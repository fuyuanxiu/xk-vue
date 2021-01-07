<template>
  <el-row>
    <el-col :span="24">
      <div v-loading="loading" element-loading-text="数据加载中，请稍等">
        <el-card style="border:none;height: auto;">
          <el-row>
            <el-col style="width:100%">
              <el-form :inline="true" :model="formQuery" class="demo-form-inline">
                <el-form-item label="关键字">
                  <el-input v-model="formQuery.keyword" placeholder="关键字"></el-input>
                </el-form-item>
                <el-form-item label="物料号">
                  <el-input v-model="formQuery.mateK3Code" placeholder="K3物料号"></el-input>
                </el-form-item>
                <el-form-item label="名称">
                  <el-input v-model="formQuery.mateName" placeholder="物料名称"></el-input>
                </el-form-item>
                <el-form-item label="是否上传">
                  <el-select v-model="formQuery.isQuality" placeholder="请选择" style="width:200px">
                    <el-option v-for="item in optionsQuality" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <!-- <el-form-item>
                  <el-button type="info" @click="resetFrom">重置</el-button>
                  <el-button v-if="permit.SEARCH" type="primary" size="mini" @click="handleSubmit('formQuery')">查找</el-button>
                  <el-button type="success" @click="showCateView()">物料类别设置</el-button>
                </el-form-item> -->
              </el-form>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-button type="info" @click="resetFrom">重置</el-button>
              <el-button v-if="permit.SEARCH" type="primary" size="mini" @click="handleSubmit('formQuery')">查找</el-button>
              <el-button type="success" @click="showCateView()">物料类别设置</el-button>
              <el-button type="warning"  @click="getExcel">导出Excel</el-button>
            </el-col>
          </el-row>
        </el-card>

        <!--上传控件-->
        <input ref="doc-upload-input" class="doc-upload-input" type="file" @change="addDoc" />

        <!--物料表-->
        <template>
          <el-table
            ref="materielTable"
            :data="materielTable"
            tooltip-effect="dark"
            style="width: 100%"
            highlight-current-row
            border
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="45" fixed>
            </el-table-column>
            <el-table-column prop="mateK3Code" label="K3物料号" width="150" fixed show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="isQuality" label="是否上传" width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tag :type="statusFilter(scope.row.isQuality)">{{ formatStatus(scope.row.isQuality)}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="categoryName" label="物料类别" width="120" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="mateName" label="物料名称" width="120" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="mateModel" label="物料规格" min-width="200" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="mateCusName" label="品牌" width="100" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="mateCusCode" label="品牌料号" width="180" show-overflow-tooltip>
            </el-table-column>
            <!-- <el-table-column prop="remark" label="备注" width="150" show-overflow-tooltip>
            </el-table-column> -->
            <el-table-column label="操作" width="100" fixed="right">
              <template slot-scope="scope">
                <el-button icon="el-icon-search" size="mini" @click="viewFile(scope.row)" title="详情" circle></el-button>
                <el-button v-if="permit.UPLOAD" type="primary" icon="el-icon-upload2" size="mini" @click="addDocBefore(scope.row.id)" title="上传" circle></el-button>
                <!-- <input ref="doc-upload-input" class="doc-upload-input" type="file" @change="addDoc" /> -->
              </template>
            </el-table-column>
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

        <!-- 物料类别筛选设置 -->
        <el-dialog title="物料类别筛选设置" :visible.sync="showCateVisible" width="1000px">
          <div>
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="搜索关键字">
                <el-input v-model="dialogCate.keyword" placeholder="关键字"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchCate">查找</el-button>
                <el-button type="primary" @click="addCateView">新增</el-button>
                <el-button type="primary" @click="doUpdateStatus(1)">显示</el-button>
                <el-button type="primary" @click="doUpdateStatus(0)">不显示</el-button>
              </el-form-item>
            </el-form>
          </div>
          <el-table border :data="showCateList" tooltip-effect="dark" style="width: 100%"
          @selection-change="cateSelectionChange">
            <el-table-column type="selection" width="45" fixed></el-table-column>
            <el-table-column prop="bsName" label="物料类别名称" show-overflow-tooltip />
            <el-table-column prop="bsCode" label="物料类别筛选编码" show-overflow-tooltip />
            <el-table-column prop="bsStatus" label="是否显示" show-overflow-tooltip>
              <template scope="scope">
                <el-tag :type="statusFilter(scope.row.bsStatus)">{{ formatStatus(scope.row.bsStatus)}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="140">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" title="编辑" @click="editCateView(scope.row)" circle></el-button>
                <!-- <el-button type="danger" icon="el-icon-delete" title="删除" circle></el-button> -->
                <MessageBox @callConfirm="delCateView(scope.row)" title="提示" contents="此操作将永久删除该行, 是否继续?" confirmTitle="确认删除"></MessageBox>
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination
              class="pull-right clearfix"
              @current-change="cateChangePage"
              @size-change="cateSizeChange"
              :current="1"
              :current-page.sync="dialogCate.page"
              :page-sizes="catePSList"
              :page-size="dialogCate.rows"
              layout="total, sizes, prev, pager, next, jumper"
              :page-size-opts="catePSList"
              :total="cateTotal">
            </el-pagination>
          </div>
          <div class="mateFooter">
            <el-button type="primary" @click="showCateVisible = false">关闭</el-button>
          </div>
        </el-dialog>

        <!-- 新增物料类别筛选设置 -->
        <el-dialog title="物料类别筛选设置" :visible.sync="addCateVisible" width="500px">
          <el-form :model="addCateForm" :inline="true" ref="addCateForm.cateCheck" :rules="addCateForm.cateCheck" label-width="150px" label-position="right">
            <el-form-item label="物料类别名称" prop="bsName" label-position="right">
              <el-input v-model="addCateForm.bsName" style="width:250px;" placeholder="例如：原材料"></el-input>
            </el-form-item>
            <el-form-item label="物料类别筛选编码" prop="bsCode" label-position="right">
              <el-input v-model="addCateForm.bsCode" style="width:250px;" placeholder="例如：01.%.%"></el-input>
            </el-form-item>
            <el-form-item label="是否显示" prop="bsStatus" label-position="right">
              <el-switch class="switch-btn" v-model="addCateForm.bsStatus"
                :active-value="1" :inactive-value="0" active-text="是" inactive-text="否"
                active-color="#13ce66" inactive-color="#ccc">
              </el-switch>
                <!-- <el-input v-model="addCateForm.bsStatus" style="width:250px;"></el-input> -->
            </el-form-item>
          </el-form>
          <div class="addCateFooter" align="center">
            <el-button type="primary" @click="addCateVisible = false">关闭</el-button>
            <el-button type="primary" @click="addCategory">确定</el-button>
          </div>
        </el-dialog>
        <!-- 编辑物料类别筛选设置 -->
        <el-dialog title="物料类别筛选设置" :visible.sync="editCateVisible" width="500px">
          <el-form :model="editCateForm" :inline="true" ref="editCateForm.cateCheck" :rules="editCateForm.cateCheck" label-width="150px" label-position="right">
            <el-form-item label="物料类别名称" prop="bsName" label-position="right">
              <el-input v-model="editCateForm.bsName" style="width:250px;" placeholder="例如：原材料"></el-input>
            </el-form-item>
            <el-form-item label="物料类别筛选编码" prop="bsCode" label-position="right">
              <el-input v-model="editCateForm.bsCode" style="width:250px;" placeholder="例如：01.%.%"></el-input>
            </el-form-item>
            <el-form-item label="是否显示" prop="bsStatus" label-position="right">
              <el-switch class="switch-btn" v-model="editCateForm.bsStatus"
                :active-value="1" :inactive-value="0" active-text="是" inactive-text="否"
                active-color="#13ce66" inactive-color="#ccc">
              </el-switch>
                <!-- <el-input v-model="editCateForm.bsStatus" style="width:250px;"></el-input> -->
            </el-form-item>
          </el-form>
          <div class="addCateFooter" align="center">
            <el-button type="primary" @click="editCateVisible = false">关闭</el-button>
            <el-button type="primary" @click="editCategory">确定</el-button>
          </div>
        </el-dialog>

      </div>
    </el-col>
  </el-row>
</template>

<script>
import {addMaterielInfo,getMaterielList,getListSrm} from "@/api/materiel";
import {addFile} from "@/api/qualityFile";
import {addCate,editCate,delCate,getCateList,updateStatus} from "@/api/categorySetting";
import {getPermByRouterCode} from '@/api/perm'
import MessageBox from "@/components/Dialog/MessageBox.vue";
export default {
  name: "qualityMateList",
  components: {
    MessageBox
  },
  data() {
    return {
      isReadOnly: true,
      isdisabled: true,
      dialog: {
        loading: false,
        dialogVisible: false
      },
      multipleSelection: [],
      cateMultipleSelection: [],//物料类别筛选多选
      formLabelWidth: "100px",
      formQuery: {
        keyword: "",
        mateK3Code: "",
        mateName: "",
        isQuality: ""
      },
      currentRow: [],
      currentId: "",
      materielTable: [{}],
      queryParams: {
        page: 1,
        rows: 10,
        pkParent: -1
      },
      pageSizesList: [10, 20, 30, 40, 50, 100],
      totalCount: 0, //数据的总条数,
      loading: false,
      permit:{
        //权限控制
        SEARCH:false,
        EDIT:false,
        UPLOAD:false
      },
      showCateVisible: false,//物料类别筛选设置
      showCateList: [],//K3物料列表
      dialogCate: {
        keyword: "",
        bsStatus: "",
        page: 1,
        rows: 10,
      },
      cateTotal: 0, //数据的总条数
      catePSList: [5, 10, 20, 30],//每页显示数量
      addCateVisible: false,//新增
      addCateForm: {
        bsName: "",
        bsCode: "",
        bsStatus: 0,
        cateCheck: {
          //trigger中blur为失去焦点时验证，change为内容变化是验证     
          bsName: [
            { required: true, message: "物料类别名称不能为空", trigger: ["blur","change"] }
          ],
          bsCode: [
            { required: true, message: "物料类别筛选编码不能为空", trigger: ["blur","change"] }
          ],
          bsStatus: [
            { required: true, message: "是否显示不能为空", trigger: ["blur","change"] }
          ]
        }
      },
      editCateVisible: false,//编辑
      editCateForm: {
        id: "",
        bsName: "",
        bsCode: "",
        bsStatus: "",
        cateCheck: {        
          bsName: [
            { required: true, message: "物料类别名称不能为空", trigger: ["blur","change"] }
          ],
          bsCode: [
            { required: true, message: "物料类别筛选编码不能为空", trigger: ["blur","change"] }
          ],
          bsStatus: [
            { required: true, message: "是否显示不能为空", trigger: ["blur","change"] }
          ]
        }
      },
      // el-tag类型转换
      statusFilter(status) {
        const statusMap = {
          0: "info",
          1: "success"
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
      optionsQuality:[{
            value: '',
            label:"请选择"
        },{
            value: '0',
            label:"否"
        },{
            value: '1',
            label:"是"
        }],
    };
  },
  created() {
    this.getData();
    this.getPermit();
  },
  mounted() {
    //this.$refs.tree.setCheckedKeys([1]); //预先选中id为1的节点;
  },
  methods: {
    handleSubmit(name) {
      this.getData();
    },
    getPermit(){
      var routerCode = this.$route.name;
      getPermByRouterCode(routerCode).then(response => {
        if(response.result){
          if(response.data == "admin"){
            this.permit.SEARCH = true;
            this.permit.EDIT = true;
            this.permit.UPLOAD = true;
          }else{
            var list = response.data;
            for(var i = 0; i < list.length; i++){
              if(list[i].permCode == "SEARCH") this.permit.SEARCH = true;
              if(list[i].permCode == "EDIT") this.permit.EDIT = true;
              if(list[i].permCode == "UPLOAD") this.permit.UPLOAD = true;
            }
          }
        }else{
          this.$message.error(res.msg);
        }
      });
    },
    getData() {
      this.loading = true;
      getListSrm(
        this.formQuery.keyword,
        this.formQuery.mateK3Code,
        this.formQuery.mateName,
        this.formQuery.isQuality,
        this.queryParams.rows,
        this.queryParams.page
      ).then(response => {
        if (!response.result) {
          this.$Message.error(response.msg);
          return
        }
        this.materielTable = response.data.rows;
        this.totalCount = response.data.total;
        this.loading = false;
      });
    },
    //查看质量文件
    viewFile(row) {
      this.$router.push({ path: 'qualityFileList', query: { mateId: row.id } });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    cancel() {
      this.dialog.modal_dialog = false;
    },
    changePage(page) {
      this.queryParams.page = page;
      this.getData();
    },
    SizeChange(size) {
      this.queryParams.rows = size;
      this.getData();
    },
    //上传
    addDoc(e) {
      //获取上传的文件
      const files = e.target.files;
      const rawFile = files[0];
      if(rawFile != null && rawFile != undefined){
        //封装数据
        let formData = new FormData();
        formData.append('file', rawFile);
        formData.append('mateId', this.currentId);
        addFile(formData).then(response => {
          if(response.result){
            this.$message.info(response.msg);
            this.currentId = "";
            this.getData();
          }else{
            this.$message.error(response.msg);
            this.currentId = "";
          }
        });
      }
    },
    addDocBefore(id) {
      this.currentId = id;
      this.$refs['doc-upload-input'].click();
    },
    //重置
    resetFrom(){
      this.formQuery.keyword = '';
      this.formQuery.mateK3Code = '';
      this.formQuery.mateName = '';
      this.formQuery.isQuality = '';
    },
    //物料类别设置列表
    showCateView() {
      this.dialogCate.keyword = "";
      this.dialogCate.bsStatus = "";
      this.showCateVisible = true;
      this.searchCate();
    },
    searchCate() {
      let filter=Object.assign({},this.dialogCate);
      getCateList(filter).then(response => {
        if (response.result) {
          this.showCateList = response.data.rows;
          this.cateTotal = response.data.total; 
        } else {
          this.$message.error(response.msg);
        }
      })
    },
    cateChangePage(page) {
      this.dialogCate.page = page;
      this.searchCate();
    },
    cateSizeChange(size) {
      this.dialogCate.rows = size;
      this.searchCate();
    },
    //新增物料类别设置
    addCateView() {
      this.addCateForm.bsName = "";
      this.addCateForm.bsCode = "";
      this.addCateForm.bsStatus = 0;
      this.addCateVisible = true;
    },
    addCategory() {
      // let filter=Object.assign({},this.addCateForm)
      this.$refs['addCateForm.cateCheck'].validate((valid) => {
        if (valid) {
          addCate(
            this.addCateForm.bsName,
            this.addCateForm.bsCode,
            this.addCateForm.bsStatus).then(response => {
            if(response.result) {                                
              this.addCateVisible = false
              this.$message.info(response.msg);
              this.searchCate();
            }else {
              this.$message.error(response.msg);
            }
          })
        }else{
          this.$message.error("信息填写不完整");
        }
      });
    },
    //编辑物料类别设置
    editCateView(row) {
      this.editCateForm.id = row.id;
      this.editCateForm.bsName = row.bsName;
      this.editCateForm.bsCode = row.bsCode;
      this.editCateForm.bsStatus = row.bsStatus;
      this.editCateVisible = true;
    },
    editCategory() {
      // let filter=Object.assign({},this.editCateForm)
      this.$refs['editCateForm.cateCheck'].validate((valid) => {
        if (valid) {
          editCate(
            this.editCateForm.id,
            this.editCateForm.bsName,
            this.editCateForm.bsCode,
            this.editCateForm.bsStatus).then(response => {
            if(response.result) {                                
              this.editCateVisible= false
              this.$message.info(response.msg);
              this.searchCate();
            }else {
              this.$message.error(response.msg);
            }
          })
        }else{
          this.$message.error("信息填写不完整");
        }
      });
    },
    //删除物料类别设置
    delCateView(row) {
      delCate(row.id).then(response => {
        if(response.result) {
          this.$message.info(response.msg);
          this.searchCate();
        }else {
          this.$message.error(response.msg);
        }
      })
    },
    //物料类别设置列表多选
    cateSelectionChange(val) {
      this.cateMultipleSelection = val;
    },
    //物料类别设置修改状态
    doUpdateStatus(bsStatus){
      let ids=[];
      this.cateMultipleSelection.map((item)=> {
        ids.push(item.id)
      })
      updateStatus(ids.join(','),bsStatus).then(response => {
        if(response.result) {
          this.$message({
            message: response.msg,
            type: 'success'
          });                              
          this.searchCate();
        }else {
          this.$message.error(response.msg);
        }
      })

    },
    //20200607-sxw-导出
    getExcel() {
      var c1 = !this.formQuery.keyword ? "": this.formQuery.keyword;
      var c2 = !this.formQuery.mateK3Code ? "": this.formQuery.mateK3Code;
      var c3 = !this.formQuery.mateName ? "": this.formQuery.mateName;
      var c4 = this.formQuery.isQuality;
      var content = "?keyword="+c1+"&&mateK3Code="+c2+"&&mateName="+c3+"&&isQuality="+c4;
      window.location.href = process.env.BASE_API + "/qualityFile/getQualityExcel"+content;
    },

  }
};
</script>
<style>
  .block {
    text-align: right;
    margin-top: 10px;
  }
  .doc-upload-input{
    display: none;
    z-index: -9999;
  }

.tree {
  background: #f7ffff;
  height: 700px;
  width: 100%;
}

.tree h5 {
  margin: 0;
  padding: 0 0 0 18px;
  background-color: #d8f0f0;
  font: 12px/34px "宋体", Arial, Tahoma, sans-serif;
  color: #001f3a;
  height: 34px;
  font-weight: bold;
}

.elTree {
  height: auto;
  width: 600px;
  border: 1px solid gainsboro;
  overflow-y: auto;
  position: absolute;
  z-index: 999;
  left: 30%;
}
.elTree .el-tree-node__content {
  height: 50px;
  border-bottom: 1px solid gainsboro;
}
</style>
