<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>新闻中心</el-breadcrumb-item>
      <el-breadcrumb-item>添加新闻</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form :model="addNewForm" :rules="addNewFormRules" ref="addNewFormRef" label-width="200px" label-position="left" size="small">
        <el-form-item label="请选择新闻所属分类" prop="cid">
          <el-select v-model="addNewForm.cid" placeholder="请选择新闻类别">
            <el-option
              v-for="item in newcategory"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="新闻标题" prop="title">
          <el-input v-model="addNewForm.title"></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="addNewForm.author"></el-input>
        </el-form-item>
        <el-form-item label="产品页面关键词" prop="pageKey">
              <el-input v-model="addNewForm.pageKey"></el-input>
            </el-form-item>
            <el-form-item label="产品页面描述" prop="pageDescription">
              <el-input v-model="addNewForm.pageDescription" type="textarea"></el-input>
            </el-form-item>
        <el-form-item label="">
          <quill v-model="addNewForm.content" :value="addNewForm.content"/>
        <el-button type="primary" class="btnAdd" @click="addNews">添加新闻</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { AddNew } from '../../network/news'
import Quill from '../../components/quill'
export default {
  components: {
    Quill
  },
  data () {
    return {
      da: '',
      newcategory: [{
        id: 3,
        name: '企业新闻'
      }, {
        id: 4,
        name: '行业新闻'
      }, {
        id: 5,
        name: '技术文献'
      }],
      addNewForm: {
        cid: '',
        title: '',
        author: 'admin',
        content: '',
        pageKey: '',
        pageDescription: ''
      },
      addNewFormRules: {
        cid: [
          { required: true, message: '请选择新闻类别', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请填写新闻标题', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    addNews () {
      console.log(this.addNewForm.content)
      AddNew(this.addNewForm).then(res => {
        if (res.code !== 200) {
          return this.$message.error(res.message)
        }
        this.$message.success(res.message)
        // this.$router.push('/news')
      })
    }
  }
}
</script>

<style>

</style>
