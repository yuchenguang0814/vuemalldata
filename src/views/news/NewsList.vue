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
          <el-button type="primary" @click="goeditNew">添加新闻</el-button>
        </el-col>
      </el-row>
      <el-table :data="newsList" border stripe>
        <el-table-column label="新闻类别" prop="cid">
          <template slot-scope="scope">
            {{ cateName(scope.row.cid).name }}
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
              <el-button type="primary" icon="el-icon-edit" size="mini" @click ="showEditNewDialogVisible(scope.row.id)"></el-button>
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
    <el-dialog title="修改新闻" :visible.sync="editNewDialogVisible" width="50%" @close="editNewDialogVisibleClosed">
      <el-form :model="editNewForm" :rules="editNewFormRules" ref="editNewFormRef" label-width="200px" label-position="left" size="small">
        <el-form-item label="请选择新闻所属分类" prop="cid">
          <el-select v-model="editNewForm.cid" placeholder="请选择新闻类别">
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
          <el-input v-model="editNewForm.title"></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="editNewForm.author"></el-input>
        </el-form-item>
        <el-form-item label="产品页面关键词" prop="pageKey">
              <el-input v-model="editNewForm.pageKey"></el-input>
            </el-form-item>
            <el-form-item label="产品页面描述" prop="pageDescription">
              <el-input v-model="editNewForm.pageDescription" type="textarea"></el-input>
            </el-form-item>
        <el-form-item label="">
          <quill  ref="richAnalysis"/>
        <el-button type="primary" class="btnAdd" @click="editNews">修改新闻</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getNews, getNewById, editNew } from '../../network/news'
import Quill from '../../components/quill'
export default {
  components: {
    Quill
  },
  data () {
    return {
      value: -1,
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      newsList: [],
      editNewDialogVisible: false,
      editNewForm: {},
      editNewFormRules: {
        cid: [
          { required: true, message: '请选择新闻类别', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请填写新闻标题', trigger: 'blur' }
        ]
      },
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
    editNews () {
      editNew(this.editNewForm).then(res => {
        if (res.code !== 200) {
          return this.$message.error(res.message)
        }
        this.$message.success(res.message)
        this.editNewDialogVisible = false
        this.getNewList()
      })
    },
    showEditNewDialogVisible (cid) {
      getNewById({ id: cid }).then(res => {
        this.editNewForm = res.data.news[0]
        this.editNewDialogVisible = true
      })
    },
    editNewDialogVisibleClosed () {
      this.$refs.editNewFormRef.resetFields()
    },
    getNewList () {
      getNews(this.queryInfo).then(res => {
        this.newsList = res.data.news
        this.total = parseInt(res.data.total[0].num)
      })
    },
    cateName (id) {
      const arr = this.newcategory.filter(item => item.id === id)
      return arr[0]
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
      this.queryInfo.query = { cid: id }
      this.getNewList()
    },
    goeditNew () {
      this.$router.push('/news/add')
    },
    goEditNew (id) {},
    removeNewById (id) {}
  }
}
</script>

<style>

</style>
