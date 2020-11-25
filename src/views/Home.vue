<template>
<el-container class="home-container">
  <el-header>
    <div>
      <img src="" alt="">
      <span>后台管理系统</span>
    </div>
    <el-button type="info" @click="logout">退出</el-button>
  </el-header>
  <el-container>
    <el-aside :width="isCollapse?'64px':'200px'">
      <div class="toggle-button" @click="toggleCollapse">|||</div>
      <el-menu background-color="#333744" text-color="#fff" active-text-color="#409bff" unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activPath">
        <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
          <template slot="title">
            <i :class="iconsObj[item.id]"></i>
            <span>{{item.authName}}</span>
          </template>
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/'+subItem.path)">
              <template slot="title">
                <i class="el-icon-s-grid"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-main><router-view></router-view></el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  data () {
    return {
      menulist: [{
        authName: '用户管理',
        children: [{
          authName: '用户列表',
          id: 110,
          path: 'users'
        }],
        id: 125,
        path: 'users'
      }, {
        authName: '页面设置',
        children: [{
          authName: '页面列表',
          id: 111,
          path: 'page'
        }, {
          authName: '轮播图列表',
          id: 112,
          path: 'banner'
        }
        ],
        id: 103,
        path: 'page'
      }, {
        authName: '商品管理',
        children: [{
          authName: '商品列表',
          id: 104,
          path: 'goods'
        }, {
          authName: '商品分类',
          id: 115,
          path: 'cate'
        }],
        id: 101,
        path: 'goods'
      }, {
        authName: '新闻中心',
        children: [{
          authName: '新闻列表',
          id: 155,
          path: 'news'
        }, {
          authName: '视频列表',
          id: 156,
          path: 'videos'
        }],
        id: 154,
        path: 'news'
      }, {
        authName: '关于我们',
        children: [{
          authName: '荣誉中心',
          id: 167,
          path: 'honor'
        }, {
          authName: '工厂实景',
          id: 166,
          path: 'factory'
        }],
        id: 165,
        path: 'news'
      }, {
        authName: '在线留言',
        children: [{
          authName: '留言列表',
          id: 107,
          path: 'orders'
        }],
        id: 102,
        path: 'orders'
      }, {
        authName: '数据统计',
        children: [{
          authName: '数据报表',
          id: 146,
          path: 'reports'
        }],
        id: 145,
        path: 'reports'
      }],
      iconsObj: {
        125: 'iconfont icon-morentouxiang',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        154: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
        165: 'iconfont icon-tijikongjian'
      },
      isCollapse: false,
      activPath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activPath = window.sessionStorage.getItem('activPath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      // const { data: res } = await this.$http.get('menus')
      // if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // this.menulist = res.data
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    saveNavState (activPath) {
      window.sessionStorage.setItem('activPath', activPath)
      this.activPath = activPath
    }
  }
}
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }

  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left:70px;
    align-items: center;
      span {
        font-size:20px;
        color:skyblue;
      }
  }

  .el-aside {
    background-color: #333744;
    .toggle-button {
      background-color: #4a5064;
      font-size:10px;
      color:#fff;
      text-align:center;
      line-height: 24px;
      letter-spacing: 0.2em;
      cursor: pointer;
    }
    .el-menu {
      border-right:none;
    }
    .iconfont {
      margin-right:10px;
    }
  }

  .el-main {
    background-color: #eaedf1;
  }
</style>
