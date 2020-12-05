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
      @expand-change="expandChange"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column label="展开" prop="pageName" width="150px"></el-table-column>
        <el-table-column label="页面banner图" prop="pageImage" width="500px" height="auto">
          <template slot-scope="scope">
            <img :src="`${$baseUrl + scope.row.pageImage}`" alt="" width="100%">
          </template>
        </el-table-column>
        <el-table-column label="页面关键词" prop="pageKey" width="100px"></el-table-column>
        <el-table-column label="页面描述" prop="pageDescription" class-name="dp"></el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" ref="btn" @click ="goEditPage(scope.row.id,scope.row.cid)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="修改页面信息" :visible.sync="editPageDialogVisible" width="50%" @close="editPageDialogVisibleClosed">
      <el-form :model="editPageForm" :rules="editPageFormRules" ref="editPageFormRef" label-width="100px">
        <el-form-item label="页面标题" prop="pageName">
          <el-input v-model="editPageForm.pageName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="页面关键词" prop="pageKey">
          <el-input v-model="editPageForm.pageKey"></el-input>
        </el-form-item>
        <el-form-item label="页面描述" prop="pageDescription">
          <el-input v-model="editPageForm.pageDescription"></el-input>
        </el-form-item>
        <el-form-item label="Banner图">
            <el-alert show-icon title="图片尺寸1920*396" type="warning" :closable="false" class="key_alert"></el-alert>
            <el-upload
            :action="uploadURL"
            ref="editBanner"
            :before-upload="beforeAvatarUpload"
            :on-error="onError"
            :headers="headerObj"
            :on-success="handleSuccess"
            :show-file-list="false"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
            <el-card title="图片预览">
              <img :src="`${$baseUrl + imgUrl}`" width="100%">
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
import { GetPageMultidata, GetPageMultidataById, editPageInfo, GetPageChildMultidataById, editPageChildInfo } from '../../network/page'
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
      uploadURL: 'http://127.0.0.1:3000/upload',
      headerObj: {
        Authorization: 'pageBanner'
      },
      imgUrl: '',
      editName: ''
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
    expandChange (row, expandedRows) {},
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
      this.imgUrl = '/uploads/banner/' + res.img
      this.editPageForm.pageImage = this.imgUrl
    },
    onError (res) {
      this.$message.error('上传Banner图片失败!')
    },
    goEditPage (id, cid) {
      if (id !== undefined) {
        GetPageMultidataById({ pid: id }).then(res => {
          this.editPageForm = res.data[0]
          this.imgUrl = this.editPageForm.pageImage
        }).then(res => {
          this.editPageDialogVisible = true
          this.editName = 'page'
        })
      } else if (cid !== undefined) {
        GetPageChildMultidataById({ pid: cid }).then(res => {
          this.editPageForm = res.data[0]
          this.imgUrl = this.editPageForm.pageImage
        }).then(res => {
          this.editPageDialogVisible = true
          this.editName = 'category'
        })
      }
    },
    editPageDialogVisibleClosed () {
      this.$refs.editPageFormRef.resetFields()
    },
    editPageInfo () {
      if (this.editName === 'page') {
        editPageInfo(this.editPageForm).then(res => {
          this.$message.success(res.message)
          GetPageMultidata().then(res => {
            this.List = res.data
            this.editPageDialogVisible = false
          })
        })
      } else {
        editPageChildInfo(this.editPageForm).then(res => {
          this.$message.success(res.message)
          GetPageMultidata().then(res => {
            this.List = res.data
            this.editPageDialogVisible = false
          })
        })
      }
    }
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
