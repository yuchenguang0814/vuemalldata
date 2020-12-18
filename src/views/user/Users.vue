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
        <el-button type="primary" @click="editUser()">修改用户信息</el-button>
        <el-button type="primary" @click="editPassworddialogVisible = true">修改密码</el-button>
        <el-button type="primary" @click="editLogodialogVisible = true">更换公司logo</el-button>
      </el-form>
    </el-card>
    <el-dialog
      title="修改密码"
      :visible.sync="editPassworddialogVisible"
      width="50%"
      @close="handleClose">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="原始密码" prop="oldpass">
          <el-input type="password" v-model="ruleForm.oldpass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPassworddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPassword('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改logo"
      :visible.sync="editLogodialogVisible"
      width="50%"
      @close="handleLogoClose">
      <img :src="`${$baseUrl + imgUrl}`" alt="" width="500px">
       <el-alert show-icon title="图片尺寸363*68" type="warning" :closable="false" class="key_alert"></el-alert>
      <el-upload
            :action="uploadURL"
            ref="editLogo"
            :before-upload="beforeAvatarUpload"
            :on-error="onError"
            :headers="headerObj"
            :on-success="handleSuccess"
            :show-file-list="false"
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
import { EditUser } from '../../network/user'
export default {
  components: {
  },
  data () {
    const validateOldPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value !== window.sessionStorage.getItem('pass')) {
        callback(new Error('原始密码不正确'))
      } else {
        this.$refs.ruleForm.validateField('validateOldPass')
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value === this.ruleForm.oldpass) {
        callback(new Error('新密码和原始密码一致'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      uploadURL: 'http://127.0.0.1:3000/upload',
      headerObj: {
        Authorization: 'pageBanner'
      },
      userInfo: {},
      editPassworddialogVisible: false,
      editLogodialogVisible: false,
      labelPosition: 'left',
      editUserForm: {
      },
      imgUrl: '',
      ruleForm: {
        pass: '',
        checkPass: '',
        oldpass: ''
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        oldpass: [
          { validator: validateOldPass, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.editUserForm = JSON.parse(window.sessionStorage.getItem('users'))
    this.imgUrl = this.editUserForm.logo
    console.log(window.sessionStorage.getItem('pass'))
  },
  methods: {
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 0.5
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 500KB!')
      }
      return isLt2M
    },
    handleSuccess (res) {
      this.$message.success('上传LOGO图片成功!')
      this.imgUrl = '/uploads/banner/' + res.img
      this.editUserForm.logo = this.imgUrl
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
    handleClose () {
      this.$refs.ruleForm.resetFields()
    },
    editUser () {
      EditUser(this.editUserForm).then(res => {
        window.sessionStorage.setItem('users', JSON.stringify(this.editUserForm))
        this.$message.success(res.message)
      })
    },
    editPassword (formName) {
      this.editUserForm.password = this.ruleForm.pass
      this.$refs[formName].validate((valid) => {
        if (valid) {
          EditUser(this.editUserForm).then(res => {
            this.$message.success('修改密码成功，请重新登录')
            window.sessionStorage.clear()
            this.$router.push('/login')
          })
        } else {
          return false
        }
      })
      window.sessionStorage.setItem('pass', this.editUserForm.password)
      this.editPassworddialogVisible = false
    },
    editLogo () {
      EditUser(this.editUserForm).then(res => {
        window.sessionStorage.setItem('users', JSON.stringify(this.editUserForm))
        this.$message.success(res.message)
        this.editLogodialogVisible = false
      })
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
.key_alert {
  width: 300px;
  position: absolute;
  left: 180px;
  top: 0px;
}
</style>
