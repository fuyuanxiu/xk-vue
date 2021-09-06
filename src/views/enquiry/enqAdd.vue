<template>
  <div class="container" >     
    <el-card class="box-card" shadow="never" v-loading="loading"> 
      <div slot="header" class="clearfix">
        <span>新增询价单</span>
      </div>
      <el-form :model="enquiryData" :rules="ruleForm" ref="form" label-width="80px" class="formStly" size="small">    
        <div class="newcont01 item">
          <div class="">
            <h3 class="conttitle">询价标题</h3>            
              <el-row type="flex" class="row-bg" >
                <el-col :span="11">
                  <el-form-item label="询价标题" prop="eqTitle">
                    <el-input v-model="enquiryData.eqTitle"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>                   
          </div>
        </div> 
      </el-form>
 
      <!-- 询价物料 --> 
      <div class="newcont02 item">           
        <div class="enqtitle">
          <h3 class="conttitle">询价物料</h3>     
          <el-form :model="materiel" :rules="ruleForm" ref="form" label-width="80px" class="formStly" size="small">     
            <el-row type="flex" class="row-bg" >
              <el-col :span="6">
                <el-form-item label="规格型号" prop="mateModel">
                  <el-input v-model="materiel.mateModel"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="物料名称" prop="mateName">
                  <el-input v-model="materiel.mateName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="物料单位" prop="eqUnit">
                  <el-input v-model="materiel.eqUnit"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" class="row-bg" >
              <el-col :span="6">
                <el-form-item label="品牌名称" prop="bsCusName">
                  <el-input v-model="materiel.bsCusName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="品牌料号" prop="bsCusCode">
                  <el-input v-model="materiel.bsCusCode"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="预计数量" prop="eqMateNum">
                  <el-input type="number" v-model="materiel.eqMateNum"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" class="row-bg" >
              <el-col :span="6">
                <el-form-item label="补充信息" prop="eqMateDesc">
                  <el-input v-model="materiel.eqMateDesc"></el-input>
                </el-form-item>
              </el-col>                          
              <el-col :span="12" style="margin-left:15px;">
                <el-button type="primary" icon="el-icon-plus" @click="addMateriel">添加物料</el-button>
                <el-button type="warning" icon="el-icon-download" @click="getTempByType">下载物料模板</el-button>
                <!-- 导入 start-->
                <el-button type="danger" icon="el-icon-upload2" @click="addDocBefore">导入物料数据</el-button>
                <input ref="doc-upload-input" class="doc-upload-input" type="file" @change="addDoc" />
                <!-- 导入 end-->
              </el-col>
            </el-row>
          </el-form>                   
        </div>
        <template>
          <el-table
            ref="multipleTable"
            border
            :data="materielList"
            tooltip-effect="dark"
            style="width: 100%"
             highlight-current-row              
            >             
            <el-table-column type="index" width="50" fixed>
            </el-table-column>
            <el-table-column
              prop="mateModel"
              label="规格型号"
              show-overflow-tooltip
              width="300">
            </el-table-column>
            <el-table-column
              prop="mateName"
              label="物料名称"
              show-overflow-tooltip
              width="160">
            </el-table-column>
            <el-table-column
              prop="bsCusName"
              label="品牌名称"
              show-overflow-tooltip
              width="100">
            </el-table-column>
            <el-table-column
              prop="bsCusCode"
              label="品牌料号"
              show-overflow-tooltip
              width="100">
            </el-table-column>
            <el-table-column
              prop="eqUnit"
              label="单位"
              show-overflow-tooltip
              width="100">
            </el-table-column>
            <el-table-column
              prop="eqMateNum"
              label="预计数量"
              show-overflow-tooltip
              width="100">
            </el-table-column>
            <el-table-column
              prop="eqMateDesc"
              label="补充信息"
              show-overflow-tooltip
              width="140">
            </el-table-column>
            <el-table-column
              prop="suppGrade"
              label="点击取消"
              fixed="right"
              show-overflow-tooltip>
              <template scope="scope">       
                <span><a class="operatIcon colorblue" @click="romoveMateriel(scope.row)"><i class="el-icon-delete"></i></a></span>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
      <!-- 询价供应商 -->
      <div class="newcont02 item">           
        <div class="enqtitle">
          <h3 class="conttitle">询价供应商</h3>     
          <el-row type="flex" class="row-bg" >
            <el-col :span="4">
              <el-button type="primary" icon="el-icon-plus" style="margin-left:15px;margin-bottom: 14px;" @click="getSuppData">添加供应商</el-button>    
            </el-col>
          </el-row>
        </div>
      </div>
      <template>
        <el-table
          ref="multipleTable"
          border
          :data="supplierList"
          tooltip-effect="dark"
          style="width: 100%"
           highlight-current-row              
          >             
          <el-table-column
            type="index"
            width="50"
            fixed>
          </el-table-column>
          <el-table-column
            prop="suppCode"
            label="供应商编号"
            show-overflow-tooltip
            width="200">
          </el-table-column>
          <el-table-column
            prop="suppChineseName"
            label="供应商全称"
            show-overflow-tooltip
            width="200">
          </el-table-column>
          <el-table-column
            prop="suppK3Code"
            label="K3编码"
            show-overflow-tooltip
            width="100">
          </el-table-column>              
          <el-table-column
            prop="suppContactName"
            label="联系人"
            show-overflow-tooltip
            width="100">
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
            width="140">
          </el-table-column>
          <!-- <el-table-column
            prop="eqIsOnline"
            label="在线报价"
            show-overflow-tooltip> 
            <template scope="scope">       
              <span v-if="scope.row.eqIsOnline==1">是</span>
              <span v-if="scope.row.eqIsOnline==0">否</span>
            </template>               
          </el-table-column>
          <el-table-column
            prop="eqIsEmail"
            label="邮箱提醒"
            show-overflow-tooltip>
            <template scope="scope">       
              <span v-if="scope.row.eqIsEmail==1">是</span>
              <span v-if="scope.row.eqIsEmail==0">否</span>
            </template>                   
          </el-table-column> -->
          <el-table-column
            prop="suppGrade"
            label="点击取消"
            fixed="right"
            show-overflow-tooltip>
            <template scope="scope">       
              <span><a class="operatIcon colorblue" @click="romoveSupplier(scope.row)"><i class="el-icon-delete"></i></a></span>
            </template>                 
          </el-table-column>
        </el-table>
      </template> 
      <!-- 采购要求 -->  
      <!-- 20191114-sxw-去除采购要求 -->
      <!-- <el-form :model="enquiryData" :rules="ruleForm" ref="form" label-width="80px" class="formStly" size="small">      
        <div class="newcont01 item">           
          <div class="enqtitle">
            <h3 class="conttitle">采购要求</h3>            
            <el-row type="flex" class="row-bg" >
              <el-col :span="8">
                <el-form-item label="询价日期" prop="eqStartDate">
                  <el-date-picker  
                    style="width:100%;"                                               
                    v-model="enquiryData.eqStartDate"
                    type="datetime"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="截止日期" prop="eqDeadLine">
                  <el-date-picker  
                    style="width:100%;"                                               
                    v-model="enquiryData.eqDeadLine"
                    type="datetime"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row> 
              <el-row type="flex" class="row-bg" >
                <el-col :span="8">
                  <el-form-item label="工程地点" prop="eqLocation">
                    <el-input v-model="enquiryData.eqLocation"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="付款方式" prop="eqPayMethod">
                    <el-input v-model="enquiryData.eqPayMethod"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="交货期限" prop="eqDelDeadline">
                    <el-input v-model="enquiryData.eqDelDeadline"></el-input>
                  </el-form-item>
                </el-col>
              </el-row> 
              <el-row type="flex" class="row-bg" >
                <el-col :span="8">
                  <el-form-item label="税点" prop="eqTaxPoint">
                    <el-input v-model="enquiryData.eqTaxPoint"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="开票要求" prop="">
                    <el-radio-group v-model="enquiryData.eqIsTax">
                      <el-radio :label="1">含税</el-radio>
                      <el-radio :label="0">不含税</el-radio>                          
                    </el-radio-group>                         
                  </el-form-item>
                </el-col>
              </el-row>
          </div>
        </div> 
      </el-form> -->
        <div class="newcont04"></div> 
        <center> <el-button v-if="permit.ADD" type="primary" style="width:200px;" @click="hanleAddEnquiry">确认发布</el-button></center>  
    </el-card>

    <!--选择供应商-->
    <el-dialog title="添加供应商" :visible.sync="dialog.suppVisible" width="1000px">
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
      <el-table border :data="suppAllList" tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="id" label="ID" show-overflow-tooltip />
        <el-table-column prop="suppCode" label="供应商编号" show-overflow-tooltip />
        <el-table-column prop="suppChineseName" label="中文名称" show-overflow-tooltip />
        <el-table-column prop="suppK3Code" label="K3编码" show-overflow-tooltip />
        <el-table-column prop="suppContactName" label="联系人" show-overflow-tooltip />
        <el-table-column prop="suppMobile" label="联系人" show-overflow-tooltip />
        <el-table-column prop="suppFax" label="传真" show-overflow-tooltip />
        <el-table-column prop="suppEmail" label="邮箱" show-overflow-tooltip />
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
        <el-table-column prop="id" label="ID" show-overflow-tooltip />
        <el-table-column prop="suppCode" label="供应商编号" show-overflow-tooltip />
        <el-table-column prop="suppChineseName" label="中文名称" show-overflow-tooltip />
        <el-table-column prop="suppK3Code" label="K3编码" show-overflow-tooltip />
        <el-table-column prop="suppContactName" label="联系人" show-overflow-tooltip />
        <el-table-column prop="suppMobile" label="联系人" show-overflow-tooltip />
        <el-table-column prop="suppFax" label="传真" show-overflow-tooltip />
        <el-table-column prop="suppEmail" label="邮箱" show-overflow-tooltip />
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <el-button type="danger" @click="deleteSupp(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="suppFooter">
        <el-button type="primary" @click="dialog.suppVisible = false">关闭</el-button>
        <el-button type="primary" @click="addSupplier">确认</el-button>
      </div>
    </el-dialog>     
  </div>
 
</template>
<script>
import {addEnquiry,getEnquiryInfo,editEnquiry,importMateExcel} from '@/api/enquiry'
import {getSupplierList} from '@/api/supplier'
import {getPermByRouterCode} from '@/api/perm'
export default {
  name:'enqAdd',
  components:{
  
  },
  data() {
    return {
      loading:false,    
      supplierInfo:{
        suppK3Code:"",
        suppAliaName:"",
        suppContactName:"",
        suppChineseName:"",
        eqIsOnline:true,
        eqIsEmail:true,
        suppMobile:"",
        suppFax:"",
        suppEmail:"",
        eqMateDesc:"",
        suppId:"",
        suppNum:""
      },    
      options:{},
      enquiryData:{
        eqMateList:[],
        eqSuppList:[]
      },
      ruleForm: {  
        mateModel: [{ required: true, message: '请输入规格型号', trigger: 'blur' }],     
      },
      mateNum:1,
      suppNum:1,       
      materiel:{
        mateNum:"",
        mateName:"",
        mateModel:"",
        eqUnit:"",
        eqMateNum:"",
        eqMateDesc:""
      }, 
      materielList:[],   
      supplierList:[],
      dialog: {        
        suppVisible: false,
        keyword: ''
      },
      suppAllList: [],
      suppSelectedList: [],
      suppParams: {
        page: 1,
        rows: 5
      },
      suppPSList: [5, 10, 20, 30],
      suppTotal: 0, //数据的总条数,
      permit:{
        //权限控制
        ADD:false
      },
    }
  }, 
  created(){
    this.getData();
    this.getPermit();
  },
  /* watch:{
    '$route':"getData"
  },*/
  methods: {
    getPermit(){
      var routerCode = this.$route.name;
      getPermByRouterCode(routerCode).then(response => {
        if(response.result){
          if(response.data == "admin"){
            this.permit.ADD = true;
          }else{
            var list = response.data;
            for(var i = 0; i < list.length; i++){
              if(list[i].permCode == "ADD") this.permit.ADD = true;
            }
          }
        }else{
          this.$message.error(response.msg);
        }
      });
    },   
    getData(){    
      if (this.$route.query.id != undefined){
        this.loading = true;
        const id=this.$route.query.id
        getEnquiryInfo(id).then(response => {    
          this.loading = false;             
          if(response.result) {             
            this.materielList = response.data.mateList;
            this.supplierList= response.data.suppList; 
            this.enquiryData= response.data.enquiryData;       
          }else {
            this.$message.error(response.msg);
          }      
        })
      }
    },   
    addMateriel(){
      //添加物料
      var records = Object.assign({},this.materiel)
      /*records.mateNum = this.mateNum;
      records.mateName = this.materiel.mateName
      records.eqUnit = this.materiel.eqUnit
      records.mateModel = this.materiel.mateModel
      records.eqMateNum = this.materiel.eqMateNum
      records.eqMateDesc = this.materiel.eqMateDesc*/
      this.materielList.push(records)
      this.mateNum ++;
    },
    romoveMateriel(item){
      this.materielList.splice(item,1)
      /* for(var n=0;n<this.materielList.length;n++){
           var m = this.materielList[n];
           if(m.mateNum == item.mateNum){
               this.materielList.splice(n,1)
           }
       }*/
    },
    handleSelectSupplier(item) {       
      this.supplierInfo.suppId = item.id;
      this.supplierInfo.suppK3Code = item.suppK3Code;
      this.supplierInfo.suppChineseName=item.suppChineseName;
      this.supplierInfo.suppAliaName=item.suppAliaName;
      this.supplierInfo.suppContactName=item.suppContactName;
      this.supplierInfo.suppMobile=item.suppMobile;
      this.supplierInfo.suppEmail=item.suppEmail;
    },
    //添加供应商
    // addSupplier(){   
    //   var arr = {};    
    //   arr.suppNum=this.suppNum;
    //   arr.suppId=this.supplierInfo.suppId
    //   arr.suppK3Code=this.supplierInfo.suppK3Code;   
    //   arr.suppChineseName=this.supplierInfo.suppChineseName;
    //   arr.suppAliaName=this.supplierInfo.suppAliaName;
    //   arr.suppContactName=this.supplierInfo.suppContactName;
    //   arr.suppMobile=this.supplierInfo.suppMobile;
    //   arr.suppFax=this.supplierInfo.suppFax;
    //   arr.suppEmail=this.supplierInfo.suppEmail;
    //   arr.eqIsOnline=this.supplierInfo.eqIsOnline==true?1:0;
    //   arr.eqIsEmail=this.supplierInfo.eqIsEmail==true?1:0;
    //   this.supplierList.push(arr);       
    //   this.suppNum++;
    // },
    romoveSupplier(item){
      this.supplierList.splice(item,1)
      // for(var n=0;n<this.supplierList.length;n++){
      //   var m = this.supplierList[n];
      //   if(m.suppNum == item.suppNum){
      //     this.supplierList.splice(n,1)
      //   }
      // }
    },
    //新增询价
    hanleAddEnquiry(){
      //物料和供应商不运行为空
      if(this.materielList.length==0){
        this.$message.info('物料信息不允行为空');
        return
      } 
      if(this.supplierList.length==0){
        this.$message.info('供应商信息不允行为空');
        return
      } 

      this.loading = true
      this.enquiryData.eqMateList=this.materielList;
      this.enquiryData.eqSuppList=this.supplierList;
      if (this.$route.query.id != undefined){
        editEnquiry(this.enquiryData).then(response => { 
          this.loading = false
          this.$message.info("询价发布成功！");
        })
      }else{
        addEnquiry(this.enquiryData).then(response => { 
          this.loading = false
          this.$message.info(response.msg);
        })
      }
    },
    //获取所有供应商数据
    getSuppData() {
      this.dialog.suppVisible = true;
      this.suppSelectedList = [];
      let filter=Object.assign({},this.suppParams,{suppGrade:2},{keyword:this.dialog.keyword});
      getSupplierList(filter).then(response => {
        if (response.result) {          
          this.suppAllList = response.data.rows;
          this.suppTotal = response.data.total;          
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
    addSupplier() {
      for(var i=0; i<this.suppSelectedList.length; i++){
        var item = this.suppSelectedList[i];//获取选择的供应商
        var arr = {};//初始化新增供应商
        arr.suppNum = this.suppNum;
        arr.suppId = item.id;
        arr.suppCode = item.suppCode;
        arr.suppK3Code = item.suppK3Code;
        arr.suppChineseName = item.suppChineseName;
        arr.suppAliaName = item.suppAliaName;
        arr.suppContactName = item.suppContactName;
        arr.suppMobile = item.suppMobile;
        arr.suppFax = item.suppFax;
        arr.suppEmail = item.suppEmail;
        this.supplierList.push(arr);
        this.suppNum++;
      }
      this.dialog.suppVisible = false;
    },
    suppChangePage(page) {
      this.suppParams.page = page;
      this.getSuppData();
    },
    suppSizeChange(size) {
      this.suppParams.rows = size;
      this.getSuppData();
    },
    //下载询价物料模板
    getTempByType() {
      window.location.href = process.env.BASE_API + "/templates/getTempByType?bsType=1";
    },
    //导入物料数据
    addDoc(e) {
      //获取上传的文件
      const files = e.target.files;
      const rawFile = files[0];
      if(rawFile != null && rawFile != undefined){
        //封装数据
        let formData = new FormData();
        formData.append('file', rawFile);
        importMateExcel(formData).then(response => {
          if(response.result){
            var list = response.data;
            for(var i = 0; i < list.length; i++){
              var item = list[i];//获取导入的物料
              var arr = {};//初始化新增物料
              arr.mateModel = item.mateModel;
              arr.mateName = item.mateName;
              arr.eqUnit = item.eqUnit;
              arr.eqMateNum = item.eqMateNum;
              arr.eqMateDesc = item.eqMateDesc;
              this.materielList.push(arr);
              this.mateNum++;
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
    li{list-style: none}
   .container{
      padding:5px;
   }
   .container .el-card__header{
     padding:5px 20px;
   }
   .enqtitle{
     width:100%;
     border-bottom: 1px dashed #e5e5e5;
   }
 
   .item{       
    display: inline;
    margin: 0;
    padding: 0 0 5px 0;
    width: 100%;
   }
   .enqAddbtn{
    padding:5px 5px 5px;
   }
   .invoice{
        width:100%;
        border:1px solid #d9d9d9;
   }
   .newcont04{   
    margin: 15px 0 0 0;
    padding: 5px 0 0 0;
    width: 100%;
   }
  .block {
    text-align: right;
    margin-top: 10px;
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
  .doc-upload-input{
    display: none;
    z-index: -9999;
  }
</style>