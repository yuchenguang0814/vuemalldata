<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialogVisible">添加分类</el-button>
        </el-col>
      </el-row>
      <el-table :data="cateList" border stripe>
        <el-table-column label="商品序号" prop="pagePath"></el-table-column>
        <el-table-column label="分类小图" prop="simage">
          <template slot-scope="scope">
            <img :src="`${scope.row.pageTitleImage}`" alt="" width="140px" height="auto">
          </template>
        </el-table-column>
        <el-table-column label="分类大图" prop="simage">
          <template slot-scope="scope">
            <img :src="`${scope.row.pageImage}`" alt="" height="140px" width="auto">
          </template>
        </el-table-column>
        <el-table-column label="分类名称" prop="pageName"></el-table-column>
        <el-table-column label="操作" width="130px">
          <template>
              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogVisibleClosed">
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="分类序号" prop="cat_sort">
          <el-input v-model="addCateForm.cat_sort" type="number"></el-input>
        </el-form-item>
        <el-form-item label="分类小涂" prop="cat_sort">
          <el-input v-model="addCateForm.cat_sort" type="number"></el-input>
        </el-form-item>
        <el-form-item label="分类序号" prop="cat_sort">
          <el-input v-model="addCateForm.cat_sort" type="number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getGoodsCate } from '../../network/goods'
export default {
  data () {
    return {
      cateList: [],
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_sort: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      selectedKeys: []
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    getCateList () {
      getGoodsCate().then(res => {
        this.cateList = res.data.cate
        console.log(this.cateList)
      })
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    showAddCateDialogVisible () {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.parentCateList = res.data
    },
    addCateDialogVisibleClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    parentCateChanged () {
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
        return false
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    addCateInfo () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) return this.$message.error('添加分类失败')
        this.$message.success(res.meta.msg)
        this.addCateDialogVisible = false
        this.getCateList()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
