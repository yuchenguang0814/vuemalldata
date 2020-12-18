<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>新闻中心</el-breadcrumb-item>
      <el-breadcrumb-item>添加视频</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form :model="addVideoForm" :rules="addVideoFormRules" ref="addVideoFormRef" label-width="200px" label-position="left" size="small">
        <el-form-item label="视频标题" prop="title">
          <el-input v-model="addVideoForm.title"></el-input>
        </el-form-item>
        <el-form-item label="视频图片">
            <el-alert show-icon title="图片尺寸168*168" type="warning" :closable="false" class="key_alert"></el-alert>
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
            <div slot="tip" class="el-upload__tip">请上传Jpg文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="视频链接" prop="vidurl">
          <el-input v-model="addVideoForm.vidurl"></el-input>
        </el-form-item>
        <el-form-item label="产品页面关键词" prop="pageKey">
          <el-input v-model="addVideoForm.pageKey"></el-input>
        </el-form-item>
        <el-form-item label="产品页面描述" prop="pageDescription">
          <el-input v-model="addVideoForm.pageDescription" type="textarea"></el-input>
        </el-form-item>
        <el-button type="primary" class="btnAdd" @click="addVideos">添加视频</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { AddVid } from '../../network/news'
export default {
  data () {
    return {
      uploadURL: 'http://127.0.0.1:3000/upload',
      headerObj: {
        Authorization: 'newsImage'
      },
      fileList: [],
      addVideoForm: {
        pageDescription: '',
        title: '',
        imgurl: '',
        pageKey: '',
        vidurl: ''
      },
      addVideoFormRules: {
        title: [
          { required: true, message: '请输入视频标题', trigger: 'blur' }
        ],
        vidurl: [
          { required: true, message: '请输入腾讯视频url', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    addVideos () {
      this.$refs.addVideoFormRef.validate(async valid => {
        if (!valid) return
        AddVid(this.addVideoForm).then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.message)
          }
          this.$message.success(res.message)
          this.$router.push('/videos')
        })
      })
    },
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
    }
  }
}
</script>

<style>

</style>
