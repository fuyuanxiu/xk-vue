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
                <el-button type="primary" size="mini" icon="el-icon-plus" @click="doAdd">新增</el-button>
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="doEdite">编辑</el-button>
                <el-button type="primary" size="mini" icon="el-icon-delete" @click="doDelete">删除</el-button>
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
      <el-table :data="keywordTable" ref="main_table" highlight-current-row @row-click="getDetails"> 
          <!-- <el-table-column
      type="selection"
      width="55">
    </el-table-column> -->
        <el-table-column prop="routerName" label="菜单名称" show-overflow-tooltip >
        </el-table-column>      
        <el-table-column prop="routerCode" label="菜单编码">
        </el-table-column>      
        <el-table-column prop="routerStatus" label="是否可用" align="center">
           <template scope="scope">
           <el-tag size="mini"  v-if="scope.row.routerStatus == 0">可用 </el-tag>
           <el-tag size="mini" type="warning" v-if="scope.row.routerStatus == 1">不可用 </el-tag>
          </template> 
        </el-table-column>             
         <el-table-column prop="routerIndex" label="顺序号">
           </el-table-column> 
           <el-table-column prop="routerComment" label="备注">
        </el-table-column>  
      </el-table>
    </el-main>
</el-container>

<el-dialog title="新增资源" :visible.sync="dialogFormVisible" >
  <el-form :model="ruleForm" :rules="rules" label-width="80px"  ref="ruleForm">
      <el-input type="hidden" v-model="ruleForm.parentId"></el-input>
      <el-row>
        <el-col :span="24">
            <el-form-item label="上级节点" >
                <el-input  :readonly="true" :value="formParentName"></el-input>
            </el-form-item>
        </el-col>
    </el-row>
      <el-row>
        <el-col :span="12">
            <el-form-item label="资源名称" :required="true" prop="routerName">
                <el-input v-model="ruleForm.routerName"></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="资源编码" :required="true" prop="routerCode">
                <el-input v-model="ruleForm.routerCode"></el-input>
            </el-form-item>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="12">
            <el-form-item label="序号" prop="routerIndex">
                <el-input v-model="ruleForm.routerIndex"></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="是否可用"  prop="routerStatus">
                <el-switch
                v-model="ruleForm.routerStatus"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value=0
                :inactive-value=1>
            </el-switch>
            </el-form-item>
        </el-col>
    </el-row>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="doCreate('ruleForm')">确 定</el-button>
  </div>
</el-dialog>

</div>
</template>
<script>
import { getTree,add ,del} from '@/api/resource'
/*import messagebox from "@/components/MessageBox.vue
*/
export default {
  name: "resourceManagement",
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
      rules: {
          routerCode: [
            { required: true, message: '请输入资源编码', trigger: 'blur' }
          ],
          routerName: [
            { required: true, message: '请输入资源名称', trigger: 'blur' }
          ]
        },
        curRow:[],
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
        this.curPoit = data;
        //console.log(this.curPoit)
        this.keywordTable = data.children;
    }, 
    //查询
    search() {
      this.getTree();
    },
    doAdd(){//新增
      //this.$refs['ruleForm'].resetFields();
     //this.$refs.ruleForm.resetFields()
      this.ruleForm.routerName = ''
      this.ruleForm.routerCode = ''
      this.ruleForm.routerIndex = ''
      this.ruleForm.routerStatus = 0
      this.ruleForm.id = null
      this.ruleForm.parentId = this.curPoit.id
      this.formParentName = this.curPoit.routerName
      this.dialogFormVisible = true
    },
    doCreate(formName){
        //console.log(this.resetFrom)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            add(this.ruleForm).then(response => {                                                   
                if(response.result) {
                    this.dialogFormVisible = false
                    this.getTree();
                    this.$message({
                      message: response.msg,
                      type: 'success'
                    }); 
                }else {
                    this.$message.error(response.msg);
                }
            })
          } 
        });
    },
    getDetails(row){
       // console.log(row)//此时就能拿到整行的信息
       this.curRow = row
      },
      doEdite(){
        //console.log(this.curRow.length)
        if(this.curRow.length==0){
          this.$message.error('请先选中行');       
        }else{
          this.ruleForm.routerName = this.curRow.routerName
          this.ruleForm.routerCode = this.curRow.routerCode
          this.ruleForm.routerIndex = this.curRow.routerIndex
          this.ruleForm.routerStatus = this.curRow.routerStatus
          this.ruleForm.id = this.curRow.id
          //this.ruleForm.routerIndex = this.curRow.routerIndex
          this.ruleForm.parentId = this.curPoit.id
          this.formParentName = this.curPoit.routerName
          this.dialogFormVisible = true
        }
      },
      doDelete(){
         if(this.curRow.length==0){
          this.$message.error('请先选中行');       
        }else{
          del(this.curRow.id).then(response => {                                                   
                if(response.result) {
                    this.$message({
                      message: response.msg,
                      type: 'success'
                    }); 
                    this.getTree();
                }else {
                    this.$message.error(response.msg);
                }
            })
        }
      }

  
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