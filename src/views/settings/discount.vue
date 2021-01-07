<template>
  <!--  搜索框 -->
  <div>
    <div class="headerTop">    
      <el-row>
        <el-col :span="6" style="width:286px">
          <el-button-group style="margin-left:18px;margin-bottom: 10px;">
            <el-button v-if="permit.ADD" type="primary" icon="el-icon-plus" @click="showAddCategory()">新增类别</el-button> 
            <el-button v-if="permit.EDIT" type="primary" icon="el-icon-edit" @click="showEditCategory()">编辑类别</el-button>             
            <el-button v-if="permit.DELETE" type="primary" icon="el-icon-delete" @click="showDeleteCategory()">删除</el-button>
          </el-button-group>
        </el-col> 
        <el-col :span="16" style="margin-left:10px">
          <el-form :inline="true" :model="queryParams" class="demo-form-inline">
            <el-form-item label="关键字">
              <el-input v-model="queryParams.keyword" placeholder="搜索关键字" class="search-input"></el-input>
            </el-form-item>
            <el-form-item label="是否禁用">
              <el-select v-model="queryParams.isBan" placeholder="请选择" style="width:200px">
                <el-option v-for="item in optionsBan" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>         
            <el-form-item>
              <el-button v-if="permit.SEARCH" type="primary" size="mini" @click="handleSubmit()">{{$t('Button.Inquire')}}</el-button>
              <el-button v-if="permit.ADD" type="primary" icon="el-icon-plus" @click="showAddData()">新增方案</el-button>
            </el-form-item>
          </el-form>
        </el-col>     
      </el-row>
    </div>

    <!-- 内容区容器 -->   
    <el-container style="height: 500px;">
      <!-- 侧边栏 -->
      <el-aside class="tree">
        <h3>类别列表 </h3>

        <el-table 
        class="mateTable"
        ref="mateTable"
        highlight-current-row      
        :data="cTable" 
        @current-change="handleSelectionChange">  
          <el-table-column type="index" width="50">
          </el-table-column>
          <el-table-column  width="230" prop="bsName" label="类别名称">
          </el-table-column>
        </el-table>
   
      </el-aside>
      <!-- 表格内容区 -->
      <el-main>
        <el-table :data="iTable"> 
          <el-table-column prop="bsCateName" label="类别名称" show-overflow-tooltip width="150">
            <template scope="scope">
              <span>{{ scope.row.discountCategory ? scope.row.discountCategory.bsName : "" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="bsCode" label="折扣编号" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="bsName" label="折扣名称" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="bsValue" label="折扣率" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="bsRemark" label="备注">
          </el-table-column>
          <el-table-column prop="bsIsBan" label="是否禁用" show-overflow-tooltip>
            <template scope="scope">
              <el-tag :type="statusFilter(scope.row.bsIsBan)">{{formatStatus(scope.row.bsIsBan)}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作"  width="150">
            <template slot-scope="scope">
              <el-button v-if="permit.EDIT" type="primary" icon="el-icon-edit" size="mini" circle @click="showEditData(scope.row)" title="编辑"></el-button>
              <messagebox v-if="permit.DELETE" 
                @callConfirm="delData(scope.row)"
                title="提示"
                contents="此操作将永久删除该行, 是否继续?"
                confirmTitle="确认删除"
                ></messagebox>
                <el-button v-if="scope.row.bsIsBan==0" type="warning" icon="el-icon-setting" size="mini" circle @click="doBan(1, scope.row)" title="禁用"></el-button>
                <el-button v-if="scope.row.bsIsBan==1" type="warning" icon="el-icon-setting" size="mini" circle @click="doBan(0, scope.row)" title="解禁"></el-button>     
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>

    <div class="block">
      <el-pagination
        class="pull-right clearfix"
        @current-change="changePage"
        @size-change="sizeChange"
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

    <!-- 新增类别 -->
    <el-dialog title="新增或编辑类别" :visible.sync="categoryVisible" width="35%">
      <el-form :inline="true" :model="categoryForm" ref="ruleForm1">
        <el-form-item label="id" prop="id" style="display: none">
          <el-input v-model="categoryForm.id"></el-input>
        </el-form-item>  
        <el-form-item label="类别名称" prop="bsName">
          <el-input style="width:300px;" v-model="categoryForm.bsName"></el-input>
        </el-form-item>      
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="el-icon-close" @click="categoryVisible = false">取 消</el-button>
        <el-button class="el-icon-check" type="primary" @click="categoryAddBtn">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 删除类别 -->
    <el-dialog title="删除类别" :visible.sync="categoryVisibleDel" width="35%">
      <el-form :inline="true" :model="categoryFormDel" ref="ruleForm1">
        <el-form-item label="id" prop="id" style="display: none">
          <el-input v-model="categoryFormDel.id"></el-input>
        </el-form-item>  
        <span>确定删除该类别？</span>     
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="el-icon-close" @click="categoryVisibleDel = false">取 消</el-button>
        <el-button class="el-icon-check" type="primary" @click="doDelete()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 新增方案 -->
    <el-dialog title="新增方案" :visible.sync="dialog.dataVisible" width="500px">
      <el-form
      :model="dataForm"
      ref="dialog.keyruleForm"
      :rules="dialog.keyruleForm"
      :inline="true" 
      label-position="right" 
      label-width="110px">
        <el-form-item label="类别ID" style="" prop="bsCateId" label-position="left">
          <el-input v-model="dataForm.bsCateId" style="width:218px;" :disabled="true"></el-input>
        </el-form-item>             
        <el-form-item label="类别名称" prop="bsCateName">
          <el-input v-model="dataForm.bsCateName" style="width:218px;" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="折扣名称" prop="bsName">
          <el-input v-model="dataForm.bsName" style="width:218px;"></el-input>
        </el-form-item>
        <el-form-item label="折扣率" prop="bsValue">
          <el-input v-model="dataForm.bsValue" style="width:218px;"></el-input>
        </el-form-item>    
        <el-form-item label="备注" prop="bsRemark">
          <el-input v-model="dataForm.bsRemark" style="width:218px;"></el-input>
        </el-form-item>               
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="el-icon-close" @click="dialog.dataVisible = false">取 消</el-button>
        <el-button class="el-icon-check" type="primary" @click="addBtn()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑方案 -->
    <el-dialog title="编辑方案" :visible.sync="dialogEdit.dataVisible" width="500px">
      <el-form
      :model="dataFormEdit"
      ref="dialogEdit.keyruleForm"
      :rules="dialogEdit.keyruleForm"
      :inline="true" 
      label-position="right" 
      label-width="110px">
        <el-form-item label="类别ID" style="" prop="bsCateId"  label-position="left" >
          <el-input v-model="dataFormEdit.bsCateId" style="width:218px;" :disabled="true"></el-input>
        </el-form-item>             
        <el-form-item label="类别名称" prop="bsCateName">
          <el-input v-model="dataFormEdit.bsCateName" style="width:218px;" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="折扣编号" prop="bsCode">
          <el-input v-model="dataFormEdit.bsCode" style="width:218px;"></el-input>
        </el-form-item>
        <el-form-item label="折扣名称" prop="bsName">
          <el-input v-model="dataFormEdit.bsName" style="width:218px;"></el-input>
        </el-form-item>
        <el-form-item label="折扣率" prop="bsValue">
          <el-input v-model="dataFormEdit.bsValue" style="width:218px;"></el-input>
        </el-form-item>    
        <el-form-item label="备注" prop="bsRemark">
          <el-input v-model="dataFormEdit.bsRemark" style="width:218px;"></el-input>
        </el-form-item>               
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="el-icon-close" @click="dialogEdit.dataVisible = false">取 消</el-button>
        <el-button class="el-icon-check" type="primary" @click="editBtn()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import {getCategory,addCategory,editCategory,delCategory,getDiscount,addDiscount,editDiscount,delDiscount,banDiscount} from '@/api/discount'
import {getPermByRouterCode} from '@/api/perm'
import messagebox from "@/components/Dialog/MessageBox.vue";
export default {
  name: "discount",
  components: {
    messagebox
  },
  data() {
    return {
      labelPosition:'right',
      selection: [],
      cTable:[{}],//左边数据列表  
      categoryVisible:false,
      categoryVisibleDel:false,   
      queryParams:{        
        keyword:'',
        isBan:'',     
        page: 1,
        rows: 15,    
      },
      item:[],
      pageSizesList: [10, 15, 20, 30, 40, 50, 100],
      totalCount: 0, //数据的总条数,
      loading:false,
      open: true,
      current:0,
      iTable:[],//右边数据列表
      categoryForm:{},
      categoryFormDel:{},
      //新增弹出框数据
      dataForm:{
        bsCateId:'',
        bsCateName:'',
        bsCode:'',
        bsName:'',
        bsValue:'',
        bsRemark:''                 
      },
      dialog: {        
        dataVisible: false,
        keyruleForm: {        
          bsCateId: [
            { required: true, message: "必填项", trigger: "blur" }
          ],
          bsCateName: [
            { required: true, message: "必填项", trigger: "blur" }
          ],
          bsName: [
            { required: true, message: "请填写折扣名称", trigger: "blur" }
          ], 
          bsValue: [
            { required: true, message: "请填写折扣率", trigger: "blur" }
          ],   
          
        }
      },
      //编辑弹出框数据
      dataFormEdit:{
        bsCateId:'',
        bsCateName:'',
        bsCode:'',
        bsName:'',
        bsValue:'',
        bsRemark:''                 
      },
      dialogEdit: {        
        dataVisible: false,
        keyruleForm: {        
          bsCateId: [
            { required: true, message: "必填项", trigger: "blur" }
          ],
          bsCateName: [
            { required: true, message: "必填项", trigger: "blur" }
          ],
          bsCode: [
            { required: true, message: "请填写折扣编号", trigger: "blur" }
          ], 
          bsName: [
            { required: true, message: "请填写折扣名称", trigger: "blur" }
          ], 
          bsValue: [
            { required: true, message: "请填写折扣率", trigger: "blur" }
          ],   
          
        }
      },
      // el-tag类型转换
      statusFilter(status) {
        const statusMap = {
          1: "danger",
          0: "success",        
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
        DELETE:false
      },
      // 禁用下拉选项
      optionsBan:[{
          value: '0',
          label:"否"
      },{
          value: '1',
          label:"是"
      }],     
    }   
  },
  created(){
    this.getCategoryData();
    this.getPermit(); 
  },
  methods:{ 
    handleSubmit(){
      this.getData();
    },    
    getPermit(){
      var routerCode = this.$route.name;
      getPermByRouterCode(routerCode).then(response => {
        if(response.result){
          if(response.data == "admin"){
            this.permit.SEARCH = true;
            this.permit.ADD = true;
            this.permit.EDIT = true;
            this.permit.DELETE = true;
          }else{
            var list = response.data;
            for(var i = 0; i < list.length; i++){
              if(list[i].permCode == "SEARCH") this.permit.SEARCH = true;
              if(list[i].permCode == "ADD") this.permit.ADD = true;
              if(list[i].permCode == "EDIT") this.permit.EDIT = true;
              if(list[i].permCode == "DELETE") this.permit.DELETE = true;
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
      this.dataForm=Object.assign({});
      this.selection = val!=null ? val : Object.assign({});
      this.dataForm.bsCateId= this.selection.id;
      this.dataForm.bsCateName=this.selection.bsName; 
      
      this.getData();     
    },
    //显示编辑物料类别窗口
    showEditCategory(){       
      if(this.selection==null||this.selection.length==0){
        this.$message.error('请选择要操作的行!');
        return
      }       
      this.categoryVisible=true;
      let r=this.selection;
      this.categoryForm={bsName:r.bsName,id:r.id}
    },
    //显示新增物料类别窗口
    showAddCategory(){
      this.categoryVisible=true;
      this.categoryForm.bsName='';
      this.categoryForm.id=''
    },
    //获取类别列表
    getCategoryData(){         
      getCategory().then(response => {
        if (response.result) { 
          this.cTable = response.data;
        }else{
          this.$message.error(response.msg);
        } 
      })   
    },
    //新增&编辑类别
    categoryAddBtn(){          
      let filter=Object.assign({},this.categoryForm)
      if(typeof(this.categoryForm.id)!=undefined && typeof(this.categoryForm.id)=="number") {
        //新增       
        editCategory(filter).then(response => {                                            
          if(response.result) {                                
            this.categoryVisible= false
            this.$message.info(response.msg);
            this.getCategoryData();
          }else {
            this.$message.error(response.msg);
          }
        });
      }else {
        //编辑
        this.dialog.loading = true;
        addCategory(filter).then(response => {                     
          if(response.result) {                       
            this.categoryVisible=false;
            this.getCategoryData();
          }else {
            this.$message.error(response.msg);
          }
        });
      }
    },
    //删除弹出框
    showDeleteCategory(){
      if(this.selection==null || this.selection.length==0){
        this.$message.error("请选择要操作的行！")
        return;
      }  
      this.categoryVisibleDel = true;
      this.categoryFormDel.id = this.selection.id;
    },
    //删除类别
    doDelete(){
      this.categoryVisibleDel = false;
      let id = this.categoryFormDel.id;
      if(id){
        delCategory(id).then(response=>{
          if(response.result){
            this.$message({ message:response.msg, type:'success'})
            this.getCategoryData();
          }else{
            this.$message.error(response.msg)
          }
        });
      }else{
        this.$message.error("请选择要操作的行！")
        return;
      }
    },

    //获取折扣方案列表
    getData(){
      let filter=Object.assign({},{cateId:this.selection.id, 
        keyword:this.queryParams.keyword,bsIsBan:this.queryParams.isBan,
        rows:this.queryParams.rows,page:this.queryParams.page})      
      getDiscount(filter).then(response => {
        if (response.result) {
          this.iTable = response.data.rows;
          this.totalCount =response.data.total;
        }  
      });
    },
    //显示编辑折扣方案窗口
    showEditData(row){       
      if(this.selection==null||this.selection.length==0){
        this.$message.error('请选择要操作的类别!');
        return
      }
      this.dialogEdit.dataVisible=true;
      const newRow = {
        id:row.id,
        bsCateId:row.bsCateId,
        bsCateName:(row.discountCategory) ? row.discountCategory.bsName : '',
        bsCode:row.bsCode,
        bsName:row.bsName,
        bsValue:row.bsValue,
        bsRemark:row.bsRemark
      }
      this.dataFormEdit = Object.assign({},newRow);
    },
    //显示新增折扣方案窗口
    showAddData(){
      if(this.selection==null||this.selection.length==0){
        this.$message.error('请选择要操作的类别!');
        return
      }
      this.dialog.dataVisible=true;
      const newRow = {
        id:'',
        bsCateId:this.dataForm.bsCateId,
        bsCateName:this.dataForm.bsCateName,
        bsCode:'',
        bsName:'',
        bsValue:'',
        bsRemark:''
      }
      this.dataForm = Object.assign(newRow); 
    },
    //新增方案
    addBtn(){    
      let filter=Object.assign({},this.dataForm);
      this.$refs['dialog.keyruleForm'].validate((valid) => {               
        if (valid) {
          addDiscount(filter).then(response => {                     
            if(response.result) {
              this.$message.success(response.msg);                       
              this.dialog.dataVisible=false;
              this.getData();
            }else {
              this.$message.error(response.msg);
            }
          });
        }
      });
    },
    //编辑方案
    editBtn(){
      let filter=Object.assign({},this.dataFormEdit);
      this.$refs['dialogEdit.keyruleForm'].validate((valid) => {
        if (valid) {
          editDiscount(filter).then(response => {                                   
            if(response.result) {                                
              this.dialogEdit.dataVisible= false
              this.$message.success(response.msg);
              this.getData();
            }else {
              this.$message.error(response.msg);
            }
          });
        }
      });
    },
    //删除方案
    delData(row){
      let id=row.id
      delDiscount(id).then(response=>{
        if(response.result){
          this.$message({
              message:response.msg,
              type:'success'
          })
          this.getData();
        }else{
          this.$message.error(response.msg);
        }
      });
    },
    select(selection,row){
      if(selection.length>1){
        selection.shift()
      }
    },
    clickRow(row,column){   
      this.$refs.mateTable.toggleRowSelection(row)      
    },
    //禁用
    doBan(isBan, row){
      var contents = "此操作将禁用该行，是否继续？";
      if(isBan==0){
        var contents = "此操作将解禁该行，是否继续？";
      }
      //提示弹出框
      this.$confirm(contents, '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        showClose :true,
        type: 'warning'         
      }).then(() => {
        //禁用
        banDiscount(row.id, isBan).then(response=>{
          if(response.result){
            this.$message({
                message:response.msg,
                type:'success'
            })
            this.getData();
          }else{
            this.$message.error(response.msg);
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        }); 
      });
    },
    changePage(page){
      this.queryParams.page=page;
      this.getData();
    },
    sizeChange(size){
      this.queryParams.rows=size;   
      this.getData();
    }, 
  
  }
};
</script>
<style>
  .headerTop{
   /* height: 40px;*/
    margin-top:10px;
    overflow: hidden;
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
</style>