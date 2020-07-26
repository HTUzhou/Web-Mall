<template>
  <div>
    <!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
<!--    卡片视图区-->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="searchInput">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
<!--      订单列表数据-->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="orderSn"></el-table-column>
        <el-table-column label="订单总价" prop="totalAmount"></el-table-column>
        <el-table-column label="是否付款" prop="payType">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.payType != 0" type="success">已付款</el-tag>
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="status">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 2">
              是
            </span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="createTime" width="150px">
          <template slot-scope="scope">
            {{scope.row.createTime | dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-button @click="showBox" type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button @click="showProgressBox" type="success" icon="el-icon-location" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
<!--      分页-->
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[5, 10, 15, 20]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
    </el-card>
<!--    修改地址对话框-->
    <el-dialog
            @close="addressDialogClose"
            title="修改地址"
            :visible.sync="addressVisible"
            width="50%">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :props="orderProps" :options="locationData" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>
<!--    展示物流进度的对话框-->
    <el-dialog
            title="物流进度"
            :visible.sync="progressVisible"
            width="50%">
      <span>这是一段信息</span>
    </el-dialog>
  </div>
</template>

<script>
  const { data, province, city, area, town } = require('province-city-china/data')

  export default {
    name: "Order",
    data() {
      return {
        orderProps: {
          label: 'name',
          value: 'code'
        },
        locationData: data.slice(3150),
        searchInput: '',
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 5
        },
        total: 0,
        orderList: [],
        addressVisible: false,
        addressForm: {
          address1: [],
          address2: ''
        },
        addressFormRules: {
          address1: [
            { required: true, message: '请选择省市区县', trigger: 'blur' }
          ],
          address2: [
            { required: true, message: '请填写详细地址', trigger: 'blur' }
          ]
        },
        progressVisible: false
      }
    },
    created() {
      this.getOrderList()
    },
    methods: {
      async getOrderList() {
        const {data: res} = await this.$http.get('/order/list', {
          params: this.queryInfo
        })
        if (res.code !== 200) {
          this.$message.error('获取信息失败')
        }
        this.orderList = res.data.list
        this.total = res.data.total
        console.log(this.orderList)
      },
      //监听size发生变化
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getOrderList()
      },
      //监听page变化
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getOrderList()
      },
      //展示修改地址的对话框
      showBox() {
        this.addressVisible = true
      },
      addressDialogClose() {
        this.$refs.addressFormRef.resetFields()
        this.addressVisible = false
      },
      showProgressBox() {
        this.progressVisible = true
      }
    }
  }
</script>

<style scoped>

</style>