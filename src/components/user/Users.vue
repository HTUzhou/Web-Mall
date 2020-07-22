<template>
  <div>
    <!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片区域-->
    <el-card class="box-card">
      <!--      搜索与添加区域，用layout布局 :gutter指定的子元素之间的间距-->
      <el-row :gutter="20">
        <!--        :span指定占的份数-->
        <el-col :span="8">
          <el-input clearable @clear="getUserList" placeholder="请输入内容" v-model="queryInfo">
            <el-button slot="append" icon="el-icon-search" @click="queryUsers"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!--      用户列表区 :data指定数据源 prop对应数据源的某个属性-->
      <el-table :data="userList" border stripe>
        <!--        这一行是索引列-->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="ID" prop="id"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!--            scope.row获得这一列的属性，这就是作用域插槽-->
            <el-switch v-model="scope.row.status" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!--            修改按钮-->
            <el-tooltip :enterable="false" class="item" effect="dark" content="修改" placement="top">
              <el-button @click="showEditDialog(scope.row.id)" size="mini" type="primary" icon="el-icon-edit"></el-button>
            </el-tooltip>
            <!--            删除按钮-->
            <el-tooltip  :enterable="false" class="item" effect="dark" content="删除" placement="top">
              <el-button @click="removeUserById(scope.row.id)" size="mini" type="danger" icon="el-icon-delete"></el-button>
            </el-tooltip>
            <!--            分配角色按钮-->
            <el-tooltip :enterable="false" class="item" effect="dark" content="分配角色" placement="top">
              <el-button size="mini" type="warning" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--      分页区域-->
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="userList.length">
      </el-pagination>

    </el-card>
    <!--    添加用户的对话框-->
    <el-dialog
            title="提示"
            :visible.sync="addDialogVisible"
            width="50%"
            @close="addDialogClosed">
      <!--      内容主体区域-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
      </el-form>
<!--      底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button @click="addUser" type="primary">确 定</el-button>
      </span>
    </el-dialog>
<!--    修改用户的对话框-->
    <el-dialog
            title="修改用户"
            :visible.sync="editdialogVisible"
            width="50%">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      //验证邮箱的规则
      let checkEmail = (rule, value, cb) => {
        //验证邮箱的正则表达式
        const regEmail = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/
        if (regEmail.test(value)) {
          return cb();
        }
        cb(new Error("请输入合法的邮箱"));
      }
      return {
        userList: [],
        currentPage: 1,
        pageSize: 10,
        //用户输入的查询信息
        queryInfo: '',
        //控制对话框的显示和隐藏
        addDialogVisible: false,
        //添加用户的表单
        addForm: {
          username: '',
          password: '',
          email: ''
        },
        addFormRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            {validator: checkEmail, trigger: 'blur'}
          ]
        },
        //控制修改用户对话框的显示与隐藏
        editdialogVisible: false,
        //查询到的用户信息对象
        editForm: {},
        //edit框的验证规则
        editFormRules: {
          email: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            {validator: checkEmail, trigger: 'blur'}
          ]
        }
    }
    },
    name: "Users",
    created() {
      this.getUserList();
    },
    methods: {
      //根据输入框内容查询用户
      async queryUsers() {
        const {data: res} = await this.$http.get(`/admin/users/${this.queryInfo}`);
        this.userList = res.data;
        this.userList.forEach(element => {
          if (element.status === 1) {
            element.status = true;
          } else {
            element.status = false;
          }
        })
      },
      async getUserList() {
        const {data: res} = await this.$http.get("/admin/users");
        if (res.code !== 200) {
          return this.$message.error("获取用户列表失败");
        }
        this.userList = res.data;
        this.userList.forEach(element => {
          if (element.status === 1) {
            element.status = true;
          } else {
            element.status = false;
          }
        })
      },
      //监听pagesize的改变
      handleSizeChange(newPageSize) {
        this.pageSize = newPageSize;
        console.log(newPageSize);
      },
      //监听页码值改变的事件
      handleCurrentChange(newPage) {
        console.log(newPage)
      },
      //监听switch状态改变按钮的切换
      async userStateChanged(userInfo) {
        const {data: res} = await this.$http.put(`/admin/${userInfo.id}/state/${userInfo.status}`);
        if (res.code !== 200) {
          userInfo.status = !userInfo.status;
          return this.$message.error("更新用户状态失败！！！");
        }
        this.$message.success("更新用户状态成功！！！");
      },
      //监听对话框的关闭,进行表单的重置
      addDialogClosed() {
        this.$refs.addFormRef.resetFields();
      },
      //点击按钮，添加新用户
      addUser() {
        //预校验
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) {
            return;
          }
          //发送请求
          const {data: res} = await this.$http.post("/admin/register", this.addForm);
          console.log(res);
          if (res.code !== 200) {
            return this.$message.error("增加用户失败！");
          }
          this.$message.success("增加用户成功！");
          this.addDialogVisible = false;
          //重新获取列表数据
          this.getUserList();
        })
      },
      //展示修改用户的对话框
      async showEditDialog(id) {
        const {data: res} = await this.$http.get(`/admin/users/get/${id}`);
        if (res.code !== 200) {
          return this.$message.error("获取信息失败！");
        }
        this.editForm = res.data;
        this.editdialogVisible = true;
        console.log(res)
      },
      //修改用户信息并提交
      editUserInfo() {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) {
            return this.$message.error("验证失败！");
          }
          const {data: res} = await this.$http.put(`/admin/users/${this.editForm.id}`,
              {
                email: this.editForm.email
              })
          if (res.code !== 200) {
            return this.$message.error("修改失败！");
          }
          this.editdialogVisible = false;
          this.$message.success("修改成功！");
        })
      },
      //根据id删除用户
      removeUserById(id) {
        //弹窗询问是否删除
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          //用户点击确定，则发送删除请求
          this.$http.delete(`/admin/users/${id}`);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          //重新获取数据
          this.getUserList();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
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

  .el-table {
    margin-top: 15px;
    font-size: 15px;
  }

  .el-pagination {
    margin-top: 15px;
  }
</style>