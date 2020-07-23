<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片视图-->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!--        角色列表区域-->
      <el-table :data="roleList" border stripe>
<!--        展开列-->
        <el-table-column type="expand">
          <template slot-scope="scope">
<!--            <pre>{{scope.row}}</pre>-->
            <el-row :class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, index1) in scope.row.permissions" :key="item1.id">
<!--              渲染一级权限-->
              <el-col :span="5">
                <el-tag @close="removeRightById(scope.row, item1.id)" closable>{{item1.name}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
<!--              渲染二级权限-->
              <el-col :span="19">
                <el-row :class="[index2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, index2) in item1.children" :key="item2.id">
                  <el-col>
                    <el-tag @close="removeRightById(scope.row, item2.id)" closable type="success">{{item2.name}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
<!--        索引列-->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="role.name"></el-table-column>
        <el-table-column label="角色描述" prop="role.description"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button @click="showSetRightDialog(scope.row)" size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
<!--    分配权限的对话框-->
    <el-dialog
            title="分配权限"
            :visible.sync="setRightDialogVisible"
            width="50%"
            @close="setRightDialogClosed">
<!--     树形控件-->
      <el-tree ref="treeRef" :default-checked-keys="defKeys" default-expand-all node-key="id" :data="rightsList" :props="treeProps" show-checkbox></el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Roles",
    data() {
      return {
        //所有角色信息
        roleList: [],
        //是否分配权限
        setRightDialogVisible: false,
        //所有权限的数据
        rightsList: [],
        //树形控件的数据绑定对象
        treeProps : {
          label: 'name',
          children: 'children'
        },
        //默认选中的节点id值
        defKeys: [],
        //当前即将分配权限的角色id
        roleId: ''
      }
    },
    created() {
      this.getRoleList();
    },
    methods: {
      //获取角色信息
      async getRoleList() {
        const {data: res} = await this.$http.get("/rights/roles")
        this.roleList = res.data;
        console.log(this.roleList);
      },
      //根据id删除对应的权限
      async removeRightById(myrole, permissionId) {
        const confirmResult = await this.$confirm("此操作将永久删除该权限，是否继续？",
        "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).catch(err => err)

        if (confirmResult !== 'confirm') {
          return this.$message.info("取消删除")
        }
        const {data: res} = await this.$http.delete(`/rights/roles/${myrole.role.id}/permission/${permissionId}`)
        if (res.code !== 200) {
          return this.$message.error("删除权限失败")
        }
        //防止页面全部刷新，只把部分数据更新
        myrole.permissions = res.data;
        this.$message.success("已删除");
      },
      //展示分配权限的对话框
      async showSetRightDialog(role) {
        //获取所有权限的数据
        const {data: res} = await this.$http.get('/rights/tree')
        this.rightsList = res.data;
        role.permissions.forEach(item => {
          this.getLeafKeys(item, this.defKeys);
        })
        this.roleId = role.role.id;
        this.setRightDialogVisible = true;
      },
      //通过递归，获得角色下所有的三级权限的id
      getLeafKeys(node, arr) {
        if (Array.prototype.isPrototypeOf(node.children) && node.children.length === 0) {
          return arr.push(node.id);
        }

        node.children.forEach(item => {
          this.getLeafKeys(item, arr)
        })
      },
      //关闭分配权限对话框时，清空数据
      setRightDialogClosed() {
        this.defKeys = []
      },
      //点击确定，分配权限
      async allotRights() {
        const keys = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        const idStr = keys.join(',')
        console.log(this.roleId)
        console.log(idStr)
        const {data: res} = await this.$http.post(`/rights/roles/${this.roleId}/rights`, {
          ids: idStr
        })
        if (res.code !== 200) {
          return this.$message.error("失败")
        }
        this.setRightDialogVisible = false
        this.getRoleList();
        this.$message.success("分配成功")
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
  .el-tag {
    margin: 7px;
  }
  .bdtop {
    border-top: 1px solid #eee;
  }
  .bdbottom {
    border-bottom: 1px solid #eee;
  }
  .vcenter {
    display: flex;
    align-items: center;
  }

</style>