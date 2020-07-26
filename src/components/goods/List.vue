<template>
  <div>
    <!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
<!--    卡片视图区-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input clearable @clear="getGoodsList" v-model="queryInfo.query" placeholder="请输入内容" >
            <el-button @click="getGoodsList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="goAddPage" type="primary">添加商品</el-button>
        </el-col>
      </el-row>
<!--      table表格区-->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column width="200px" label="商品名称" prop="name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="price"></el-table-column>
        <el-table-column label="商品重量" prop="weight"></el-table-column>
        <el-table-column label="品牌" prop="brandName"></el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button @click="removeById(scope.row.id)" type="danger" icon="el-icon-delete" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
<!--      分页条-->
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[5, 10, 20, 30]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "List",
    data() {
      return {
        //查询参数对象
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 10
        },
        //商品列表
        goodsList: [],
        //总数据条数
        total: 0
      }
    },
    methods: {
      //根据分页获取对应的商品列表
      async getGoodsList() {
        const {data: res} = await this.$http.get('/goods/list', {
          params: this.queryInfo
        })
        if (res.code !== 200) {
          return this.$message.error("获取失败")
        }
        this.goodsList = res.data.list
        this.total = res.data.total
        console.log(this.goodsList)
      },
      //监听pagesize发生改变
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getGoodsList()
      },
      //监听pagenum发生改变
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getGoodsList()
      },
      //监听删除按钮
      async removeById(id) {
        const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (confirmResult !== 'confirm') {
          return this.$message.info('取消删除')
        }
        const {data: res} = await this.$http.delete(`/goods/${id}`)
        if (res.code !== 200) {
          return this.$message.error('删除失败')
        }
        this.getGoodsList()
        this.$message.success('删除成功')
      },
      //添加商品
      goAddPage() {
        this.$router.push('/home/goodsList/add')
      }
    },
    created() {
      this.getGoodsList()
    }
  }
</script>

<style lang="less" scoped>

</style>