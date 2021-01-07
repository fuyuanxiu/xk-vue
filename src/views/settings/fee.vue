<template>
  <div>
    <el-card style="padding-bottom: 0;border:none;">
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="formQuery" class="demo-form-inline">
            <el-form-item label="关键字">
              <el-input v-model="formQuery.keyword" placeholder="搜索关键字"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button v-if="permit.SEARCH" type="primary" @click="handleSubmit">查找</el-button>
              <el-button v-if="permit.ADD" type="primary" icon="el-icon-plus" @click="showAddDialog()">新增</el-button> 
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>

    <template>
      <el-table border ref="main_table" :data="dataTable" tooltip-effect="dark" style="width: 100%" highlight-current-row v-loading="loading" element-loading-text="数据加载中，请稍等">
        <!-- <el-table-column type="index" width="45" /> -->
        <el-table-column prop="bsCode" label="编号" show-overflow-tooltip />
        <el-table-column prop="bsName" label="名称" show-overflow-tooltip />
        <el-table-column prop="bsMeasureType" label="计量方式" width="150" show-overflow-tooltip />
        <el-table-column prop="bsMeasureUnit" label="计量单位" show-overflow-tooltip />
        <el-table-column prop="bsRemark" label="备注" show-overflow-tooltip />
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <el-button v-if="permit.EDIT" type="primary" size="mini" @click="showEditDialog(scope.row)" icon="el-icon-edit" circle></el-button>
            <messagebox v-if="permit.DELETE" 
                @callConfirm="delData(scope.row)"
                title="提示"
                contents="此操作将永久删除该行, 是否继续?"
                confirmTitle="确认删除"
                ></messagebox>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div class="block">
      <el-pagination class="pull-right clearfix" @current-change="changePage" @size-change="sizeChange" :current="1" :current-page.sync="queryParams.page" :page-sizes="pageSizesList" :page-size="queryParams.rows" layout="total, sizes, prev, pager, next, jumper" :page-size-opts="pageSizesList" :total="totalCount">
      </el-pagination>
    </div>

    <!--新增页 start-->
    <el-dialog title="新增" :visible.sync="dialog.addVisible" width="500px">
      <el-form :inline="true" :model="addForm" ref="dialog.keyruleForm" :rules="dialog.keyruleForm" 
      label-position="right" label-width="110px">
        <el-form-item label="费用名称" prop="bsName">
          <el-input style="width:300px;" v-model="addForm.bsName"></el-input>
        </el-form-item>
        <el-form-item label="计量方式" prop="bsMeasureType">
          <el-input style="width:300px;" v-model="addForm.bsMeasureType"></el-input>
        </el-form-item>
        <el-form-item label="计量单位" prop="bsMeasureUnit">
          <el-input style="width:300px;" v-model="addForm.bsMeasureUnit"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="bsRemark">
          <el-input style="width:300px;" v-model="addForm.bsRemark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="el-icon-close" @click="dialog.addVisible = false">取 消</el-button>
        <el-button class="el-icon-check" type="primary" @click="addBtn()">确 定</el-button>
      </div>
    </el-dialog>
    <!--新增页 end--> 

    <!--编辑页 start--> 
    <el-dialog title="编辑" :visible.sync="dialogEdit.editVisible" width="500px">
      <el-form :inline="true" :model="editForm" ref="dialogEdit.keyruleForm" :rules="dialogEdit.keyruleForm" 
      label-position="right" label-width="110px">
        <el-form-item label="id" prop="id" style="display: none">
          <el-input v-model="editForm.id"></el-input>
        </el-form-item>
        <el-form-item label="费用编号" prop="bsCode">
          <el-input style="width:300px;" v-model="editForm.bsCode" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="费用名称" prop="bsName">
          <el-input style="width:300px;" v-model="editForm.bsName"></el-input>
        </el-form-item>
        <el-form-item label="计量方式" prop="bsMeasureType">
          <el-input style="width:300px;" v-model="editForm.bsMeasureType"></el-input>
        </el-form-item>
        <el-form-item label="计量单位" prop="bsMeasureUnit">
          <el-input style="width:300px;" v-model="editForm.bsMeasureUnit"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="bsRemark">
          <el-input style="width:300px;" v-model="editForm.bsRemark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="el-icon-close" @click="dialogEdit.editVisible = false">取 消</el-button>
        <el-button class="el-icon-check" type="primary" @click="editBtn()">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑页 end-->

  </div>
</template>
<script>
import { getFee,addFee,editFee,delFee } from '@/api/fee';
import {getPermByRouterCode} from '@/api/perm';
import messagebox from "@/components/Dialog/MessageBox.vue";
export default {
  name:'fee',
  components: {
    messagebox
  },
  data() {
    return {
      loading: false,
      formQuery: {
        keyword: ''
      },
      currentRow: [],
      dataTable: [{
        
      }],
      addForm:{
        bsName:"",
        bsMeasureType:"",
        bsMeasureUnit:"",
        bsRemark:""
      },
      editForm:{
        id: 0,
        bsCode: "",
        bsName:"",
        bsMeasureType:"",
        bsMeasureUnit:"",
        remark: ""
      },
      dialog: {
        addVisible: false,
        keyruleForm: {
          bsName: [
            { required: true, message: "请填写计费名称", trigger: "blur" }
          ], 
          bsMeasureType: [
            { required: true, message: "请填写计量方式", trigger: "blur" }
          ],
          bsMeasureUnit: [
            { required: true, message: "请填写计量单位", trigger: "blur" }
          ],
          
        }
      },
      dialogEdit: {
        editVisible: false,
        keyruleForm: {
          bsCode: [
            { required: true, message: "请填写计费编号", trigger: "blur" }
          ],
          bsName: [
            { required: true, message: "请填写计费名称", trigger: "blur" }
          ], 
          bsMeasureType: [
            { required: true, message: "请填写计量方式", trigger: "blur" }
          ],
          bsMeasureUnit: [
            { required: true, message: "请填写计量单位", trigger: "blur" }
          ],
          
        }
      },
      queryParams: {
        page: 1,
        rows: 10,
      },
      pageSizesList: [10, 20, 30, 40, 50, 100],
      totalCount: 1, //数据的总条数
      permit:{
        //权限控制
        SEARCH:false,
        EDIT:false
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
    getData() {
      this.loading = true;
      let filter=Object.assign({},this.formQuery,this.queryParams);
      getFee(filter).then(response => {
        if(response.result){
          this.loading = false;
          this.dataTable = response.data.rows;
          this.totalCount = response.data.total;
        }else{
          this.loading = false;
          this.$message.error(response.msg);
        }
      });
    },
    //新增弹出框
    showAddDialog(){
      this.addForm.bsName = "";
      this.addForm.bsMeasureType = "";
      this.addForm.bsMeasureUnit = "";
      this.addForm.bsRemark = "";
      this.dialog.addVisible = true;
    },
    //编辑弹出框
    showEditDialog(row){
      this.editForm.id = row.id;
      this.editForm.bsCode = row.bsCode;
      this.editForm.bsName = row.bsName;
      this.editForm.bsMeasureType = row.bsMeasureType;
      this.editForm.bsMeasureUnit = row.bsMeasureUnit;
      this.editForm.bsRemark = row.bsRemark;
      this.dialogEdit.editVisible = true;
    },
    addBtn() {
      let filter=Object.assign({},this.addForm);
      this.$refs['dialog.keyruleForm'].validate((valid) => {
        if (valid) {
          addFee(filter).then(response => {                     
            if(response.result) {
              this.$message.success(response.msg);
              this.dialog.addVisible=false;
              this.getData();
            }else {
              this.$message.error(response.msg);
            }
          });
        }
      });
    },
    editBtn() {
      let filter=Object.assign({},this.editForm);
      this.$refs['dialogEdit.keyruleForm'].validate((valid) => {
        if (valid) {
          editFee(filter).then(response => {                     
            if(response.result) {
              this.$message.success(response.msg);
              this.dialogEdit.editVisible=false;
              this.getData();
            }else {
              this.$message.error(response.msg);
            }
          });
        }
      });
    },
    //删除计费方式
    delData(row){
      let id=row.id
      delFee(id).then(response=>{
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
    changePage(page) {
      this.queryParams.page = page;
      this.getData();
    },
    sizeChange(size) {
      this.queryParams.rows = size;
      this.getData();
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
