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
      :before-close="handleClose">
      <span>上传组件</span>
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
      userInfo: {},
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
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    editUser () {
      console.log(this.editUserForm)
    },
    editPassword () {
      console.log(this.editUserForm)
    },
    editLogo () {
      console.log(this.editUserForm)
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
