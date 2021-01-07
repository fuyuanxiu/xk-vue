<template>
  <div>
    <el-card style="padding-bottom: 0;border:none;">
      <el-row>
        <el-col :span="6">
          <el-button-group size="samll">
            <el-button v-if="permit.ADD" type="primary" icon="el-icon-plus" @click="showAddDialog()">新增模板</el-button>                
          </el-button-group>
        </el-col>
      </el-row>  
    </el-card>
    <template>
      <!--表格 start-->
      <el-table 
        :data="templatesTable" 
        tooltip-effect="dark" 
        style="width: 100%" 
        border 
        highlight-current-row 
        v-loading="loading" 
        element-loading-text="数据加载中，请稍等">
        <el-table-column type="index" width="45">
        </el-table-column>
        <el-table-column prop="bsType" label="模板类型" width="200" show-overflow-tooltip>
          <template scope="scope">
            <span>{{ formatType(scope.row.bsType)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="bsFileName" label="模板名称" width="200" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="createdTime" label="创建时间" width="200" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="modifiedTime" label="修改时间" width="200" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button v-if="permit.EDIT" type="primary" icon="el-icon-edit" circle size="mini" @click="showEditDialog(scope.row)"></el-button>
            <el-button v-if="permit.DOWNLOAD" type="success" icon="el-icon-download" circle size="mini" @click="download(scope.row.bsFileId)"></el-button>
            <MessageBox v-if="permit.DELETE" @callConfirm="doDelete(scope.row)" title="提示" contents="此操作将永久删除该行, 是否继续?" confirmTitle="确认删除"></MessageBox>
          </template>
        </el-table-column>
      </el-table>
      <!--表格 end-->           
    </template>

    <!--分页 start-->
    <div class="block">
      <el-pagination class="pull-right clearfix" @current-change="changePage" @size-change="sizeChange" :current="1" :current-page.sync="queryParams.page" :page-sizes="pageSizesList" :page-size="queryParams.rows" layout="total, sizes, prev, pager, next, jumper" :page-size-opts="pageSizesList" :total="totalCount">
      </el-pagination>
    </div>     
    <!--分页 end-->

    <!--添加页 start--> 
    <el-dialog title="新增模板" :visible.sync="dialog.docVisible" width="500px">
      <div>
        <input ref="doc-upload-input" class="doc-upload-input" type="file" @change="addDoc" />
        <el-button :loading="addBtnLoading" style="margin-bottom: 10px;" size="mini" type="primary" @click="addDocBefore">上传文件</el-button>
      </div>
      <el-form :inline="true" :model="addForm">
        <el-form-item 
          label="id" 
          prop="id"
          style="display: none">
          <el-input v-model="addForm.id"></el-input>
        </el-form-item>
        <el-form-item
          label="模板类型"         
          prop="bsType">
          <el-select style="width:300px;" v-model="addForm.bsType">
            <el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="文件ID"         
          prop="bsFileId"
          style="display: none" hidden>
          <el-input v-model="addForm.bsFileId"></el-input>
        </el-form-item>
        <el-form-item
          label="文件名称"         
          prop="bsFileName">
          <el-input style="width:300px;" v-model="addForm.bsFileName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.docVisible = false">取 消</el-button>
        <el-button type="primary"  @click="doAdd">确 定</el-button>
      </div>
    </el-dialog>
    <!--添加页 end-->

    <!--编辑页 start--> 
    <el-dialog title="编辑模板" :visible.sync="dialog.docVisibleEdit" width="500px">
      <div>
        <input ref="doc-upload-input-edit" class="doc-upload-input" type="file" @change="editDoc" />
        <el-button :loading="editBtnLoading" style="margin-bottom: 10px;" size="mini" type="primary" @click="editDocBefore">上传文件</el-button>
      </div>
      <el-form :inline="true" :model="editForm">
        <el-form-item 
          label="id" 
          prop="id"
          style="display: none">
          <el-input v-model="editForm.id"></el-input>
        </el-form-item>
        <el-form-item
          label="模板类型"         
          prop="bsType">
          <el-select style="width:300px;" v-model="editForm.bsType">
            <el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="文件ID"         
          prop="bsFileId"
          style="display: none" hidden>
          <el-input v-model="editForm.bsFileId"></el-input>
        </el-form-item>
        <el-form-item
          label="文件名称"         
          prop="bsFileName">
          <el-input style="width:300px;" v-model="editForm.bsFileName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.docVisibleEdit = false">取 消</el-button>
        <el-button type="primary"  @click="doEdit">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑页 end-->
  </div>
</template>
<script>
import MessageBox from '@/components/Dialog/MessageBox.vue';
import { uplaodFile,getFile } from '@/api/file';
import { addTemp,editTemp,deleteTemp,getTempList } from '@/api/templates';
import {getPermByRouterCode} from '@/api/perm'

export default {
  name:'templates',
  components: {
    MessageBox
  },
  data() {
    return {
      loading: false,
      addBtnLoading: false,
      editBtnLoading: false,
      templatesTable:[],
      addForm:{
        bsType: "",
        bsFileId: 0,
        bsFileName: ""
      },
      option: [{
        value: 1,
        label: '询价物料模板'
      }],
      editForm:{
        id: 0,
        bsType: "",
        bsFileId: 0,
        bsFileName: ""
      },
      queryParams: {
        page: 1,
        rows: 10,
        pkParent: -1
      },
      pageSizesList: [10, 20, 30, 40, 50, 100],
      totalCount: 0, //数据的总条数
      dialog: {        
        docVisible: false,
        docVisibleEdit: false,
        bsFileId: 0
      },
      permit:{
        //权限控制
        ADD:false,
        EDIT:false,
        DELETE:false,
        DOWNLOAD:false
      },
    }
  },
  created() {
    this.getData();
    this.getPermit();
  },
  methods: {
    getPermit(){
      var routerCode = this.$route.name;
      getPermByRouterCode(routerCode).then(response => {
        if(response.result){
          if(response.data == "admin"){
            this.permit.ADD = true;
            this.permit.EDIT = true;
            this.permit.DELETE = true;
            this.permit.DOWNLOAD = true;
          }else{
            var list = response.data;
            for(var i = 0; i < list.length; i++){
              if(list[i].permCode == "ADD") this.permit.ADD = true;
              if(list[i].permCode == "EDIT") this.permit.EDIT = true;
              if(list[i].permCode == "DELETE") this.permit.DELETE = true;
              if(list[i].permCode == "DOWNLOAD") this.permit.DOWNLOAD = true;
            }
          }
        }else{
          this.$message.error(res.msg);
        }
      });
    },
    getData() {
      this.loading = true;
      getTempList(this.queryParams.rows,this.queryParams.page).then(response => {
        if(response.result){
          this.loading = false;
          this.templatesTable = response.data.rows;
          this.totalCount = response.data.total;
        }else{
          this.$message.error(response.msg);
        }
      });
    },
    //新增模板
    doAdd() {
      let filter=Object.assign({},{"bsType":this.addForm.bsType,"bsFileId":this.addForm.bsFileId,"bsFileName":this.addForm.bsFileName});
      addTemp(filter).then(response => {
        if(response.result){
          this.dialog.docVisible = false;
          this.$message.info(response.msg);
          this.getData();
        }else{
          this.$message.error(response.msg);
        }
      });
    },
    //编辑模板
    doEdit() {
      let filter=Object.assign({},{"id":this.editForm.id,"bsType":this.editForm.bsType,"bsFileId":this.editForm.bsFileId,"bsFileName":this.editForm.bsFileName});
      editTemp(filter).then(response => {
        if(response.result){
          this.dialog.docVisibleEdit = false;
          this.$message.info(response.msg);
          this.getData();
        }else{
          this.$message.error(response.msg);
        }
      });
    },
    //删除模板
    doDelete(row) {
      var id = row.id;
      deleteTemp(id).then(response => {
        if(response.result){
          this.$message.info(response.msg);
          this.getData();
        }else{
          this.$message.error(response.msg);
        }
      });
    },
    //下载模板
    download(fsFileId) {
      window.location.href = process.env.BASE_API + "/file/get?fsFileId=" + fsFileId;
    },
    changePage(page) {
      this.queryParams.page = page;
      this.getData();
    },
    sizeChange(size) {
      this.queryParams.rows = size;
      this.getData();
    },
    //新增上传文件弹出框
    showAddDialog(){
      this.addForm.bsType = "";
      this.addForm.bsFileId = 0;
      this.addForm.bsFileName = "";
      this.dialog.docVisible = true;
      this.addBtnLoading = false;
    },
    addDoc(e) {
      this.addBtnLoading = true;
      //获取上传的文件
      const files = e.target.files;
      const rawFile = files[0];
      //封装数据
      let formData = new FormData();
      formData.append('file', rawFile);
      uplaodFile(formData).then(response => {
        if(response.result){
          this.addForm.bsFileId = response.data.id;
          this.addForm.bsFileName = response.data.bsName;
          this.addBtnLoading = false;
          this.$message.info(response.msg);
        }else{
          this.$message.error(response.msg);
        }
      });
    },
    addDocBefore() {
      this.$refs['doc-upload-input'].click();
    },
    //编辑上传文件弹出框
    showEditDialog(row){
      this.editForm.id = row.id;
      this.editForm.bsType = row.bsType;
      this.editForm.bsFileId = row.bsFileId;
      this.editForm.bsFileName = row.bsFileName;
      this.dialog.docVisibleEdit = true;
      this.editBtnLoading = false;
    },
    editDoc(e) {
      this.editBtnLoading = true;
      //获取上传的文件
      const files = e.target.files;
      const rawFile = files[0];
      //封装数据
      let formData = new FormData();
      formData.append('file', rawFile);
      uplaodFile(formData).then(response => {
        if(response.result){
          this.editForm.bsFileId = response.data.id;
          this.editForm.bsFileName = response.data.bsName;
          this.editBtnLoading = false;
          this.$message.info(response.msg);
        }else{
          this.$message.error(response.msg);
        }
      });
    },
    editDocBefore(){
      this.$refs['doc-upload-input-edit'].click();
    },
    // 状态显示转换
    formatType(status) {
      const statusMap = {
        1: "询价物料模板"
      };
      return statusMap[status];
    }
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
