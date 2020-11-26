<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>页面管理</el-breadcrumb-item>
      <el-breadcrumb-item>页面列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="pageList"
      row-key= "pageName"
      border
      cell-class-name = "ttd"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column label="展开" prop="pageName"></el-table-column>
        <el-table-column label="页面名称" prop="pageName"></el-table-column>
        <el-table-column label="页面banner图" prop="pageImage">
          <template slot-scope="scope">
            <img :src="`${scope.row.pageImage}`" alt="" width="140px" height="auto">
          </template>
        </el-table-column>
        <el-table-column label="页面关键词" prop="pageKey"></el-table-column>
        <el-table-column label="页面描述" prop="pageDescription" class-name="dp"></el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click ="goEditPage(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { GetPageMultidata } from '../../network/page'
export default {
  data () {
    return {
      List: [],
      pageList: []
    }
  },
  created () {
    GetPageMultidata().then(res => {
      this.List = res.data
    })
  },
  watch: {
    List () {
      this.List.page.forEach(item => {
        item.children = this.List.category.filter(item1 => item.id === item1.pageId)
      })
      this.pageList = this.List.page
    }
  },
  methods: {
    goEditPage () {}
  }
}
</script>

<style>
table tbody tr .ttd {
  white-space: nowrap;text-overflow: ellipsis;overflow: hidden;
}
</style>
