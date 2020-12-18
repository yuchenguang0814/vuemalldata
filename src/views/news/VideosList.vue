<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>新闻中心</el-breadcrumb-item>
      <el-breadcrumb-item>视频列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="goAddVideo">添加视频</el-button>
      <el-table :data="videosList" border stripe>
        <el-table-column label="视频图片" prop="imgurl">
          <template slot-scope="scope">
            <img :src="`${$baseUrl + scope.row.imgurl}`">
          </template>
        </el-table-column>
        <el-table-column label="视频标题" prop="title"></el-table-column>
        <el-table-column label="创建时间" prop="createtime" width="160px">
          <template slot-scope="scope">
            {{scope.row.createtime | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click ="showEditVideoDialogVisible(scope.row.id)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeVideoById(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <el-dialog title="修改视频" :visible.sync="editVideoDialogVisible" width="50%" @close="editVideoDialogVisibleClosed">
      <el-form :model="editVideoForm" :rules="editVideoFormRules" ref="editVideoFormRef" label-width="200px" label-position="left" size="small">
        <el-form-item label="视频标题" prop="title">
          <el-input v-model="editVideoForm.title"></el-input>
        </el-form-item>
        <el-form-item label="视频链接" prop="vidurl">
          <el-input v-model="editVideoForm.vidurl"></el-input>
        </el-form-item>
        <el-form-item label="视频图片">
            <el-alert show-icon title="图片尺寸168*168" type="warning" :closable="false" class="key_alert"></el-alert>
            <el-upload
            :action="uploadURL"
            ref="eupload"
            :file-list="fileList"
            :before-upload="beforeAvatarUpload"
            :on-change="handlechange"
            :on-remove="handleRemove"
            list-type="picture"
            :on-error="onError"
            :headers="headerObj"
            :auto-upload="false"
            :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">请上传JPG文件，且不超过500kb</div>
            </el-upload>
            <el-card title="图片预览" v-show="previewVisible">
              <img :src="`${$baseUrl+previewPath}`" alt="previewPath">
            </el-card>
        </el-form-item>
        <el-form-item label="视频页面关键词" prop="pageKey">
          <el-input v-model="editVideoForm.pageKey"></el-input>
        </el-form-item>
        <el-form-item label="视频页面描述" prop="pageDescription">
          <el-input v-model="editVideoForm.pageDescription" type="textarea"></el-input>
          <el-button type="primary" class="btnAdd" @click="editVideo">修改视频</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getVideos, removeVid, getVideoById, editVideoPost } from '../../network/news'
export default {
  data () {
    return {
      previewVisible: true,
      uploadURL: 'http://127.0.0.1:3000/upload',
      headerObj: {
        Authorization: 'newsImage'
      },
      fileList: [],
      previewPath: '',
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      videosList: [],
      editVideoForm: {},
      editVideoDialogVisible: false,
      editVideoFormRules: {
        title: [
          { required: true, message: '请输入视频标题', trigger: 'blur' }
        ],
        vidurl: [
          { required: true, message: '请输入腾讯视频url', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getVideoList()
  },
  methods: {
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 0.5
      if (!isLt2M) {
        this.$message.error('上传分类图片大小不能超过 500KB!')
      }
      return isLt2M
    },
    handleSuccess (res) {
      this.$message.success('上传视频图片成功!')
      this.addVideoForm.imgurl = '/uploads/newspics/' + res.img
    },
    onError (res) {
      this.$message.error('上传视频图片失败!')
    },
    handlechange (file, fileList) {
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]]
      }
      this.$refs.upload.submit()
    },
    handleRemove (file) {
      this.addVideoForm.imgurl = ''
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getNewList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getNewList()
    },
    getVideoList () {
      getVideos(this.queryInfo).then(res => {
        this.videosList = res.data.videos
        this.total = parseInt(res.data.total[0].num)
      })
    },
    goAddVideo () {
      this.$router.push('/videos/add')
    },
    showEditVideoDialogVisible (vid) {
      getVideoById({ id: vid }).then(res => {
        this.editVideoForm = res.data.video[0]
        this.previewPath = this.editVideoForm.imgurl
        this.editVideoDialogVisible = true
      })
    },
    editVideoDialogVisibleClosed () {
      this.$refs.editVideoFormRef.resetFields()
    },
    editVideo () {
      this.$refs.editVideoFormRef.validate(async valid => {
        if (!valid) return
        editVideoPost(this.editVideoForm).then(res => {
          this.$message.success(res.message)
          this.editVideoDialogVisible = false
          this.getVideoList()
        })
      })
    },
    async removeVideoById (vid) {
      const confirmResult = await this.$confirm('此操作将删除新闻, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      removeVid({ id: vid }).then(res => {
        this.$message.success(res.message)
        this.getVideoList()
      })
    }
  }
}
</script>

<style>

</style>
