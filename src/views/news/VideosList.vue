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
        <el-form-item label="视频页面关键词" prop="pageKey">
          <el-input v-model="editVideoForm.pageKey"></el-input>
        </el-form-item>
        <el-form-item label="视频页面描述" prop="pageDescription">
          <el-input v-model="editVideoForm.pageDescription" type="textarea"></el-input>
        </el-form-item>
        <el-button type="primary" class="btnAdd" @click="editVideos">修改视频</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getVideos, removeVid, getVideoById } from '../../network/news'
export default {
  data () {
    return {
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
        this.editVideoDialogVisible = true
      })
    },
    editVideoDialogVisibleClosed () {
      this.$refs.editVideoFormRef.resetFields()
    },
    editVideos () {
      console.log(this.editVideoForm)
    },
    removeVideoById (vid) {
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
