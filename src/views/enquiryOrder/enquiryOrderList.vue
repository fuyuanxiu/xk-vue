<template>
  <div>
    <!--搜索框-->
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
        <el-form
          :model="queryParams"
          ref="form"         
          class="formStly"
          size="small"
          :inline="true">
          <el-row type="flex" class="row-bg">
            <el-col :span="24">
              <el-form-item label="关键字" prop="keyword">
                <el-input v-model="queryParams.keyword"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button v-if="permit.SEARCH" type="primary" size="mini"  @click="getData">查找</el-button>
                <el-button type="info" size="mini"  @click="resetFrom">重置</el-button>
                <messagebox v-if="permit.PASS" @callConfirm="approval" title="提示" contents="此操作将审核通过此清单, 是否继续?" confirmTitle="确认审核通过">
                </messagebox>
                <messageInvalidBox v-if="permit.FORBID" @callConfirm="invalid" title="提示" contents="此操作将作废此清单, 是否继续?" confirmTitle="确认作废">
                </messageInvalidBox>
              </el-form-item>
            </el-col>           
          </el-row>
        </el-form>
      </div>
    </div>
    <!--表格-->
    <template>
      <el-table
        ref="multipleTable"
        border
        :data="enquiryOrderList"
        tooltip-effect="dark"
        style="width: 100%" 
        highlight-current-row v-loading="loading" 
        @select="select" 
        @selection-change="handleSelectionChange"
        :header-cell-class-name="cellClass">
        <el-table-column type="selection" width="45" disable="true">
        </el-table-column>
        <el-table-column label="序号" type="index" width="50">
        </el-table-column>
        <el-table-column prop="bsFileName" label="文件名称" show-overflow-tooltip width="170">
        </el-table-column>
        <el-table-column prop="bsFileCode" label="文件编号" show-overflow-tooltip width="170">
        </el-table-column>
        <el-table-column prop="bsType" label="类型" align="center" width="100" show-overflow-tooltip>
          <template scope="scope">
            <el-tag :type="statusFilter(scope.row.bsType)">{{ formatStatus(scope.row.bsType)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="bsStatus" label="状态" align="center" width="100" show-overflow-tooltip>
          <template scope="scope">
            <el-tag :type="statusFilter_1(scope.row.bsStatus)">{{ formatStatus_1(scope.row.bsStatus)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="bsCompleteNum" label="完成数" show-overflow-tooltip width="60">
        </el-table-column>
        <el-table-column prop="bsNum" label="总数" show-overflow-tooltip width="50">
        </el-table-column>
        <el-table-column prop="createdTime" label="创建时间" show-overflow-tooltip width="150">
        </el-table-column>
        <el-table-column prop="bsModifiedName" label="操作人" show-overflow-tooltip width="80">
        </el-table-column>
        <el-table-column prop="bsRemark" label="备注" show-overflow-tooltip width="100">
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template scope="scope">  
            <el-button v-if="permit.EDIT" title="编辑" type="primary" icon="el-icon-edit" size="mini" @click="viewDetail(scope.row)" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!--分页-->
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
  </div>
</template>
<script>
import { getlist,doApproval,doInvalid } from "@/api/enquiryOrder";
import {getPermByRouterCode} from '@/api/perm'
import messagebox from "@/views/enquiryOrder/components/messagebox.vue";
import messageInvalidBox from "@/views/enquiryOrder/components/messageInvalidBox.vue";
export default {
  name: "enquiryOrderList",
  components: {
    messagebox,
    messageInvalidBox
  },
  data() {
    return {
      loading: false,
      current: 0,
      open: true,
      items: [
        { sort: "全部"}, 
        // { sort: "BOM"},
        // { sort: "询价模板文件"},        
      ],
      enquiryOrderList: [],
      currentRow: [],
      multipleSelection: [],
      queryParams: {
        page: 1,
        rows: 15,
        bsType: 0,
        keyword: ''
      },
      pageSizesList: [15, 20, 30, 40, 50, 100],
      totalCount: 0, //数据的总条数,
      // el-tag类型转换
      statusFilter(status) {
        const statusMap = {
          1: "success",
          2: "warinng"
        };
        return statusMap[status];
      },
      // 清单类型显示转换
      formatStatus(status) {
        const statusMap = {
          1: "BOM",
          2: "询价模板文件"
        };
        return statusMap[status];
      },
      // el-tag类型转换_1
      statusFilter_1(status) {
        const statusMap = {
          1: "primary",
          2: "success",
          3: "danger",
        };
        return statusMap[status];
      },
      // 清单类型显示转换_1
      formatStatus_1(status) {
        const statusMap = {
          1: "进行中",
          2: "审核完成",
          3: "作废"
        };
        return statusMap[status];
      },
      permit:{
        //权限控制
        SEARCH:false,
        EDIT:false,
        PASS:false,
        FORBID:false
      },
    };
  },
  created() {
    this.getData();
    this.getPermit();
  },
  methods: {
    //单击添加选中项样式
    addClass: function(index) {
      this.current = index;
    },
    changeStatus(index){
      this.queryParams.bsStatus = index;
      this.getData();
    },
    getPermit(){
      var routerCode = this.$route.name;
      getPermByRouterCode(routerCode).then(response => {
        if(response.result){
          if(response.data == "admin"){
            this.permit.SEARCH = true;
            this.permit.EDIT = true;
            this.permit.PASS = true;
            this.permit.FORBID = true;
          }else{
            var list = response.data;
            for(var i = 0; i < list.length; i++){
              if(list[i].permCode == "SEARCH") this.permit.SEARCH = true;
              if(list[i].permCode == "EDIT") this.permit.EDIT = true;
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
      let filter=Object.assign({},this.queryParams)
      this.loading = true;
      //获取BOM-询价列表
      getlist(filter).then(response => {
        this.loading = false;
        if (response.result) {          
          this.enquiryOrderList = response.data.rows;
          this.totalCount = response.data.total;          
        } else {
          this.$message.error(response.msg);
        }
      });
    },
    handleSelectionChange(val){
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
    //审核通过
    approval() {
      if(this.multipleSelection.length == 1){
        let filter=Object.assign({},{"bsOrderId":this.currentRow.id});
        doApproval(filter).then(response => {
          if(response.result){
            this.$message.info(response.msg);
            this.getData();
          }else{
            this.$message.error(response.msg);
          }
        });
      }else if(this.multipleSelection.length == 0){
        this.$message.error("请选择选择清单！");
      }else{
        this.$message.error("只能选择一个清单！");
      }
    },
    //作废
    invalid() {
      if(this.multipleSelection.length == 1){
        let filter=Object.assign({},{"bsOrderId":this.currentRow.id});
        doInvalid(filter).then(response => {
          if(response.result){
            this.$message.info(response.msg);
            this.getData();
          }else{
            this.$message.error(response.msg);
          }
        });
      }else if(this.multipleSelection.length == 0){
        this.$message.error("请选择选择清单！");
      }else{
        this.$message.error("只能选择一个清单！");
      }
    },
    //隐藏全选勾选框
    cellClass(row) {
      if(row.columnIndex === 0){
        return 'disabledSelection';
      }
    },
    //重置
    resetFrom(){
      this.queryParams.keyword = '';
    },
    //查看详情
    viewDetail(row) {
      this.$router.push({path:'enquiryOrderDetail',query:{bsOrderId:row.id}});
    },
    changePage(page) {
      this.queryParams.page = page;
      this.getData();
    },
    sizeChange(size) {
      this.queryParams.rows = size;
      this.getData();
    }
  }
};
</script>
<style>
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
.block {
  text-align: right;
  margin-top: 10px;
}
.detail-table {
  margin: 7px 0 0 0;
  padding: 0 0 10px 0;
  clear: both;
  overflow: hidden;
}
.s-ul {
  margin: 0 0 10px 0;
  padding: 0;
  clear: both;
  overflow: hidden;
  width: 100%;
}

.formStly .el-input--small .el-input__inner {
  height: 27px;
  line-height: 27px;
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