<template>
  <div v-loading="load" element-loading-text="数据加载中，请稍等">
    <!-- <Row> -->
    <el-row style="margin-bottom:5px;margin-top:5px;">
      <el-col :span="16">
        <el-button type="button" @click="toList" style="margin-left: 15px;">返回</el-button>    
      </el-col>
    </el-row>
    <el-collapse
      v-model="activeNames"
      v-show="isShow">
      <el-collapse-item title="设置参数" name="1" class="collapse">
        <el-row>
          <el-col :span="24" style="margin-bottom:-10px;">
            <el-form
              :inline="true"
              ref="formQuery"
              :model="formQuery"
              :rules="rules"
              class="demo-form-inline"
              label-width="60px"
              :label-position="labelPosition">
              <el-col :span="24" style="margin-bottom:-10px;margin-top:5px;">
                <el-form-item label="品牌料号">
                  <el-select  v-model="formQuery.brandNumberCol" placeholder="品牌料号" style="width:185px">
                    <el-option
                      v-for="item in optionHearder"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <!--按钮-->
              <el-col>
                <el-form-item style="margin-left:15px;">
                  <el-button type="primary" @click="doSimilarity('formQuery')">开始匹配K3数据</el-button>
                  <el-button type="primary" @click="exportBom()">导出Excel</el-button>
                </el-form-item>
              </el-col>
            </el-form>
          </el-col>
        </el-row>
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
      row-key="bomId"
      @expand-change="rowExpand"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="45"></el-table-column>

      <el-table-column type="expand" prop="children">
        <template slot-scope="props">
          <el-form
            label-position="left"
            inline
            class="demo-table-expand"
          >
            <el-button type="primary" @click="showMateView(props.row.bomId)" style="margin-top:10px;margin-left:47px;">查询物料</el-button>
            <el-table
              :data="props.row.childrenData"
              border
              v-loading="loading"
              element-loading-text="数据加载中，请稍等"
              :highlight-current-row="true"
              style="width: 1154px;margin-top:10px;margin-left:47px;font-size: 12px"
            >
              <el-table-column 
                label="序号" 
                type="index" 
                width="50"
                show-overflow-tooltip
                fixed
              />
              <el-table-column
                prop="fNumber"
                label="物料编号"
                width="110"
                show-overflow-tooltip
                fixed
              />
              <el-table-column
                prop="fName"
                label="物料名称"
                width="90"
                show-overflow-tooltip
              />
              <el-table-column
                prop="fModel"               
                label="物料规格"
                width="283"
                show-overflow-tooltip
              />
              <el-table-column
                prop="mateCusName"
                label="品牌"
                width="100"
                show-overflow-tooltip
              />
              <el-table-column
                prop="mateCusCode"
                label="品牌料号"
                width="180"
                show-overflow-tooltip
              />
              <el-table-column
                prop="suppChineseName"
                label="供应商"
                width="100"
                show-overflow-tooltip
              />
              <el-table-column
                prop="modifiedName"
                label="修改人"
                width="80"
                show-overflow-tooltip
              />
              <el-table-column
                label="状态"
                width="60"
                fixed="right"
              >
                <template slot-scope="scope1">
                  <span v-if="scope1.row.checkStatus===0" style="color:green;font-weight:bold;">未选中</span>
                  <span v-if="scope1.row.checkStatus===1" style="color:red;font-weight:bold;">已选中</span>
                </template>
              </el-table-column>
              <el-table-column
                label="取消/选中"
                width="100"
                fixed="right"
              >
                <template slot-scope="scope1">
                  <el-button
                    type="success"
                    v-if="scope1.row.checkStatus===0"
                    icon="el-icon-check"
                    @click="doCheck('1',scope1.row)"
                  >选中</el-button>
                  <el-button
                    type="danger"
                    v-if="scope1.row.checkStatus===1"
                    icon="el-icon-close"
                    @click="doCheck('0',scope1.row)"
                  >取消</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </template>
      </el-table-column>

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
        width="150"
        show-overflow-tooltip
      /> <!-- v-if="item!='mateCategory'" -->
      <el-table-column
        prop="checkCode"
        label="选中的物料号"
        width="150"
        show-overflow-tooltip>
      </el-table-column>

    </el-table>

    <!-- K3物料列表 -->
    <el-dialog title="K3物料列表" :visible.sync="showMateVisible" width="1000px">
      <div>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="物料编号">
            <el-input v-model="mateCode" placeholder="请准确输入物料编号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchMate">查找</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table border :data="showMateList" tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="mateK3Code" label="编号" show-overflow-tooltip />
        <el-table-column prop="mateName" label="名称" show-overflow-tooltip />
        <el-table-column prop="mateModel" label="规格" show-overflow-tooltip />
        <el-table-column prop="suppChineseName" label="供应商名称" show-overflow-tooltip />
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <el-button type="primary" @click="chooseMate(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="mateFooter">
        <el-button type="primary" @click="showMateVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getBomData,getK3Bom,getBomMatch,doCheckMateriel,addMate } from "@/api/quality";
import MessageBoxDelete from "./components/MessageBox.vue";
import { getPermission } from '@/api/role';
import { getMateList } from '@/api/costMate';
export default {
  name: "qualityBomDetail",
  components: { MessageBoxDelete },
  data() {
    return {     
      tableData: [],      
      tableHeader: [],
      labelPosition:'right',
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
      formQuery: {
        brandNumberCol: "",
        isCustomer:0
      },
      optionHearder: [],
      bomParamsId:"",
      rules: {
        brandNumberCol: [
          { required: true, message: "请选择品牌料号列", trigger: "change" }
        ]
      },
      currentRow: [],
      showMateVisible: false,//K3物料显示列表
      mateCode: '',//K3物料编号搜索
      showMateList: [],//K3物料列表
      showBomId: 0,//物料选择框的BomId
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
      getBomData(fileId).then(response => {
        if (!response.result) {
          this.$message.error(response.msg);
          return;
        }
        //填充表格数据
        this.tableHeader = response.data.header;
        this.tableData = response.data.results;

        //填充下拉框数据
        this.optionHearder = [];
        this.optionHearder.push({ value: "", label: "无"});
        this.tableHeader.forEach(element => {
          var option = { value: element, label: element };
          this.optionHearder.push(option);
        });

        if(response.data.bomParams.brandNumberCol)
          this.formQuery.brandNumberCol = response.data.bomParams.brandNumberCol;

        this.bomParamsId = response.data.bomParams.id;

        //设置控件的展示
        this.fileId = fileId;
        this.isShowTable = true;
        this.isShow = true;
      });
    },
    toList() {
      this.$router.push({ path: "qualityBomList", query: this.$route.query });
    },
    //选中行
    handleSelectionChange(val){ 
      this.multipleSelection = val;
    }, 
    doSimilarity(formName) {    
      this.load=true;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let filter = Object.assign(
                {},
                this.formQuery,
                {fileId:this.fileId}
            );
            getK3Bom(filter).then(response => {
               if (!response.result) {
              this.$message.error(response.msg);
              return;
            }
            this.$message.info("匹配成功，请点击行展开查看!");
            this.tableHeader = response.data.header;
            this.tableData = response.data.results;
            this.isShowTable = true;
            this.load=false;
            location.reload();
          });
        } else {
          this.load=false;
          this.$message.error("请设置好品牌料号对应的列！");
          return false;
        }
      });
    },
    // 展开父表格数据 并查询该数据下的子数据
    rowExpand(row, expandedRows) {
      this.loading = true;
      this.currentRow = row;
      // 打印父任务内容 
      //console.log(row)
      getBomMatch(row.bomId).then(response => {
        if (response.result) {
          //
          row.childrenData = response.data.bomMatchList;//匹配的物料表
          this.currentRow.checkStatus =  response.data.bomList.checkStatus; //改变行颜色
          this.currentRow.checkCode = response.data.bomList.checkCode; //获取选中的K3物料号

          this.loading = false;
        }else{
          this.loading = false;
          this.$message.error(response.msg);
          return;
        }
      });
      //如果展开行数大于1
      if(expandedRows.length>1){
        //shift() 方法用于把数组的第一个元素从其中删除，并返回第一个元素的值。
        expandedRows.shift();
      }
    },
    doCheck(isCheck, rows) {
      doCheckMateriel(rows.id, isCheck).then(response => {
        if (!response.result) {
          this.$message.error(response.msg);
          return;
        }
        this.$message.info("操作成功!");
        this.currentRow.childrenData = response.data.bomMatchList;

        this.currentRow.checkStatus = isCheck; //改变行颜色
        this.currentRow.checkCode = response.data.bomList.checkCode; //获取选中的K3物料号
      });
    },
    showMateView(bomId) {
      this.showBomId = bomId;
      this.showMateVisible = true;
    },
    searchMate() {
      let filter=Object.assign({},{"mateCode":this.mateCode});
      getMateList(filter).then(response => {
        if (response.result) {
          this.showMateList = response.data;
        } else {
          this.$message.error(response.msg);
        }
      })
    },
    chooseMate(row) {
      this.showMateVisible = false;
      let filter=Object.assign({},{"id":row.id,"bomId":this.showBomId});
      addMate(filter).then(response => {
        if(response.result){
          var bomMatchId = response.data.id;
          //选中刚刚选择的物料
          doCheckMateriel(bomMatchId, 1).then(res => {
            if(res.result){
              this.currentRow.childrenData = res.data.bomMatchList;
              this.currentRow.checkStatus = 1; //改变行颜色
              this.currentRow.checkCode = res.data.bomList.checkCode; //获取选中的K3物料号
            }else{
              this.$message.error(response.msg);
            }
          })
        }else{
          this.$message.error(response.msg);
        }
      });
    },
    //导出Excel
    exportBom(){   
      window.location.href =
      process.env.BASE_API + "/qualityBom/getBomExcel?fileId=" + this.fileId;
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