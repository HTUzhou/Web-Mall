<template>
  <div>
<!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
<!--    卡片视图-->
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="name"></el-table-column>
        <el-table-column label="路径" prop="uri"></el-table-column>
        <el-table-column label="权限值" prop="value"></el-table-column>
      </el-table>
    </el-card>

  </div>
</template>

<script>
  export default {
    name: "Rights",
    data() {
      return {
        rightsList: []
      }
    },
    created() {
      //获取全部权限
      this.getRightsList();
    },
    methods: {
      //获取全部权限
      async getRightsList() {
        const {data: res} = await this.$http.get('/rights/list');
        this.rightsList = res.data;
        console.log(this.rightsList);
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-breadcrumb {
    margin-bottom: 20px;
  }

  .el-card {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
  }
</style>