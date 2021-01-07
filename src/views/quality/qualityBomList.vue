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
              <el-button type="primary" v-if="permit.SEARCH"  @click="handleSubmit('formQuery')">查找</el-button>
              <upload-excel-component v-if="permit.UPLOAD" style="display: inline-block;"v-on:afterUpload="afterUpload">
              </upload-excel-component>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>

    <!--列表-->
    <template>
      <el-table border ref="main_table" :data="dataTable" tooltip-effect="dark" style="width: 100%" highlight-current-row @select="select" @selection-change="handleSelectionChange" v-loading="loading" element-loading-text="数据加载中，请稍等">
        <el-table-column type="selection" width="45" />
        <el-table-column prop="createdTime" label="创建时间" width="150" show-overflow-tooltip />
        <el-table-column prop="fileName" label="BOM文件名称" show-overflow-tooltip />
        <el-table-column prop="bomCode" label="BOM编号" show-overflow-tooltip />
        <el-table-column prop="modifiedName" label="操作人" width="80" show-overflow-tooltip />
        <el-table-column prop="remark" label="备注" width="150 " show-overflow-tooltip />
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button icon="el-icon-search" size="mini" @click="viewBox(scope.row,'view')" circle title="详情"></el-button>
            <MessageBoxDelete v-if="permit.DELETE" 
              @callConfirm="doDelete(scope.row)"
              title="提示"
              contents="此操作将永久删除该行, 是否继续?"
              confirmTitle="确认删除">
            </MessageBoxDelete>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div class="block">
      <el-pagination class="pull-right clearfix" @current-change="changePage" @size-change="sizeChange" :current="1" :current-page.sync="queryParams.page" :page-sizes="pageSizesList" :page-size="queryParams.rows" layout="total, sizes, prev, pager, next, jumper" :page-size-opts="pageSizesList" :total="totalCount">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getBomList,delBom } from '@/api/quality'
import UploadExcelComponent from "./components/UploadExcel.vue";
import MessageBoxDelete from "@/components/Dialog/MessageBox.vue";
import {getPermByRouterCode} from '@/api/perm'
export default {
  name:'enquiryReport',
  components: {
    MessageBoxDelete,
    UploadExcelComponent
  },
  data() {
    return {
      loading: false,
      rolesDate: [],
      checkedRolesDate: [],
      value4: [],
      formQuery: {
        keyword: ''
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
    getPermit(){
      var routerCode = this.$route.name;
      getPermByRouterCode(routerCode).then(response => {
        if(response.result){
          if(response.data == "admin"){
            this.permit.SEARCH = true;
            this.permit.UPLOAD = true;
            this.permit.EDIT = true;
            this.permit.DELETE = true;
          }else{
            var list = response.data;
            for(var i = 0; i < list.length; i++){
              if(list[i].permCode == "SEARCH") this.permit.SEARCH = true;
              if(list[i].permCode == "UPLOAD") this.permit.UPLOAD = true;
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
      this.loading = true
      let suppGrade = 2;
      getBomList(this.formQuery.keyword, this.queryParams.rows, this.queryParams.page).then(response => {
        this.loading = false
        if (!response.result) {
          this.$Message.error(response.msg);
          return
        }
        this.dataTable = response.data.rows;
        this.totalCount = response.data.total;
      })
    },
    /*编辑*/
    viewBox(row, type) {
      //console.log(row);
      this.$router.push({ path: 'qualityBomDetail', query: { fileId: row.fileId,type:type } });
    },
    handleSelectionChange(val) {
      this.currentRow = val
    },
    select(selection, row) {
      if (selection.length > 1) {
        selection.shift()
      }
    },          
    changePage(page) {
      this.queryParams.page = page;
      this.getData();
    },
    sizeChange(size) {
      this.queryParams.rows = size;
      this.getData();
    },
    afterUpload(fileId) {
      //获取该文件的fid
      this.fileId = fileId;     
      this.getData();
    },
    //删除
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
