<template>
  <el-row>
    <el-col :span="24">
      <div v-loading="loading" element-loading-text="数据加载中，请稍等">
        <div class="retrieval">
          <div class="title">
            <h3>状态</h3>
            <div class="filter">
              <ul>
                <li v-for="(item,index) in items" :key="index" @click="addClass(index)"
                  v-bind:class="{ current:index==current}">
                  <a @click="changeStatus(index)"><span>{{item.sort}}</span></a>
                </li>
              </ul>
            </div>
            <span class="more" @click="open=!open"></span>
          </div>
          <div class="searchDiv" v-show="open">
            <el-form :inline="true" :model="formQuery" class="demo-form-inline">
              <el-form-item label="关键字">
                <el-input v-model="formQuery.keyword" placeholder="关键字"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="info" @click="resetFrom">重置</el-button>
                <el-button v-if="permit.SEARCH" type="primary" size="mini" @click="handleSubmit('formQuery')">查找</el-button>
                <!-- 上传 start-->
                <el-button v-if="permit.UPLOAD" type="primary" @click="addDocBefore">上传文件
                  <input ref="doc-upload-input" class="doc-upload-input" type="file" @change="addDoc" />
                </el-button>
                <!-- 上传 end-->
                <el-button v-if="permit.PASS" type="success" @click="approval(2)">审核通过</el-button>
                <el-button v-if="permit.PASS" type="danger" @click="approval(3)">审核不通过</el-button>
                <el-button v-if="permit.PASS" type="warning" @click="reject()">驳回</el-button>  
              </el-form-item>
            </el-form>
          </div>
        </div>

        <!--物料表-->
        <template>
          <el-table
            ref="fileTable"
            :data="fileTable"
            tooltip-effect="dark"
            style="width: 100%"
            highlight-current-row
            border
            @select="select" 
            @selection-change="handleSelectionChange"
            :header-cell-class-name="cellClass">
            <el-table-column type="selection" width="45" disable="true">
            </el-table-column>
            <el-table-column prop="bsStatus" label="审核状态" align="center" width="100" show-overflow-tooltip>
              <template slot-scope="scope">
              <el-tag :type="statusFilter(scope.row.bsStatus)">{{ formatStata(scope.row.bsStatus)}}</el-tag>
          </template>
            </el-table-column>
            <el-table-column prop="mateK3Code" label="K3物料号" width="130" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="fileName" label="文件名称" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="modifiedName" label="操作人" width="100" align="center"show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="createdTime" label="创建时间" width="150" align="center"show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="操作" width="100" fixed="right">
              <template slot-scope="scope">
                <!-- 重新上传 start-->
                  <!-- <input ref="doc-upload-input2" class="doc-upload-input2" type="file" @change="editDoc" />
                  <el-button type="primary" icon="el-icon-upload2" size="mini" @click="editDocBefore(scope.row.id)" title="重新上传" circle></el-button> -->
                  <!-- 重新上传 end-->
                <el-button v-if="permit.DOWNLOAD" type="primary" icon="el-icon-download" size="mini" @click="downloadDoc(scope.row.fileId)" title="下载" circle></el-button>
                <MessageBox v-if="permit.DELETE" @callConfirm="doDelete(scope.row)" title="提示" contents="此操作将永久删除该行, 是否继续?" confirmTitle="确认删除"></MessageBox>
              </template>
            </el-table-column>
          </el-table>
        </template>
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
    </el-col>
  </el-row>
</template>

<script>
import {addFile,editFile,delFile,getFileList,doApproval,doBack} from "@/api/qualityFile";
import {getPermByRouterCode} from '@/api/perm'
import MessageBox from "@/components/Dialog/MessageBox.vue";
export default {
  name: "qualityFileList",
  components: {
    MessageBox
  },
  data() {
    return {
      mateId: this.$route.query.mateId,
      current: 0,
      open: true,
      isReadOnly: true,
      isdisabled: true,
      dialog: {
        loading: false,
        dialogVisible: false
      },
      multipleSelection: [],
      formLabelWidth: "100px",
      formQuery: {
        keyword: "",
        bsStatus: 0,
      },
      currentRow: [],
      currentId: "",
      fileTable: [{}],
      queryParams: {
        page: 1,
        rows: 10,
        pkParent: -1
      },
      pageSizesList: [10, 20, 30, 40, 50, 100],
      totalCount: 0, //数据的总条数,
      loading: false,
      permit:{
        //权限控制
        SEARCH:false,
        UPLOAD:false,
        DELETE:false,
        DOWNLOAD:false,
        PASS:false
      },
      items: [
        { sort: "全部"}, 
        { sort: "待审核"},
        { sort: "审核通过"},
        { sort: "审核不通过"},   
      ],
      // el-tag类型转换
      statusFilter(status) {
        const statusMap = {
          1: "primary",
          2: "success",
          3: "danger"
        };
        return statusMap[status];
      },
      // 状态显示转换
      formatStata(status) {
        const statusMap = {
          1: "待审核",
          2: "审核通过",
          3: "审核不通过"
        };
        return statusMap[status];
      },
    };
  },
  created() {
    this.getData();
    this.getPermit();
  },
  mounted() {
    //this.$refs.tree.setCheckedKeys([1]); //预先选中id为1的节点;
  },
  methods: {
    //单击添加选中项样式
    addClass: function(index) {
      this.current = index;
    },
    changeStatus(index){
      this.formQuery.bsStatus = index;
      this.getData();
    },
    handleSubmit(name) {
      this.getData();
    },
    getPermit(){
      var routerCode = this.$route.name;
      getPermByRouterCode(routerCode).then(response => {
        if(response.result){
          if(response.data == "admin"){
            this.permit.SEARCH = true;
            this.permit.UPLOAD = true;
            this.permit.DELETE = true;
            this.permit.DOWNLOAD = true;
            this.permit.PASS = true;
          }else{
            var list = response.data;
            for(var i = 0; i < list.length; i++){
              if(list[i].permCode == "SEARCH") this.permit.SEARCH = true;
              if(list[i].permCode == "UPLOAD") this.permit.ADD = true;
              if(list[i].permCode == "DELETE") this.permit.DELETE = true;
              if(list[i].permCode == "DOWNLOAD") this.permit.DOWNLOAD = true;
              if(list[i].permCode == "PASS") this.permit.PASS = true;
            }
          }
        }else{
          this.$message.error(response.msg);
        }
      });
    },
    getData() {
      this.loading = true;
      getFileList(this.formQuery.keyword, this.formQuery.bsStatus, this.$route.query.mateId, this.queryParams.rows, this.queryParams.page).then(response => {
        if (response.result) {
          this.fileTable = response.data.rows;
          this.totalCount = response.data.total;
          this.loading = false;
        }else{
          this.$message.error(response.msg);
          return
        }
      });
    },
    //查看质量文件
    viewFile(row) {
      //this.$router.push({ path: 'qualityBomDetail', query: { fileId: row.fileId } });
    },
    //隐藏全选勾选框
    cellClass(row) {
      if(row.columnIndex === 0){
        return 'disabledSelection';
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if(val.length > 0){
        this.currentRow = val[val.length-1];
      }else{
        this.currentRow = [];
      }   
    },
    select(selection, row){
      if(selection.length > 1){
        selection.shift();
        this.multipleSelection = selection;
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
    //上传
    addDoc(e) {
      //获取上传的文件
      const files = e.target.files;
      const rawFile = files[0];
      if(rawFile != null && rawFile != undefined){
        //封装数据
        let formData = new FormData();
        formData.append('file', rawFile);
        formData.append('mateId', this.mateId);
        addFile(formData).then(response => {
          if(response.result){
            this.$message.info(response.msg);
            this.getData();
          }else{
            this.$message.error(response.msg);
          }
        });
      }
    },
    addDocBefore() {
      this.$refs['doc-upload-input'].click();
    },
    //重新上传
    editDoc(e) {
      //获取上传的文件
      const files = e.target.files;
      const rawFile = files[0];
      //封装数据
      let formData = new FormData();
      formData.append('file', rawFile);
      formData.append('id', this.currentId);
      editFile(formData).then(response => {
        if(response.result){
          this.$message.info(response.msg);
          this.currentId = "";
          this.getData();
        }else{
          this.$message.error(response.msg);
          this.currentId = "";
        }
      });
    },
    editDocBefore(id) {
      this.currentId = id;
      this.$refs['doc-upload-input2'].click();
    },
    //下载文件
    downloadDoc(fileId) {
      window.location.href = process.env.BASE_API + "/file/get?fsFileId=" + fileId;
    },
    //删除
    doDelete(row) {
      let id = row.id;
      delFile(id).then(response => {
        if (response.result) {
          this.$message({
            message: response.msg,
            type: "success"
          });
          this.getData();
        } else {
          this.$message.error(response.msg);
        }
      });
    },
    //审核
    approval(bsStatus){
      if(this.multipleSelection.length == 1){
        let filter=Object.assign({},{"id":this.currentRow.id,"bsStatus":bsStatus});
        doApproval(filter).then(response => {
          if(response.result){
            this.$message.info(response.msg);
            this.getData();
          }else{
            this.$message.error(response.msg);
          }
        });
      }else if(this.multipleSelection.length == 0){
        this.$message.error("请选择选择质量文件！");
      }else{
        this.$message.error("只能选择一个质量文件！");
      }
    },
    reject() {
      if(this.multipleSelection.length == 1){
        let filter=Object.assign({},{"id":this.currentRow.id});
        doBack(filter).then(response => {
          if(response.result){
            this.$message.info(response.msg);
            this.getData();
          }else{
            this.$message.error(response.msg);
          }
        });
      }else if(this.multipleSelection.length == 0){
        this.$message.error("请选择选择质量文件！");
      }else{
        this.$message.error("只能选择一个质量文件！");
      }
    },
    //重置
    resetFrom(){
      this.formQuery.keyword = '';
    },

  }
};
</script>
<style>
  .block {
    text-align: right;
    margin-top: 10px;
  }
  .doc-upload-input{
    display: none;
    z-index: -9999;
  }
  .doc-upload-input2{
    display: none;
    z-index: -9999;
  }
  /*搜索框部分*/
  .retrieval {
    margin: 0;
    padding: 0;
    clear: both;
    overflow: hidden;
  }
  .retrieval .searchDiv{margin-left:20px;}
  .title {
    margin: 0 0 10px 0;
    padding: 3px 10px 0 0;
    background: #ededed;
    clear: both;
    overflow: hidden;
    height: 30px;
    line-height: 30px;
  }
  .title h3 {
    float: left;
    margin: 0;
    padding: 0 0 0 20px;
    font: 12px/24px "宋体", Arial, Tahoma, sans-serif;
    color: #fff;
    background: url(../../assets/img/title-bg.gif) no-repeat left top scroll;
    height: 24px;
    width: 80px;
  }
  
  .title .filter {
    float: left;
    display: inline;
    margin: 0 0 0 15px;
    padding: 2px 0;
  }
  .title .filter ul {
    float: left;
    display: inline;
    margin: 0;
    padding: 0;
  }
  .title .filter ul li {
    float: left;
    display: inline;
    margin: 0 5px 0 0;
    padding: 0;
    height: 20px;
    vertical-align: middle;
    color: #333;
    font: 12px/20px Arial, Helvetica, sans-serif;
  }
  .title .filter ul li a {
    color: #333;
    text-decoration: none;
    padding: 0 10px 0 0;
    float: left;
  }
  .title .filter ul li.current a {
    float: left;
    padding: 0 10px 0 0;
    background: #050f36;
    text-decoration: none;
    color: #fff;
    text-decoration: none;
  }
  .title .filter ul li.current a span {
    float: left;
    background: #050f36;
    text-decoration: none;
    color: #fff;
    text-decoration: none;
  }
  
  .title .filter ul li a span {
    float: left;
    display: inline;
    padding: 0 0 0 10px;
    margin: 0;
    color: #333;
    font: 12px/20px Arial, Helvetica, sans-serif;
  }
  
  .title span.more {
    float: right;
    margin: 3px 0 0 0;
    padding: 0;
    background: url(../../assets/img/retrieve-btn.gif) no-repeat left top scroll;
    width: 61px;
    height: 18px;
    cursor: pointer;
  }

  /*隐藏全选勾选框*/
  .el-table /deep/.disabledSelection .cell .el-checkbox__inner{
    display: none;
    position: relative;
  }
  /*隐藏全选勾选框，并用文字代替*/
  .el-table /deep/.disabledSelection .cell:before{
    content: "选择";
    position: absolute;
    right: 11px;
  }

</style>
