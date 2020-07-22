<template>
  <div class="login_container">
    <div class="login_box">
<!--      头像区域-->
      <div class="avatar_box">
        <img src="../assets/images/logo.png" alt="">
      </div>
<!--      登录表单区-->
      <el-form ref="loginFormRef" :rules="loginForm.rules" :model="loginForm" label-width="0px" class="login_form">
<!--        用户名-->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
<!--        密码-->
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-password "></el-input>
        </el-form-item>
<!--        按钮区域-->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Login",
    data() {
      return {
        //只是登录表单的数据绑定对象
        loginForm: {
          username: 'string',
          password: 'string',
          //表单验证规则对象
          rules: {
            //验证用户名是否合法
            username: [
              { required: true, message: '请输入登录名', trigger: 'blur' },
              { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
            ],
            //验证密码是否合法
            password: [
              { required: true, message: '请输入登录密码', trigger: 'blur' },
              { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
            ]
          }
        }
      }
    },
    methods: {
      //点击重置按钮重置表单
      resetLoginForm() {
        this.$refs.loginFormRef.resetFields();
      },
      login() {
        //为了简化promise操作，异步请求要用async修饰，并且发送请求时前面加上await，因为返回的是一个promise对象，这就是promise语法的语法糖
        this.$refs.loginFormRef.validate(async valid => {
          //valid为true时，发送请求
          if (!valid) {
            return;
          }
          //直接将请求的data赋值给res
          const {data: res} = await this.$http.post('/admin/login', this.loginForm);
          console.log(res);
          if (res.code !== 200) {
            return this.$message.error("账号或密码错误！");
          }
          this.$message.success("登录成功！");
          window.sessionStorage.setItem("token", res.data.token);
          //跳转页面
          this.$router.push("/home");
        //  将登录成功之后的token，保存到客户端的sessionStorage中
        //  token只应该在当前网站打开期间生效，所以将token保存在sessionStorage中
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .login_container {
    background-color: #2b4b6b;
    height: 100%;
  }
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    /*居中*/
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .avatar_box {
      width: 130px;
      height: 130px;
      border: 1px solid #eeeeee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        border-radius: 50%;
        height: 100%;
        width: 100%;
        background-color: #eeeeee;
      }
    }
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
</style>