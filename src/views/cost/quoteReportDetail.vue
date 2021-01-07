<template>
  <div v-loading="load" element-loading-text="数据加载中，请稍等">
    <!-- <Row> -->
    <el-row style="margin-bottom:5px;margin-top:5px;">
      <el-col :span="16">
        <el-button type="button" @click="toList" style="margin-left: 15px;">返回</el-button>
        <el-button type="primary" @click="exportBom()">导出Excel</el-button>
        <el-button type="primary" @click="updateReport()">同步BOM</el-button>
      </el-col>
    </el-row>
    <el-collapse
      v-model="activeNames"
      v-show="isShow">
      <el-collapse-item
        title="汇总信息"
        name="2"
        class="collapse"
        v-if="isShowTable">
        <!--汇总行-->
        <el-row style="margin-bottom:10px;">
          <el-col :span='1' style="margin-left:10px;">
            <el-tag>进度:</el-tag>
            <!-- <el-slider v-model="fillNum"  :max="totalNum"></el-slider> :color="fillPercent=='100'?'greed':'red'" -->
          </el-col>
          <el-col :span="20" class="progressbox">
            <el-progress
              :text-inside="true"
              :stroke-width="18" 
              :color="color"
              :percentage="fillPercent"
              status="exception">
            </el-progress>
            <span class="total">总数:{{this.totalNum}}</span>
          </el-col>
        </el-row>
        <ul class="priceTotal">
          <li>
            <p class="num1 num">{{this.fAuxPriceTotal}}</p>
            <p class="label">最近采购价汇总</p>
            <!-- <div class="downBtn">
              <el-button round> <svg-icon icon-class="excel" style="width:45px;height:45px" /></el-button>
            </div> -->
          </li>
          <li>
            <p class="num2 num">{{this.fAuxPrice3MonthMaxTotal}}</p>
            <p class="label">三个月之内最高价汇总</p>
          </li>
          <li>
            <p class="num3 num">{{this.fAuxPrice3MonthMinTotal}}</p>
            <p class="label">三个月之内最低价汇总</p>
          </li>
        </ul>
      </el-collapse-item>
    </el-collapse>
    <!-- </Row> -->

    <!-- 后台解析到的excel数据 -->
    <el-table 
      ref="multipleTable"
      class="sometable"
      max-height="600"
      v-show="isShowTable"
      :data="tableData"
      border
      :row-class-name="tableRowClassName"
      style="overflow-x:auto" 
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="45"></el-table-column>
      <el-table-column
        label="是否匹配"
        width="80">
        <template scope="scope">
          <span>{{ formatStatus(scope.row.checkStatus) }}</span>
          <!-- <el-tag :type="statusFilter(scope.row.checkStatus)">{{ formatStatus(scope.row.checkStatus)}}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column
        v-for="item of tableHeader"
        :prop="item"
        :label="item"
        :key="item"
        v-if="item!='mateCategory'"
        width="100"
        show-overflow-tooltip
      /> <!-- v-if="item!='mateCategory'" -->
      <el-table-column
        prop="checkCode"
        label="选中的物料号"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="fAuxPriceDiscount"
        label="最新采购价"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="fAuxPriceDiscountTotal"
        label="最新采购金额"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="fAuxPrice3MonthMaxTotal"
        label="3个月最高采购价金额"
        width="150"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="fAuxPrice3MonthMinTotal"
        label="3个月最低采购价金额"
        width="150"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="fStockQty"
        label="库存数量"
        width="110"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="fStockPrice"
        label="库存单价"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="fStockPriceTotal"
        label="库存金额"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="price1Total"
        label="价格1金额"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="price2Total"
        label="价格2金额"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="price3Total"
        label="价格3金额"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="price4Total"
        label="价格4金额"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column 
        prop="smtPoints"
        label="SMT点数"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="smtPointsTotal"
        label="SMT点数总和"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="smtFeetQty"
        label="引脚数"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <!--报价信息-->
      <el-table-column
        label="是否采纳"
        width="80">
        <template scope="scope">
          <span>{{ formatStatusQt(scope.row.bs_status) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="supp_chinese_name"
        label="供应商名称"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="mate_model"
        label="规格"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="qt_unit"
        label="单位"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="qt_mate_num"
        label="预计量"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="bs_real_num"
        label="报价数量"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="bs_tax_unit_price"
        label="含税单价"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="bs_del_deadline_real"
        label="交期"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="bs_package_min"
        label="最小包装"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="bs_cus_name"
        label="品牌"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="bs_cus_code"
        label="品牌料号"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="qt_mate_desc"
        label="备注"
        width="120"
        show-overflow-tooltip>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import { getBomData } from "@/api/cost";
import { getQtReport,getQtReportByBom } from "@/api/report";
import MessageBoxDelete from "./components/MessageBox.vue";
import { getPermission } from '@/api/role';
export default {
  name: "quoteReportDetail",
  components: { MessageBoxDelete },
  data() {
    return {     
      tableData: [],      
      tableHeader: [],
      isShow: false,
      isShowTable: false,
      activeNames: ["1"],
      fileId: "",
      expands: [],
      load:false,
      fillPercent: 0,
      fAuxPriceTotal: 0,
      fAuxPrice3MonthMaxTotal: 0,
      fAuxPrice3MonthMinTotal: 0,
      fillNum: 0, //已勾选数量
      totalNum: 0,       
      color:'#f56c6c',
      loading: false,
      docVisible: false,
      bsFileId: 0,
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
      // 报价类型显示转换
      formatStatusQt(status) {
        const statusMap = {
          0: "未报价",
          1: "未报价",
          2: "已报价",
          3: "审核中",
          4: "已采纳",
          5: "未采纳"
        };
        return statusMap[status];
      },
      isBomPrice: false,//是否有查看价格权限
    };
  },
  created() {  
    //非新增
    if (this.$route.query.fileId) {
      this.getBomDateByFileId(this.$route.query.fileId);
    }
    //获取当前角色的操作权限
    getPermission().then(response => {
      if(response.result){
          if(response.data.isSuper == 1){
            this.isBomPrice = true;
          }else{
            //查看价格权限
            if(response.data.perm != "" && response.data.perm.indexOf("BOM_PRICE") >= 0){
              this.isBomPrice = true;
            }
          }
      }else{
        this.$message.error(response.msg);
      }
    });
  },
  computed:{
     
  },
  methods: {
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
    tableRowClassName({ row, rowIndex }) {
      if (row.checkStatus == 1) {
        return "success-row";
      } else {
        return "warning-row";
      }
    },
    getBomDateByFileId(fileId) {
      //根据fileId获取参数设置信息以及bom信息
      //封装数据
      let filter=Object.assign({},{fileId:fileId});
      getQtReport(filter).then(response => {
        if (!response.result) {
          this.$message.error(response.msg);
          return;
        }
        //填充表格数据
        this.tableHeader = response.data.header;
        this.tableData = response.data.results;

        //填充进度数据
        this.fillPercent =(response.data.totalCost.chosenNum / response.data.totalCost.totalNum) * 100;
        if(this.fillPercent == 100)this.color = 'green'
       // this.fillNum =  response.data.totalCost.chosenNum;
        this.totalNum = response.data.totalCost.totalNum;

        this.fAuxPriceTotal = response.data.totalCost.fAuxPriceDiscount;
        this.fAuxPrice3MonthMaxTotal = response.data.totalCost.fAuxPrice3MonthMax;
        this.fAuxPrice3MonthMinTotal = response.data.totalCost.fAuxPrice3MonthMin;

        //设置控件的展示
        this.fileId = fileId;
        this.isShowTable = true;
        this.isShow = true;
      });
    },
    toList() {
      this.$router.push({ path: "enquiryReport", query: this.$route.query });
    },
    //选中行
    handleSelectionChange(val){ 
      this.multipleSelection = val;
    }, 
    //导出Excel
    exportBom(){   
      window.location.href =
      process.env.BASE_API + "/report/getQtReportExcel?fileId=" + this.fileId;
    },
    //同步
    updateReport(){
      let filter=Object.assign({},{fileId:this.$route.query.fileId});
      getQtReportByBom(filter).then(response => {
        if (response.result) {
          this.$message.info(response.msg);
          this.getBomDateByFileId(this.$route.query.fileId);
        }else{
          this.$message.error(response.msg);
          return;
        }
      });
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