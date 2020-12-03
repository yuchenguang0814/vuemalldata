<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>页面管理</el-breadcrumb-item>
      <el-breadcrumb-item>页面列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="pageList"
      row-key= "pageName"
      border
      cell-class-name = "ttd"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column label="展开" prop="pageName"></el-table-column>
        <el-table-column label="页面名称" prop="pageName"></el-table-column>
        <el-table-column label="页面banner图" prop="pageImage">
          <template slot-scope="scope">
            <img :src="`${scope.row.pageImage}`" alt="" width="140px" height="auto">
          </template>
        </el-table-column>
        <el-table-column label="页面关键词" prop="pageKey"></el-table-column>
        <el-table-column label="页面描述" prop="pageDescription" class-name="dp"></el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click ="goEditPage(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="修改页面信息" :visible.sync="editPageDialogVisible" width="50%" @close="editPageDialogVisibleClosed">
      <el-form :model="editPageForm" :rules="editPageFormRules" ref="editPageFormRef" label-width="100px">
        <el-form-item label="页面标题" prop="pageName">
          <el-input v-model="editPageForm.pageName"></el-input>
        </el-form-item>
        <el-form-item label="页面关键词" prop="pageKey">
          <el-input v-model="editPageForm.pageKey"></el-input>
        </el-form-item>
        <el-form-item label="页面描述" prop="pageDescription">
          <el-input v-model="editPageForm.pageDescription"></el-input>
        </el-form-item>
        <el-form-item label="Banner图">
            <el-alert show-icon title="图片尺寸560*350" type="warning" :closable="false" class="key_alert"></el-alert>
            <el-upload
            :action="uploadURL"
            ref="uploadPageBanner"
            :file-list="fileList"
            :before-upload="beforeAvatarUpload"
            :on-change="handlechange"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture"
            :on-error="onError"
            :headers="headerObj"
            :auto-upload="false"
            :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
            <el-card title="图片预览" v-show="previewVisible">
              <img :src="`${previewPath}`" alt="previewPath" height="140px">
            </el-card>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPageDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPageInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { GetPageMultidata, GetPageMultidataById } from '../../network/page'
export default {
  data () {
    return {
      List: [],
      pageList: [],
      editPageDialogVisible: false,
      editPageForm: {},
      editPageFormRules: {
        pageName: [
          { required: true, message: '页面标题不能为空', trigger: 'blur' }
        ]
      },
      previewPath: '',
      previewVisible: true,
      uploadURL: 'http://127.0.0.1:3000/upload',
      headerObj: {
        Authorization: 'pageBanner'
      },
      fileList: []
    }
  },
  created () {
    GetPageMultidata().then(res => {
      this.List = res.data
    })
  },
  watch: {
    List () {
      this.List.page.forEach(item => {
        if (item.id !== 1) {
          item.children = this.List.category.filter(item1 => item.id === item1.pageId && item.id !== 1)
        }
      })
      this.pageList = this.List.page
    }
  },
  methods: {
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 0.5
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 500KB!')
      }
      return isJPG && isLt2M
    },
    handleSuccess (res) {
      this.$message.success('上传Banner图片成功!')
    },
    onError (res) {
      this.$message.error('上传Banner图片失败!')
    },
    handlePreview (file) {},
    handlechange (file, fileList) {
      if (fileList.length > 0) {
        this.fileListBig = [fileList[fileList.length - 1]]
      }
      this.$refs.uploadBig.submit()
    },
    handleRemove (file) {
      this.addCateForm.pageImage = ''
    },
    goEditPage (id) {
      GetPageMultidataById({ pid: id }).then(res => {
        this.editPageForm = res.data[0]
        this.previewPath = this.editPageForm.pageImage
      }).then(res => {
        this.editPageDialogVisible = true
      })
    },
    editPageDialogVisibleClosed () {
      this.$refs.editPageFormRef.resetFields()
    },
    editPageInfo () {}
  }
}
</script>

<style>
table tbody tr .ttd {
  white-space: nowrap;text-overflow: ellipsis;overflow: hidden;
}
.key_alert {
  width: 300px;
  position: absolute;
  left: 180px;
  top: 0px;
}
</style>
