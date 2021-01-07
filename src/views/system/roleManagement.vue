<template>
    <div>
        <el-card>
            <el-row>
                <el-col :span="14">
                    <el-form :inline="true" :model="formQuery" class="demo-form-inline">
                      <el-form-item label="角色编号">
                        <el-input v-model="formQuery.roleCode" placeholder="角色编号"></el-input>
                      </el-form-item>
                      <el-form-item label="角色名称">
                        <el-input v-model="formQuery.roleName" placeholder="角色名称"></el-input>
                      </el-form-item>
                      <el-form-item>
                         <el-button type="primary" size="mini" @click="handleSubmit('formQuery')">查找</el-button>
                      </el-form-item>

                  </el-form>
                </el-col>
                <el-col :span="10">
                     <el-button-group size="small">
                     <el-button type="primary" icon="el-icon-plus" @click="showAddDialog()">新增</el-button>
                     <el-button type="primary" icon="el-icon-delete" @click="doDelete()">删除</el-button>
                     <el-button type="primary" icon="el-icon-edit" @click="showEditDialog()">编辑</el-button>
                     </el-button-group>
                     <el-button-group size="small">
                     <el-button type="primary" icon="el-icon-view" @click="showRouterDialog">页面权限</el-button>
                     <el-button type="primary" icon="el-icon-view" @click="setPermPage()">操作权限</el-button>
                     </el-button-group>
                </el-col>
              
            </el-row>           
        </el-card>
        <template>
              <el-table
                ref="multipleTable"
                border
                :data="roleTable"
                tooltip-effect="dark"
                style="width: 100%"
                 @select="select"
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="45">
                </el-table-column>
                 <el-table-column
                  prop="roleCode"
                  label="角色编号"
                   show-overflow-tooltip
                 >
                </el-table-column>

                <el-table-column
                  prop="roleName"
                  label="角色名称"
                   show-overflow-tooltip
                  >
                </el-table-column>                           
             
                 <el-table-column
                  prop="createdTime"
                  label="创建时间"
                  align="center"
                  show-overflow-tooltip>
                    <template scope="scope">
                    <span>{{(scope.row.createdTime != undefined&& scope.row.createdTime!== null) ?  scope.row.createdTime.substring(0,10) : ''}}</span>
                 </template>
                </el-table-column>
                <el-table-column
                  prop="modifiedTime"
                  align="center"
                  label="更新时间"
                  show-overflow-tooltip>
                   <template scope="scope">
                    <span>{{(scope.row.modifiedTime != undefined && scope.row.modifiedTime!== null) ?  scope.row.modifiedTime.substring(0,10) : ''}}
                    </span>
                 </template>
                </el-table-column>
                 <el-table-column
                  prop="roleComment"
                  label="备注"
                  show-overflow-tooltip>
                </el-table-column>

              </el-table>             
        </template>
          <div class="block">
            <el-pagination class="pull-right clearfix" @current-change="changePage" @size-change="SizeChange" :current="1" :current-page.sync="queryParams.page" :page-sizes="pageSizesList" :page-size="queryParams.rows" layout="total, sizes, prev, pager, next, jumper" :page-size-opts="pageSizesList" :total="totalCount">

            </el-pagination>
        </div>
        <el-dialog ref="dialog.addRole" :visible.sync="dialog.modal_dialog" title="角色管理" width="500px" :modal="true" :close-on-click-modal="false" :close-on-press-escape="true" append-to-body>
           
                <el-form :model="dialog.formItem" ref="adduserForm" :rules="dialog.ruleForm" :label-width="'100px'" >
    
                <el-row>
                   <el-col :span="20">
                        <el-form-item label="id" prop="id" style="display: none" >
                            <el-input v-model="dialog.formItem.id" size="small" placeholder="请输入" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="20">
                        <el-form-item label="角色编码" prop="roleCode" >
                            <el-input v-model="dialog.formItem.roleCode" size="small" placeholder="请输入" :disabled="dialog.formItem.id>0"></el-input>
                        </el-form-item>
                    </el-col>
                    
                    <el-col :span="20">
                        <el-form-item label="角色名称" prop="roleName">
                            <el-input v-model="dialog.formItem.roleName" size="small" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
              </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="备注" prop="roleComment">
                            <el-input v-model="dialog.formItem.roleComment" size="small" type="textarea" placeholder="请输入..."></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                </el-form>
                <div slot="footer">
                    <el-button type="primary" size="small" :loading="false" @click="cancel">取 消</el-button>
                    <el-button type="primary" size="small" :loading="dialog.loading" @click="ok">确 定</el-button>
                </div>
            
        </el-dialog>

        <el-dialog ref="routerDialog" :visible.sync="routerDialog" title="分配权限" width="500px" :modal="true" :close-on-click-modal="false" :close-on-press-escape="true" append-to-body>
           <el-tree 
                ref="tree" 
                node-key="id"  show-checkbox
                :data="treeList" :props="options"      
                highlight-current
                default-expand-all  
                :default-checked-keys="checkekList"          
                >        
                </el-tree> 
                <div slot="footer">
                    <el-button type="primary" size="small" :loading="false" @click="routerDialog = false">取 消</el-button>
                    <el-button type="primary" size="small" :loading="dialog.loading" @click="addRouter">确 定</el-button>
                </div>
            
        </el-dialog>

    </div>
 
</template>
<script>

import {getRoleList,getCheckedRoles,saveUserRoles,addRole,delRoleInfo,editRole,addRouter,getRouter} from '@/api/role'
import { getTree } from '@/api/resource'
  export default {
    name:'roleManagement',
    data() {
      return {   
        dialogVisible: false, 
        rolesDate:[],
        checkedRolesDate:[],
        value4: [],  
        formQuery: {
                roleCode: '',
                roleName: ''
            },
        currentRow:[],
        roleTable:[{

        }], 
           checkekList:[], 
        dialog: {
                loading: false,
                modal_dialog: false,
                formItem: {
                    
                },
                ruleForm: {
                    roleCode: [
                        { required: true, message: '请填写角色编号', trigger: 'blur' }
                    ],
                    roleName: [
                        { required: true, message: '请填写名称', trigger: 'blur' }
                    ],
                  
                }
        },
        queryParams: {
                page: 1,
                rows: 15,
                pkParent: -1
            },
            pageSizesList: [10, 15, 20, 30, 40, 50, 100],
            totalCount: 0, //数据的总条数,
            treeList:[],
            options: {
        label: "routerName",
        children: "children",
        id:"id",
        isLeaf: true
      }, 
      routerDialog:false,
      }
    },
    created(){
        this.getData();
    },
    methods: {
    handleSubmit(name){
        this.getData();
    },
    getData(){        
        getRoleList(this.formQuery.roleCode,this.formQuery.roleName,this.queryParams.rows,this.queryParams.page).then(response => {              
             if (!response.data) { 
                reject('error')
          }
          this.roleTable = response.data.rows;
          this.totalCount =response.data.total;
        })
    },
    showAddDialog(){
        this.dialog.modal_dialog = true;
        this.dialog.formItem = {id: ''};
    },
/*编辑*/
    showEditDialog() {  
       
       if(!this.currentRow){               
            this.$message.error('请选择要操作的行!');
            return
        } 
        this.dialog.modal_dialog = true;
        let r =this.currentRow ;      
        this.dialog.formItem = {roleCode:r.roleCode, roleName:r.roleName, id:r.id, roleComment:r.roleComment};
    },
/*删除角色*/
    doDelete(){    
        if(!this.currentRow){
                this.$message.error("请选择要操作的行!");
                return
            }
        let r = this.currentRow;
        let id=r.id;      
            delRoleInfo(id).then(response => {                                           
                           
                if(response.result) { 
                    this.$message({
                      message: response.msg,
                      type: 'success'
                    });                             
                    this.getData();
                }else {
                    this.$message.error(response.msg);
                    }
                })  
    
    },

    handleSelectionChange(val){  
        this.currentRow = val[val.length-1];
    },
    select(selection,row){
    if(selection.length>1){
        selection.shift()
    }
    
},
/*新增*/
    ok() {     
   
       if(typeof(this.dialog.formItem.id)!=undefined && typeof(this.dialog.formItem.id)=="number") {             
                this.$refs['adduserForm'].validate((valid) => {
                    if (valid) {                   
                        editRole(this.dialog.formItem).then(response => {                                                   
                            this.dialog.loading = false;
                            if(response.result) {
                                this.dialog.loading = false;
                                this.dialog.modal_dialog= false
                                this.getData();
                            }else {
                                this.$message.error(res.msg);
                            }
                        })
                     }
                });
            }else {
                 this.$refs['adduserForm'].validate((valid) => {                 
                    if (valid) {
                       addRole(this.dialog.formItem).then(response => {                          
                        
                            if(response.result) {                                
                                this.dialog.loading = false;
                                this.dialog.modal_dialog=false;
                                this.getData();
                            }else {
                                this.$message.error(res.msg);
                            }
                        })
                    }
                });
            }
        },   
        saveRoles(){
            var userId = this.currentRow[0].id;
            saveUserRoles(userId,this.value4.toString()).then(response => { 
                this.$message.info(response.msg);
            })
        },
      
        handleChange(value, direction, movedKeys) {
                console.log(value, direction, movedKeys);
            },
        cancel() {
            this.dialog.modal_dialog = false;
        },
        changePage(page) {
            this.queryParams.page = page;

            this.getData();
        },
        SizeChange(size) {
            this.queryParams.rows = size;
            this.getData();
        },
        showRouterDialog(){
            console.log(this.currentRow)
            if(this.currentRow.length == 0){               
                this.$message.error('请选择要操作的行!');
                return
            } 
            getRouter(this.currentRow.roleCode).then(response=>{
            if(response.result){
                this.checkekList = response.data
                this.getTree();
                this.routerDialog = true
            }else{
                this.$message.error(response.msg);
            }
        }) 
            
        },
    //获取分类目录
    getTree(){     
         getTree().then(response=>{       
          if(response.result){ 
            let root={routerName:"目录",id:1,children:[]};
            root.children= response.data;            
            this.treeList = [root];
            if(this.treeList.length > 0){
              this.showRouter(); 
            }
          }        
       })      
    },
    // addRouter(){
    //     console.log(this.$refs.tree.getCheckedKeys());
    //     const param={
    //           roleCode:this.currentRow.roleCode,
    //           roles:this.$refs.tree.getCheckedKeys().join(';')
    //     };
    //     let filter = Object.assign(param);

    //     addRouter(filter).then(response=>{
    //         if(response.result){
    //             this.$message({
    //                   message: '操作成功',
    //                   type: 'success'
    //                 });
    //                 this.routerDialog = false;
    //         }else{
    //             this.$message.error(response.msg);
    //         }
    //     }) 
    // },
    //20191008-sxw-修复添加权限功能，将所选节点和父节点传入后台（除了ID为1的节点）
    addRouter() {
      //获取选中目录ID
      var arr  = this.$refs.tree.getCheckedKeys();
      this.array = [];
      //将半选中状态的父节点加入目录ID数组
      for(var i = 0; i < arr.length; i++){
        this.fun(arr[i], this.treeList, this.array);
      }
      //console.log(this.array);
      //添加权限
      if(this.array.length > 0){
        const param={
          roleCode:this.currentRow.roleCode,
          roles:this.array.join(';')
        };
        let filter = Object.assign(param);
        addRouter(filter).then(response=>{
            if(response.result){
                this.$message({
                      message: '操作成功',
                      type: 'success'
                    });
                    this.routerDialog = false;
            }else{
                this.$message.error(response.msg);
            }
        })
      }
    },
    //数组去重
    noRepeat(arr, value) {
      for(var i = 0; i < arr.length; i++){
        if(arr[i] == value){
          return false;
        }
      }
      return true;
    },
    //通过查询父节点下是否有子节点 将半选状态的父节点加入数组中（除了ID为1的节点）
    fun(value, data, arr) {
      for(var i = 0; i < data.length; i++){
        var mod = data[i];
        if(mod.id == value) {
          if(this.noRepeat(arr, mod.id) && mod.id != 1) {
            this.array.push(mod.id);
          }
          return true;
        }else {
          if(mod.children) {
            var bool = this.fun(value, mod.children, arr);
            if(bool) {
              if(this.noRepeat(arr, mod.id) && mod.id != 1){
                this.array.push(mod.id);
              }
              return true;
            }
          }
        }
      }
      return false;
    },
    //剔除只有部分选择子节点的父节点
    removeParent(value, data) {
      for(var i = 0; i < data.length; i++){
        var mod = data[i];
        if(mod.id == value){
          if(mod.children.length == 0){
            this.array.push(mod.id);
            return true;
          }
          return true;
        }else{
          if(mod.children.length != 0){
            this.removeParent(value, mod.children);
          }
        }
      }
      return true;
    },
    //回显时,将只有部分选择子节点的父节点剔除
    showRouter() {
      var arr = this.checkekList;
      this.array = [];
      for(var i = 0; i < arr.length; i++){
        this.removeParent(arr[i], this.treeList);
      }
      this.checkekList = this.array;
    },
    setPermPage() {
      if(this.currentRow.length == 0){
        this.$message.error('请选择要操作的行!');
        return
      }
      this.$router.push({path: "permRoleResource",query:{ id: this.currentRow.id }}); 
    },
    }
  }
</script>
<style type="text/css">
.block {
    text-align: right;
    margin-top: 10px;
}
</style>