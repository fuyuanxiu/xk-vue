<template>
  <div>
    <el-card style="padding-bottom: 0; border: none">
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="formQuery" class="demo-form-inline">
            <el-form-item label="关键字">
              <el-input
                v-model="formQuery.keyword"
                placeholder="关键字"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item label="产品" prop="userStatus">
              <el-select v-model="formQuery.userStatus" placeholder="主营产品类别" style="width:280px">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                v-if="permit.SEARCH"
                >查找</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
    <el-tabs type="border-card">
      <template>
        <el-table
          border
          ref="main_table"
          :data="supplierK3Table"
          tooltip-effect="dark"
          style="width: 100%"
          highlight-current-row
        >
          <el-table-column
            prop="fBillNo"
            label="单据编号"
            width="120"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="fDate"
            :formatter="timestampToTime"
            label="日期"
            width="100"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="fName"
            label="供应商"
            width="180"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="fNumber"
            label="'物料长代码"
            width="120"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="mName"
            label="物料名称"
            width="120"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="fModel"
            label="规格型号"
            width="120"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="f_103"
            label="制造商名称"
            width="120"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="f_102"
            label="制造商物料编号"
            width="200"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column label="回复交期" width="80" fixed="right">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-date"
                size="mini"
                title="回复"
                @click="drawer=true"
                round
              />
            </template>
          </el-table-column>
          
          <el-table-column
            prop="fEntrySelfP0276"
            label="产地"
            width="150"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="fAuxQty"
            label="数量"
            width="60"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="unit"
            label="单位"
            width="50"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="fStockQty"
            label="入库数量"
            width="80"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="deliveryDate"
            :formatter="timestampToTime"
            label="交货日期"
            width="150"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="fPrice"
            label="单价"
            width="70"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="fAuxTaxPrice"
            label="含税单价"
            width="75"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="fCess"
            label="税率"
            width="50"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="fAmount"
            label="金额"
            width="70"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="currency"
            label="币别"
            width="70"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="fNote"
            label="备注"
            width="60"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="fTaxAmount"
            label="税额"
            width="80"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="fAllAmount"
            label="价税合计"
            width="80"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="salesMan"
            label="业务员"
            width="80"
            show-overflow-tooltip
          >
          </el-table-column>
          <!-- <el-table-column prop="suppGrade" label="状态" show-overflow-tooltip>
                  <template scope="scope">
                    <span v-bind:class="{orange:scope.row.suppGrade==1 ,green:scope.row.suppGrade==2, gray:scope.row.suppGrade==3}">{{$t('supplier.Status['+2+']')}}</span>
                  </template>
                </el-table-column> -->
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
    </el-tabs>

    <!--end-->
  </div>
</template>
<script>
import { getPermByRouterCode } from "@/api/perm";
import { getSupplierStatus } from "@/api/deliveryOrder";
import MessageBoxDel from "@/components/Dialog/MessageBox.vue";
export default {
  name: "deliveryOrder",
  components: {
    MessageBoxDel,
  },
  data() {
    return {
      dialogVisible: false,
      rolesDate: [],
      checkedRolesDate: [],
      value4: [],
      drawer: false,
      formQuery: {
        keyword: "",
      },
      options: [],
      supplierTable: [{}],
      queryParams: {
        page: 1,
        rows: 10,
      },

      pageSizesList: [10, 20, 30, 40, 50, 100],
      totalCount: 0,
      supplierK3Table: [{}],
      loading: true,
      permit: {
        //权限控制
        SEARCH: false,
      },
    };
  },
  created() {
    this.getData();
    this.getPermit();
  },
  methods: {
    replyDate() {
      this.drawer = true;
    },
    timestampToTime(row, column) {
      var date = new Date(row.fDate); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate() + " ";
      return Y + M + D;
    },
    getData() {
      const filter = Object.assign({}, this.queryParams);
      getSupplierStatus(filter).then((response) => {
        if (response.result) {
          this.supplierK3Table = response.data.rows;
          this.totalCount = response.data.total;
        } else {
          this.$message.error(response.msg);
        }
      });
    },
    getPermit() {
      var routerCode = this.$route.name;
      getPermByRouterCode(routerCode).then((response) => {
        if (response.result) {
          if (response.data == "admin") {
            this.permit.SEARCH = true;
          } else {
            var list = response.data;
            for (var i = 0; i < list.length; i++) {
              if (list[i].permCode == "SEARCH") this.permit.SEARCH = true;
            }
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    handleSelectionChange(val) {
      this.currentRow = val;
      console.log(this.currentRow);
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
    changePageK3(page) {
      this.queryK3Params.pageK3 = page;
      this.getData();
    },
    SizeChangeK3(size) {
      this.queryK3Params.rowsK3 = size;
      this.getData();
    },
  },
};
</script>
<style>
.block {
  text-align: right;
  margin-top: 10px;
}
</style>
