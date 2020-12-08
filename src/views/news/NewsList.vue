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
      <el-table :data="newsList" border stripe>
        <el-table-column label="新闻类别" prop="cid">
          <template slot-scope="scope">
            {{ cateName(scope.row.cid)[0].name }}
          </template>
        </el-table-column>
        <el-table-column label="新闻标题" prop="title"></el-table-column>
        <el-table-column label="创建时间" prop="createtime" width="160px">
          <template slot-scope="scope">
            {{scope.row.createtime | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click ="goEditNew(scope.row.id)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeNewById(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getNews } from '../../network/news'
export default {
  data () {
    return {
      value: '',
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      newsList: [],
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
  computed: {},
  created () {
    this.getNewList()
  },
  methods: {
    getNewList () {
      getNews(this.queryInfo).then(res => {
        this.newsList = res.data.news
        this.total = parseInt(res.data.total[0].num)
      })
    },
    cateName (id) {
      return this.newcategory.filter(item => item.id === id)
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getNewList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getNewList()
    },
    handleChange (id) {
      console.log(id)
    },
    goAddNew () {
      console.log(1)
    },
    goEditNew (id) {},
    removeNewById (id) {}
  }
}
</script>

<style>

</style>
