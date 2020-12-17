<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>页面管理</el-breadcrumb-item>
      <el-breadcrumb-item>轮播图列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-upload
            :action="uploadURL"
            ref="addBanner"
            :before-upload="beforeAvatarUpload"
            :on-error="onError"
            :headers="headerObj"
            :on-success="handleSuccess"
            :show-file-list="false">
              <el-button size="small" type="primary">点击上传轮播图</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
      <el-table :data="bannerList">
        <el-table-column label="页面banner图" prop="image">
          <template slot-scope="scope">
            <img :src="`${$baseUrl + scope.row.image}`" alt="" width="500px" height="auto">
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeBannerById(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { GetBanner, AddBanner, removeBanner } from '../../network/page'
export default {
  name: '',
  components: {
  },
  data () {
    return {
      bannerList: [],
      uploadURL: 'http://127.0.0.1:3000/upload',
      headerObj: {
        Authorization: 'pageBanner'
      }
    }
  },
  created () {
    GetBanner().then(res => {
      this.bannerList = res.data
    })
  },
  methods: {
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 0.5
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 500KB!')
      }
      return isJPG && isLt2M
    },
    handleSuccess (res) {
      this.$message.success('上传Banner图片成功!')
      const imgUrl = '/uploads/banner/' + res.img
      AddBanner({ img: imgUrl }).then(res => {
        GetBanner().then(res => {
          this.bannerList = res.data
        })
      })
    },
    onError (res) {
      this.$message.error('上传Banner图片失败!')
    },
    removeBannerById (Bid) {
      removeBanner({ id: Bid }).then(res => {
        GetBanner().then(res => {
          this.$message.success(res.message)
          this.bannerList = res.data
        })
      })
    }
  }
}
</script>

<style>
.key_alert {
  width: 300px;
  position: absolute;
  left: 180px;
  top: 0px;
}
</style>
