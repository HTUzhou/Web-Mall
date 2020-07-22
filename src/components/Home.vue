<template>
<!--  注意，elementui中的组件的名称，同时也是他的类名-->
  <el-container class="home-container">
<!--    头部区域-->
    <el-header>
      <div>
        <img src="../assets/images/logo.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button @click="logout" type="info">退出</el-button>
    </el-header>
<!--    页面主体区域-->
    <el-container>
<!--      侧边栏-->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
<!--        侧边栏菜单区域-->
        <el-menu
                background-color="#313743"
                text-color="#fff"
                active-text-color="#3c97ff"
                unique-opened
                :collapse="isCollapse"
                :collapse-transition="false"
                :router="true"
                :default-active="activePath">
<!--          一级菜单-->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
<!--            一级菜单模板区域-->
            <template slot="title">
<!--              图标-->
              <i :class="item.class"></i>
<!--              文本-->
              <span>{{item.authname}}</span>
            </template>
<!--            二级菜单-->
            <el-menu-item @click="saveNavState('/home/' + subItem.path)" :index="'/home/' + subItem.path" v-for="subItem in item.children" :key="subItem.id">
<!--              二级菜单模板区域-->
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authname}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
<!--      右侧内容主体-->
      <el-main>
<!--        路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: "Home",
    methods: {
      logout() {
        //清除sessionStorage的token
        window.sessionStorage.clear();
        //重定向到登录页
        this.$router.push('/login');
      },
      //获取所有菜单
      async getMenuList() {
        const {data: res} = await this.$http.get('/admin/info')
        this.menuList = res.data;
        //为每个对象再添加上一个类属性，用于字体图标
        const classes = ['iconfont icon-user', 'iconfont icon-tijikongjian',
        'iconfont icon-shangpin', "iconfont icon-danju-tianchong ", "iconfont icon-baobiao"];
        for (let i = 0; i < this.menuList.length; i++) {
          this.menuList[i].class = classes[i];
        }
      },
      //点击按钮，切换菜单的折叠与展开
      toggleCollapse() {
        this.isCollapse = !this.isCollapse;
      },
      //保存链接的激活状态
      saveNavState(activePath) {
        window.sessionStorage.setItem('activePath', activePath);
        this.activePath = activePath;
      }
    },
    data() {
      return {
        menuList: [],
        //是否折叠
        isCollapse: false,
        //被激活的链接地址
        activePath: ''
      }
    },
    created() {
      this.getMenuList();
      //一开始就去到激活的路径
      this.activePath = window.sessionStorage.getItem("activePath");
    }
  }
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }
  .el-header {
    background-color: #363d40;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div {
      display: flex;
      align-items: center;
      span {
        margin-left: 15px;
      }
      img {
        width: 80px;
        height: 100%;
      }
    }


  }
  .el-aside {
    background-color: #313743;
    .el-menu {
      border-right: none;
    }
  }
  .el-main {
    background-color: #e9edf1;
  }
  .iconfont {
    margin-right: 10px;
  }
  .toggle-button {
    background-color: #475163;
    color: #fff;
    font-size: 15px;
    text-align: center;
    line-height: 24px;
    /*文字之间的间距*/
    letter-spacing: 0.2em;
    /*鼠标放上去后变成一个手*/
    cursor: pointer;
  }
</style>