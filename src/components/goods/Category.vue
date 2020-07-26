<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

<!--    卡片视图区-->
    <el-card>
      <el-row>
        <el-col>
          <el-button @click="showAddCateDialog" type="primary" class="classButton">添加分类</el-button>
        </el-col>
      </el-row>
      <!--        表格  vue-table-with-tree-grid依赖-->
      <tree-table index-text="#" border show-index :selection-type="false" :expand-type="false" :data="cateList" :columns="columns">
<!--        是否有效-->
        <template slot="isok" slot-scope="scope">
          <i style="color: #3cb6ba" v-if="scope.row.showStatus == 1" class="el-icon-success"></i>
          <i style="color: red;" v-else class="el-icon-error"></i>
        </template>
<!--        排序-->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.level == 0" type="success" size="mini">一级</el-tag>
          <el-tag v-else type="warning" size="mini">二级</el-tag>
        </template>
<!--        操作-->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">
            编辑
          </el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">
            删除
          </el-button>
        </template>
      </tree-table>


      <!--        分页区域-->
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[3, 5, 10, 15]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
    </el-card>
<!--    添加分类的对话框-->
    <el-dialog
            title="添加分类"
            :visible.sync="addCateDialogVisible"
            width="50%"
            @close="addCateDialogClose">
<!--      添加分类的表单-->
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称：">
<!--          option:指定数据源-->
          <el-cascader width="800px" class="height: 300px"
                  v-model="selectedKeys"
                  :options="parentCateList"
                  :props="cascaderProps"
                  @change="parentCateChanged"
                  clearable
                  >
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateFormToEnd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Category",
    data() {
      return {
        //分类信息
        cateList: [],
        //查询参数
        queryInfo: {
          pagenum: 1,
          pagesize: 5
        },
        //总数据条数
        total: 0,
        //为table指定列的定义
        columns: [
          {
            label: '分类名称',
            prop: 'name'
          },
          {
            label: '是否有效',
            //表示将当前列定义为模板列
            type: 'template',
            //表示当前这一列使用模板名称
            template: 'isok'
          },
          {
            label: '排序',
            type: 'template',
            template: 'order'
          },
          {
            label: '操作',
            type: 'template',
            template: 'opt'
          }
        ],
        //控制添加分类对话框的显示和隐藏
        addCateDialogVisible: false,
        //添加分类的表单数据对象
        addCateForm: {
        //  将要添加的分类名称
          cat_name: '',
        //  父级分类的id,一级分类为0
          cat_pid: 0,
          //分类的等级，默认添加的是一级分类
          cat_level: 0
        },
        addCateFormRules: {
          cat_name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ]
        },
      //  父级分类的列表
        parentCateList: [],
        //指定级联选择器的配置对象
        cascaderProps: {
          value: 'id',
          label: 'name'
        },
        //选中的父级分类的id数组
        selectedKeys: []

      }
    },
    created() {
      this.getCateList()
    },
    methods: {
      async getCateList() {
        const {data: res} = await this.$http.get('/category/list', {
          params: this.queryInfo
        })
        if (res.code !== 200) {
          return this.$message.error("获取分类信息失败");
        }
        this.cateList = res.data.pmsCategoryResults;
        //总数据条数
        this.total = res.data.total
      },
      //监听pagesize改变
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getCateList()
      },
      //监听pagenum的改变
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getCateList()
      },
      //显示添加分类的对话框
      showAddCateDialog() {
        this.getParentCateList();
        this.addCateDialogVisible = true
      },
      async getParentCateList() {
        const {data: res} = await this.$http.get(`/category/flist`)
        this.parentCateList = res.data
      },
      //选中项发生变化触发这个函数
      parentCateChanged() {
      //  如果selectedKeys 数组中的length大于0，证明选中了父级分类
      //  反正，没有选中任何父级分类
        if (this.selectedKeys.length > 0) {
          this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        } else {
          this.addCateForm.cat_pid = 0
        }
        this.addCateForm.cat_level = this.selectedKeys.length;
      },
      //发送表单信息
      async addCateFormToEnd() {
        const {data: res} = await this.$http.post(`/category/addCategory`, {
          parentId: this.addCateForm.cat_pid,
          name: this.addCateForm.cat_name,
          level: this.addCateForm.cat_level
        })
        this.addCateDialogVisible = false
        this.$message.success("添加成功")
      },
      //监听对话框的关闭事件
      addCateDialogClose() {
        this.$refs.addCateFormRef.resetFields()
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_name = ''
        this.selectedKeys = []
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
  .classButton {
    margin-bottom: 20px;
  }
  .el-cascader {
    width: 100%;
  }

</style>