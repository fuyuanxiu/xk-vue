<template>
  <div class="home-main">
    <el-row>
      <!-- 待办事项开始 -->
      <el-col
        :md="24"
        :lg="24"       
      >
        <el-card class="tolistcard mt0" shadow="hover">       
          <el-col :span="12">
              <div class="toUserInfo">
              <div class="portrait"><img src="../../../assets/img/timg.gif"></div>
              <!-- <div class="portrait"><img src="/src/assets/img/timg.gif"></div> -->
              <!-- <div class="portrait"><img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544437034380&di=720382c6c22aae4b1d55b554a80c8d1f&imgtype=0&src=http%3A%2F%2Fimg3.doubanio.com%2Fview%2Fgroup_topic%2Fraw%2Fpublic%2Fp107176763.jpg"></div> -->
              <div class="usertext"><p>您好，<span>{{this.name}}</span></p></div>             
          </div> 
          </el-col>  
          <el-col :span="10" style="margin-top:-14px;">
              <ul class="todoNumber">
                  <li><p>待办任务</p> <p class="listNum">{{this.totalNum}}</p></li>
                  <li><p>已完成</p> <p class="listNum">{{this.completedNum}}</p></li>
                  <li><p>未完成</p> <p class="listNum">{{this.inCompleteNum}}</p></li>
                 
              </ul>
          </el-col>              
        </el-card>
        <el-row >
        <el-col :span="24">
        <el-card class="tolistcard">
               <div
            slot="header"
            class="clearfix"
          >
            <span>
              <svg-icon icon-class="todo" />
              待办事项</span>
            <el-button
              icon="el-icon-search"
              style="float: right; padding: 3px 0"
              type="text"
              size="medium"
              @click="pushTodolist"
            > 查看更多</el-button>
          </div>
            <el-table 
              @selection-change="handleSelectionChange" 
              ref="main_table"
             :data="todolistdata" tooltip-effect="dark" style="width: 100%" highlight-current-row 
              @row-click="rowClick">
                <el-table-column type="index" width="45">
                </el-table-column>
                <el-table-column prop="bsTitle" label="待办标题" width="120" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="bsContent" label="文件信息"  show-overflow-tooltip>
<!--                   <template slot-scope="scope">
                    <a style="color:blue" size="mini" @click="pushCreator(scope.row)">{{scope.row.bsContent}}</a>  
                  </template>  -->
                </el-table-column>
                <el-table-column prop="createdTime" label="创建时间"  show-overflow-tooltip>                
                </el-table-column>
                 <el-table-column prop="bsRemark" label="备注信息"  show-overflow-tooltip>                
                </el-table-column>  
               <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                  <el-button type="primary" plain size="mini" @click="showDoc(scope.row.bsReferId)" >附件管理</el-button>  
                   <el-button type="danger" plain size="mini" @click="closeItem(scope.row.id)"  >关闭待办</el-button>  
                    </template>                  
                 </el-table-column>            
            </el-table>
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
        </el-card>
    </el-col>
    </el-row>
 <!--          <ul class="tolist">
            <li v-for="item in todolistdata " :key="item">
                   <el-col :span="16"><a  @click="pushCreator(item)" class="grid-content bg-purple">[{{item.bsTitle}}]{{item.bsContent}}</a></el-col>

                   <el-col :span="4"><div class="bsCreatedTime"><i class="el-icon-time"></i>{{item.createdTime}}</div></el-col>
                   <el-col :span="4" > <el-button   size="mini" type="primary" plain @click="closeItem(item.id)" style="margin-top:-22px">关闭待办</el-button></el-col>
            </li>          
        </ul>  -->
        
       <!--  <el-card class="box-card">
          <div v-for="o in todolistdata" :key="o" class="text item" style="padding: 14px;">
              <div class="bottom clearfix">
               <a > {{'['+o.bsTitle+'] ' + o.bsContent }}</a>
            <time class="time">{{ o.createdTime }}</time>
            <el-button type="text" class="button">操作按钮</el-button>
          </div>
          </div>
        </el-card> -->
      </el-col>
    </el-row>
    <!-- 附件管理 -->  
    <el-dialog title="附件管理" :visible.sync="dialog.docVisible" width="500px">
      <el-table border :data="docList" tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="no" label="序号" show-overflow-tooltip width="60" />
        <el-table-column prop="bsDocName" label="附件名称" show-overflow-tooltip />
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-download" size="mini" @click="downloadDoc(scope.row.bsDocId)" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button class="el-icon-check" type="primary" @click="dialog.docVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
/*import GithubCorner from '@/components/GithubCorner'*/
import { getlist,closeTodo } from "@/api/todo";
import {exportEnquiryExcel} from "@/api/enquiryCost";
import { getDocListOnTodo } from '@/api/costFile';

export default {
  name: "DashboardEditor",
  data() {
    return {
      emptyGif:
        "https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3",
      toDoList: [],
      todolistdata:[],
      multipleSelection:[],
      dialog: {        
        docVisible: false
      },
      docList:[],
      totalNum: 0,
      completedNum: 0,
      inCompleteNum: 0,
      queryParams: {
        page: 1,
        rows: 10,
        pkParent: -1,
        bsStatus:0,
        keyword:''
      },
      pageSizesList: [5, 10, 15, 20,50, 100],
      totalCount: 0, //数据的总条数,
    };
  },
  computed: {
    ...mapGetters(["name", "avatar", "roles"])
  },
   created() {
    this.getData();    
  },
  methods: {
   getData() {
      getlist(0, this.queryParams.page, this.queryParams.rows).then(response => {
        if (response.result) {
          this.todolistdata = response.data.list.rows;
          this.totalCount = response.data.list.total;
          this.totalNum = response.data.totalNum;
          this.completedNum = response.data.completedNum;
          this.inCompleteNum = response.data.inCompleteNum;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    pushTodolist(){

    },
    handleSelectionChange(val){
      this.multipleSelection=val;
    },

    rowClick(row, event, column) {     
      if(column.label != '操作'){
        if(row.bsType == 1){
          this.$router.push({ path: '/enquiry/enquiryBomDetail',query: { eqBomId: row.bsReferId}});
        }else if(row.bsType == 2){
          this.$router.push({ path: '/quotation/quoAdd',query: { id: row.bsReferId}});
        }
      }
    },
    pushCreator(item){
      if(item.bsType == 1){
        window.location.href =
        process.env.BASE_API + "/enquiryCost/getEnquiryExcel?id=" + item.bsReferId;
      }else{
        
      }
    },
    closeItem(item){
      let filter=Object.assign({Id:item});
      closeTodo(filter).then(response => {
        if (response.result) {
          this.$message({
            message: response.msg,
            type: 'success'
          });
        this.getData();
        } else {
          this.$message.error(response.msg);
        }
      })
    },
    //附件管理
    showDoc(bsReferId){
      this.dialog.docVisible = true;
      getDocListOnTodo(bsReferId).then(response => {
        if(response.result){
          this.docList = response.data;
        }else{
          this.$message.error(response.msg);
        }
      });
    },
    //下载附件
    downloadDoc(bsDocId) {
      window.location.href =
        process.env.BASE_API + "/file/get?fsFileId=" + bsDocId;
    },
    changePage(page) {
      this.queryParams.page = page;
      this.getData();
    },
    sizeChange(size) {
      this.queryParams.rows = size;
      this.getData();
    },
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.text {
    font-size: 13px;
  }

  .item {
    margin-bottom: 10px;
  }
.tolistcard {
  height:auto;
  margin-top:10px;
}
.mt0{margin-top:0px;}
.toUserInfo{ 
    padding:2px 10px;
    overflow:hidden;
    display: -webkit-flex; /* Safari */
    display: flex;
    align-content: flex-start;

}

.portrait img{
    width:70px;
}
.usertext{  
margin-top:27px;
}
.todoNumber{
    margin-top:20px;
   overflow:hidden; 
   list-style:none;  
   display: -webkit-flex; /* Safari */
   display: flex;   
 
}
.todoNumber li{
    width:25%;
    border-right:1px dashed #ccc;
    text-align:center
}
.todoNumber li p{
    pading:0;
    margin:0;
    font-family:"Microsoft YaHei",Georgia,Serif;
    color:#666;
}
.todoNumber li p.listNum{
   font-size:26px;
   color:#333;
   margin-top:3px;

}
.doc-upload-input{
  display: none;
  z-index: -9999;
}

</style>
