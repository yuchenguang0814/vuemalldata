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
        <el-table-column label="分类图片" prop="simage">
          <template slot-scope="scope">
            <img :src="`${$baseUrl+scope.row.pageTitleImage}`" alt="" width="140px" height="auto">
          </template>
        </el-table-column>
        <el-table-column label="分类名称" prop="pageName"></el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCateDialogVisible(scope.row.cid)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCateById(scope.row.cid)"></el-button>
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
        <el-form-item label="分类图片">
            <el-alert show-icon title="图片尺寸150*115" type="warning" :closable="false" class="key_alert"></el-alert>
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
              <div slot="tip" class="el-upload__tip">请上传透明背景的png文件，且不超过500kb</div>
            </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateInfo">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改分类" :visible.sync="editCateDialogVisible" width="50%" @close="editCateDialogVisibleClosed">
      <el-form :model="editCateForm" :rules="editCateFormRules" ref="editCateFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="pageName">
          <el-input v-model="editCateForm.pageName"></el-input>
        </el-form-item>
        <el-form-item label="分类序号" prop="pagePath">
          <el-input v-model="editCateForm.pagePath" type="number"></el-input>
        </el-form-item>
        <el-form-item label="SEO关键词" prop="pageKey">
          <el-input v-model="editCateForm.pageKey"></el-input>
        </el-form-item>
        <el-form-item label="SEO描述" prop="pageDescription">
          <el-input v-model="editCateForm.pageDescription"></el-input>
        </el-form-item>
        <el-form-item label="分类图片">
            <el-alert show-icon title="图片尺寸150*115" type="warning" :closable="false" class="key_alert"></el-alert>
            <el-upload
            :action="uploadURL"
            ref="eupload"
            :file-list="efileList"
            :before-upload="beforeAvatarUpload"
            :on-change="ehandlechange"
            :on-preview="handlePreview"
            :on-remove="ehandleRemove"
            list-type="picture"
            :on-error="onError"
            :headers="headerObj"
            :auto-upload="false"
            :on-success="ehandleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">请上传透明背景的png文件，且不超过500kb</div>
            </el-upload>
            <el-card title="图片预览" v-show="previewVisible">
              <img :src="`${$baseUrl+previewPath}`" alt="previewPath">
            </el-card>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getGoodsCate, AddCate, getCateById, editCate, removeCate } from '../../network/goods'
export default {
  data () {
    return {
      previewVisible: true,
      previewPath: '',
      uploadURL: 'http://127.0.0.1:3000/upload',
      headerObj: {
        Authorization: 'goodsCateImage'
      },
      fileList: [],
      efileList: [],
      cateList: [],
      addCateDialogVisible: false,
      editCateDialogVisible: false,
      addCateForm: {
        pageDescription: '',
        pageId: 1,
        pageImage: '',
        pageKey: '',
        pageName: '',
        pagePath: '',
        pageTitleImage: ''
      },
      editCateForm: {
      },
      addCateFormRules: {
        pageName: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      editCateFormRules: {
        pageName: [
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
      const isLt2M = file.size / 1024 / 1024 < 0.5
      if (!isLt2M) {
        this.$message.error('上传分类图片大小不能超过 500KB!')
      }
      return isLt2M
    },
    handleSuccess (res) {
      this.$message.success('上传分类图片成功!')
      this.addCateForm.pageTitleImage = '/uploads/catespics/' + res.img
    },
    ehandleSuccess (res) {
      this.$message.success('上传分类图片成功!')
      this.previewVisible = false
      this.editCateForm.pageTitleImage = '/uploads/catespics/' + res.img
    },
    onError (res) {
      this.$message.error('上传分类图片失败!')
    },
    handlePreview (file) {},
    handlechange (file, fileList) {
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]]
      }
      this.$refs.upload.submit()
    },
    ehandlechange (file, fileList) {
      if (fileList.length > 0) {
        this.efileList = [fileList[fileList.length - 1]]
      }
      this.$refs.eupload.submit()
    },
    handleRemove (file) {
      this.addCateForm.pageTitleImage = ''
    },
    ehandleRemove (file) {
      this.addCateForm.pageTitleImage = ''
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
    showEditCateDialogVisible (id) {
      this.efileList = []
      this.previewVisible = true
      getCateById(id).then(res => {
        this.editCateForm = res.data[0]
        this.previewPath = this.editCateForm.pageTitleImage
        this.editCateDialogVisible = true
      })
    },
    editCateDialogVisibleClosed () {
      this.$refs.editCateFormRef.resetFields()
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
    },
    editCateInfo () {
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return
        editCate(this.editCateForm).then(res => {
          this.$message.success(res.message)
          this.editCateDialogVisible = false
          this.getCateList()
        })
      })
    },
    async removeCateById (id) {
      const confirmResult = await this.$confirm('此操作将删除此分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      this.cateId = { cid: id }
      console.log(this.cateId)
      removeCate(this.cateId).then(res => {
        this.$message.success(res.message)
      })
      this.getCateList()
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
