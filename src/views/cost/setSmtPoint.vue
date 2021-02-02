<template>
 <!--  搜索框 -->
 <div>
  <div class="retrieval">
      <div class="title">
        <h3>设置状态</h3>
        <div class="filter">
          <ul>
            <li
              v-for="(item,index) in items"
              :key="index"
              @click="addClass(index)"
              v-bind:class="{ current:index==current}"
            ><a @click="changeStatus(index)"><span>{{item.sort}}</span></a></li>
          </ul>
        </div>
        <span
          class="more"
          @click="open=!open"
        ></span>
      </div>
      <div
        class="searchDiv"
        v-show="open"
      >
        <el-form
          :model="queryParams"
          ref="form"
          label-width="70px"
          class="formStly"
          size="small"
          :inline="true"
        >
        <el-row
            type="flex"
            class="row-bg"
          >
            <el-col :span="18"  style="margin-left:280px;">
                <el-form-item
                label="关键字:"
                prop="eqTitle"
              >
                <el-input v-model="queryParams.keyword"  @click="search" class="search-input"></el-input>
              </el-form-item>    
              <el-form-item>
                <el-button v-if="permit.SEARCH" size="mini" type="primary"  @click="search">查找</el-button>
              <el-button  size="mini" type="info"  @click="resetFrom()">重置</el-button>
               <el-button  :disabled="isChecked" v-if="permit.CHECK" style="margin-left:10px" size="mini" type="primary" @click="check">审核</el-button>
                <el-button :disabled="!isChecked" v-if="permit.UNCHECK" size="mini"  type="success" @click="uncheck">反审核</el-button>
              </el-form-item>       
            </el-col>          
          </el-row>
        </el-form>
      </div>
    </div>      
  <!--     内容区容器    -->   
<el-container style="height: 500px;">
<!--   侧边栏 -->
     <el-aside class="tree">
      <h3>分类列表 </h3> 
      <el-tree 
       ref="tree" 
       node-key="id" 
       :data="list" :props="options"      
       highlight-current
       accordion
       :default-expanded-keys="expandedKeys"     
       @node-click="handleNodeClick"         
       >        
      </el-tree>   
     </el-aside>
<!--   表格内容区 -->
      <el-main style="padding:0;">
      <el-table :data="keywordTable" ref="main_table" border> 
        <el-table-column prop="sName" label="物料名称" show-overflow-tooltip width="80">
        </el-table-column>
        <el-table-column prop="sModel" label="规格型号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="sCode" label="物料编码" show-overflow-tooltip width="100">
        </el-table-column>
        <el-table-column prop="sPackage" label="封装" show-overflow-tooltip width="70">
        </el-table-column>
        <el-table-column prop="sFeetQty" label="焊脚数量" align="center" width="120">
          <template scope="scope">
            <el-input :disabled="isChecked"
            type="number"            
            v-model="scope.row.sFeetQty"              
            @change="updateHandler(scope.row)"             
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="sPoints" label="SMT点数" align="center" width="120">
          <template scope="scope">
           <el-input
           :disabled="isChecked"
            type="number"  
            step="0.5"          
            v-model="scope.row.sPoints"              
            @change="updateHandler(scope.row)"             
            ></el-input>
          </template>
        </el-table-column>       
        </el-table-column>      
        <!-- <el-table-column prop="address" label="操作">
            <template slot-scope="scope">
                    
            </template>
        </el-table-column> -->
      </el-table>
    </el-main>
</el-container>
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
import { getTree,updateStmPoints,getlist,updateStmCheck,getReviewStatus,reverseStmCheck } from '@/api/smtpoint'
import {getPermByRouterCode} from '@/api/perm'
/*import messagebox from "@/components/MessageBox.vue
*/
export default {
  inject: ['reload'],
  name: "setSmtPoint",
  components: {

  },
  data() {
    return {
      isChecked:false,
      queryParams:{        
        keyword:'',
        setStatus:0,
        categoryNumber:'',
        sLevel:'',
        page: 1,
        rows: 15,    
      },
      pageSizesList: [15, 20, 30, 40, 50, 100],
      totalCount: 0, //数据的总条数,
      loading:false,
      open: true,
      current:0,
      options: {
        label: "title",
        children: "children",
        isLeaf: true
      },     
      list:[],
      expandedKeys:[],
      keywordTable:[],
      searchData:[],    
      data: [], 
      items: [
        { sort: "全部" }, 
        { sort: "未设置"},
        { sort: "已设置"},         
      ],
      permit:{
        //权限控制
        SEARCH:false,
        EDIT:false,
        CHECK:false,
        UNCHECK:false
      },   
      }   
  },
   mounted(){   
   
  },
  created(){
    this.getStatu()
    this.getTree();   
    this.getPermit();
  },
  methods:{
    //切换设置状态查询
    changeStatus(index){         
        this.queryParams.setStatus = index;
        this.getData()       
    },
    //单击添加选中项样式
    addClass(index) {
      this.current = index;
    },
    //重置按钮
     resetFrom(){   
        this.queryParams.keyword = '';
        this.queryParams.categoryNumber = '';
        this.queryParams.sLevel = '';
    },
    getPermit(){
      var routerCode = this.$route.name;
      getPermByRouterCode(routerCode).then(response => {
        if(response.result){
          if(response.data == "admin"){
            this.permit.SEARCH = true;
            this.permit.EDIT = true;
            this.permit.CHECK= true;
            this.permit.UNCHECK=true;
          }else{
            var list = response.data;
            for(var i = 0; i < list.length; i++){
              if(list[i].permCode == "SEARCH") this.permit.SEARCH = true;
              if(list[i].permCode == "EDIT") this.permit.EDIT = true;
               if(list[i].permCode == "CHECK") this.permit.CHECK = true;
              if(list[i].permCode == "UNCHECK") this.permit.UNCHECK=true;
            }
          }
        }else{
          this.$message.error(res.msg);
        }
      });
    },
    //获取分类目录
    getTree(){     
         getTree().then(response=>{       
          if(response.result){ 
       
            let root={title:"目录",id:-1,children:[]};
            root.children= response.data.rows;            
            this.list = [root];
            this.expandedKeys.push(-1);       
          }        
       })      
    },
    //选中类别节点
    handleNodeClick(data,node){
        this.queryParams.categoryNumber = data.sCode;
        this.queryParams.sLevel = data.sLevel;
        let filter=Object.assign(
            {},
            {keyword:this.queryParams.keyword,setStatus:this.queryParams.setStatus,
            categoryNumber:data.sCode,sLevel:data.sLevel,rows:this.queryParams.rows,page:this.queryParams.page})       
        if(data.sLevel==1 || data.sLevel==2){
          getlist(filter).then(response=>{
           if(response.result){
              this.keywordTable=response.data.rows;   
              this.totalCount = response.data.total;
           }
        })
       }
    }, 
    //修改SMT点数
    updateHandler(row){     
        let filter=Object.assign(
            {},{id:row.id,sCode:row.sCode,sName:row.sName,sPoints:row.sPoints,isSpecial:row.isSpecial,sLevel:row.sLevel,sFeetQty:row.sFeetQty}
        );
        updateStmPoints(filter).then(response=>{
        if(response.result) {                              
            this.$message({
                type: 'success',
                message: response.msg
              });                         
         }else {
            this.$message.error(res.msg);
            }
        })
    },  

    //查询
    search() {
      if (this.queryParams.keyword) {
        this.getData()
      } else {
        this.$message.error('请输入要查找的内容！');
      }
    },
    //获取SMT目录信息 
    getData(){     
        let filter=Object.assign(
            {},
            {keyword:this.queryParams.keyword,
            setStatus:this.queryParams.setStatus,
            categoryNumber: this.queryParams.categoryNumber,
            sLevel:this.queryParams.sLevel,
            rows:this.queryParams.rows,
            page:this.queryParams.page});
          getlist(filter).then(response=>{
           if(response.result){
                this.keywordTable=response.data.rows;
                this.totalCount =response.data.total;             
           }
        })     
    },
    changePage(page){
      this.queryParams.page=page;
      this.getData();
    },
    SizeChange(size){
      this.queryParams.rows=size;   
      this.getData();
    },
    check() {
      this.$confirm('是否确认审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
        
      }).then(() => {
        updateStmCheck()
        this.$message({
          type: 'success',
          message: '审核成功!'
        })
        this.reload()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消审核'
        })
      })
    },
    getStatu(){
      getReviewStatus().then(res=>{
        if(res.result){
          if(res.data){
           this.isChecked=true
          }
        }
      })
    },
    uncheck() {
   this.$confirm('是否确认反审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        reverseStmCheck()
        this.$message({
          type: 'success',
          message: '反审核成功!'
        })
        this.reload()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消反审核'
        })
      })
    }
   /* filterNode(value, data) {        
        if (!value) return true;
        return data.title.indexOf(value) !== -1;
    },*/
  
  }
};
</script>
<style>
.tree{
    width: 280px!important;
    margin: 0 15px 0 0;
 /*   padding: 0 15px 15px 0;*/
    background-color: #f7ffff; 
}
.tree h3{
    margin: 0;
    padding: 0 0 0 30px;
    background: url(../../assets/img/tree-title-icon.gif) no-repeat 15px center scroll;
    background-color: #d8f0f0;
    font: 12px/34px "Microsoft YaHei", Arial, Tahoma, sans-serif;
    color: #001f3a;
    height: 34px;
    font-weight: bold;
    width: 280px;
}
.searchbox{
  margin:10px 0px 0px 10px; 
}
.block{
    text-align: right;
    margin-top:10px;
}

</style>