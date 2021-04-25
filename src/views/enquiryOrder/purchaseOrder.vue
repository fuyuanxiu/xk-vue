<template>
  <div>
    <el-card style="padding-bottom: 0; border: none">
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="formQuery" class="demo-form-inline">
            <el-form-item label="关键字">
              <el-input
              @keyup.enter.native="getData"
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
              <el-button type="primary" icon="el-icon-search" @click="getData">查找</el-button>
              <el-button type="primary" @click="sendStatus()">手动推送</el-button>
               <el-button type="primary" @click="cancelSendStatus()">取消推送</el-button>
            </el-form-item>
            <el-form-item label="自动推送时间:" prop="date">
              <el-time-picker
                style="margin-left: 10px"
                value-format="HH:mm"
                v-model="value1"
                format="HH:mm"
                placeholder="自动推送时间"
              >
              </el-time-picker>
            </el-form-item>
            <el-button
              style="margin-left: 10px"
              type="primary"
              @click="updateTime()"
              >修改自动推送时间</el-button
            >
          </el-form>
        </el-col>
      </el-row>
    </el-card>
    <el-tabs type="border-card">
      <el-tab-pane label="K3采购订单信息">
        <template>
          <el-table
            border
            ref="multipleTable"
            :data="k3OrderTable"
            tooltip-effect="dark"
            style="width: 100%"
            highlight-current-row
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="45"> </el-table-column>
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
              <el-table-column prop="sync" label="推送状态" width="90" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span :class="{green:scope.row.sync== true,red:scope.row.sync==false}">
                    {{scope.row.sync==false ? '未推送' : '已推送'}}
                  </span>
                </template>
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
      </el-tab-pane>
    </el-tabs>

    <!--end-->
  </div>
</template>
<script>
import { getOrderList,sendOrder,cancelSend} from "@/api/purchaseOrderK3";
import { modifyTime } from "@/api/cron";
import { getPermByRouterCode } from "@/api/perm";
import MessageBoxDel from "@/components/Dialog/MessageBox.vue";
export default {
  name: "purchaseOrder",
  components: {
    MessageBoxDel,
  },
  data() {
    return {
      value1: "",
      dialogVisible: false,
      rolesDate: [],
      checkedRolesDate: [],
      value4: [],
      formQuery: {
        keyword: "",
      },
      options: [],
      multipleSelection: [],
      k3OrderTable: [{}],
      queryParams: {
        page: 1,
        rows: 10,
      },
      queryK3Params: {
        pageK3: 1,
        rowsK3: 10,
        pkParent: -1,
      },
      pageSizesList: [10, 20, 30, 40, 50, 100],
      totalCount: 0, //数据的总条数,
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
    handleSubmit(name) {
      this.getData();
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
    getData() {
      // let suppGrade = 2;
      // let filter=Object.assign(
      //     {},
      //     this.formQuery,
      //     this.queryParams,
      //     this.queryK3Params
      //   )
      // getSupplierListAll(filter).then(response => {
      //   if (!response.result) {
      //     this.$Message.error(response.msg);
      //     return
      //   }
      //   this.supplierTable = response.data.listSrm.rows;
      //   this.totalCount = response.data.listSrm.total;
      //   this.supplierK3Table = response.data.listK3.rows;
      //   this.totalK3Count = response.data.listK3.total;

      //   this.loading = false
      // })
      const filter = Object.assign({}, this.formQuery, this.queryParams);
      getOrderList(filter).then((response) => {
        if (!response.result) {
          this.$message.error(response.msg);
          return;
        }
        this.k3OrderTable = response.data.rows;
        this.totalCount = response.data.total;
      });
    },
        timestampToTime (row, column) {
        var date = new Date(row.fDate) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-'
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
        var D = date.getDate() + ' '
        return Y+M+D
    }
,
    /*推送状态修改*/
    sendStatus(){
     let ids=[];
     this.multipleSelection.map((item)=>{
       ids.push(item.id)
     })
     sendOrder(ids.join(',')).then(response=>{
       if(response.result){
         this.$message({
           message:response.msg,
           type: 'success'
         });
         this.getData();
       }else{
         this.$message.error(response.msg)
       }
     })

    }
  ,

  /*取消推送*/
    cancelSendStatus(){
     let ids=[];
     this.multipleSelection.map((item)=>{
       ids.push(item.id)
     })
     cancelSend(ids.join(',')).then(response=>{
       if(response.result){
         this.$message({
           message:response.msg,
           type: 'success'
         });
         this.getData();
       }else{
         this.$message.error(response.msg)
       }
     })

    },
    /*查看供应商详情*/
    viewSupplier(url, row) {
      this.$store.commit("updateSupplierDataStates", row);
      this.$router.push({ path: url, query: { id: row.id, type: "view" } });
    },
    handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(this.multipleSelection)
    },
    select(selection, row) {
      if (selection.length > 1) {
        selection.shift();
      }
    },
    cancel() {
      this.dialog.modal_dialog = false;
    },
    // doMatchK3(){
    //   doMatchK3().then(response => {
    //     if (response.result) {
    //       this.$message({
    //         message: response.msg,
    //         type: 'success'
    //       });
    //       this.getData();
    //     } else {
    //       this.$message.error(res.msg);
    //     }
    //   })
    // }
    changePage(page) {
      this.queryParams.page = page;
      this.getData();
    },
    SizeChange(size) {
      this.queryParams.rows = size;
      this.getData();
    },
    updateTime() {
      console.log(this.value1);
      modifyTime(this.value1).then((response) => {
        if (response.result) {
          this.$message({
            message: response.msg,
            type: "success",
          });
        } else {
          this.$message.error(response.msg);
        }
      });
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
