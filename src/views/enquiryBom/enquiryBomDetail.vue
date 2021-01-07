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
                <el-button type="primary" size="mini"  @click="getData">查找</el-button>
                <el-button type="info" size="mini"  @click="resetFrom">重置</el-button>
                <el-button type="success" size="mini"  @click="showSupplier">设置供应商</el-button>
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
        :data="detailList"
        tooltip-effect="dark"
        style="width: 100%" 
        highlight-current-row v-loading="loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="45">
        </el-table-column>
        <el-table-column label="序号" type="index" width="50">
        </el-table-column>
        <el-table-column prop="bsStatus" label="状态" align="center" width="80" show-overflow-tooltip>
          <template scope="scope">
            <el-tag :type="statusFilter(scope.row.bsStatus)">{{ formatStata(scope.row.bsStatus)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="bsModel" label="规格" show-overflow-tooltip width="200">
        </el-table-column>
        <el-table-column prop="bsName" label="名称" show-overflow-tooltip width="100">
        </el-table-column>
        <el-table-column prop="bsCategory" label="类别" show-overflow-tooltip width="100">
        </el-table-column>
        <el-table-column prop="bsQty" label="数量" show-overflow-tooltip width="50">
        </el-table-column>
        <el-table-column prop="bsPackage" label="封装" show-overflow-tooltip width="100">
        </el-table-column>
        <el-table-column prop="bsCusName" label="品牌名称" show-overflow-tooltip width="100">
        </el-table-column>
        <el-table-column prop="bsCusCode" label="品牌料号" show-overflow-tooltip width="150">
        </el-table-column>
        <el-table-column prop="bsPlaceNum" label="位号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="bsBomNum" label="套数" show-overflow-tooltip width="50">
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
            <template scope="scope">
              <messagebox @callConfirm="doDelete(scope.row)" title="提示" contents="此操作将永久删除该行, 是否继续?" confirmTitle="确认删除">
              </messagebox> 
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

    <!--设置供应商-->
    <el-dialog title="设置供应商" :visible.sync="dialog.suppVisible" width="1000px">
      <div>
        <el-form :inline="true" :model="dialog" class="demo-form-inline">
          <el-form-item label="关键字">
            <el-input v-model="dialog.keyword" placeholder="关键字"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getSuppData">查找</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table border :data="suppList" tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="suppCode" label="供应商编号" show-overflow-tooltip />
        <el-table-column prop="suppChineseName" label="中文名称" show-overflow-tooltip />
        <el-table-column prop="suppK3Code" label="K3编码" show-overflow-tooltip />
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <el-button type="primary" @click="chooseSupp(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          class="pull-right clearfix"
          @current-change="suppChangePage"
          @size-change="suppSizeChange"
          :current="1"
          :current-page.sync="suppParams.page"
          :page-sizes="suppPSList"
          :page-size="suppParams.rows"
          layout="total, sizes, prev, pager, next, jumper"
          :page-size-opts="suppPSList"
          :total="suppTotal">
        </el-pagination>
    </div>
    <el-table border :data="suppSelectedList" tooltip-effect="dark" style="width: 100%">
      <el-table-column prop="suppCode" label="供应商编号" show-overflow-tooltip />
      <el-table-column prop="suppChineseName" label="中文名称" show-overflow-tooltip />
      <el-table-column prop="suppK3Code" label="K3编码" show-overflow-tooltip />
      <el-table-column label="操作" width="140">
        <template slot-scope="scope">
          <el-button type="danger" @click="deleteSupp(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="suppFooter">
      <el-button type="primary" @click="dialog.suppVisible = false">关闭</el-button>
      <el-button type="primary" @click="setSupplier">确认</el-button>
    </div>
    </el-dialog>
  </div>

</template>
<script>
import { getDetailInfo,delEnquiry,setSupp,delDetail } from "@/api/enquiryBom";
import { getSupplierList } from "@/api/supplier";
import messagebox from "@/components/Dialog/MessageBox.vue";
export default {
  name: "enquiryBomDetail",
  components: {
    messagebox
  },
  data() {
    return {
      eqBomId:this.$route.query.eqBomId,
      loading:true,
      current: 0,
      open: true,
      items: [
        { sort: "全部"},    
        { sort: "未设置"}, 
        { sort: "已设置"},        
      ],
      detailList: [{}],
      queryParams: {
        page: 1,
        rows: 15,
        pkParent: -1,
        bsStatus:0,
        keyword:''
      },
      pageSizesList: [15, 20, 30, 40, 50, 100],
      totalCount: 0, //数据的总条数,
      // el-tag类型转换
      statusFilter(status) {
        const statusMap = {
          1: "danger",
          2: "success"
        };
        return statusMap[status];
      },
      // 状态显示转换
      formatStata(status) {
        const statusMap = {
          1: "未设置",
          2: "已设置"  
        };
        return statusMap[status];
      },
      dialog: {        
        suppVisible: false,
        keyword: ''
      },
      suppList: [],
      suppSelectedList: [],
      suppParams: {
        page: 1,
        rows: 5
      },
      suppPSList: [5, 10, 20, 30],
      suppTotal: 0, //数据的总条数,
      multipleSelection:[],
    };
  },
  created() {
    this.getData();
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
    getData() {
      let filter=Object.assign({},this.queryParams,{"bsEqBomId":this.eqBomId});
      this.loading = true;
      //获取BOM-询价列表详情
      getDetailInfo(filter).then(response => {
        this.loading = false;
        if (response.result) {          
          this.detailList = response.data.rows;
          this.totalCount = response.data.total;          
        } else {
          this.$message.error(response.msg);
        }
      });
    },
    //重置
    resetFrom(){
      this.queryParams.keyword = '';
    },
    //删除
    doDelete(row) {
      let id = row.id;
      delDetail(id).then(response => {
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
    changePage(page) {
      this.queryParams.page = page;
      this.getData();
    },
    sizeChange(size) {
      this.queryParams.rows = size;
      this.getData();
    },
    //获取合格供应商信息
    getSuppData() {
      let filter=Object.assign({},this.suppParams,{keyword:this.dialog.keyword, suppGrade:2});
      getSupplierList(filter).then(response => {
        if (response.result) {          
          this.suppList = response.data.rows;
          this.suppTotal = response.data.total;          
        } else {
          this.$message.error(response.msg);
        }
      });
    },
    //显示供应商选择框
    showSupplier() {
      if(this.multipleSelection.length>0){
        this.dialog.suppVisible = true;
        this.getSuppData();
      }else{
        this.$message.error("请选择要操作的行");
      }
    },
    //设置供应商
    setSupplier() {
      //获取中间表ID
      var eqBomId = this.eqBomId;
      //获取详情表ID
      var detailIds = '';
      for(var i=0; i<this.multipleSelection.length; i++){
        detailIds += this.multipleSelection[i].id + ','
      }
      detailIds = detailIds.substring(0, detailIds.lastIndexOf(','));
      //获取供应商ID
      var suppIds = '';
      for(var i=0; i<this.suppSelectedList.length; i++){
        suppIds += this.suppSelectedList[i].id + ','
      }
      suppIds = suppIds.substring(0, suppIds.lastIndexOf(','));

      //设置
      setSupp(eqBomId, detailIds, suppIds).then(response => {
        if (response.result) {
          this.getData();
          this.dialog.suppVisible = false;
          this.$message.info(response.msg); 
        } else {
          this.$message.error(response.msg);
        }
      });
    },
    chooseSupp(row) {
      this.suppSelectedList.push(row);
    },
    deleteSupp(index) {
      this.suppSelectedList.splice(index,1);
    },
    suppChangePage(page) {
      this.suppParams.page = page;
      this.getSuppData();
    },
    suppSizeChange(size) {
      this.suppParams.rows = size;
      this.getSuppData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
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
  padding: 0 0 0 10px;
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
.suppFooter{
  box-sizing: border-box;
  background: #fff;
  text-align: center;
  max-width: 1000px;
  display: table-cell;
  vertical-align: middle;
  width: 1000px;
  height: 50px;
}
</style>