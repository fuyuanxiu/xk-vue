<template>
 <!--  搜索框 -->
 <div class="setSpecKeyword">
  <div class="headerTop">    
     <el-row>
        <el-col :span="6" style="width:285px">
          <el-button-group style="margin-left:10px;margin-bottom: 10px;">
              <el-button v-if="permit.ADD" type="primary" icon="el-icon-plus" @click="newCategory()">新增类别</el-button> 
              <el-button v-if="permit.EDIT" type="primary" icon="el-icon-edit" @click="showEditDialog()">编辑类别</el-button>             
              <el-button v-if="permit.DELETE" type="primary" icon="el-icon-delete" @click="doDelete()">删除</el-button>
            </el-button-group>
        </el-col> 
         <el-col :span="15" style="margin-left:10px">
             <el-form :inline="true" :model="queryParams" class="demo-form-inline">           
              <el-form-item>
                 <el-button v-if="permit.ADD" type="primary" icon="el-icon-plus" @click="addShowDialog()">新增子项目</el-button>
              </el-form-item>

            </el-form>
        </el-col>     
      </el-row>
    </div>
<!--     内容区容器    -->   
<el-container style="height: 500px;">
<!--   侧边栏 -->
     <el-aside class="tree">
      <h3>分类列表 </h3>  
 
      <el-table 
        class="mateTable"
        ref="mateTable"
        highlight-current-row      
        :data="matchTable" 
        @current-change="handleSelectionChange"        
        >  
      <el-table-column
        type="index"      
        width="50">
        </el-table-column>
        <el-table-column  width="230" prop="prName" label="项目类别">
        </el-table-column>
      </el-table>
   
     </el-aside>
<!--   表格内容区 -->
      <el-main>
      <el-table :data="keywordTable">     
        <el-table-column prop="childName" label="子项目名称"  show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="180">
            <template slot-scope="scope">
              <el-button v-if="permit.EDIT" type="primary" icon="el-icon-edit" size="mini" circle @click="showEditKeyword(scope.row)"></el-button>
              <messagebox v-if="permit.DELETE" 
                @callConfirm="delKeywordlist(scope.row)"
                title="提示"
                contents="此操作将永久删除该行, 是否继续?"
                confirmTitle="确认删除"
                ></messagebox>
            </template>
        </el-table-column>
      </el-table>
    </el-main>
</el-container>
<!--  新增物料 -->
        <el-dialog
          title="新增类别"
          :visible.sync="keywordsDialogVisible"
          width="35%"
        >
          <el-form
            :inline="true"
            :model="matchForm"
            ref="ruleForm1"                       
          >
          <el-form-item
            label="id"         
            prop="id"
            style="display: none"  
            >
            <el-input
                v-model="matchForm.id"                           
              ></el-input>
            </el-form-item>  
            <el-form-item
              label="项目类别"         
              prop="prName"
            >
              <el-input
                style="width:300px;"
                v-model="matchForm.prName"              
              ></el-input>
            </el-form-item>      
                
          </el-form>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="keywordsDialogVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="matchFormOk"
            >确 定</el-button>
          </div>
        </el-dialog> 
 <!--  新增匹配关键字 -->
        <el-dialog
          title="新增子项目"
          :visible.sync="dialog.keywordVisible"
          width="500px"
        >
          <el-form
            :model="keywordForm"
             ref="dialog.keyruleForm"
            :rules="dialog.keyruleForm"
            :inline="true" 
            class="keywordForm" 
            label-width="120px"
            label-position="right"         
          >
           <el-form-item label="类别ID:" style="" prop="parentId"  label-position="right" >
                <el-input v-model="keywordForm.parentId" style="width:250px;" :disabled="true"></el-input>
            </el-form-item>             
             <el-form-item label="子项目名称:" prop="childName">
                <el-input v-model="keywordForm.childName" style="width:250px;"></el-input>
            </el-form-item>                 
          </el-form>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="dialog.keywordVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="addKeywordsBtn"
            >确 定</el-button>
          </div>
        </el-dialog> 
     <div class="block">
      <el-pagination
        class="pull-right clearfix"
        @current-change="changePage"
        @size-change="SizeChange"
        :current="1"
        :current-page.sync="queryParams.page"
        :page-sizes="pageSizesList"
        :page-size="queryParams.rows"
        layout="total, sizes, prev, pager, next, jumper"
        :page-size-opts="pageSizesList"
        :total="totalCount"
      >
      </el-pagination>
    </div>
</div>
</template>
<script>
import { getProjectlist,addCategoryKey,edit,delKeyword } 
from '@/api/projectManage'
import {getlist,add,editChild} from '@/api/childProject'
import {getPermByRouterCode} from '@/api/perm'
import messagebox from "@/components/Dialog/MessageBox.vue";
export default {
  name: "projectManage",
  components: {
    messagebox
  },
  data() {
    return {
      selection: [],
      matchTable:[{}],     
      keywordsDialogVisible:false,     
      queryParams:{              
        page: 1,
        rows: 15,    
      },
      item:[],
      pageSizesList: [10, 15, 20, 30, 40, 50, 100],
      totalCount: 0, //数据的总条数,
      loading:false,
      open: true,
      current:0,
      keywordTable:[],
      matchForm:{},
      keywordForm:{
        id:'',
        parentId:'',
        prName:''
      },
      dialog: {        
        keywordVisible: false,
        keyruleForm: {        
          parentId: [
            { required: true, message: "类别ID必填", trigger: "blur" }
          ],
          childName: [
            { required: false, message: "子项目名称", trigger: "blur" }
          ]    
        }
      }, 
       // el-tag类型转换
      statusFilter(status) {
        const statusMap = {
          1: "success",
          0: "danger",        
        };
        return statusMap[status];
      },
       // 是否匹配显示格式转换
      formatStatus(status) {
        const statusMap = {
          1: "是",
          0: "否",         
        };
        return statusMap[status];
      },
      permit:{
        //权限控制
        SEARCH:false,
        ADD:false,
        EDIT:false,
        DELETE:false,
        CHECK:false,
        UNCHECK:false
      },
             
    }   
  },
  created(){
    this.getCategoryData();
    this.getPermit(); 
  },
  methods:{ 
    getPermit(){
      var routerCode = this.$route.name;
      console.log(routerCode)
      getPermByRouterCode(routerCode).then(response => {
        if(response.result){
          if(response.data == "admin"){
            this.permit.SEARCH = true;
            this.permit.ADD = true;
            this.permit.EDIT = true;
            this.permit.DELETE = true;
            this.permit.CHECK= true;
            this.permit.UNCHECK=true;
          }else{
            var list = response.data;
            for(var i = 0; i < list.length; i++){
              if(list[i].permCode == "SEARCH") this.permit.SEARCH = true;
              if(list[i].permCode == "ADD") this.permit.ADD = true;
              if(list[i].permCode == "EDIT") this.permit.EDIT = true;
              if(list[i].permCode == "DELETE") this.permit.DELETE = true;
              if(list[i].permCode == "CHECK") this.permit.CHECK = true;
              if(list[i].permCode == "UNCHECK") this.permit.UNCHECK=true;
            }
          }
        }else{
          this.$message.error(res.msg);
        }
      });
    },
    //重置按钮
     resetFrom(){   
        this.queryParams.keyword = ''      
    },
    //获取当前选行的数据
     handleSelectionChange(val) {       
        this.keywordForm=Object.assign({});
        this.selection = val!=null ? val : Object.assign({});
        this.keywordForm.parentId=this.selection.id;
        this.keywordForm.prName=this.selection.prName;
        this.getKeywordList();     
    },
    //显示编辑物料类别窗口
    showEditDialog(){       
        if(this.selection==null||this.selection.length==0){
            this.$message.error('请选择要操作的项目类别!');
            return
        }       
        this.keywordsDialogVisible=true;
       let r=this.selection;
        this.matchForm={prName:r.prName,id:r.id}
    },
    //显示新增物料类别窗口
    newCategory(){
     this.keywordsDialogVisible=true;
     this.matchForm.prName='';
     this.matchForm.id=''
    },
    //获取类别列表
    getCategoryData(){         
        getProjectlist().then(response => {
            if (!response.data) { 
           this.$message.error('获取类别列表失败!');
          }            
        this.matchTable = response.data
        })   
    },
    //获取匹配关键字列表
    getKeywordList(){ 
    let filter=Object.assign({},{parentId:this.selection.id, rows:this.queryParams.rows,page:this.queryParams.page})      
        getlist(filter).then(response => {
            if (!response.data) { 
            this.$message.error('获取匹配关键字列表失败!');
          }            
        this.keywordTable = response.data.rows;
        this.totalCount =response.data.total;
        })
    },
    //显示匹配关键字窗口
    showEditKeyword(row){        
        if(this.selection==null||this.selection.length==0){
            this.$message.error('请选择要操作的分类!');
            return
        }
        this.dialog.keywordVisible=true;
        this.keywordForm=Object.assign({},row);
    },
    //显示新增匹配关键字窗口
    addShowDialog(){
        if(this.selection==null||this.selection.length==0){
            this.$message.error('请选择要操作的项目类别!');
            return
        }
        this.dialog.keywordVisible=true;
        const newRow = {
          id:'',
          parentId:this.keywordForm.parentId,
          childName:this.keywordForm.childName
        }
        this.keywordForm = Object.assign(newRow);   
        // this.keywordForm.id='';
        // this.keywordForm.bsName='';
        // this.keywordForm.bsOrderNumber='';
        // this.keywordForm.bsRemark='';
        // this.keywordForm.bsValue=1;
    },
    //新增&编辑分类
    matchFormOk(){          
        let filter=Object.assign({},this.matchForm)
        if(typeof(this.matchForm.id)!=undefined && typeof(this.matchForm.id)=="number") {             
                this.$refs['ruleForm1'].validate((valid) => {
                    if (valid) {
                       /* this.dialog.loading = true;*/
                        edit(filter).then(response => {                                            
                        if(response.result) {                                
                                this.keywordsDialogVisible= false
                                 this.$message({
                                   message:response.msg,
                                   type:'success'
                                 })
                                this.getCategoryData();
                            }else {
                                this.$message.error(response.msg);
                            }
                        })
                     }
                });
            }else {
                 this.$refs['ruleForm1'].validate((valid) => {
                    this.dialog.loading = true;
                    if (valid) {
                        addCategoryKey(filter).then(response => {                     
                            if(response.result) {                       
                                this.keywordsDialogVisible=false;
                                this.$message({
                                  message:response.msg,
                                  type:'success'
                                })
                                this.getCategoryData();
                            }else {
                                this.$message.error(response.msg);
                            }
                        })
                    }
                });
            }

    },
    //删除分类
    doDelete(){        
        if(this.selection==null&this.selection.length==0){
            this.$message.error("请选择要操作的行！")
            return
        }    
        let id=this.selection.id
        delKeyword(id).then(response=>{
            if(response.result){
                this.$message({
                    message:response.msg,
                    type:'success'
                })
                this.getCategoryData();
            }else{
                this.$message.error(response.msg)
            }
        })
    },

    //新增&编辑匹配关键字
    addKeywordsBtn(){       
    let filter=Object.assign({},this.keywordForm)
    if(typeof(this.keywordForm.id)!=undefined && typeof(this.keywordForm.id)=="number") {             
            this.$refs['dialog.keyruleForm'].validate((valid) => {
                if (valid) {
                   /* this.dialog.loading = true;*/
                    editChild(filter).then(response => {                                   
                    if(response.result) {                                
                            this.dialog.keywordVisible= false
                                 this.$message({
                                  message:response.msg,
                                  type:'success'
                                })                           
                            this.getKeywordList();
                        }else {
                            this.$message.error(response.msg);
                        }
                    })
                 }
            });
        }else {
             this.$refs['dialog.keyruleForm'].validate((valid) => {               
                if (valid) {
                    add(filter).then(response => {                     
                        if(response.result) {                       
                            this.dialog.keywordVisible=false;
                                this.$message({
                                  message:response.msg,
                                  type:'success'
                                })                           
                            this.getKeywordList();
                        }else {
                            this.$message.error(response.msg);
                        }
                    })
                }
            });
        }

    },
    //删除关键字列表
    delKeywordlist(row){
        let id=row.id
        del(id).then(response=>{
            if(response.result){
                this.$message({
                    message:response.msg,
                    type:'success'
                })
                this.getKeywordList();
            }else{
                this.$message.error(response.msg)
            }
        })
    },
    select(selection,row){
    if(selection.length>1){
        selection.shift()
        }
    },
    clickRow(row,column){   
      this.$refs.mateTable.toggleRowSelection(row)      
    },
    changePage(page){
      this.queryParams.page=page;
      this.getKeywordList();
    },
    SizeChange(size){
      this.queryParams.rows=size;   
      this.getKeywordList();
    }, 
     check(id) {
      this.$confirm('是否确认审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
        
      }).then(() => {
        this.getKeywordList(id)
        updateCheck(id)
        this.getKeywordList(id)
        console.log(id)
        this.$message({
          type: 'success',
          message: '审核成功!'
        })
       
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消审核'
        })
      })
    },
    uncheck(id) {
   this.$confirm('是否确认反审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.getKeywordList(id)
        reverseCheck(id)
        this.getKeywordList(id)
        this.$message({
          type: 'success',
          message: '反审核成功!'
        })
         
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消反审核'
        })
      })
    }
  }
};
</script>
<style>
.setSpecKeyword .el-dialog__footer{
  width:640px;
}
.headerTop{
    margin-top:10px;
}
.block{
    text-align: right;
    margin-top:10px;
}
.tree{
    width: 280px!important;
    margin: 0 15px 0 0;
 /*   padding: 0 15px 15px 0;*/
    background-color: #f7ffff; 
}
.tree h3{
    margin: 0;
    padding: 0 0 0 30px;
    background: url(../../assets/img/tree-title-icon.gif) no-repeat 15px center scroll;
    background-color: #d8f0f0;
    font: 12px/34px "Microsoft YaHei", Arial, Tahoma, sans-serif;
    color: #001f3a;
    height: 34px;
    font-weight: bold;
    width: 280px;
}
.tree .el-tree{
  padding-left:10px;
  background: none;  
}
ul,li,p,div{
  margin:0;
  padding:0;
}

.toList{
  list-style: none;
  width:100%;
  margin:0;
  padding:0;

}
.toList li{
    height: 32px;
    line-height: 32px;
    background: #fff;
    position: relative;
    margin-bottom: 5px;
    margin-top:0px;
    padding: 0 10px;
    border-radius: 3px;
    border-left: 2px solid #629A9C;
    box-shadow: 0 1px 2px rgba(0,0,0,0.07);
}
.toList li a{
    position: absolute;
    top: 4px;
    right: 5px;    
    cursor: pointer;
    color:red;
    font-size: 20px;
    font-weight: 80px;

}

.el-main{
  padding:0!important;
  border:1px solid #ddd;
 }

.mateTable .el-table__body tr.current-row>td{
  background-color: #fdf3ea!important;
  color: #f19944!important;
}
.switch-btn .el-switch__core{width:55px;}
</style>