<template>
    <div>
        <el-card style="padding-bottom: 0;border:none;">
            <el-row>
                <el-col :span="8">
                    <el-form :inline="true" :model="formQuery" class="demo-form-inline">
                      <el-form-item label="关键字:">
                        <el-input v-model="formQuery.keyword" placeholder="关键字" class="search-input"></el-input>
                      </el-form-item>
                      <el-form-item>
                         <el-button v-if="permit.SEARCH" type="primary" @click="getData">查找</el-button>
                      </el-form-item>
                  </el-form>
                </el-col>
                <el-col :span="6">
                     <el-button-group size="samll">
                     <el-button v-if="permit.ADD" type="primary" icon="el-icon-plus" @click="Addsupplier('addsupplier')">新增供应商</el-button>
                     <el-button v-if="permit.IMPORT" type="primary" icon="el-icon-upload" @click="importExecl">导入EXCEL</el-button>                  
                     </el-button-group>
                </el-col>
                  <el-col :span="4" >
                     <el-button-group  size="samll">                     
                     <el-button v-if="permit.PASS" type="success" icon="el-icon-check" @click="docCecked(2)">复核</el-button>
                     <el-button v-if="permit.FORBID" type="danger" icon="el-icon-circle-close" @click="docCecked(3)">禁用</el-button>                   
                     </el-button-group>
                </el-col>
            </el-row>           
        </el-card>
        <template>
              <el-table
                ref="multipleTable"
                :data="supplierTable"
                tooltip-effect="dark"
                style="width: 100%"
                border
                 highlight-current-row              
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="45"
                  fixed>
                </el-table-column>
                 <el-table-column
                  prop="suppCode"
                  label="供应商编号"
                  width="100"
                   show-overflow-tooltip
                  >
                </el-table-column>
                <el-table-column
                  prop="suppChineseName"
                  label="中文名称"
                  width="280"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="suppK3Code"
                  label="K3编码"
                  width="90"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="suppAliaName"
                  label="供应商简称"
                  width="120">
                </el-table-column>
                <el-table-column
                  prop="suppGrade"
                  label="状态"
                  width="90"
                  align="center"
                  show-overflow-tooltip>
                  <template scope="scope">       
                    <span v-bind:class="{orange:scope.row.suppGrade==1 ,green:scope.row.suppGrade==2, gray:scope.row.suppGrade==3}">{{$t('supplier.Status['+scope.row.suppGrade+']')}}</span>
                </template>
                </el-table-column>  
                 <el-table-column
                  prop="suppContactName"
                  label="联系人"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="suppMobile"
                  width="120"
                  label="电话"
                  align="center"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="suppEmail"
                  width="120"
                  label="邮箱地址"
                  align="center"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="createdTime"
                  label="注册时间"
                  width="150"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="操作" width="140" fixed="right">
                <template slot-scope="scope">
                   <el-button icon="el-icon-search" size="mini" @click="viewSupplier('addsupplier',scope.row)" circle></el-button>
                    <el-button v-if="permit.EDIT" type="primary" size="mini" @click="showEditDialog('addsupplier',scope.row)" icon="el-icon-edit" circle></el-button>       
                 <!--    <a class="operatIcon colorRed"  @click="doDelete(scope.row)"><i class="el-icon-delete"></i> </a> -->                    
                <MessageBox v-if="permit.DELETE" @callConfirm="doDelete(scope.row)" title="提示" contents="此操作将永久删除该行, 是否继续?" confirmTitle="确认删除"></MessageBox>                        
                </template>
                 </el-table-column>           

              </el-table>             
        </template>
         <div class="block">
            <el-pagination class="pull-right clearfix" @current-change="changePage" @size-change="SizeChange" :current="1" :current-page.sync="queryParams.page" :page-sizes="pageSizesList" :page-size="queryParams.rows" layout="total, sizes, prev, pager, next, jumper" :page-size-opts="pageSizesList" :total="totalCount">
            </el-pagination>
        </div>     
        <!--end-->
    </div>
 
</template>
<script>
import {getlistWithTobe,delSupplierInfo,uplaodFile,updateStatus} from '@/api/supplier'
import {getPermByRouterCode} from '@/api/perm'
import MessageBox from '@/components/Dialog/MessageBox.vue'
  export default {
    name:'supplierList',
    components:{
    MessageBox
  },
    data() {
      return {   
        dialogVisible: false, 
        rolesDate:[],
        multipleSelection: [],
        checkedRolesDate:[],
        value4: [],    
        formQuery: {
            keyword: ''
            },
        currentRow:[],
        supplierTable:[{

        }],          
        queryParams: {
            page: 1,
            rows: 15,
            pkParent: -1
            },
        pageSizesList: [10, 15, 20, 30, 40, 50, 100],
        totalCount: 0, //数据的总条数,
        permit:{
          //权限控制
          SEARCH:false,
          ADD:false,
          EDIT:false,
          DELETE:false,
          IMPORT:false,
          PASS:false,
          FORBID:false
        },
      }
    }, 
    created(){
        this.getData();   
        this.getPermit();
    },
    watch:{
    '$route':"getData"
    },
    methods: {      
    handleSubmit(name){
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
            this.permit.IMPORT = true;
            this.permit.PASS = true;
            this.permit.FORBID = true;
          }else{
            var list = response.data;
            for(var i = 0; i < list.length; i++){
              if(list[i].permCode == "SEARCH") this.permit.SEARCH = true;
              if(list[i].permCode == "ADD") this.permit.ADD = true;
              if(list[i].permCode == "EDIT") this.permit.EDIT = true;
              if(list[i].permCode == "DELETE") this.permit.DELETE = true;
              if(list[i].permCode == "IMPORT") this.permit.IMPORT = true;
              if(list[i].permCode == "PASS") this.permit.PASS = true;
              if(list[i].permCode == "FORBID") this.permit.FORBID = true;
            }
          }
        }else{
          this.$message.error(res.msg);
        }
      });
    },
    getData() {
      //let suppGrade=1;
    let filter = Object.assign(
        {},
        this.formQuery,
        this.queryParams
      );     
      getlistWithTobe(filter).then(response => {
        if (!response.data) {
          reject('error')
        }
        this.supplierTable = response.data.rows;
        this.totalCount = response.data.total;
      })
    },
    Addsupplier(url){
         this.$router.push({path: url});
    },
//删除
    doDelete(row){        
        let id=row.id;     
           delSupplierInfo(id).then(response => {                                            
            if(response.result) {
                this.$message({
                  message: response.msg,
                  type: 'success'
                });                              
                this.getData();
            }else {
                this.$message.error(res.msg);
            }
        }) 
   
    },
//复核&禁用
    docCecked(Grade){       
        let ids=[];
        let suppGrade=Grade;
        this.multipleSelection.map((item)=> {
            ids.push(item.id)
        })         
        updateStatus(ids.join(','),suppGrade).then(response => {                                           
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

   //获取被选中的行的数量
    getSelectedCount(){        
        return this.multipleSelection.length
    },
    //获取被选中的行的数据的id，放到一个数组中   
    getSelectedIds(){
        let ids=[]
        this.multipleSelection.map((item)=> {
            ids.push(item.id)
        })
        return ids;
    },      
   //编辑
    showEditDialog(url,row) {      
       this.$store.commit("updateSupplierDataStates",row);
      this.$router.push({ path: url, query: { id: row.id,type:'edite' } });
    },
    //查看供应商详情
    viewSupplier(url,row) {
       this.$store.commit("updateSupplierDataStates",row);
       this.$router.push({path: url,query:{ id: row.id,type:'view'}});      
    },

    handleSelectionChange(val){    
        this.multipleSelection = val;
    },

    importExecl(){        
        if(!this.multipleSelection){               
            this.$message.error('请选择操作行');
            return
        }
        
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
        }
    }
  }
</script>
<style>
    .block {
    text-align: right;
    margin-top: 10px;
}

</style>