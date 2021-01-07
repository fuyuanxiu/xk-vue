<template>
  <!--报价明细-->
  <div>
	  <div>
      <el-card style="padding-bottom: 0;border:none;">
        <el-row>
          <el-col :span="24">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item>
                <el-button type="primary" @click="acceptQuote">采纳报价</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-card>
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
        <el-table-column type="selection" width="45" fixed="left">
        </el-table-column>
        <el-table-column label="序号" type="index" width="50" fixed="left">
        </el-table-column>
        <el-table-column prop="bs_status" label="状态" align="center" width="80" show-overflow-tooltip  fixed="left">
          <template scope="scope">
            <el-tag :type="statusFilter(scope.row.bs_status)">{{ formatStata(scope.row.bs_status)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="mate_model" label="规格" show-overflow-tooltip width="250" fixed="left">
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
<!--         <el-table-column prop="qt_del_deadline" label="交货期限" show-overflow-tooltip width="80">
        </el-table-column> -->
        <el-table-column prop="bs_del_deadline_real" label="交期" show-overflow-tooltip width="80">
        </el-table-column>
        <el-table-column prop="bs_package_min" label="最小包装" show-overflow-tooltip width="100">
        </el-table-column>
        <el-table-column prop="bs_cus_name" label="品牌" show-overflow-tooltip width="100">
        </el-table-column>
        <el-table-column prop="bs_cus_code" label="品牌料号" show-overflow-tooltip width="120">
        </el-table-column>
        <el-table-column prop="qt_mate_desc" label="备注" show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>
<script>
import { getAllQuoteList,doAccept } from "@/api/quote";
export default {
  name: "quoMateDetail",
  data() {
    return {
      bsEqId: this.$route.query.bsEqId,
      loading: false,
      detailList: [],
      multipleSelection:[],
      // el-tag类型转换
      statusFilter(status) {
        const statusMap = {
          1: "info",
          2: "primary",
          3: "warning",
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
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      let filter=Object.assign({},{"bsEqId":this.bsEqId});
      this.loading = true;
      //根据询价单ID获取所有报价信息
      getAllQuoteList(filter).then(response => {
        this.loading = false;
        if (response.result) {          
          this.detailList = response.data;        
        } else {
          this.$message.error(response.msg);
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //采纳报价
    acceptQuote() {
      if(this.multipleSelection.length>0){
        //获取报价明细ID
        var quoMateIds = "";
        for(var i=0; i<this.multipleSelection.length; i++){
          quoMateIds += this.multipleSelection[i].id + ","
        }
        quoMateIds = quoMateIds.substring(0, quoMateIds.lastIndexOf(","));        
        //采纳报价
        let filter=Object.assign({},{"bsEqId":this.bsEqId, "quoMateIds":quoMateIds});
        doAccept(filter).then(response => {
          if(response.result){
            this.getData();
            this.$message.info(response.msg);
          }else{
            this.$message.error(response.msg);
          }
        });
      }else{
        this.$message.error("请选择要操作的行");
      }
    },
  }
};
</script>
<style>
.el-table th, .el-table tr{ cursor: pointer; }

</style>