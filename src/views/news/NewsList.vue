<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>新闻中心</el-breadcrumb-item>
      <el-breadcrumb-item>新闻列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="4">
          <el-select v-model="value" placeholder="请选择新闻类别" @change = handleChange>
            <el-option
              v-for="item in newcategory"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddNew">添加新闻</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: '',
      newcategory: [{
        id: 3,
        name: '企业新闻'
      }, {
        id: 4,
        name: '行业新闻'
      }, {
        id: 5,
        name: '技术文献'
      }]
    }
  },
  methods: {
    handleChange (id) {
      console.log(id)
    },
    goAddNew () {
      console.log(1)
    }
  }
}
</script>

<style>

</style>
