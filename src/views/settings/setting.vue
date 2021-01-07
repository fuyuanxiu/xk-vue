<template>
  <div class="">
    <el-card
      class="box-card"
      shadow="hover"
    >
      <div
        slot="header"
        class="clearfix"
      >
        <span class="sroreIcon"><i
            class="iconfont"
            style="font-size: 14px;margin-right:5px;"
          >&#xe693;</i>信息同步</span>
        <!-- <el-button
          style="float: right;"
          type="primary"
          @click="save()"
        >保存</el-button> -->
      </div>
      <!-- <el-card shadow="naver">
        <el-row>
          <el-form
            :model="form"
            :rules="ruleForm"
            ref="scoreForm"
            label-width="250px"
          
          >
            <el-col :span="12">
              <el-form-item
                label="客户BOM匹配数据时:勾选匹配率大于"
                prop="batchValue"
                style="display: inline-block;"
                label-position="left"
              >
                <el-input
                  type="number"
                  placeholder="请输入内容"
                  v-model.number="form.checkRate"
                >
                </el-input>
              </el-form-item>           
            </el-col>
            <el-col :span="12">
              <i class="iconfont" style="color:#42b983" > &#xe617;</i>
              <el-form-item
                label="限制比例大于"
                prop="batchValue"
                      
                 >
                  <el-input
                  type="number"
                  placeholder="请输入内容"
                  v-model.number="form.limitRate"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="匹配数量"
                prop="batchValue"  
                 >
                  <el-input
                  type="number"
                  placeholder="请输入内容"
                  v-model.number="form.number"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </el-card> -->
    </el-card>
    <el-card shadow="naver" v-loading="loading" element-loading-text="数据加载中，请稍等">
      <el-row>
        <el-col :span="12" class="colInfo">
          <label class="labelInfo">库存均价信息：</label>
          <updata-k3 @callConfirm2="update1()" title="提示" contents="是否确认同步数据？" confirmTitle="确认"></updata-k3>
          <!-- <el-button class="btnDataInfo" type="primary" @click="update1()">同步数据</el-button> -->
        </el-col>
        <el-col :span="12" class="colInfo">
          <label class="labelInfo">采购订单价信息：</label>
          <updata-k3 @callConfirm2="update2()" title="提示" contents="是否确认同步数据？" confirmTitle="确认"></updata-k3>
        </el-col>
        <el-col :span="12" class="colInfo">
          <label class="labelInfo">采购发票价信息：</label>
          <updata-k3 @callConfirm2="update3()" title="提示" contents="是否确认同步数据？" confirmTitle="确认"></updata-k3>
        </el-col>
        <el-col :span="12" class="colInfo">
          <label class="labelInfo">产品成本价信息：</label>
          <updata-k3 @callConfirm2="update4()" title="提示" contents="是否确认同步数据？" confirmTitle="确认"></updata-k3>
        </el-col>
        <el-col :span="12" class="colInfo">
          <label class="labelInfo">产品销售订单价信息：</label>
          <updata-k3 @callConfirm2="update5()" title="提示" contents="是否确认同步数据？" confirmTitle="确认"></updata-k3>
        </el-col>
        <el-col :span="12" class="colInfo">
          <label class="labelInfo">产品销售发票价信息：</label>
          <updata-k3 @callConfirm2="update6()" title="提示" contents="是否确认同步数据？" confirmTitle="确认"></updata-k3>
        </el-col>
        <el-col :span="12" class="colInfo">
          <label class="labelInfo">物料信息：</label>
          <updata-k3 @callConfirm2="updateMateData()" title="提示" contents="是否确认同步数据？" confirmTitle="确认"></updata-k3>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import { getList,updateSetting,updateStockPriceData,updateOrderBillData,updateInvoiceBillData,updateCostData,updateOrderData,updateInvoiceData } from "@/api/setting";
import updataK3 from "./components/updataK3MessageBox.vue";
import { updateMateData } from '@/api/materiel';
export default {
  name: "setting",
  components: {
    updataK3
  },
  data() {
    return {
      form: {
        checkRate:'',
        limitRate:'',
        number:''
      },
      ruleForm: {},
      loading: false
    };
  },
  created() {
    this.queryData();
  },
  methods: {
    //获取数据
    queryData() {
      getList().then(response => {
        if (response.result) {
          console.log(response.data);
          response.data.forEach(element => {
            if(element.code == 'customer_bom_check')this.form.checkRate=element.value;
            if(element.code == 'customer_bom_limit')this.form.limitRate=element.value;
            if(element.code == 'customer_bom_number')this.form.number=element.value;
          });
        } else {
          this.$message.error(response.msg);
        }
      });
    },
    save(){
      updateSetting(this.form.checkRate,this.form.limitRate,this.form.number).then(response => {
        if (response.result) {
          this.$message.info(response.msg);
        } else {
          this.$message.error(response.msg);
        }
      });
    },
    update1(){
      this.loading = true;
      updateStockPriceData(null,null).then(response => {
        this.loading = false;
        if(response.result){
          this.$message.info(response.msg);
        }else{
          this.$message.error(response.msg);
        }
      });
    },
    update2(){
      this.loading = true;
      updateOrderBillData().then(response => {
        this.loading = false;
        if(response.result){
          this.$message.info(response.msg);
        }else{
          this.$message.error(response.msg);
        }
      });
    },
    update3(){
      this.loading = true;
      updateInvoiceBillData().then(response => {
        this.loading = false;
        if(response.result){
          this.$message.info(response.msg);
        }else{
          this.$message.error(response.msg);
        }
      });
    },
    update4(){
      this.loading = true;
      updateCostData().then(response => {
        this.loading = false;
        if(response.result){
          this.$message.info(response.msg);
        }else{
          this.$message.error(response.msg);
        }
      });
    },
    update5(){
      this.loading = true;
      updateOrderData().then(response => {
        this.loading = false;
        if(response.result){
          this.$message.info(response.msg);
        }else{
          this.$message.error(response.msg);
        }
      });
    },
    update6(){
      this.loading = true;
      updateInvoiceData().then(response => {
        this.loading = false;
        if(response.result){
          this.$message.info(response.msg);
        }else{
          this.$message.error(response.msg);
        }
      });
    },
    //20190608-Shen 手动同步K3物料数据
    updateMateData(){
      this.loading = true;
      updateMateData().then(response => {
        this.loading = false;
        if (response.result) {
          this.$message.info(response.msg);
        }else{
          this.$message.error(response.msg);
        }
      });
    },

  }
};
</script>
<style  scoped>
.sroreIcon {
  color: #42b983 !important;
  font-size: 14px;
}
.labelInfo {
  display: inline-block;
  font-size: 14px;
  margin-left:30px;
}
.btnDataInfo {
  display: inline-block;
}
.colInfo {
  margin-top: 10px;
}
</style>
 
