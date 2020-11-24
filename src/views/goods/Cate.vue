<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialogVisible">添加分类</el-button>
        </el-col>
      </el-row>
      <el-table :data="cateList" border stripe>
        <el-table-column label="商品序号" prop="pagePath"></el-table-column>
        <el-table-column label="分类小图" prop="simage">
          <template slot-scope="scope">
            <img :src="`${scope.row.pageTitleImage}`" alt="" width="140px" height="auto">
          </template>
        </el-table-column>
        <el-table-column label="分类大图" prop="simage">
          <template slot-scope="scope">
            <img :src="`${scope.row.pageImage}`" alt="" height="140px" width="auto">
          </template>
        </el-table-column>
        <el-table-column label="分类名称" prop="pageName"></el-table-column>
        <el-table-column label="操作" width="130px">
          <template>
              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogVisibleClosed">
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="pageName">
          <el-input v-model="addCateForm.pageName"></el-input>
        </el-form-item>
        <el-form-item label="分类序号" prop="pagePath">
          <el-input v-model="addCateForm.pagePath" type="number"></el-input>
        </el-form-item>
        <el-form-item label="SEO关键词" prop="pageKey">
          <el-input v-model="addCateForm.pageKey"></el-input>
        </el-form-item>
        <el-form-item label="SEO描述" prop="pageDescription">
          <el-input v-model="addCateForm.pageDescription"></el-input>
        </el-form-item>
        <el-form-item label="分类小图">
            <el-alert show-icon title="图片尺寸560*350" type="warning" :closable="false" class="key_alert"></el-alert>
            <el-upload
            :action="uploadURL"
            ref="upload"
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
        </el-form-item>
        <el-form-item label="分类大图">
            <el-alert show-icon title="图片尺寸560*350" type="warning" :closable="false" class="key_alert"></el-alert>
            <el-upload
            :action="uploadURL"
            ref="uploadBig"
            :file-list="fileListBig"
            :before-upload="beforeAvatarUpload"
            :on-change="handlechangeBig"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture"
            :on-error="onError"
            :headers="headerObj"
            :auto-upload="false"
            :on-success="handleSuccessBig">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getGoodsCate, AddCate } from '../../network/goods'
export default {
  data () {
    return {
      uploadURL: 'http://127.0.0.1:3000/upload',
      headerObj: {
        Authorization: 'goodsCateImage'
      },
      fileList: [],
      fileListBig: [],
      cateList: [],
      addCateDialogVisible: false,
      addCateForm: {
        pageDescription: '',
        pageId: 1,
        pageImage: '',
        pageKey: '',
        pageName: '',
        pagePath: 0,
        pageTitleImage: ''
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 0.5
      if (!isJPG) {
        this.$message.error('上传产品图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传产品图片大小不能超过 500KB!')
      }
      return isJPG && isLt2M
    },
    handleSuccess (res) {
      this.$message.success('上传产品图片成功!')
      this.addCateForm.pageTitleImage = '/uploads/catespics/' + res.img
      console.log(this.addCateForm.pageTitleImage)
    },
    handleSuccessBig (res) {
      this.$message.success('上传产品图片成功!')
      this.addCateForm.pageImage = '/uploads/catespics/' + res.img
    },
    onError (res) {
      this.$message.error('上传产品图片失败!')
    },
    handlechange (file, fileList) {
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]]
      }
      this.$refs.upload.submit()
    },
    handlechangeBig (file, fileList) {
      if (fileList.length > 0) {
        this.fileListBig = [fileList[fileList.length - 1]]
      }
      this.$refs.uploadBig.submit()
    },
    handleRemove (file) {
      const filePath = file.response.data.tmp_path
      const index = this.addForm.pics.findIndex(x => x.pic === filePath)
      this.addForm.pics.splice(index, 1)
    },
    getCateList () {
      getGoodsCate().then(res => {
        this.cateList = res.data.cate
      })
    },
    showAddCateDialogVisible () {
      this.addCateDialogVisible = true
    },
    addCateDialogVisibleClosed () {
      this.$refs.addCateFormRef.resetFields()
    },
    addCateInfo () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        AddCate(this.addCateForm).then(res => {
          this.$message.success(res.message)
          this.addCateDialogVisible = false
          this.getCateList()
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.key_alert {
  width: 300px;
  position: absolute;
  left: 180px;
  top: 0px;
}
.el-cascader {
  width: 100%;
}
</style>
