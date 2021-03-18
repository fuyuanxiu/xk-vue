<template>
  <div element-loading-text="数据加载中，请稍等">
    <!-- <Row> -->
                              <el-card style="padding-bottom: 0;border:none;">
            <el-row>
                <el-col :span="25">
                    <el-form :inline="true" class="demo-form-inline">
                      <el-form-item label="关键字:">
                        <el-input  @keyup.enter.native="getLogList()"  placeholder="关键字" v-model="queryParams.keyword" class="search-input"></el-input>
                      </el-form-item>
                      <el-form-item>
                         <el-button v-if="permit.SEARCH" type="primary" @click="getLogList()">查找</el-button>
                      </el-form-item>
                      <el-form-item>
                         <el-button type="info" @click="reset()">重置</el-button>
                      </el-form-item>
                  </el-form>
                </el-col>
            </el-row>           
        </el-card>
    <el-table :data="iTable" class="market-table">
      <el-table-column type="index" label="序号" width="50" show-overflow-tooltip/>
      <el-table-column prop="username" label="操作账号" show-overflow-tooltip width="110">
      </el-table-column>
      <el-table-column prop="moduleName" label="模块" width="150" show-overflow-tooltip>
        </el-table-column>
      <el-table-column prop="methodName" label="操作" width="150" show-overflow-tooltip >
      </el-table-column>

      <el-table-column prop="ip" label="登录IP" width="150" show-overflow-tooltip>
      </el-table-column>
         <el-table-column label="结果" width="90" show-overflow-tooltip>
           <template slot-scope="scope">
        <el-tag
          :type="scope.row.operation === '操作成功' ? 'primary' : 'danger'"
          size="small"
          disable-transitions>{{scope.row.operation}}</el-tag>
      </template>        
      </el-table-column>
      <el-table-column  label="时间" width="200"  show-overflow-tooltip>
         <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.createdTime }}</span>
         </template>
      </el-table-column>
      <el-table-column prop="params" label="参数" min-width="260" show-overflow-tooltip/>
    </el-table>
    <div class="block">
      <el-pagination
        :current="1"
        :current-page.sync="queryParams.page"
        :page-sizes="pageSizesList"
        :page-size="queryParams.rows"
        :page-size-opts="pageSizesList"
        :total="totalCount"
        class="pull-right clearfix"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="changePage"
        @size-change="sizeChange"
      />
    </div>
  </div>
</template>

<script>
import messagebox from '@/components/Dialog/MessageBox.vue'
import { getlist } from '../../api/operateLog'
 //import { getPermission } from '@/api/role'
// import { getReport, addReport, editReport, delReport, getDetail, addDetail, editDetail, delDetail, getDetailList, getExcelSplit } from '@/api/marketReport'
// import { editCheckStatus, editUncheckStatus, getCheckStatu, getReportId } from '../../api/marketReport'
 import { getPermByRouterCode } from '../../api/perm'
export default {
  name: 'operateLog',
  components: { messagebox },
  data() {
    return {
      checked: false,
      labelPosition: 'right',
      iTable: [],
      formQuery: {
        id: null,
        bsCustomer: '',
        bsMachine: '',
        bsBomCode: '',
        bsFileId: null,
        bsDiscountId: null,
        bsFlowId: null,
        feeId2: null, // 计费方式-工时ID
        feeId3: null// 计费方式-夹具ID
      },
      queryParams: {
        keyword: '',
        page: 1,
        rows: 15
      },
      pageSizesList: [10, 15, 20, 30, 40, 50, 100],
      totalCount: 0, // 数据的总条数,
      fileId: '',
      currentRow: [],
      multipleSelection: [],
      // el-tag类型转换
      statusFilter(status) {
        const statusMap = {
          0: 'info',
          1: 'info'
        }
        return statusMap[status]
      },
      // 清单类型显示转换
      formatStatus(status) {
        const statusMap = {
          0: '否',
          1: '是'
        }
        return statusMap[status]
      },
      isBomPrice: false,// 是否有查看价格权限
      permit:{
        //权限控制
        SEARCH:false
      }
    }
  },
  computed: {

  },
  created() {
    // 非新增
    // this.getCheckStatus(this.formQuery.id)
    this.getPermit()
     this.getLogList()
    // 获取当前角色的操作权限
    // getPermission().then(response => {
    //   if(response.result){
    //       if(response.data.isSuper == 1){
    //         this.isBomPrice = true;
    //       }else{
    //         //查看价格权限
    //         if(response.data.perm != "" && response.data.perm.indexOf("BOM_PRICE") >= 0){
    //           this.isBomPrice = true;
    //         }
    //       }
    //   }else{
    //     this.$message.error(response.msg);
    //   }
    // });
  },
  methods: {
      // 获取详情列表数据
    getLogList() {
        const filter = Object.assign({}, { keyword: this.queryParams.keyword,rows: this.queryParams.rows, page: this.queryParams.page })
        // if(this.queryParams.keyword!=null){
        //    const filter = Object.assign({}, { keyword: '',rows: this.queryParams.rows, page: this.queryParams.page })
        // }
        getlist(filter).then(response => {
          if (response.result) {
            this.iTable = response.data.rows
            this.totalCount = response.data.total
          }
        })
      },
      reset(){
     this.queryParams.keyword=''
      },
    changePage(page) {
      this.queryParams.page = page
      this.getLogList()
    },
    sizeChange(size) {
      this.queryParams.rows = size
      this.getLogList()
    },
    // 获取权限
    getPermit() {
      var routePath = this.$route.name;
      getPermByRouterCode(routePath).then(res => {
        if (res.result) {
          if (res.data == 'admin') {
             this.permit.SEARCH=true
          }else{
            var list = res.data;
            for(var i = 0; i < list.length; i++){
               if(list[i].permCode == "SEARCH") this.permit.SEARCH = true;
            }
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    }

  }

}
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
.market-table .el-input-number--mini{
  width: 80px;
}
</style>
