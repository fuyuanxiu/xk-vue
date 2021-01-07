<template>
  <div>
    <!--搜索框-->
    <div class="retrieval">
      <div class="title">
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
                <el-button type="primary" size="mini" @click="getData">查找</el-button>
                <el-button type="info" size="mini" @click="resetFrom">重置</el-button>
                <messagebox @callConfirm="approval" title="提示" contents="此操作将审核通过此清单, 是否继续?" confirmTitle="确认审核通过">
                </messagebox>
                <messageInvalidBox @callConfirm="invalid" title="提示" contents="此操作将作废此清单, 是否继续?" confirmTitle="确认作废">
                </messageInvalidBox>
                <el-button type="primary" size="mini" @click="getExcel">已询价详情</el-button>
                <messageSuppBox @callConfirm="noticeSupplier" title="提示" contents="此操作将通知已采纳报价的供应商，是否继续?" confirmTitle="确认通知供应商">
                </messageSuppBox>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div>
          <el-row type="flex" class="row-bg" style="margin-bottom: 10px;">
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <span class="order-info">清单状态：
                  <el-tag :type="statusFilter_2(orderInfo.status)">{{ formatStatus_2(orderInfo.status)}}</el-tag>
                </span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <span class="order-info">清单成本：{{this.orderInfo.totalPrice}}
                </span>
              </div>
            </el-col>           
          </el-row>
        </div>
      </div>
    </div>
    <!--表格-->
    <template>
      <el-table
        border
        :data="orderDetailList"
        tooltip-effect="dark"
        style="width: 100%" 
        highlight-current-row 
        v-loading="loading" 
        @expand-change="rowExpand" 
        :row-class-name="tableRowClassName">
        <!--下拉列表 start-->
        <el-table-column type="expand" prop="children">
          <template scope="scope">
            <el-form label-position="left" inline class="demo-table-expand">
              <div>
                <el-button type="primary" @click="acceptQuote(scope.row.id)" style="margin-top:10px;margin-left:47px;">采纳报价</el-button>
              </div>
              <el-table
                ref="multipleTable"
                :data="quoteMateList"
                border
                :highlight-current-row="true"
                style="width: 1154px;margin-top:10px;margin-left:47px;font-size: 12px"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="45">
                </el-table-column>
                <el-table-column label="序号" type="index" width="50">
                </el-table-column>
                <el-table-column prop="bs_status" label="状态" align="center" width="80" show-overflow-tooltip>
                  <template scope="scope">
                    <el-tag :type="statusFilter(scope.row.bs_status)">{{ formatStata(scope.row.bs_status)}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="mate_model" label="规格" show-overflow-tooltip width="200">
                </el-table-column>
                <el-table-column prop="supp_chinese_name" label="供应商名称" show-overflow-tooltip width="150">
                </el-table-column>
                <el-table-column prop="mate_name" label="名称" show-overflow-tooltip width="100">
                </el-table-column>
                <el-table-column prop="qt_unit" label="单位" show-overflow-tooltip width="50">
                </el-table-column>
                <el-table-column prop="qt_mate_num" label="预计数量" show-overflow-tooltip width="80">
                </el-table-column>
                <el-table-column prop="bs_real_num" label="报价数量" show-overflow-tooltip width="80">
                </el-table-column>
                <el-table-column prop="bs_tax_unit_price" label="含税单价" show-overflow-tooltip width="80">
                </el-table-column>
                <el-table-column prop="bs_tax_total_price" label="含税金额" show-overflow-tooltip width="80">
                </el-table-column>
                <!-- <el-table-column prop="qt_del_deadline" label="交货期限" show-overflow-tooltip width="80">
                </el-table-column> -->
                <el-table-column prop="bs_del_deadline_real" label="交期" show-overflow-tooltip width="80">
                </el-table-column>
                <el-table-column prop="bs_package_min" label="最小包装" show-overflow-tooltip width="100">
                </el-table-column>
                <el-table-column prop="bs_cus_name" label="品牌" show-overflow-tooltip width="100">
                </el-table-column>
                <el-table-column prop="bs_cus_code" label="品牌料号" show-overflow-tooltip width="100">
                </el-table-column>
                <el-table-column prop="qt_mate_desc" label="备注" show-overflow-tooltip>
                </el-table-column>
            </el-table>
            </el-form>
          </template>
        </el-table-column>
        <!--下拉列表 end-->

        <el-table-column label="序号" type="index" width="50">
        </el-table-column>
        <el-table-column prop="bsStatus" label="状态" align="center" width="100" show-overflow-tooltip>
          <template scope="scope">
            <el-tag :type="statusFilter_1(scope.row.bsStatus)">{{ formatStata_1(scope.row.bsStatus)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="simglePrice" label="单价" show-overflow-tooltip width="100">
          <template scope="scope">
            {{scope.row.bsBom.fAuxPriceDiscount}}
          </template>
        </el-table-column>
        <el-table-column prop="k3Code" label="选中物料号" show-overflow-tooltip width="150">
          <template scope="scope">
            {{scope.row.bsBom.checkCode}}
          </template>
        </el-table-column>
        <el-table-column prop="bsModel" label="规格" show-overflow-tooltip width="200">
        </el-table-column>
        <el-table-column prop="bsName" label="名称" show-overflow-tooltip width="100">
        </el-table-column>
        <el-table-column prop="bsCategory" label="类别" show-overflow-tooltip width="100">
        </el-table-column>
        <el-table-column prop="bsQty" label="用量" show-overflow-tooltip width="100">
        </el-table-column>
        <el-table-column prop="bsPackage" label="封装" show-overflow-tooltip width="100">
        </el-table-column>
        <el-table-column prop="bsCusName" label="品牌名称" show-overflow-tooltip width="100">
        </el-table-column>
        <el-table-column prop="bsCusCode" label="品牌料号" show-overflow-tooltip width="100">
        </el-table-column>
        <el-table-column prop="bsPlaceNum" label="位号" show-overflow-tooltip width="100">
        </el-table-column>
        <el-table-column prop="bsBomNum" label="套数" show-overflow-tooltip width="100">
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
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
import { getDetailList,getQuoteMateList,doAccept,doApproval,doInvalid,sendSuppMsg } from "@/api/enquiryOrder";
import messagebox from "@/views/enquiryOrder/components/messagebox.vue";
import messageInvalidBox from "@/views/enquiryOrder/components/messageInvalidBox.vue";
import messageSuppBox from "@/views/enquiryOrder/components/messageSuppBox.vue";
export default {
  name: "enquiryOrderDetail",
  components: {
    messagebox,
    messageInvalidBox,
    messageSuppBox
  },
  data() {
    return {
      bsOrderId:this.$route.query.bsOrderId,
      orderInfo: {
        status: 0,
        totalPrice: 0
      },
      loading: false,
      current: 0,
      open: true,
      orderDetailList: [],
      quoteMateList: [],
      multipleSelection:[],
      queryParams: {
        page: 1,
        rows: 15,
        keyword: ''
      },
      pageSizesList: [15, 20, 30, 40, 50, 100],
      totalCount: 0, //数据的总条数
      // el-tag类型转换
      statusFilter(status) {
        const statusMap = {
          1: "info",
          2: "info",
          3: "info",
          4: "success",
          5: "danger"
        };
        return statusMap[status];
      },
      // 状态显示转换
      formatStata(status) {
        const statusMap = {
          1: "未报价",
          2: "已报价",
          3: "审核中",
          4: "已采纳",
          5: "未采纳"
        };
        return statusMap[status];
      },
      // el-tag类型转换_1
      statusFilter_1(status) {
        const statusMap = {
          0: "info",
          1: "info",
          2: "danger",
          3: "danger",
          4: "success"
        };
        return statusMap[status];
      },
      // 状态显示转换_1
      formatStata_1(status) {
        const statusMap = {
          0: "未询价",
          1: "未询价",
          2: "询价中",
          3: "已报价",
          4: "已采纳",
        };
        return statusMap[status];
      },
      // el-tag类型转换_2
      statusFilter_2(status) {
        const statusMap = {
          1: "primary",
          2: "success",
          3: "danger",
        };
        return statusMap[status];
      },
      // 清单类型显示转换_2
      formatStatus_2(status) {
        const statusMap = {
          1: "进行中",
          2: "审核完成",
          3: "作废"
        };
        return statusMap[status];
      },
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      let filter=Object.assign({},this.queryParams,{"bsOrderId":this.bsOrderId})
      this.loading = true;
      //获取BOM-询价列表
      getDetailList(filter).then(response => {
        this.loading = false;
        if (response.result) {          
          this.orderDetailList = response.data.rows;
          this.totalCount = response.data.total;
          this.orderInfo.status = response.data.status;
          this.orderInfo.totalPrice = response.data.totalPrice;       
        } else {
          this.$message.error(response.msg);
        }
      });
    },
    //展开父表格数据 并查询该数据下的子数据
    rowExpand(row, expandedRows) {
      if (expandedRows.length != 0) {
        var detailId = row.id;
        let filter=Object.assign({},{"bsOrderDetailId":detailId});
        //获取关联报价信息
        getQuoteMateList(filter).then(response => {
          if(response.result){
            this.quoteMateList = response.data;
          }else{
            this.quoteMateList = [];
            this.$message.error(response.msg);
          }
        });
      }else{
        this.quoteMateList = [];
      }
      this.multipleSelection = [];
      //如果展开行数大于1
      if(expandedRows.length>1){
        //shift() 方法用于把数组的第一个元素从其中删除，并返回第一个元素的值。
        expandedRows.shift();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    acceptQuote(id) {
      if(this.multipleSelection.length>0){
        //获取报价明细ID
        var quoMateIds = "";
        for(var i=0; i<this.multipleSelection.length; i++){
          quoMateIds += this.multipleSelection[i].id + ","
        }
        quoMateIds = quoMateIds.substring(0, quoMateIds.lastIndexOf(","));
        //采纳报价
        let filter=Object.assign({},{"bsOrderDetailId":id, "quoMateIds":quoMateIds});
        doAccept(filter).then(response => {
          if(response.result){
            this.$message.info(response.msg);
            this.getData();
            // //成功则重新获取下拉数据
            // let filter1 = Object.assign({},{"bsOrderDetailId":id});
            // getQuoteMateList(filter1).then(response => {
            //   if(response.result){
            //     this.quoteMateList = response.data;
            //   }else{
            //     this.$message.error(response.msg);
            //   }
            // });
          }else{
            this.$message.error(response.msg);
          }
        })
      }
    },
    //不同状态对应的行颜色
    tableRowClassName({ row, rowIndex }) {
      if (row.bsStatus == 2 || row.bsStatus == 3) {
        return "danger-row";
      } else if(row.bsStatus == 4){
        return "success-row";
      }
    },
    //重置
    resetFrom(){
      this.queryParams.keyword = '';
    },
    changePage(page) {
      this.queryParams.page = page;
      this.getData();
    },
    sizeChange(size) {
      this.queryParams.rows = size;
      this.getData();
    },
    approval() {
      let filter=Object.assign({},{"bsOrderId":this.bsOrderId});
      doApproval(filter).then(response => {
        if(response.result){
          this.$message.info(response.msg);
          this.orderInfo.status = 2;
        }else{
          this.$message.error(response.msg);
        }
      });
    },
    invalid() {
      let filter=Object.assign({},{"bsOrderId":this.bsOrderId});
      doInvalid(filter).then(response => {
        if(response.result){
          this.$message.info(response.msg);
          this.orderInfo.status = 3;
        }else{
          this.$message.error(response.msg);
        }
      });
    },
    getExcel() {
      this.$router.push({path:'/enquiry/enquiryOrderDetail2',query:{bsOrderId:this.bsOrderId}});
    },
    noticeSupplier() {
      let filter=Object.assign({},{"bsOrderId":this.bsOrderId});
      sendSuppMsg(filter).then(response => {
        if(response.result){
          this.$message.info(response.msg);
        }else{
          this.$message.error(response.msg);
        }
      });
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

.el-table .success-row {
  background: #98FB98 !important ;
}
.el-table .danger-row {
  background: #FFE4E1 !important ;
}
.order-info {
  font-size: 14px;
  color: #606266;
}
</style>