<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>在线留言</el-breadcrumb-item>
      <el-breadcrumb-item>在线留言</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="orderList" border stripe>
        <el-table-column label="姓名" prop="user"></el-table-column>
        <el-table-column label="电话" prop="phone"></el-table-column>
        <el-table-column label="留言内容" prop="content"></el-table-column>
        <el-table-column label="创建时间" prop="createtime" width="160px">
          <template slot-scope="scope">
            {{scope.row.createtime | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeOrderById(scope.row.id)"></el-button>
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
import { getOrder, removeOrder } from '../../network/order'
export default {
  name: '',
  components: {
  },
  data () {
    return {
      orderList: [],
      queryInfo: {
        query: { id: 0 },
        pagenum: 1,
        pagesize: 5
      },
      total: 0
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    getOrderList () {
      getOrder(this.queryInfo).then(res => {
        this.orderList = res.data.order
        this.total = parseInt(res.data.total[0].num)
      })
    },
    async removeOrderById (oid) {
      const confirmResult = await this.$confirm('此操作将删除这条留言, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      removeOrder({ id: oid }).then(res => {
        this.$message.success(res.message)
        this.getOrderList()
      })
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    }
  }
}

</script>

<style>

</style>
