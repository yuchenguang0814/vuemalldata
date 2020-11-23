<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="4">
          <el-select v-model="value" placeholder="请选择商品类别" @change = handleChange>
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :label="item.pageName"
              :value="item.id"
              >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodList" border stripe>
        <el-table-column label="商品序号" prop="sort"></el-table-column>
        <el-table-column label="商品缩略图" prop="image">
          <template slot-scope="scope">
            <img :src="`http://localhost:3000/uploads/goodspics/${scope.row.image}`" alt="" width="140px" height="auto">
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="name"></el-table-column>
        <el-table-column label="商品类别" prop="pageName" width="120px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="160px">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click ="goEditPage(scope.row.id)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeGoodById(scope.row.id)"></el-button>
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
import { getGoods } from '../../network/goods'
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      List: [],
      goodList: [],
      cateList: [],
      total: 0,
      value: ''
    }
  },
  watch: {
    List () {
      this.goodList = this.List.goods
      this.total = parseInt(this.List.total)
      this.cateList = this.List.goodsCate
    }
  },
  created () {
    this.getGoodList()
  },
  methods: {
    getGoodList () {
      getGoods(this.queryInfo).then(res => {
        this.List = res.data
      })
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodList()
    },
    handleChange (id) {
      this.queryInfo.query = { cid: id }
      this.getGoodList()
    },
    async removeGoodById (goodsId) {
      const confirmResult = await this.$confirm('此操作将删除商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('goods/' + goodsId)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getGoodList()
    },
    goAddPage () {
      this.$router.push('/goods/add')
    },
    goEditPage (id) {
      this.$router.push('/goods/edit/' + id)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
