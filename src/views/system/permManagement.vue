<template>
    <div>
        <el-card>
            <el-row>
                <el-col :span="10">
                    <el-form :inline="true" :model="formQuery" class="demo-form-inline">
                      <el-form-item>
                        <el-input v-model="formQuery.keyword" placeholder="关键字"></el-input>
                      </el-form-item>
                      <el-form-item>
                         <el-button type="primary" size="mini" @click="handleSubmit('formQuery')">查找</el-button>
                      </el-form-item>
                  </el-form>
                </el-col>
                <el-col :span="8">
                     <el-button-group size="small">
                     <el-button type="primary" icon="el-icon-plus" @click="showAddDialog()">新增</el-button>
                     <el-button type="primary" icon="el-icon-edit" @click="showEditDialog()">编辑</el-button>
                     <el-button type="primary" icon="el-icon-delete" @click="doDelete()">删除</el-button>
                     </el-button-group>
                </el-col>
            </el-row>           
        </el-card>
        <template>
              <el-table
                ref="multipleTable"
                border
                :data="permTable"
                tooltip-effect="dark"
                style="width: 100%"
                 @select="select"
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="45">
                </el-table-column>
                 <el-table-column
                  prop="bsCode"
                  label="操作权限编号"
                   show-overflow-tooltip
                 >
                </el-table-column>

                <el-table-column
                  prop="bsName"
                  label="操作权限名称"
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
                  prop="bsRemark"
                  label="备注"
                  show-overflow-tooltip>
                </el-table-column>
              </el-table>             
        </template>
          <div class="block">
            <el-pagination class="pull-right clearfix" @current-change="changePage" @size-change="SizeChange" :current="1" :current-page.sync="queryParams.page" :page-sizes="pageSizesList" :page-size="queryParams.rows" layout="total, sizes, prev, pager, next, jumper" :page-size-opts="pageSizesList" :total="totalCount">

            </el-pagination>
        </div>
        <el-dialog ref="dialog.addRole" :visible.sync="dialog.modal_dialog" title="操作权限管理" width="500px" :modal="true" :close-on-click-modal="false" :close-on-press-escape="true" append-to-body>
           
                <el-form :model="dialog.formItem" ref="adduserForm" :rules="dialog.ruleForm" :label-width="'100px'" >
    
                <el-row>
                   <el-col :span="20">
                        <el-form-item label="id" prop="id" style="display: none" >
                            <el-input v-model="dialog.formItem.id" size="small" placeholder="请输入" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="20">
                        <el-form-item label="操作权限编码" prop="bsCode" >
                            <el-input v-model="dialog.formItem.bsCode" size="small" placeholder="请输入" :disabled="dialog.formItem.id>0"></el-input>
                        </el-form-item>
                    </el-col>
                    
                    <el-col :span="20">
                        <el-form-item label="操作权限名称" prop="bsName">
                            <el-input v-model="dialog.formItem.bsName" size="small" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
              </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="备注" prop="bsRemark">
                            <el-input v-model="dialog.formItem.bsRemark" size="small" type="textarea" placeholder="请输入..."></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                </el-form>
                <div slot="footer">
                    <el-button type="primary" size="small" :loading="false" @click="cancel">取 消</el-button>
                    <el-button type="primary" size="small" :loading="dialog.loading" @click="ok">确 定</el-button>
                </div>
        </el-dialog>
    </div>
</template>
<script>

import { addPerm,editPerm,deletePerm,getPermList} from '@/api/perm'
  export default {
    name:'permManagement',
    data() {
      return {   
        dialogVisible: false, 
        formQuery: {
          keyword:''
        },
        currentRow:[],
        permTable:[{

        }], 
        checkekList:[], 
        dialog: {
          loading: false,
          modal_dialog: false,
          formItem: {
              
          },
          ruleForm: {
              bsCode: [
                  { required: true, message: '请填写编号', trigger: 'blur' }
              ],
              bsName: [
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
        getPermList(this.formQuery.keyword,this.queryParams.rows,this.queryParams.page).then(response => {
          if (!response.data) { 
            reject('error')
          }
          this.permTable = response.data.rows;
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
        let r =this.currentRow;      
        this.dialog.formItem = {bsCode:r.bsCode, bsName:r.bsName, id:r.id, bsRemark:r.bsRemark};
    },
/*删除角色*/
    doDelete(){    
        if(!this.currentRow){
                this.$message.error("请选择要操作的行!");
                return
            }
        let r = this.currentRow;
        let id=r.id;      
            deletePerm(id).then(response => {                                           
                           
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
                        editPerm(this.dialog.formItem).then(response => {                                                   
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
                       addPerm(this.dialog.formItem).then(response => {                          
                        
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
    }
  }
</script>
<style type="text/css">
.block {
    text-align: right;
    margin-top: 10px;
}
</style>