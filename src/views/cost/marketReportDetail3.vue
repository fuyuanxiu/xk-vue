<!-- 工时-报价单 -->
<template>
  <div element-loading-text="数据加载中，请稍等">
    <el-card style="padding-bottom: 0;border:none;">
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="queryParams" class="demo-form-inline">
            <el-form-item label="关键字">
              <el-input v-model="queryParams.keyword" placeholder="关键字"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="info" @click="resetFrom">重置</el-button>
              <el-button type="primary" @click="handleSubmit('queryParams')">查找</el-button>
              <el-button type="primary" @click="downloadDoc()">导出</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
   
    <el-table :data="iTable">
      <el-table-column type="index" label="序号" width="50" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="bsMachine" label="机型" show-overflow-tooltip width="80">
        <template scope="scope">
          <span>{{ scope.row.marketReport ? scope.row.marketReport.bsMachine : "" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bsProcess" label="项目" width="120" show-overflow-tooltip>
        <template scope="scope">
          <span>{{ getProcessName(scope.row) ? getProcessName(scope.row) : "" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bsFee" label="规格" width="100">
        <template scope="scope">
          <span>{{ getFeeName(scope.row) ? getFeeName(scope.row) : "" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bsQty" label="数量" width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="bsUnit" label="单位" minWidth="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="price1" label="单价1" width="80" show-overflow-tooltip>
        <template scope="scope">
          <span>{{ returnFloat_2(scope.row.price1) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="price1Total" label="金额1" width="80" show-overflow-tooltip>
        <template scope="scope">
          <span>{{ returnFloat_2(scope.row.price1Total) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="price2" label="单价2" width="80" show-overflow-tooltip>
        <template scope="scope">
          <span>{{ returnFloat_2(scope.row.price2) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="price2Total" label="金额2" width="80" show-overflow-tooltip>
        <template scope="scope">
          <span>{{ returnFloat_2(scope.row.price2Total) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="price3" label="单价3" width="80" show-overflow-tooltip>
        <template scope="scope">
          <span>{{ returnFloat_2(scope.row.price3) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="price3Total" label="金额3" width="80" show-overflow-tooltip>
        <template scope="scope">
          <span>{{ returnFloat_2(scope.row.price3Total) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bsRemark" label="备注" width="150" show-overflow-tooltip>
      </el-table-column>
    </el-table>
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
import messagebox from "@/components/Dialog/MessageBox.vue";
import { getPermission } from '@/api/role';
import { getDetailListByfee } from "@/api/marketReport"
export default {
  name: "marketReportDetail3",
  components: { messagebox },
  data() {
    return {     
      iTable:[],
      queryParams:{
        keyword:'',
        reportId: null,
        feeId: null,
        page: 1,
        rows: 15,
      },
      pageSizesList: [10, 15, 20, 30, 40, 50, 100],
      totalCount: 0, //数据的总条数,
      fileId: "",
      currentRow: [],
      multipleSelection: [],
      // el-tag类型转换
      statusFilter(status) {
        const statusMap = {
          0: "info",
          1: "info"
        };
        return statusMap[status];
      },
      // 清单类型显示转换
      formatStatus(status) {
        const statusMap = {
          0: "否",
          1: "是"
        };
        return statusMap[status];
      },
      isBomPrice: false,//是否有查看价格权限
    };
  },
  created() {
    this.queryParams.reportId = this.$route.query.reportId;
    this.queryParams.feeId = this.$route.query.feeId;
    this.getDetailList();
  },
  computed:{
     
  },
  methods: {
    //数字保留6位小数
    returnFloat(value){
      if(value == null || value == undefined){
       return "0.000000";
      }
      var value=Math.round(parseFloat(value)*1000000)/1000000;
      var xsd=value.toString().split(".");
      if(xsd.length==1){
       value=value.toString()+".000000";
       return value;
      }
      //如果存在小数，则循环添加0，直到6位小数
      if(xsd.length>1){
       var after = "";
       for(var i = 0; i < (6-xsd[1].length); i++){
         after = after.toString() + "0";
       }
       value = value.toString() + after;
       // if(xsd[1].length<2){
       //   value=value.toString()+"0";
       // }
      return value;
      }
    },
    //数字保留3位小数
    returnFloat_2(value){
      if(value == null || value == undefined){
        return "0.000";
      }
      var value=Math.round(parseFloat(value)*1000)/1000;
      var xsd=value.toString().split(".");
      if(xsd.length==1){
        value=value.toString()+".000";
        return value;
      }
      //如果存在小数，则循环添加0，直到6位小数
      if(xsd.length>1){
        var after = "";
        for(var i = 0; i < (3-xsd[1].length); i++){
          after = after.toString() + "0";
        }
        value = value.toString() + after;
        return value;
      }
    },
    handleSubmit() {
      this.getDetailList();
    },
    //获取详情列表数据
    getDetailList(){
      let filter=Object.assign({},
      {
        keyword:this.queryParams.keyword,
        reportId:this.queryParams.reportId,
        feeId:this.queryParams.feeId,
        rows:this.queryParams.rows,
        page:this.queryParams.page
      });
      getDetailListByfee(filter).then(response => {
        if (response.result) {
          this.iTable = response.data.rows;
          this.totalCount =response.data.total;
        }  
      });
    },
    //转换工序
    getProcessName(row){
      var processName = "";
      if(row.bsType == 1){
        processName = row.processInfo ? row.processInfo.bsName : "";
      }else{
        processName = "BOM物料清单";
      }
      return processName;
    },
    //转换计费方式
    getFeeName(row){
      var feeName = "";
      if(row.bsType == 1){
        feeName = row.fee ? row.fee.bsName : "";
      }else{
        feeName = "SMD";
      }
      return feeName;
    },
    changePage(page){
      this.queryParams.page=page;
    },
    sizeChange(size){
      this.queryParams.rows=size;
    },
    //导出
    downloadDoc() {
      var reportId = this.queryParams.reportId;
      var feeId = this.queryParams.feeId;
      window.location.href = process.env.BASE_API + "/marketReport/getExcel2?reportId="+reportId+"&&feeId="+feeId;
    },
    //重置
    resetFrom(){
      this.queryParams.keyword = '';
    },

  }
};
</script>
<style type="text/css">
/*.demo-form-inline {
  padding: 10px;
}*/
.demo-form-inline .el-form-item__label {
  font-size: 12px;
  font-family: "Microsoft YaHei";
  margin-left:15px;
}
.collapse .el-collapse-item__header {
  font-size: 13px;
  /*height: 30px;
  line-height:38px;*/
}
.Operation {
  font-size: 13px;
  /*cursor: pointer;*/
}
.el-table .success-row {
  background: #9fe0a6 !important ;
}
.el-table .warning-row {
  background: #f6a556 !important ;
}
/*.sometable{
  width: 100%;height: 100%;
}*/
.sometable th {
  background: none !important;

}
.priceTotal {
  display: flex;
  height: 70px;
  background: #f7f8fd;
  border: 1px solid #e2e7f0;
}
.priceTotal li {
  list-style: none;
  flex: 1;
  /* text-align: center;*/
  height: 100%;
  background: none;
  border-right: 1px solid #e2e7f0;
  cursor: pointer;
  padding-left: 15px;
  position: relative;
}
.priceTotal p.label {
  color: #96a6b6;
}
.priceTotal .num {
  font-size: 18px;
/*  height: 8px;*/
  margin-top: 10px;
}
.priceTotal p.num1 {
  color: #fb7884;
  /* text-align:center; */
}
.priceTotal p.num2 {
  color: #03a9f3;
}
.priceTotal p.num3 {
  color: #9675ce;
}
.progressbox {
  position: relative;
}
.progressbox .total {
  position: absolute;
  right: -5%;
  top: -2px;
  font-size: 14px;
}
.downBtn {
  position: absolute;
  right: 44px;
  top: 4px;
  width: 50px;
  height: 50px;
}
.demo .el-switch__label {
  position: absolute;
  display: none;
  color: #fff;
}
/*打开时文字位置设置*/
.demo .el-switch__label--right {
  z-index: 1;
  right: -3px;
}
.el-switch__label *{
  font-size: 12px;
}
/*关闭时文字位置设置*/
.demo .el-switch__label--left {
  z-index: 1;
  left: 19px;
}
/*显示文字*/
.demo .el-switch__label.is-active {
  display: block;
}
.demo.el-switch .el-switch__core,
.el-switch .el-switch__label {
  width: 50px !important;
}
.doc-upload-input{
  display: none;
  z-index: -9999;
}
.mateFooter{
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