<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="添加商品" type="info" center show-icon :closable="false"></el-alert>
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="SEO关键词"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="TabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="产品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="是否首页显示" prop="goods_ishome">
              <el-switch v-model="addForm.goods_ishome" active-value="是" inactive-value="否"></el-switch>
            </el-form-item>
            <el-form-item label="产品序号" prop="goods_sort">
              <el-input v-model="addForm.goods_sort" type="number"></el-input>
            </el-form-item>
            <el-form-item label="机器重量KG" prop="goods_weight">
              <el-alert show-icon title="单位（KG）" type="warning" :closable="false" class="cat_alert"></el-alert>
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="外形尺寸" prop="goods_dimensions">
              <el-alert show-icon title="单位（M）" type="warning" :closable="false" class="cat_alert"></el-alert>
              <el-input v-model="addForm.goods_dimensions"></el-input>
            </el-form-item>
            <el-form-item label="请选择商品所属分类" prop="goods_cat">
              <el-select v-model="addForm.goods_cat" placeholder="请选择商品类别">
                <el-option
                  v-for="item in cateList"
                  :key="item.cid"
                  :label="item.pageName"
                  :value="item.cid"
                  >
                </el-option>
              </el-select>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="SEO关键词" name="1">
            <el-alert show-icon title="为了更好的优化，请填写下面这些信息" type="warning" :closable="false" class="key_alert"></el-alert>
            <el-form-item label="产品页面标题" prop="goods_title">
              <el-input v-model="addForm.goods_title"></el-input>
            </el-form-item>
            <el-form-item label="产品页面关键词" prop="goods_key">
              <el-input v-model="addForm.goods_key"></el-input>
            </el-form-item>
            <el-form-item label="产品页面描述" prop="goods_description">
              <el-input v-model="addForm.goods_description" type="textarea"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="产品概述" name="2">
            <el-form-item label="产品概述" prop="goods_overview">
              <el-input v-model="addForm.goods_overview" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="产品特点" prop="goods_advantage">
              <el-input v-model="addForm.goods_advantage" type="textarea"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
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
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor
            v-model="addForm.goods_content"
            ref="richAnalysis" :options="options"></quill-editor>
            <el-button type="primary" class="btnAdd" @click="addGood">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="previewPath" style="width: 100%">
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import { quillEditor } from 'vue-quill-editor'
// 导入富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { getGoodsCate, addgoods } from '../../network/goods'
import { addQuillTitle } from '../../plugins/quill-title'
export default {
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
      addForm: {
        goods_name: '',
        goods_ishome: '',
        goods_sort: '',
        goods_weight: '',
        goods_dimensions: '',
        goods_cat: '',
        goods_title: '',
        goods_key: '',
        goods_description: '',
        goods_overview: '',
        goods_advantage: '',
        goods_content: ''
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ],
        goods_sort: [
          { required: true, message: '请输入产品序号', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入机器重量', trigger: 'blur' }
        ],
        goods_dimensions: [
          { required: true, message: '请输入外形尺寸', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      cateList: [],
      value: '',
      uploadURL: 'http://127.0.0.1:3000/upload',
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      previewVisible: false,
      fileList: []
    }
  },
  created () {
    this.getGoodList()
  },
  mounted () {
    addQuillTitle()
  },
  computed: {
  },
  methods: {
    getGoodList () {
      getGoodsCate().then(res => {
        this.cateList = res.data.cate
      })
    },
    beforeTabLeave (activeName, oldActiveName) {
      let valBoolean = false
      let varObject = ''
      this.$refs.addFormRef.validate((boolean, object) => {
        valBoolean = boolean
        varObject = object
      })
      if (!valBoolean) {
        const varMessage = []
        for (const key in varObject) {
          varMessage.push(varObject[key][0].message)
        }
        this.$message.error(varMessage[0])
        return false
      }
    },
    TabClicked () {},
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
      this.addForm.pic = '/uploads/goodspics/' + res.img
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
    handlePreview (file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    handleRemove (file) {
      const filePath = file.response.data.tmp_path
      const index = this.addForm.pics.findIndex(x => x.pic === filePath)
      this.addForm.pics.splice(index, 1)
    },
    async addGood () {
      const form = _.cloneDeep(this.addForm)
      addgoods(form).then(res => {
        if (res.code !== 200) {
          return this.$message.error(res.message)
        }
        this.$message.success(res.message)
        this.$router.push('/goods')
      })
    }
  }
}
</script>

<style lang='less' scoped>
.key_alert {
  width: 300px;
  position: absolute;
  left: 180px;
  top: 0px;
}
.cat_alert {
  width: 140px;
  position: absolute;
  left: 180px;
  top: -60px;
}
.el-checkbox {
  margin: 0 5px 0 0 !important;
}
.btnAdd {
  margin-top: 15px;
}
</style>
