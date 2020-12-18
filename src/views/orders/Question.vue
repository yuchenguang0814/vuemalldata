<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>在线留言</el-breadcrumb-item>
      <el-breadcrumb-item>在线问题</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-select v-model="value" placeholder="请选择状态" @change = handleChange>
        <el-option label="未解决" value="1"></el-option>
        <el-option label="已解决" value="2"></el-option>
      </el-select>
      <el-table :data="orderList" border stripe style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="问题分类">
                <span>{{ cateName(scope.row.cid).pageName }}</span>
              </el-form-item>
              <el-form-item label="问题状态">
                <span>{{scope.row.isQusetion === 2? '已解决' : '未解决'}}</span>
              </el-form-item>
              <el-form-item label="发言人">
                <span>{{ scope.row.user }}</span>
              </el-form-item>
              <el-form-item label="手机号码">
                <span>{{ scope.row.phone }}</span>
              </el-form-item>
              <el-form-item label="创建时间" style="width:100%">
                <span>{{ scope.row.createtime | dateFormat}} {{ scope.row.createtime | hoursFormat}}</span>
              </el-form-item>
              <el-form-item label="提问内容" style="width:100%">
                <span>{{ scope.row.content }}</span>
              </el-form-item>
              <el-form-item label="回复内容" style="width:100%">
                <span>{{ scope.row.answerContent }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="isQusetion">
          <template slot-scope="scope">
            {{scope.row.isQusetion === 2? '已解决' : '未解决'}}
          </template>
        </el-table-column>
        <el-table-column v-if="cateList.length > 0" label="问题类别" prop="cid">
          <template slot-scope="scope">
            {{ cateName(scope.row.cid).pageName }}
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="user"></el-table-column>
        <el-table-column label="电话" prop="phone"></el-table-column>
        <el-table-column label="创建时间" prop="createtime" width="160px">
          <template slot-scope="scope">
            {{scope.row.createtime | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click ="showAnswerDialogVisible(scope.row.id)"></el-button>
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
      <el-dialog title="回答问题" :visible.sync="AnswerDialogVisible" width="50%" @close="AnswerDialogVisibleClosed">
      <el-form :model="AnswerForm" :rules="AnswerFormRules" ref="AnswerFormRef" label-width="100px" label-position="left" size="small">
        <el-form-item label="问题描述" prop="content">
          <el-input type="textarea" v-model="AnswerForm.content" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="回答问题" prop="answerContent">
          <quill v-model="AnswerForm.answerContent" :value="AnswerForm.answerContent"  />
          <el-button type="primary" class="btnAdd" @click="answer">回答问题</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getGoodsCate } from '../../network/goods'
import { getOrder, removeOrder, getOrderById, editOrder } from '../../network/order'
import Quill from '../../components/quill'
export default {
  name: '',
  components: {
    Quill
  },
  data () {
    return {
      AnswerDialogVisible: false,
      value: '',
      orderList: [],
      queryInfo: {
        query: { id: -1 },
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      cateList: [],
      AnswerForm: {},
      AnswerFormRules: {
        answerContent: [
          { required: true, message: '请输入您的回答', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getOrderList()
    getGoodsCate().then(res => {
      this.cateList = res.data.cate
    })
  },
  methods: {
    handleChange (qid) {
      this.queryInfo.query = { id: qid }
      this.getOrderList()
    },
    showAnswerDialogVisible (qid) {
      getOrderById({ id: qid }).then(res => {
        this.AnswerForm = res.data.order[0]
        this.AnswerDialogVisible = true
      })
    },
    AnswerDialogVisibleClosed () {
      this.$refs.AnswerFormRef.resetFields()
    },
    answer () {
      this.AnswerForm.isQusetion = 2
      editOrder(this.AnswerForm).then(res => {
        this.$message.success(res.message)
        this.AnswerDialogVisible = false
        this.getOrderList()
      })
    },
    cateName (id) {
      const arr = this.cateList.filter(item => item.cid === id)
      return arr[0]
    },
    getOrderList () {
      getOrder(this.queryInfo).then(res => {
        this.orderList = res.data.order
        this.total = parseInt(res.data.total[0].num)
      })
    },
    async removeOrderById (oid) {
      const confirmResult = await this.$confirm('此操作将删除这条问题, 是否继续?', '提示', {
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
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
