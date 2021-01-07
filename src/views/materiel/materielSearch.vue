<template>
  <el-row>
    <el-col :span="24">
      <div v-loading="loading" element-loading-text="数据加载中，请稍等">
        <el-card style="border:none;height:auto;">
          <el-row>
            <el-col style="width:100%">
              <el-form
                :inline="true"
                :model="formQuery"
                class="demo-form-inline"
              >
                <el-form-item label="物料号">
                  <el-input
                    v-model="formQuery.mateK3Code"
                    placeholder="K3物料号"
                  ></el-input>
                </el-form-item>
                <el-form-item label="品牌">
                  <el-input
                    v-model="formQuery.mateCusName"
                    placeholder="品牌"
                  ></el-input>
                </el-form-item>
                <el-form-item label="品牌料号">
                  <el-input
                    v-model="formQuery.mateCusCode"
                    placeholder="品牌料号"
                  ></el-input>
                </el-form-item>
                <el-form-item label="规格">
                  <el-input style="width: 100px;"
                    v-model="formQuery.model1"
                    placeholder="V1"
                  ></el-input>
                  <el-input style="width: 100px;"
                    v-model="formQuery.model2"
                    placeholder="V2"
                  ></el-input>
                  <el-input style="width: 100px;"
                    v-model="formQuery.model3"
                    placeholder="V3"
                  ></el-input>
                  <el-input style="width: 100px;"
                    v-model="formQuery.model4"
                    placeholder="V4"
                  ></el-input>
                  <el-input style="width: 100px;"
                    v-model="formQuery.model5"
                    placeholder="V5"
                  ></el-input>
                  <el-input style="width: 150px;"
                    v-model="formQuery.model6"
                    placeholder="V6"
                  ></el-input>
                  <el-input style="width: 100px;"
                    v-model="formQuery.model7"
                    placeholder="V7"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button v-if="permit.SEARCH" 
                    type="primary"
                    size="mini"
                    @click="handleSubmit('formQuery')"
                  >查找</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button 
                  type="info"
                  size="mini"
                  @click="resetFrom"
                >重置</el-button>
                </el-form-item>
              </el-form>
            </el-col>        
          </el-row>
        </el-card>

        <template>
          <el-table
            ref="materielTable"
            :data="materielTable"
            tooltip-effect="dark"
            style="width: 100%"
            highlight-current-row
            border>
            </el-table-column>
            <el-table-column
              prop="mateK3Code"
              label="K3物料号"
              width="120"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="categoryName"
              label="物料类别"
              width="100"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="mateCusName"
              label="品牌"
              width="120"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="mateCusCode"
              label="品牌料号"
              width="200"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="mateModel"
              label="物料规格"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="fStockQty"
              label="库存数量"
              width="80"
              show-overflow-tooltip
            >
            </el-table-column>
            <!-- <el-table-column
              prop="fAuxPriceDiscount"
              label="最新采购单价"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="suppCode"
              label="供应商编号"
              show-overflow-tooltip
            >
            </el-table-column> -->
            <!-- <el-table-column
              prop="suppChineseName"
              label="供应商名称"
              show-overflow-tooltip
            >
            </el-table-column> -->
            <el-table-column
              prop="remark"
              label="备注"
              width="80"
              show-overflow-tooltip
            >
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
import { searchMateInfo } from "@/api/materiel";
import { getPermByRouterCode } from '@/api/perm'
import MessageBox from "@/components/Dialog/MessageBox.vue";
export default {
  name: "materielSearch",
  components: {
    MessageBox
  },
  data() {
    return {
      dialog: {
        loading: false
      },
      formQuery: {
        mateK3Code: "",
        mateCusName: "",
        mateCusCode: "",
        model1: "",
        model2: "",
        model3: "",
        model4: "",
        model5: "",
        model6: "",
        model7: ""
      },
      currentRow: [],
      materielTable: [{}],
      queryParams: {
        page: 1,
        rows: 10,
        pkParent: -1
      },
      queryK3Params: {
        page: 1,
        rows: 10,
        pkParent: -1
      },
      pageSizesList: [10, 20, 30, 40, 50, 100],
      totalCount: 0, //数据的总条数,
      totalK3Count: 0,
      loading: false,
      permit:{
        //权限控制
        SEARCH:false
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
    getPermit(){
      var routerCode = this.$route.name;
      getPermByRouterCode(routerCode).then(response => {
        if(response.result){
          if(response.data == "admin"){
            this.permit.SEARCH = true;
          }else{
            var list = response.data;
            for(var i = 0; i < list.length; i++){
              if(list[i].permCode == "SEARCH") this.permit.SEARCH = true;
            }
          }
        }else{
          this.$message.error(res.msg);
        }
      });
    },
    getData() {
      this.loading = true;
      searchMateInfo(
        this.formQuery.mateK3Code,
        this.formQuery.mateCusName,
        this.formQuery.mateCusCode,
        this.formQuery.model1,
        this.formQuery.model2,
        this.formQuery.model3,
        this.formQuery.model4,
        this.formQuery.model5,
        this.formQuery.model6,
        this.formQuery.model7,
        this.queryParams.rows,
        this.queryParams.page
      ).then(response => {
        if (!response.result) {
          this.$Message.error(response.msg);
          return
        }
        this.materielTable = response.data;
        // this.totalCount = response.data.listSrm.total;
        this.loading = false;
      });
    },
    resetFrom() {
      this.formQuery.mateK3Code = "";
      this.formQuery.mateCusName = "";
      this.formQuery.mateCusCode = "";
      this.formQuery.model1 = "";
      this.formQuery.model2 = "";
      this.formQuery.model3 = "";
      this.formQuery.model4 = "";
      this.formQuery.model5 = "";
      this.formQuery.model6 = "";
      this.formQuery.model7 = "";
    },
    changePage(page) {
      this.queryParams.page = page;
      this.getData();
    },
    changePageK3(page) {
      this.queryK3Params.page = page;
      this.getData();
    },
    SizeChange(size) {
      this.queryParams.rows = size;
      this.getData();
    },
    SizeChangeK3(size) {
      this.queryK3Params.rows = size;
      this.getData();
    }
  }
};
</script>
<style>
.block {
  text-align: right;
  margin-top: 10px;
}
</style>
