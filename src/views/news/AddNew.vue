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
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
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
        author: '',
        content: ''
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
  }
}
</script>

<style>

</style>
