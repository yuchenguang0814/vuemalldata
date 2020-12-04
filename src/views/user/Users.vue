<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-form :label-position="labelPosition" label-width="80px" :model="editUserForm">
        <el-form-item label="联系人" prop ="name">
          <el-input v-model="editUserForm.name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editUserForm.userEmail"></el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="editUserForm.userPhone"></el-input>
        </el-form-item>
        <el-form-item label="QQ">
          <el-input v-model="editUserForm.userQQ"></el-input>
        </el-form-item>
        <el-form-item label="公司名称">
          <el-input v-model="editUserForm.companyName"></el-input>
        </el-form-item>
        <el-form-item label="公司地址">
          <el-input v-model="editUserForm.companyAddress"></el-input>
        </el-form-item>
        <el-button type="primary" >修改用户信息</el-button>
        <el-button type="primary" @click="editPassworddialogVisible = true">修改密码</el-button>
        <el-button type="primary" @click="editLogodialogVisible = true">更换公司logo</el-button>
      </el-form>
    </el-card>
    <el-dialog
      title="修改密码"
      :visible.sync="editPassworddialogVisible"
      width="50%"
      :before-close="handleClose">
      <span>修改密码</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPassworddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPassword">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改logo"
      :visible.sync="editLogodialogVisible"
      width="50%"
      @close="handleLogoClose">
      <el-upload
            :action="uploadURL"
            ref="editLogo"
            :before-upload="beforeAvatarUpload"
            :on-error="onError"
            :headers="headerObj"
            :on-success="handleSuccess"
            list-type="picture"
            :file-list="fileList"
            :on-change="handlechange"
            :auto-upload="false"
            >
              <el-button size="small" type="primary">点击上传logo</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editLogodialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editLogo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
      uploadURL: 'http://127.0.0.1:3000/upload',
      headerObj: {
        Authorization: 'pageBanner'
      },
      fileList: [],
      userInfo: {},
      logoImg: '',
      editPassworddialogVisible: false,
      editLogodialogVisible: false,
      labelPosition: 'left',
      editUserForm: {
        userName: '1231',
        userEmail: '',
        userPhone: '',
        userQQ: '',
        companyName: '',
        companyAddress: ''
      }
    }
  },
  created () {
    this.editUserForm = JSON.parse(window.sessionStorage.getItem('users'))
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
      this.$message.success('上传LOGO图片成功!')
      this.logoImg = '/uploads/banner/' + res.img
    },
    handlechange (file, fileList) {
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]]
      }
      this.$refs.editLogo.submit()
    },
    onError (res) {
      this.$message.error('上传LOGO图片失败!')
    },
    handleLogoClose () {
      this.fileList = []
    },
    handleClose () {},
    editUser () {
      console.log(this.logoImg)
    },
    editPassword () {
      console.log(this.editUserForm)
    },
    editLogo () {
      console.log(this.logoImg)
    }
  }
}

</script>

<style>
.box-card {
  width:600px;
  margin: 0 auto;
  border-radius: 10px
}
</style>
