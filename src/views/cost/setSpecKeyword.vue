<template>
 <!--  搜索框 -->
 <div class="setSpecKeyword">
  <div class="headerTop">    
     <el-row>
        <el-col :span="6" style="width:285px">
          <el-button-group style="margin-left:10px;margin-bottom: 10px;">
              <el-button v-if="permit.ADD" type="primary" icon="el-icon-plus" @click="newCategory()">新增分类</el-button> 
              <el-button v-if="permit.EDIT" type="primary" icon="el-icon-edit" @click="showEditDialog()">编辑分类</el-button>             
              <el-button v-if="permit.DELETE" type="primary" icon="el-icon-delete" @click="doDelete()">删除</el-button>
            </el-button-group>
        </el-col> 
        <el-col :span="15" style="margin-left:20px">
             <el-form :inline="true" :model="queryParams" class="demo-form-inline">
              <el-form-item label="关键字">
                <el-input v-model="queryParams.keyword" placeholder="关键字" class="search-input"></el-input>
              </el-form-item>            
              <el-form-item>
                 <el-button v-if="permit.SEARCH"  type="primary" size="mini" @click="handleSubmit('formQuery')">{{$t('Button.Inquire')}}</el-button>
                 <el-button v-if="permit.ADD" type="primary" icon="el-icon-plus" @click="addShowDialog()">新增关键字</el-button>
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
        <el-table-column  width="230" prop="bsName" label="关键字名称">
        </el-table-column>
      </el-table>
   
     </el-aside>
<!--   表格内容区 -->
      <el-main>
      <el-table :data="keywordTable"> 
        <el-table-column prop="bsCateName" label="分类名称" show-overflow-tooltip width="200">
        </el-table-column>      
        <el-table-column prop="bsName" label="关键字名称"  show-overflow-tooltip>
        </el-table-column>
         <el-table-column prop="bsOrderNumber" label="搜索顺序" align="center">
        </el-table-column>
        <el-table-column prop="bsValue" label="是否100%匹配" align="center">
          <template scope="scope">
             <el-tag :type="statusFilter(scope.row.bsValue)">{{formatStatus(scope.row.bsValue)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="bsRemark" label="备注">
        </el-table-column>      
        <el-table-column prop="address" label="操作" width="180">
            <template slot-scope="scope">
              <el-button v-if="permit.EDIT" :disabled="scope.row.isChecked" type="primary" icon="el-icon-edit" size="mini" circle @click="showEditKeyword(scope.row)"></el-button>
              <messagebox v-if="permit.DELETE" :disabled="scope.row.isChecked"
                @callConfirm="delKeywordlist(scope.row)"
                title="提示"
                contents="此操作将永久删除该行, 是否继续?"
                confirmTitle="确认删除"
                ></messagebox>
                <el-button v-if="permit.CHECK" :disabled="scope.row.isChecked" type="primary" icon="el-icon-success" size="mini" circle title="审核" @click="check(scope.row.id)"></el-button>
                <el-button v-if="permit.UNCHECK" :disabled="!scope.row.isChecked" type="success" icon="el-icon-error" size="mini" circle title="反审核"  @click="uncheck(scope.row.id)"></el-button>
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
              label="物料类别"         
              prop="bsName"
            >
              <el-input
                style="width:300px;"
                v-model="matchForm.bsName"              
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
          title="关键字设置"
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
           <el-form-item label="类别ID:" style="" prop="bsCateId"  label-position="right" >
                <el-input v-model="keywordForm.bsCateId" style="width:250px;" :disabled="true"></el-input>
            </el-form-item>             
            <el-form-item label="类别名称:"  >
                 <el-input v-model="keywordForm.bsCateName" style="width:250px;" :disabled="true"></el-input>                    
            </el-form-item>
             <el-form-item label="关键字名称:" prop="bsName">
                <el-input v-model="keywordForm.bsName" style="width:250px;"></el-input>
            </el-form-item>
            <el-form-item label="搜索顺序:" prop="bsOrderNumber">
                <el-input type="number" v-model="keywordForm.bsOrderNumber" style="width:250px;">        
                </el-input>
            </el-form-item>             
             <el-form-item label="填写备注:" prop="bsRemark">
                <el-input v-model="keywordForm.bsRemark" style="width:250px;">
                </el-input>
            </el-form-item> 
            <el-form-item label="是否100%匹配:" prop="bsValue">
                <el-switch class="switch-btn"
                    v-model="keywordForm.bsValue"
                    :active-value="1"
                    :inactive-value="0"
                    active-text="是"
                    inactive-text="否"
                    active-color="#13ce66"
                    inactive-color="#ccc">
                  </el-switch>
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
import { getkeylist,addKeywords,editKeyword,delKeyword,add,del,getlist,edit,updateCheck,reverseCheck} 
from '@/api/keywords'
import {getPermByRouterCode} from '@/api/perm'
import messagebox from "@/components/Dialog/MessageBox.vue";
export default {
  name: "setSpecKeyword",
  components: {
    messagebox
  },
  data() {
    return {
      selection: [],
      matchTable:[{}],     
      keywordsDialogVisible:false,     
      queryParams:{        
        keyword:'',       
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
        bsCateId:'',
        bsCateName:'',
        bsName:'',
        bsOrderNumber:'',
        bsRemark:'',
        bsValue:1
      },
      dialog: {        
        keywordVisible: false,
        keyruleForm: {        
          bsCateId: [
            { required: true, message: "类别ID必填", trigger: "blur" }
          ],
          bsCateName: [
            { required: true, message: "类别名称", trigger: "blur" }
          ],
           bsValue: [
            { required: true, message: "匹配值", trigger: "blur" }
          ],    
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
    handleSubmit(name){
        this.getKeywordList();
    },    
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
        this.keywordForm.bsCateId=this.selection.id;
        this.keywordForm.bsCateName=this.selection.bsName;
        this.getKeywordList();     
    },
    //显示编辑物料类别窗口
    showEditDialog(){       
        if(this.selection==null||this.selection.length==0){
            this.$message.error('请选择要操作的新料!');
            return
        }       
        this.keywordsDialogVisible=true;
       let r=this.selection;
        this.matchForm={bsName:r.bsName,id:r.id}
    },
    //显示新增物料类别窗口
    newCategory(){
     this.keywordsDialogVisible=true;
     this.matchForm.bsName='';
     this.matchForm.id=''
    },
    //获取类别列表
    getCategoryData(){         
        getkeylist().then(response => {
            if (!response.data) { 
            reject('error')
          }            
        this.matchTable = response.data
        })   
    },
    //获取匹配关键字列表
    getKeywordList(){ 
    let filter=Object.assign({},{cateId:this.selection.id, keyword:this.queryParams.keyword,rows:this.queryParams.rows,page:this.queryParams.page})      
        getlist(filter).then(response => {
            if (!response.data) { 
            reject('error')
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
            this.$message.error('请选择要操作的分类!');
            return
        }
        this.dialog.keywordVisible=true;
        const newRow = {
          id:'',
          bsCateId:this.keywordForm.bsCateId,
          bsCateName:this.keywordForm.bsCateName, 
          bsName:'',
          bsOrderNumber:'',
          bsRemark:'',
          bsValue:1
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
                        editKeyword(filter).then(response => {                                            
                        if(response.result) {                                
                                this.keywordsDialogVisible= false
                                 this.$message.info(response.msg);
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
                        addKeywords(filter).then(response => {                     
                            if(response.result) {                       
                                this.keywordsDialogVisible=false;
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
                    edit(filter).then(response => {                                   
                    if(response.result) {                                
                            this.dialog.keywordVisible= false
                             this.$message.info(response.msg);
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