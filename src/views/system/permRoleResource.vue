<template>
 <!--  搜索框 -->
 <div>
  <div class="retrieval">
      <div
        class="searchDiv" style="margin-top:10px;"
      >
        <el-form
          :model="queryParams"
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
                <el-button-group>
                  <el-button size="mini" type="primary" icon="el-icon-search" @click="search">查找</el-button>
                  <el-button  size="mini" type="info" icon="el-icon-minus" @click="resetFrom()">重置</el-button>
                </el-button-group>
                <el-button-group>
                  <el-button type="primary" size="mini" icon="el-icon-edit" @click="setPermit(1)">允许</el-button>
                  <el-button type="primary" size="mini" icon="el-icon-edit" @click="setPermit(0)">不允许</el-button>
                </el-button-group>
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
      <el-tree 
       ref="tree" 
       node-key="id" 
       :data="list" :props="options"      
       highlight-current

       :default-expanded-keys="expandedKeys"     
       @node-click="handleNodeClick"         
       >        
      </el-tree>   
     </el-aside>
<!--   表格内容区 -->
      <el-main style="padding:0;">
      <el-table :data="keywordTable" ref="main_table" highlight-current-row @row-click="getDetails"
        @selection-change="handleSelectionChange"> 
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="id" label="ID" v-if="false">
        </el-table-column>  
        <el-table-column prop="permName" label="名称" show-overflow-tooltip >
        </el-table-column>      
        <el-table-column prop="permCode" label="编码">
        </el-table-column>      
        <el-table-column prop="isPermit" label="是否允许" align="center">
           <template scope="scope">
           <el-tag size="mini" type="danger" v-if="scope.row.isPermit == 0">不允许 </el-tag>
           <el-tag size="mini" v-if="scope.row.isPermit == 1">允许 </el-tag>
          </template> 
        </el-table-column>
      </el-table>
    </el-main>
</el-container>

</div>
</template>
<script>
import { getTree } from '@/api/resource'
import { getPermByRouter,setPermit } from '@/api/perm'
export default {
  name: "permRoleResource",
  components: {

  },
  data() {
    return {
      queryParams:{        
        keyword:'',
      },
      loading:false,
      options: {
        label: "routerName",
        children: "children",
        id:"id",
        isLeaf: true
      },     
      list:[],
      expandedKeys:[],
      keywordTable:[],   
      data: [],
      curPoit:[],//当前选中的节点信息   
      dialogFormVisible:false,
      ruleForm:{
        id:'',
        routerName:'',
        routerCode:'',
        routerIndex:'',
        routerStatus:0
      },
      formParentName:'',
      curRow:[],
      roleId:this.$route.query.id,
      routerId:'',
      multipleSelection:[],
      permList:[],
      permMap:[],
      }   
  },
   mounted(){   
   
  },
  watch: {
'curPoit': {
      handler (newName, oldName) {
        //console.log(newName)
        this.curRow = [];
      }
   }
  },
  created(){
    this.getTree();   
  },
  methods:{
    //重置按钮
    resetFrom(){   
        this.queryParams.keyword = '';
    },
    //获取分类目录
    getTree(){     
         getTree().then(response=>{       
          if(response.result){ 
            let root={routerName:"目录",id:1,children:[]};
            this.curPoit = root;
            this.keywordTable = [];
            root.children= response.data;            
            this.list = [root];
            this.expandedKeys.push(1);       
          }        
       })      
    },
    //选中类别节点
    handleNodeClick(data,node){
      if(node.level > 2){
        // this.curPoit = data;
        // this.keywordTable = data.children;
        this.routerId = data.id;
        getPermByRouter(this.roleId,data.id).then(response => {
          if(response.result){
            this.keywordTable = response.data;
          }else{
            this.$message.error(response.msg);
          }
        });
      }
    }, 
    //查询
    search() {
      this.getTree();
    },
    doAdd(){//新增
      this.ruleForm.routerName = ''
      this.ruleForm.routerCode = ''
      this.ruleForm.routerIndex = ''
      this.ruleForm.routerStatus = 0
      this.ruleForm.id = null
      this.ruleForm.parentId = this.curPoit.id
      this.formParentName = this.curPoit.routerName
      this.dialogFormVisible = true
    },
    getDetails(row){
       // console.log(row)//此时就能拿到整行的信息
       this.curRow = row
    },
    //选中行
    handleSelectionChange(val){
      this.multipleSelection = val;
    },
    setPermit(isPermit){
      this.permList = [];
      this.permMap = [];
      this.multipleSelection.forEach(element => {
        this.permList.push({ id: element.id, isPermit:element.isPermit, permId:element.permId, permCode:element.permCode, permName:element.permName })
      });
      //将permList数据添加到permMap中
      // for(var n = 0; n < this.permList.length; n++){
      //   this.permMap['permList['+ n +'].id'] = this.permList[n].id;
      //   this.permMap['permList['+ n +'].bsIsPermit'] = this.permList[n].isPermit;
      //   this.permMap['permList['+ n +'].bsPermId'] = this.permList[n].permId;
      //   this.permMap['permList['+ n +'].bsPermCode'] = this.permList[n].permCode;
      //   this.permMap['permList['+ n +'].bsPermName'] = this.permList[n].permName;
      // }
      var idStr = '';
      var permIdStr = '';
      for(var n = 0; n < this.permList.length; n++){
        if(this.permList[n].id){
          idStr += this.permList[n].id + ',';
        }else{
          idStr += '0' + ',';
        }
        if(this.permList[n].permId){
          permIdStr += this.permList[n].permId + ',';
        }else{
          permIdStr += '0' + ',';
        }
      }
      idStr = idStr.substring(0, idStr.lastIndexOf(','));
      permIdStr = permIdStr.substring(0, permIdStr.lastIndexOf(','));

      this.permMap.bsRoleId = this.roleId;
      this.permMap.bsRouterId = this.routerId;
      this.permMap.bsIsPermit = isPermit;
      this.permMap.idStr = idStr;
      this.permMap.permIdStr = permIdStr;
      //设置权限
      let filter = Object.assign({}, this.permMap);
      setPermit(filter).then(response => {
        if(response.result){
          this.keywordTable = response.data;
        }else{
          this.$message.error(response.msg);
        }
      });
    },

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