<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>修改商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form :model="editForm" :rules="editFormRules" ref="editformRef" label-width="100px" label-position="top">
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="是否首页显示" prop="ishome">
          <el-switch v-model="editForm.ishome" active-value="是" inactive-value="否"></el-switch>
        </el-form-item>
        <el-form-item label="产品序号" prop="sort">
          <el-input v-model="editForm.sort" type="number"></el-input>
        </el-form-item>
        <el-form-item label="机器重量KG" prop="weight">
          <el-alert show-icon title="单位（KG）" type="warning" :closable="false" class="cat_alert"></el-alert>
          <el-input v-model="editForm.weight"></el-input>
        </el-form-item>
        <el-form-item label="外形尺寸" prop="dimensions">
          <el-alert show-icon title="单位（M）" type="warning" :closable="false" class="cat_alert"></el-alert>
          <el-input v-model="editForm.dimensions"></el-input>
        </el-form-item>
        <el-form-item label="请选择商品所属分类" prop="good_cat">
          <el-select v-model="editForm.c_id" placeholder="请选择商品类别">
            <el-option
              v-for="item in cateList"
              :key="item.cid"
              :label="item.pageName"
              :value="item.cid"
              >
            </el-option>
          </el-select>
        </el-form-item>
        <el-alert show-icon title="为了更好的优化，请填写下面这些信息" type="warning" :closable="false" class="key_alert"></el-alert>
        <el-form-item label="产品页面标题" prop="good_title">
          <el-input v-model="editForm.pageTitle"></el-input>
        </el-form-item>
        <el-form-item label="产品页面关键词" prop="good_key">
          <el-input v-model="editForm.pageKey"></el-input>
        </el-form-item>
        <el-form-item label="产品页面描述" prop="good_description">
          <el-input v-model="editForm.pageDescription" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="产品概述" prop="good_overview">
          <el-input v-model="editForm.overView" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="产品特点" prop="good_advantage">
          <el-input v-model="editForm.advantage" type="textarea"></el-input>
        </el-form-item>
        <el-alert show-icon title="图片尺寸560*350" type="warning" :closable="false" class="key_alert"></el-alert>
        <el-upload
        :action="uploadURL"
        ref="upload"
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
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-card title="图片预览" v-show="previewVisible">
          <img :src="previewPath" alt="previewPath">
        </el-card>
        <quill-editor
        v-model="editForm.content"
        ref="richAnalysis" :options="options"></quill-editor>
        <el-button type="primary" class="btnAdd" @click="editGood">修改商品</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import { getGoodsCate, getGood, editGood } from '../../network/goods'
// 导入富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
export default {
  name: '',
  components: {
    quillEditor
  },
  data () {
    return {
      options: {
        theme: 'snow',
        placeholder: '请输入内容'
      },
      activeIndex: '0',
      editForm: {
      },
      editFormRules: {
        name: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入产品序号', trigger: 'blur' }
        ],
        weight: [
          { required: true, message: '请输入机器重量', trigger: 'blur' }
        ],
        dimensions: [
          { required: true, message: '请输入外形尺寸', trigger: 'blur' }
        ],
        c_id: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      cateList: [],
      value: '',
      uploadURL: 'http://127.0.0.1:3000/upload',
      headerObj: {
        Authorization: 'goodsImage'
      },
      previewPath: '',
      previewVisible: true,
      fileList: []
    }
  },
  watch: {
    editForm () {
    }
  },
  created () {
    this.getGoodList()
    getGoodsCate().then(res => {
      this.cateList = res.data.cate
    })
  },
  methods: {
    getGoodList () {
      getGood(this.$route.params).then(res => {
        this.editForm = res.data[0]
        this.previewPath = this.editForm.image
        this.editForm.pic = this.editForm.image
      })
    },
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
      this.previewVisible = false
      this.editForm.pic = res.img
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
    handleRemove (file) {
      const filePath = file.response.data.tmp_path
      const index = this.editForm.pics.findIndex(x => x.pic === filePath)
      this.editForm.pics.splice(index, 1)
    },
    editGood () {
      editGood(this.editForm).then(res => {
        this.$message.success(res.message)
        this.$router.push('/goods')
      })
    }
  }
}

</script>

<style>

</style>
