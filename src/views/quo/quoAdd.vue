<template>
    <div style="padding:15px 15px;">  
      <el-card class="box-card" shadow="never" v-loading="loading"> 
          <div slot="header" class="clearfix">
            <el-row type="flex" class="row-bg" >
                <el-col :span="20" style="padding-top:5px;">
                     <span>供应商报价</span>
                </el-col>
                 <el-col :span="4">                      
                      <el-button style="float: right;" type="primary" size="mini" @click="backList">返回列表</el-button>                          
                </el-col>
            </el-row>  
          </div>
             <el-tabs v-model="activeName">
              <el-tab-pane label="填写报价单" name="first">
          <!--   填写报价单 -->
                  <div class="detail-table">
                       <h3 class="conttitle">报价标题</h3>
                       <el-row>
                        <el-col :span="14">                          
                            <el-input v-model="quoteData.qtTitle" placeholder="报价标题" style="width:350px"></el-input>                          
                        </el-col>                                   
                    </el-row>      
                  </div>
           <!--  询价单信息 -->
                    <div class="detail-table">
                      <h3 class="conttitle">产品报价</h3>
                      <div style="margin-top: 5px;margin-bottom: 5px;">
                        <el-button type="primary" @click="getExcel">导出</el-button>
                        <el-button type="primary" @click="addDocBefore">导入</el-button>
                        <input ref="doc-upload-input" class="doc-upload-input" type="file" @change="addDoc" />
                      </div>
                      <el-table
                        ref="multipleTable"
                        border
                        :data="mateList"
                        tooltip-effect="dark"
                        style="width: 100%"
                         highlight-current-row              
                        >             
                        <!--  <el-table-column
                          prop="mateName"
                          label="序号"
                          show-overflow-tooltip
                          width="80">
                        </el-table-column> -->
                        <el-table-column
                          fixed="left"
                          prop="mateModel"
                          label="规格型号"
                          show-overflow-tooltip
                          width="140">
                        </el-table-column>
                        <el-table-column
                          prop="mateName"
                          label="物料名称"
                          show-overflow-tooltip
                          width="140">
                        </el-table-column>
                          <el-table-column
                          prop="qtUnit"
                          label="单位"
                          show-overflow-tooltip
                          width="80">
                          <template scope="scope">
                            <el-input             
                            v-model="scope.row.qtUnit"
                            style="background:none;border:none;width:100%;"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="qtMateNum"
                          label="预计数量"
                          show-overflow-tooltip
                          width="80">
                        </el-table-column>
                        <el-table-column
                          prop="bsRealNum"
                          label="报价数量"
                          show-overflow-tooltip
                          width="80">
                          <template scope="scope">
                            <el-input             
                            v-model="scope.row.bsRealNum"
                            style="background:none;border:none;width:100%;"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="bsTaxUnitPrice"
                          label="含税单价"
                          show-overflow-tooltip
                          width="">
                          <template scope="scope">
                            <el-input             
                            v-model="scope.row.bsTaxUnitPrice"
                            style="background:none;border:none;width:100%;"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="bsTaxTotalPrice"
                          label="含税金额"
                          show-overflow-tooltip
                          width="">
                        <template scope="scope">
                          <el-input             
                          v-model="scope.row.bsTaxTotalPrice"
                          style="background:none;border:none;width:100%;"                                    
                          >{{calculateTotal(scope.row)}}</el-input>
                        </template>
                        </el-table-column>
                        <el-table-column
                          prop="bsDelDeadlineReal"
                          label="交期(天)"
                          show-overflow-tooltip
                          width="">
                          <template scope="scope">
                            <el-input             
                            v-model="scope.row.bsDelDeadlineReal"
                            style="background:none;border:none;width:100%;"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="bsStatus"
                          label="报价状态"
                          align="center"
                          show-overflow-tooltip
                          width="100">
                          <template slot-scope="scope">
                            <el-tag :type="statusFilter(scope.row.bsStatus)">{{ formatQt(scope.row.bsStatus)}}</el-tag>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="bsPackageMin"
                          label="最小包装"
                          show-overflow-tooltip
                          width="140">
                          <template scope="scope">
                            <el-input             
                            v-model="scope.row.bsPackageMin"
                            style="background:none;border:none;width:100%;"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="bsCusName"
                          label="品牌"
                          show-overflow-tooltip
                          width="140">
                          <template scope="scope">
                            <el-input             
                            v-model="scope.row.bsCusName"
                            style="background:none;border:none;width:100%;"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="bsCusCode"
                          label="品牌料号"
                          show-overflow-tooltip
                          width="140">
                          <template scope="scope">
                            <el-input             
                            v-model="scope.row.bsCusCode"
                            style="background:none;border:none;width:100%;"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="qtMateDesc"
                          label="报价备注"
                          show-overflow-tooltip
                          width="140">
                          <template scope="scope">
                            <el-input             
                            v-model="scope.row.qtMateDesc"
                            style="background:none;border:none;width:100%;"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          fixed="right"
                          label="操作"
                          show-overflow-tooltip
                          width="140">
                          <template scope="scope">
                            <el-button type="primary" @click="saveQuote(scope.row)">保存</el-button>
                            <el-button type="primary" @click="showAddDialog(scope.row)">添加</el-button>
                          </template>
                        </el-table-column> 
                    </el-table>
                    </div>
              <!--   报价说明 -->
                          
                  <div class="detail-table">
                       <h3 class="conttitle">报价说明</h3>
                       <el-form :inline="true"  :model="quoteData" :rules="ruleForm" ref="form" label-width="80px" class="formStly" size="small">
                          <el-form-item label="报价日期" prop="qtStartDate">
                           <el-date-picker  
                            style="width:250px;"                                              
                            v-model="quoteData.qtStartDate"
                            type="date"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                             placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>  
                        <el-form-item label="有效期至" prop="qtDeadLine">
                           <el-date-picker  
                            style="width:250px;"                                                 
                            v-model="quoteData.qtDeadLine"
                            type="date"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                         <el-form-item label="交货期" prop="qtDelDeadline">
                            <el-input v-model="quoteData.qtDelDeadline" placeholder="到款后10个工作日" style="width:250px;"></el-input>
                        </el-form-item>
                        <el-form-item label="交货地点" prop="qtDelLocation">
                            <el-input v-model="quoteData.qtDelLocation" placeholder="到款后10个工作日" style="width:250px;"></el-input>
                        </el-form-item>
                         <el-form-item label="验货方式" prop="qtAcceptType">
                            <el-input v-model="quoteData.qtAcceptType" placeholder="验货方式" style="width:250px;"></el-input>
                        </el-form-item>
                         <el-form-item label="付款方式" prop="qtPayMethod">
                            <el-input v-model="quoteData.qtPayMethod" placeholder="付款方式" style="width:250px;"></el-input>
                        </el-form-item>
                        <el-form-item label="补充说明" prop="qtDesc">
                            <el-input v-model="quoteData.qtDesc" placeholder="付款方式" style="width:250px;"></el-input>
                        </el-form-item>
                       </el-form> 
                        <center>
                            <el-button type="primary" style="width:200px; margin-top:25px" @click="hanleAddQuote">确认报价</el-button>                        
                        </center>  
                  </div>
              </el-tab-pane>

              <el-tab-pane label="询价单信息" name="second">
                  <div class="detail-table">
                       <h3 class="conttitle">询价单信息</h3>
                       <ul class="s-ul">
                          <li>
                             <span class="li-name01">询价标题:</span>
                             <span class="li-cont">{{enquiryData.eqTitle}}</span>
                          </li>
                           <li>
                             <span class="li-name01">询价代码:</span>
                             <span class="li-cont">{{enquiryData.eqCode}}</span>
                          </li>
                         <li>
                             <span class="li-name01">询价日期:</span>
                             <span class="li-cont">{{enquiryData.eqStartDate}}</span>
                          </li>
                          <li>
                             <span class="li-name01">截止日期:</span>
                             <span class="li-cont">{{enquiryData.eqDeadLine}}</span>
                          </li>                            
                       </ul>
                       <h3 class="conttitle">采购要求</h3>
                       <ul class="s-ul">
                          <li>
                             <span class="li-name01">工程地点:</span>
                             <span class="li-cont">{{enquiryData.eqLocation}}</span>
                          </li>
                           <li>
                             <span class="li-name01">付款方式:</span>
                             <span class="li-cont" style="color:blue;">{{enquiryData.eqPayMethod}}</span>
                          </li>
                          <li>
                             <span class="li-name01">是否含税:</span>
                             <span class="li-cont" v-if="enquiryData.eqIsTax==1">是</span>
                             <span class="li-cont" v-else>否</span>                            
                          </li>
                           <li>
                             <span class="li-name01">交货期限:</span>
                             <span class="li-cont">{{enquiryData.eqDelDeadline}}</span>
                          </li>
                           <li>
                             <span class="li-name01">税点:</span>
                             <span class="li-cont">{{enquiryData.eqTaxPoint}}</span>
                          </li>
                          
                           <li>
                             <span class="li-name01">补充信息:</span>
                             <span class="li-cont">{{enquiryData.eqDesc}}</span>
                          </li>
                       </ul>    
                  </div>
              </el-tab-pane>
            <el-tab-pane label="询价供应商" name="tride">
                 <!--   询价供应商 -->                          
                  <div class="detail-table">
                       <h3 class="conttitle">询价供应商</h3>
                         <el-table
                        ref="multipleTable"
                        border
                        :data="suppList"
                        tooltip-effect="dark"
                        style="width: 100%"
                         highlight-current-row              
                        >             
                       <!--   <el-table-column
                          prop="mateName"
                          label="序号"
                          show-overflow-tooltip
                          width="80">
                        </el-table-column> -->
                        <el-table-column
                          prop="suppChineseName"
                          label="供应商名称"
                          show-overflow-tooltip
                          width="160">
                        </el-table-column>
                        <el-table-column
                          prop="suppK3Code"
                          label="供应商编号"
                          show-overflow-tooltip
                          width="160">
                        </el-table-column>
                          <el-table-column
                          prop="suppContactName"
                          label="联系人"
                          show-overflow-tooltip
                          width="140">
                        </el-table-column>
                          <el-table-column
                          prop="suppMobile"
                          label="电话"
                          show-overflow-tooltip
                          width="140">
                        </el-table-column>
                          <el-table-column
                          prop="suppFax"
                          label="传真"
                          show-overflow-tooltip
                          width="140">
                        </el-table-column>
                          <el-table-column
                          prop="suppEmail"
                          label="邮箱"
                          show-overflow-tooltip
                          width="">
                        </el-table-column>
                        <!-- <el-table-column
                          prop="eqIsOnline"
                          label="在线报价"
                          show-overflow-tooltip>
                          <template slot-scope="scope">
                            <span>{{ formatStata(scope.row.eqIsOnline)}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="eqTotalPrice"
                          label="邮件提醒"
                          show-overflow-tooltip>
                          <template slot-scope="scope">
                            <span>{{ formatStata(scope.row.eqIsOnline)}}</span>
                          </template>
                        </el-table-column> -->
                        <el-table-column 
                        prop="eqTotalPrice" 
                        label="报价总金额" 
                        show-overflow-tooltip 
                        width="140">
                        <template slot-scope="scope">
                          <el-tag type="danger" v-if="scope.row.eqTotalPrice==null">未报价</el-tag>
                          <el-tag v-else>{{scope.row.eqTotalPrice}}</el-tag>
                        </template> 
                        </el-table-column>                    
                    </el-table>   
                  </div> 
            </el-tab-pane>              
            </el-tabs>          
       </el-card>
    <!-- 新增不同数量报价 start--> 
    <el-dialog title="新增报价" :visible.sync="dialog.docVisible" width="500px">
      <el-form :inline="true" :model="addForm">
        <el-form-item
          label="id"         
          prop="id"
          style="display: none" hidden>
          <el-input v-model="addForm.id"></el-input>
        </el-form-item>
        <el-form-item
          label="规格型号"         
          prop="mateModel">
          <el-input v-model="addForm.mateModel" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item
          label="物料名称"         
          prop="mateName">
          <el-input style="width:300px;" v-model="addForm.mateName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item
          label="预计数量"         
          prop="qtMateNum">
          <el-input style="width:300px;" v-model="addForm.qtMateNum" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item
          label="报价数量"         
          prop="bsRealNum">
          <el-input style="width:300px;" v-model="addForm.bsRealNum"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.docVisible = false">取 消</el-button>
        <el-button type="primary"  @click="doAdd">确 定</el-button>
      </div>
    </el-dialog>
    <!--新增不同数量报价 end-->

  </div>
</template>
<script>
import {getQuoteInfo,addQuote,addMateByNum,editMate,addQuoteExcel} from '@/api/quote'
  export default {
    name:'quoAdd',
    components:{
    
    },
    data() {
      return { 
        loading:false,       
        activeName: 'first',  
        mateList:[],
        suppList:[],
        enquiryData:[],
        quoteData:{
          qtMateList:[]
        },   
        //状态显示转换
        formatStata(status) {
          const statusMap = {
            0: "否",
            1: "是",
          };
          return statusMap[status];
        }, 
        ruleForm: {  
            qtStartDate: [{ required: true, message: '填写报价日期', trigger: 'blur' }],
            qtDeadLine: [{ required: true, message: '填写有效期', trigger: 'blur' }],                    
        },
        // el-tag类型转换
        statusFilter(status) {
          const statusMap = {
            1: "info",
            2: "primary",
            3: "primary",
            4: "success",
            5: "danger"
          };
          return statusMap[status];
        },
        // 报价状态显示转换
        formatQt(status) {
          const statusMap = {
            1: "未报价",
            2: "已报价",
            3: "审核中",
            4: "已采纳",
            5: "未采纳"
          };
          return statusMap[status];
        },
        addForm:{
        },
        dialog: {        
          docVisible: false,
        }
      }
    },  
    created(){
        this.getData(); 
    }, 
    methods: {
    //计算总价 
     calculateTotal: function (row) {
        row.bsTaxTotalPrice = row.bsTaxUnitPrice * row.bsRealNum
      return row.bsTaxTotalPrice
    },     
    handleSubmit(name){
        this.getData();
    },
    getData(){   
    //获取报价信息   
      const id = this.$route.query.id;
      getQuoteInfo(id).then(response => {
        this.loading = false;
        if(response.result){
          this.enquiryData= response.data.enquiryData;      
          this.quoteData = response.data.quoteData;
          this.mateList = response.data.mateList;         
          this.suppList = response.data.suppList;
        }else{
          this.$message.error(res.msg);
        }
      })   
      
    },
    //确认新增填写报价单
    hanleAddQuote(){
      this.quoteData.qtMateList=this.mateList;
      this.loading=true;
      if (this.$route.query.id != undefined){
        addQuote(this.quoteData).then(response => {
          this.loading = false
          if(response.result){
            this.$message.info(response.msg);
          }else{
            this.$message.error(response.msg);
          }
        })
      }else{           
        this.loading = false
        this.$message.error("报价不存在");
      }
    },
    /*返回报价列表*/
    backList(){
        this.$router.push({path: 'quoList',query:{}});
    },
    //新增报价模态框
    showAddDialog(row){
      this.addForm.id = row.id;
      this.addForm.mateName = row.mateName;
      this.addForm.mateModel = row.mateModel;
      this.addForm.qtMateNum = row.qtMateNum;
      this.addForm.bsRealNum = row.bsRealNum;
      this.dialog.docVisible = true;
    },
    //新增报价
    doAdd() {
      let filter=Object.assign({},{"id":this.addForm.id,"bsRealNum":this.addForm.bsRealNum});
      addMateByNum(filter).then(response => {
        if(response.result){
          this.dialog.docVisible = false;
          this.$message.info(response.msg);
          this.getData();
        }else{
          this.$message.error(response.msg);
        }
      });
    },
    saveQuote(row){
      editMate(row).then(response => {
        if(response.result){
          this.$message.info(response.msg);
          this.getData();
        }else{
          this.$message.error(response.msg);
        }
      })
    },
    //sxw-20200423-导出报价
    getExcel() {
      window.location.href =
      process.env.BASE_API + "/quoteMateriel/getQuoteExcel?qtId=" + this.$route.query.id;
    },
    //sxw-20200423-导入报价
    addDoc(e) {
      //获取上传的文件
      const files = e.target.files;
      const rawFile = files[0];
      if(rawFile != null && rawFile != undefined){
        //封装数据
        let formData = new FormData();
        formData.append('file', rawFile);
        addQuoteExcel(formData).then(response => {
          if(response.result){
            if(response.data != null && response.data.length > 0){
              this.mateList = response.data; 
            }
            this.$message.info(response.msg);
          }else{
            this.$message.error(response.msg);
          }
        });
      }
    },
    addDocBefore() {
      this.$refs['doc-upload-input'].click();
    },

    }
  }
</script>
<style>
    .block {
    text-align: right;
    margin-top: 10px;
}

   .detail-table{
    margin: 7px 0 0 0;
    padding: 0 0 10px 0;
    clear: both;
    overflow: hidden;
   }
   .s-ul{
    margin: 0 0 10px 0;
    padding: 0;
    clear: both;
    overflow: hidden;
    width: 100%;
   }
   
   .el-card__header{
     padding:6px 20px!important ;
    
   }
   .formStly{
    margin-top:10px;
   }
   .doc-upload-input{
    display: none;
    z-index: -9999;
  }

</style>