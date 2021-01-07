<template>
  <div>
    <el-card style="padding-bottom: 0;border:none;">
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="formQuery" class="demo-form-inline">
            <el-form-item label="关键字">
              <el-input v-model="formQuery.keyWord" placeholder="关键字"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="info" @click="resetFrom">重置</el-button>
              <el-button type="primary" v-if="permit.SEARCH"  @click="handleSubmit('formQuery')">查找</el-button>
              <upload-excel-component v-if="permit.UPLOAD" style="display: inline-block;"                
                v-on:afterUpload="afterUpload"        
              >
              </upload-excel-component>
                <updata-k3 v-if="permit.SYNCH"
                       @callConfirm2="updateMateData()"
                      title="提示"
                      contents="此同步操作将花费较长时间，是否继续？"
                      confirmTitle="确认"
                    ></updata-k3>
             <!--  <el-button type="primary"  @click="updateMateData()">同步K3物料数据</el-button> -->
              <!-- <el-button type="primary" icon="el-icon-upload"  @click="toClientBomRate">客户Bom导入</el-button> -->
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>

            <template>
              <el-table  border ref="main_table" :data="dataTable" tooltip-effect="dark" style="width: 100%" highlight-current-row @select="select" @selection-change="handleSelectionChange" v-loading="loading" element-loading-text="数据加载中，请稍等">
                <el-table-column type="selection" width="45" />
                <el-table-column prop="createdTime" label="创建时间" width="150" show-overflow-tooltip />
                <el-table-column prop="fileName" label="BOM文件名称" show-overflow-tooltip />
                <el-table-column prop="bomCode" label="BOM编号" show-overflow-tooltip />
                <el-table-column prop="modifiedName" label="操作人" width="80" show-overflow-tooltip />
                <el-table-column prop="remark" label="备注" show-overflow-tooltip >
                  <template slot-scope="scope">
                    <el-input type="" name="" v-model="scope.row.remark" style="background:none;border:none;width:100%;"  @blur="handler(scope.row)"></el-input>
                  </template>
                </el-table-column>
                <!-- 附件管理 -->
                <el-table-column prop="fileId" label="附件" show-overflow-tooltip width="100">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="showDoc(scope.row)">附件管理</el-button>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="140">
                  <template slot-scope="scope">
                    <el-button icon="el-icon-search" size="mini" @click="viewBox(scope.row,'view')" circle></el-button>
                    <el-button v-if="permit.EDIT" type="primary" size="mini" @click="viewBox(scope.row,'edite')" icon="el-icon-edit" circle></el-button>
                    <MessageBoxDelete v-if="permit.DELETE" 
                      @callConfirm="doDelete(scope.row)"
                      title="提示"
                      contents="此操作将永久删除该行, 是否继续?"
                      confirmTitle="确认删除"
                    ></MessageBoxDelete>
                  </template>
                </el-table-column>
              </el-table>
            </template>
            <div class="block">
              <el-pagination class="pull-right clearfix" @current-change="changePage" @size-change="SizeChange" :current="1" :current-page.sync="queryParams.page" :page-sizes="pageSizesList" :page-size="queryParams.rows" layout="total, sizes, prev, pager, next, jumper" :page-size-opts="pageSizesList" :total="totalCount">
              </el-pagination>
            </div>
    <!-- 附件管理 -->  
    <el-dialog title="附件管理" :visible.sync="dialog.docVisible" width="500px">
      <div>
        <input ref="doc-upload-input" class="doc-upload-input" type="file" @change="addDoc" />
        <el-button style="margin-bottom: 10px;" size="mini" type="primary" @click="addDocBefore">添加附件</el-button>
      </div>
      <el-table border :data="docList" tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="no" label="序号" show-overflow-tooltip width="60" />
        <el-table-column prop="bsDocName" label="附件名称" show-overflow-tooltip />
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-download" size="mini" @click="downloadDoc(scope.row.bsDocId)" circle></el-button>
            <MessageBoxDelete @callConfirm="deleteDoc(scope.row)" title="提示" contents="此操作将永久删除该行, 是否继续?" confirmTitle="确认删除"></MessageBoxDelete>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button class="el-icon-check" type="primary" @click="dialog.docVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <!--end-->
  </div>
</template>
<script>
import { getBomList,delBom,modifyRemark } from '@/api/cost'
import UploadExcelComponent from "./components/UploadExcel.vue";
import updataK3 from "./components/updataK3MessageBox.vue";
import MessageBoxDelete from "@/components/Dialog/MessageBox.vue";
import { updateMateData } from '@/api/materiel';
import { addDoc,deleteDoc,getDocList } from '@/api/costFile';
import {getPermByRouterCode} from '@/api/perm'
export default {
  name:'clientBomList',
  components: {
    MessageBoxDelete,
    UploadExcelComponent,
    updataK3
  },
  data() {
    return {
      loading: false,
      rolesDate: [],
      checkedRolesDate: [],
      value4: [],
      formQuery: {
        keyWord: ''
      },
      currentRow: [],
      dataTable: [{

      }],
      queryParams: {
        page: 1,
        rows: 10,
        pkParent: -1
      },
      pageSizesList: [10, 20, 30, 40, 50, 100],
      totalCount: 0, //数据的总条数
      dialog: {        
        docVisible: false,
        bsFileId: 0
      },
      docList:[],
      permit:{
          //权限控制
          SEARCH:false,
          UPLOAD:false,
          EDIT:false,
          DELETE:false,
          SYNCH:false
        },
    }
  },
  created() {
    this.getData();
    this.getPermit();
  },
  methods: {
    handleSubmit() {      
      this.getData();
    },
      afterUpload(fileId) {
      //获取该文件的fid
      this.fileId = fileId;     
      this.getData();
    },
    getPermit(){
      var routerCode = this.$route.name;
      getPermByRouterCode(routerCode).then(response => {
        if(response.result){
          if(response.data == "admin"){
            this.permit.SEARCH = true;
            this.permit.UPLOAD = true;
            this.permit.EDIT = true;
            this.permit.DELETE = true;
            this.permit.SYNCH = true;
          }else{
            var list = response.data;
            for(var i = 0; i < list.length; i++){
              if(list[i].permCode == "SEARCH") this.permit.SEARCH = true;
              if(list[i].permCode == "UPLOAD") this.permit.UPLOAD = true;
              if(list[i].permCode == "EDIT") this.permit.EDIT = true;
              if(list[i].permCode == "DELETE") this.permit.DELETE = true;
              if(list[i].permCode == "SYNCH") this.permit.SYNCH = true;
            }
          }
        }else{
          this.$message.error(response.msg);
        }
      });
    },
    getData() {
      this.loading = true
      let suppGrade = 2;
      getBomList(this.formQuery.keyWord, this.queryParams.rows, this.queryParams.page).then(response => {
        this.loading = false
        if (!response.result) {
          this.$Message.error(response.msg);
          return
        }
        this.dataTable = response.data.rows;
        this.totalCount = response.data.total;
      })
    },

    /*删除*/
    doDelete(row) {
      let id = row.fileId;
      delBom(id).then(response => {
        if (response.result) {
          this.$message({
            message: response.msg,
            type: 'success'
          });
          this.getData();
        } else {
          this.$message.error(response.msg);
        }
      })

    },
    /*编辑*/
    viewBox(row, type) {
      //console.log(row);
      this.$router.push({ path: 'clientBomRate', query: { fileId: row.fileId,type:type } });
    },
    toClientBomRate() {
    /*  this.$router.push({path:'clientBomRate',query:{}});*/
    },
    handleSelectionChange(val) {
      this.currentRow = val
      console.log(this.currentRow)
    },
    select(selection, row) {
      if (selection.length > 1) {
        selection.shift()
      }
    },
    clickRow(row,event,column){
        if(event.target.nodeName!="INPUT"  && column.label != '操作'){
          this.$router.push({ path: 'clientBomRate', query: { fileId: row.fileId,type:'edite' } });
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
    },
    //修改备注
    handler(row){
       modifyRemark(row.id,row.remark).then(response => { 
        if(response.result) {
                this.$message({
                  message: response.msg,
                  type: 'success'
                });                              
                this.getData();
            }else {
                this.$message.error(response.msg);
            }                      
           /* if(response.result) {                          
             this.$confirm('备注修改成功', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              dangerouslyUseHTMLString: true,
              type: 'warning'
            }).then(() => {
              this.$message({
                type: 'success',
                message: response.msg
              });
            }).catch(() => {
              this.$error({
                type: 'info',
                message: response.msg
              });          
            });                          
       
         }else {
            this.$message.error(res.msg);
        }*/
    })
    },
    //20190417-Shen 手动同步K3物料数据
    updateMateData(){
      this.loading = true;
      updateMateData().then(response => {
        this.loading = false;
        if (response.result) {
          this.$message.info(response.msg);
        }else{
          this.$message.error(response.msg);
        }
      });
    },
    //附件管理
    showDoc(row){
      this.dialog.docVisible = true;
      this.dialog.bsFileId = row.fileId;
      getDocList(row.fileId,'').then(response => {
        if(response.result){
          this.docList = response.data;
        }else{
          this.$message.error(response.msg);
        }
      });
    },
    //添加附件
    addDoc(e){
      //获取上传的附件
      const files = e.target.files;
      const rawFile = files[0];
      //封装数据
      let formData = new FormData();
      formData.append('file', rawFile);
      formData.append('bsFileId', this.dialog.bsFileId);
      addDoc(formData).then(response => {
        if(response.result){
          getDocList(this.dialog.bsFileId,'').then(response => {
            if(response.result){
              this.docList = response.data;
            }
          });
          this.$message.info(response.msg);
        }else{
          this.$message.error(response.msg);
        }
      });
    },
    addDocBefore() {
      this.$refs['doc-upload-input'].click();
    },
    //删除附件
    deleteDoc(row){
      debugger;
      var id = row.id;
      deleteDoc(id).then(response => {
        if(response.result){
          getDocList(this.dialog.bsFileId,'').then(response => {
            if(response.result){
              this.docList = response.data;
            }
          });
          this.$message.info(response.msg);
        }else{
          this.$message.error(response.msg);
        }
      });
    },
    //下载附件
    downloadDoc(bsDocId) {
      window.location.href =
        process.env.BASE_API + "/file/get?fsFileId=" + bsDocId;
    },
    //重置
    resetFrom(){
      this.formQuery.keyWord = '';
    },

  }
}

</script>
<style>
.block {
  text-align: right;
  margin-top: 10px;
}
.el-table th, .el-table tr{ cursor: pointer; }
.doc-upload-input{
  display: none;
  z-index: -9999;
}

</style>
