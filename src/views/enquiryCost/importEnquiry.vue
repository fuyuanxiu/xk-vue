<template>
  <div>
  <el-row class="headerbtn">
    <el-col :span="24" style="margin-left:10px">
     <el-form :inline="true" :model="queryParams" class="demo-form-inline">
      <el-form-item label="关键字">
        <el-input v-model="queryParams.keyword" placeholder="输入关键字查询" style="width:200px"></el-input>
      </el-form-item>            
      <el-form-item>
         <el-button type="primary" icon="el-icon-search" size="mini" @click="handleSubmit('formQuery')">查询</el-button>     
        
      </el-form-item>
      <el-form-item style="margin-left: 20px">
           <el-upload 
            class="upload-demo"
            action=""
            :before-upload="beforeUpload"                 
            :file-list="fileList" 
            :on-success="handleSuccess" 
            :on-preview="handleUpload"          
            >
            <el-button size="mini" type="success" icon="el-icon-upload" >
             导入询价单
            </el-button>
            <div slot="tip" class="el-upload__tip"></div>
          </el-upload>         
      </el-form-item>
      <el-form-item>
          <el-button type="primary" icon="el-icon-download" size="mini" @click="downloadEnquiry()">下载询价单</el-button>  
      </el-form-item>
       <el-form-item>
         <messagebox 
          @callConfirm="delEnqDetail()"
          title="提示"
          contents="此操作将永久删除该行, 是否继续?"
          confirmTitle="确认删除"></messagebox>
      </el-form-item>
    </el-form>
    </el-col>    
  </el-row>
    <template>        
    <el-table        
      :data="tableData"
      ref="enqTable"
      border
      style="width: 100%;"
      @row-click="clickRow"  
      @select="select"      
      @selection-change="handleSelectionChange"
    >   
    <el-table-column
    v-if="isShow"
      type="selection"
        fixed
      width="45">
    </el-table-column> 
     <el-table-column        
        v-for="item of tableHeader"
        :prop="item"
        :label="item"
        :key="item"
        show-overflow-tooltip
      />

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

</template>
<script>

import {  
  getDetailList,  
  uplaodEnqFile,
  delEnquiryDetail
} from "@/api/enquiryCost";

import messagebox from "./components/messagebox.vue";
export default {
  name: "importEnquiry",
  components: {
  messagebox
  },
  data() {
    return {
      eqId:this.$route.query.eqId,
      fileList:[],
      isShow:false,
      tableHeader:{       
      },
      tableData:[],
      currentRow:[],
      loading:true,      
      open: false,     
      queryParams: {
        page: 1,
        rows: 15,
        pkParent: -1,        
        keyword:'',     
      },
      pageSizesList: [15, 20, 30, 40, 50, 100],
      totalCount: 0, //数据的总条数,    
    };
  },
  created() {
    this.getData();
  },
  methods: {
    //文件上传前钩子验证
     beforeUpload(file){
        // console.log(file,'文件');
        this.files = file;
        const extension = file.name.split('.')[1] === 'xls'
        const extension2 = file.name.split('.')[1] === 'xlsx'
        const isLt5M = file.size / 1024 / 1024 < 5
        if (!extension && !extension2) {
            this.$message.warning('上传模板只能是 xls、xlsx格式!')
            return
        }
        if (!isLt5M) {
            this.$message.warning('上传模板大小不能超过 5MB!')
            return
        }
        this.fileName = file.name;
        setTimeout(() => {
            this.handleUpload(file);
        },500);
        return false; // 返回false不会自动上传
    },  
    handleSuccess({ results, header }) {   
        this.tableData = results;
        this.tableHeader = header; 
    },  
    getData() {      
      this.loading = true
       let filter = Object.assign(
            {},
           this.queryParams,           
           {eqId:this.$route.query.eqId}
            );
      //获取询价详情列表
      getDetailList(filter).then(response => {
          this.loading = false
        if (response.result) {          
          this.tableHeader = response.data.header;
          this.isShow=true;
          this.tableData=response.data.results
          this.totalCount = response.data.total;       
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    changeStatus(index){
        this.queryParams.eqStatus = index
        getData()
    },
    resetFrom(){
        //重置
        this.queryParams.keyword = ''       
    },
   
   //导入文件
    handleUpload(file) {       
        this.file = file;
        let formData = new FormData();
        formData.append("file", this.file);
        formData.append("eqId", this.$route.query.eqId);      
       uplaodEnqFile(formData).then(response => {
            if (response.result) {
                this.$message.info(response.msg);
                this.getData();
            } else {
                this.$message.error(response.msg);
            }
        });
    },
    //获取行
    handleSelectionChange(val) {        
        this.currentRow = val;
    },
    clickRow(row){         
       this.$refs.enqTable.toggleRowSelection(row);
    },
    //单选行
    select(selection,row){
    if(selection.length>1){
        selection.shift()
        }
    },       
    //删除
    delEnqDetail() {            
      if(this.currentRow==null||this.currentRow.length==0){               
            this.$message.error('请选择要删除的行!');
            return
    } 
      var id=this.currentRow[0].id;     
      delEnquiryDetail(id).then(response => {
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
    //下载询价单
    downloadEnquiry(){   
      window.location.href =
      process.env.BASE_API + "enquiryCost/getEnquiryExcel?id=" + this.eqId;
    },  
    changePage(page) {
      this.queryParams.page = page;
      this.getData();
    },
    SizeChange(size) {
      this.queryParams.rows = size;
      this.getData();
    }
  }
};
</script>
<style>
/*搜索框部分*/
.headerbtn {
  padding-top:10px;
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