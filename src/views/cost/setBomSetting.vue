<template>
  <div>
    <el-card style="padding-bottom: 0;border:none;">
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="formQuery" class="demo-form-inline">
            <el-form-item label="关键字">
              <el-input v-model="formQuery.keyword" placeholder="关键字"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button v-if="permit.SEARCH" type="primary"  @click="handleSubmit">查找</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>

    <template>
      <el-table  border ref="main_table" :data="dataTable" tooltip-effect="dark" style="width: 100%" highlight-current-row v-loading="loading" element-loading-text="数据加载中，请稍等">
        <el-table-column type="index" width="45" />
        <el-table-column prop="code" label="编码" show-overflow-tooltip />
        <el-table-column prop="value" label="值" show-overflow-tooltip />
        <el-table-column prop="createdTime" label="创建时间" width="150" show-overflow-tooltip />
        <el-table-column prop="remark" label="备注" show-overflow-tooltip />
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <el-button v-if="permit.EDIT" type="primary" size="mini" @click="showEditDialog(scope.row)" icon="el-icon-edit" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div class="block">
      <el-pagination class="pull-right clearfix" @current-change="changePage" @size-change="SizeChange" :current="1" :current-page.sync="queryParams.page" :page-sizes="pageSizesList" :page-size="queryParams.rows" layout="total, sizes, prev, pager, next, jumper" :page-size-opts="pageSizesList" :total="totalCount">
      </el-pagination>
    </div>

    <!--编辑页 start--> 
    <el-dialog title="编辑模板" :visible.sync="dialog.settingVisibleEdit" width="500px">
      <el-form :inline="true" :model="editForm">
        <el-form-item 
          label="id" 
          prop="id"
          style="display: none">
          <el-input v-model="editForm.id"></el-input>
        </el-form-item>
        <el-form-item
          label="编码"         
          prop="code">
          <el-input style="width:300px;" v-model="editForm.code" disabled></el-input>
        </el-form-item>
        <el-form-item
          label="数值"         
          prop="value">
          <el-input style="width:300px;" v-model="editForm.value"></el-input>
        </el-form-item>
        <el-form-item
          label="备注"         
          prop="value">
          <el-input style="width:300px;" v-model="editForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.settingVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="doEdit">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑页 end-->

  </div>
</template>
<script>
import { getList,editSetting } from '@/api/setting';
import {getPermByRouterCode} from '@/api/perm'
export default {
  name:'setBomSetting',
  components: {
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
      editForm:{
        id: 0,
        code: "",
        value: "",
        remark: ""
      },
      dialog: {        
        settingVisibleEdit: false
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
            this.permit.EDIT = true;
          }else{
            var list = response.data;
            for(var i = 0; i < list.length; i++){
              if(list[i].permCode == "SEARCH") this.permit.SEARCH = true;
              if(list[i].permCode == "EDIT") this.permit.EDIT = true;
            }
          }
        }else{
          this.$message.error(res.msg);
        }
      });
    },
    getData() {
      this.loading = true;
      let filter=Object.assign({},{"code":"customer_sort_plan"},this.queryParams);
      getList(filter).then(response => {
        if(response.result){
          this.loading = false;
          this.dataTable = response.data;
          //this.totalCount = response.data.total;
        }else{
          this.loading = false;
          this.$message.error(response.msg);
        }
      });
    },
    //编辑上传文件弹出框
    showEditDialog(row){
      this.editForm.id = row.id;
      this.editForm.code = row.code;
      this.editForm.value = row.value;
      this.editForm.remark = row.remark;
      this.dialog.settingVisibleEdit = true;
    },          
    cancel() {
      this.dialog.settingVisibleEdit = false;
    },
    doEdit() {
      let filter=Object.assign({},{"id":this.editForm.id,"value":this.editForm.value,"remark":this.editForm.remark});
      editSetting(filter).then(response => {
        if(response.result){
          this.dialog.settingVisibleEdit = false;
          this.$message.info(response.msg);
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
    SizeChange(size) {
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
