<template>
  <div>
    <!--搜索框-->
    <div class="retrieval">
      <div class="title">
        <h3>状态</h3>
        <div class="filter">
          <ul>
            <li v-for="(item,index) in items" :key="index" @click="addClass(index)"
              v-bind:class="{ current:index==current}">
              <a @click="changeStatus(index)"><span>{{item.sort}}</span></a>
            </li>
          </ul>
        </div>
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
                <el-button v-if="permit.SEARCH" type="primary" size="mini"  @click="getData">查找</el-button>
                <el-button type="info" size="mini"  @click="resetFrom">重置</el-button>
              </el-form-item>
            </el-col>           
          </el-row>
        </el-form>
      </div>
    </div>
    <!--表格-->
    <template>
      <el-table
        ref="multipleTable"
        border
        :data="enquiryBomList"
        tooltip-effect="dark"
        style="width: 100%" 
        highlight-current-row v-loading="loading">
        <el-table-column label="序号" type="index" width="50">
        </el-table-column>
        <el-table-column prop="bsTitle" label="标题" show-overflow-tooltip width="200">
        </el-table-column>
        <el-table-column prop="bsFileCode" label="文件编号" show-overflow-tooltip width="170">
        </el-table-column>
        <el-table-column prop="bsStatus" label="状态" align="center" width="80"show-overflow-tooltip>
          <template scope="scope">
            <el-tag :type="statusFilter(scope.row.bsStatus)">{{ formatStata(scope.row.bsStatus)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="bsContactName" label="联系人" width="60" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="bsContactMobile" label="联系电话" align="center" width="120" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="bsEmail" label="邮箱" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="createdTime" label="创建日期" width="150" align="center" show-overflow-tooltip>
        </el-table-column> 
        <el-table-column prop="bsRemark" label="备注" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template scope="scope">  
            <el-button v-if="permit.EDIT" icon="el-icon-search" size="mini" @click="viewDetail(scope.row)" circle></el-button>
            <messagebox v-if="permit.DELETE" @callConfirm="doDelete(scope.row)" title="提示" contents="此操作将永久删除该行, 是否继续?" confirmTitle="确认删除">
            </messagebox> 
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
import { getlist,doCreateEnquiry,delEnquiry } from "@/api/enquiryBom";
import {getPermByRouterCode} from '@/api/perm'
import messagebox from "@/components/Dialog/MessageBox.vue";
export default {
  name: "enquiryBomList",
  components: {
    messagebox
  },
  data() {
    return {
      loading:true,
      current: 0,
      open: true,
      items: [
        { sort: "全部"}, 
        { sort: "未询价"},
        { sort: "询价中"},
        { sort: "询价完成"},         
      ],
      enquiryBomList: [],
      queryParams: {
        page: 1,
        rows: 15,
        bsStatus:0,
        keyword:''
      },
      pageSizesList: [15, 20, 30, 40, 50, 100],
      totalCount: 0, //数据的总条数,
      // el-tag类型转换
      statusFilter(status) {
        const statusMap = {
          1: "info",
          2: "danger",
          3: "success"
        };
        return statusMap[status];
      },
      // 状态显示转换
      formatStata(status) {
        const statusMap = {
          1: "未询价",
          2: "询价中",
          3: "询价完成"      
        };
        return statusMap[status];
      },
      permit:{
        //权限控制
        SEARCH:false,
        EDIT:false,
        DELETE:false
      },
    };
  },
  created() {
    this.getData();
    this.getPermit();
  },
  methods: {
    //单击添加选中项样式
    addClass: function(index) {
      this.current = index;
    },
    changeStatus(index){
      this.queryParams.bsStatus = index;
      this.getData();
    },
    getPermit(){
      var routerCode = this.$route.name;
      getPermByRouterCode(routerCode).then(response => {
        if(response.result){
          if(response.data == "admin"){
            this.permit.SEARCH = true;
            this.permit.EDIT = true;
            this.permit.DELETE = true;
          }else{
            var list = response.data;
            for(var i = 0; i < list.length; i++){
              if(list[i].permCode == "SEARCH") this.permit.SEARCH = true;
              if(list[i].permCode == "EDIT") this.permit.EDIT = true;
              if(list[i].permCode == "DELETE") this.permit.DELETE = true;
            }
          }
        }else{
          this.$message.error(res.msg);
        }
      });
    },
    getData() {
      let filter=Object.assign({},this.queryParams)
      this.loading = true;
      //获取BOM-询价列表
      getlist(filter).then(response => {
        this.loading = false;
        if (response.result) {          
          this.enquiryBomList = response.data.rows;
          this.totalCount = response.data.total;          
        } else {
          this.$message.error(response.msg);
        }
      });
    },
    //重置
    resetFrom(){
      this.queryParams.keyword = '';
    },
    //删除
    doDelete(row) {
      let id = row.id;
      delEnquiry(id).then(response => {
        if (response.result) {
          this.$message({
            message: response.msg,
            type: "success"
          });
          this.getData();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //查看详情
    viewDetail(row) {
      this.$router.push({path:'enquiryBomDetail',query:{eqBomId:row.id}});
    },
    changePage(page) {
      this.queryParams.page = page;
      this.getData();
    },
    sizeChange(size) {
      this.queryParams.rows = size;
      this.getData();
    }
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
</style>