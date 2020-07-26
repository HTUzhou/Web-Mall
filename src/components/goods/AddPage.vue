<template>
  <div>
    <!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
<!--    卡片视图-->
    <el-card>
<!--      提示区-->
      <el-alert
              title="添加商品信息"
              type="info"
              center
              show-icon
              :closable="false">
      </el-alert>
<!--      步骤条 active需要的是int值-->
      <el-steps align-center :space="200" :active="activeIndex - 0" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="addForm" label-position="top" :rules="addFormRules" ref="addFormRef" label-width="100px">
<!--      tab区域 model与name绑定，
所以activeIndex需要是字符串 :before-leave是钩子函数-->
        <el-tabs :before-leave="beforeTableLeave" v-model="activeIndex" :tab-position="'left'">
          <el-tab-pane name="0" label="基本信息">
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="addForm.name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="price">
              <el-input type="number" v-model="addForm.price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="weight">
              <el-input type="number" v-model="addForm.weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="stock">
              <el-input type="number" v-model="addForm.stock"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="productCategoryId">
              <el-cascader
                      v-model="addForm.productCategoryId"
                      :options="cateList"
                      :props="cateProps"
                      @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="1" label="商品参数">商品参数</el-tab-pane>
          <el-tab-pane name="2" label="商品属性">商品属性</el-tab-pane>
          <el-tab-pane name="3" label="商品图片">
<!--            action上传图片的接口 :on-preview预览事件-->
            <el-upload
                    :http-request="fnUploadRequest"
                    :headers="uploadHead"
                    name="file"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    list-type="picture" action="">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane name="4" label="商品内容">
<!--            富文本编辑器-->
            <quill-editor v-model="addForm.introduce"></quill-editor>
            <el-button type="primary" class="addBtn" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <el-dialog
            title="图片预览"
            :visible.sync="previewVisible"
            width="50%">
      <img :src="addForm.pic" alt="" class="previewImage">
    </el-dialog>
  </div>
</template>

<script>
  import {client, getFileNameUUID} from "../../oss/aliOss";

  export default {
    name: "AddPage",
    created() {
      this.getCateList()
    },
    methods: {
      //获取商品分类信息
      async getCateList() {
        const {data: res} = await this.$http.get(`/category/listAll`)
        if (res.code !== 200) {
          return this.$message.error('获取失败')
        }
        this.cateList = res.data.pmsCategoryResults
        for (let i = 0; i < this.cateList.length; i++) {
          for (let j = 0; j < this.cateList[i].children.length; j++) {
            this.cateList[i].children[j].children = undefined
          }
        }
        console.log(this.cateList)
      },
      //级联选择器选中项变化处理函数
      handleChange() {
        console.log(this.addForm.productCategoryId)
      },

      beforeTableLeave(activeName, oldActiveName) {

      },
      //处理图片预览
      handlePreview(file) {
        this.previewVisible = true
      },
      //处理移除图片操作
      handleRemove(file) {
      },
      //自定义文件上传
      fnUploadRequest(file) {
        const that = this
        let obj = {
          region: 'oss-cn-beijing',
          accessKeyId: 'LTAI4GG1pnRk4SKNtf6CNu7i',
          accessKeySecret: 'oe4NAIFKHZnVQFtA2Go1q4QXG3xMbS',
          bucket: 'zyt-mall'
        }
        let myClient = client(obj)
        console.log(myClient)
        async function multipartUpload() {
          let temporary = file.file.name.lastIndexOf('.')
          let fileNameLength = file.file.name.length
          let fileFormat = file.file.name.substring(temporary + 1, fileNameLength)
          let fileName = getFileNameUUID() + '.' + fileFormat
          myClient.multipartUpload(`videoTest/${fileName}`, file.file, {
            progress: function (p) {
              //p进度条的值
              console.log(p)
            }
          }).then(res => {
            console.log(res)
            that.addForm.pic = res.res.requestUrls[0]
          }).catch(error => {
            console.log(error)
          })
        }
        multipartUpload()
      },
      //点击添加商品按钮
      addGoods() {
        this.$refs.addFormRef.validate(valid => {
          if (!valid) {
            return this.$message.error('请填写必要的表单项！')
          }
        //  执行添加的必要逻辑
          this.$message.success('添加成功！')
        })
      }
    },
    data() {
      return {
        previewVisible: false,
        activeIndex: '0',
        //添加商品的表单对象
        addForm: {
          name: '',
          price: 0,
          weight: 0,
          stock: 0,
          productCategoryId: [],
          pic: '',
          introduce: ''
        },
        //添加商品的验证对象
        addFormRules: {
          name: [
            { required: true, message: '请输入商品名称', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ],
          price: [
            { required: true, message: '请输入商品价格', trigger: 'blur' }
          ],
          weight: [
            { required: true, message: '请输入商品重量', trigger: 'blur' }
          ],
          stock: [
            { required: true, message: '请输入商品数量', trigger: 'blur' }
          ],
          productCategoryId: [
            { required: true, message: '请选择商品分类', trigger: 'blur' }
          ]
        },
        //分类列表
        cateList: [],
        cateProps: {
          label: 'name',
          value: 'id',
          children: 'children',
        },
        uploadFileParams: {},
        //这个组件发送的请求没有被拦截，所以我们要自己加上token
        uploadHead: {
          Authorization: 'Bearer ' + window.sessionStorage.getItem('token')
        },

      }
    }
  }
</script>

<style lang="less" scoped>
  .previewImage {
    width: 100%;
  }
  .addBtn {
    margin-top: 20px;
  }
</style>