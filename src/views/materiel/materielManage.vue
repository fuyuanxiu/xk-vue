<template>
  <el-row>
    <el-col :span="24">
      <div v-loading="loading" element-loading-text="数据加载中，请稍等">
        <el-card style="border:none">
          <el-row>
            <el-col style="width:100%">
              <el-form
                :inline="true"
                :model="formQuery"
                class="demo-form-inline"
              >
                <el-form-item label="物料号">
                  <el-input
                    v-model="formQuery.mateK3Code"
                    placeholder="K3物料号"
                  ></el-input>
                </el-form-item>
                <el-form-item label="名称">
                  <el-input
                    v-model="formQuery.mateName"
                    placeholder="物料名称"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button v-if="permit.SEARCH" 
                    type="primary"
                    size="mini"
                    @click="handleSubmit('formQuery')"
                  >查找</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button v-if="permit.ADD" 
                  type="primary"
                  icon="el-icon-plus"
                  @click="showAddDialog()"
                >新增物料</el-button>
                </el-form-item>
              </el-form>
            </el-col>        
          </el-row>
          <div
            class="elTree"
            v-if="showMenuTree"
          >
            <el-tree
              border
              :data="treeList"
              :props="defaultProps"
              show-checkbox
              node-key="id"
              :check-strictly="true"
              :highlight-current="true"
              default-expand-all
              :expand-on-click-node="false"
              :render-content="renderContent"
              ref="tree"
              @check-change="checkChange"
              @node-click="nodeClick"
            >
            </el-tree>
          </div>
        </el-card>

        <el-tabs type="border-card">
          <el-tab-pane label="SRM物料信息">
            <template>
              <el-table
                ref="materielTable"
                :data="materielTable"
                tooltip-effect="dark"
                style="width: 100%"
                highlight-current-row
                border
                @selection-change="handleSelectionChange"
              >
                <el-table-column
                  type="selection"
                  width="45"
                >
                </el-table-column>
                <el-table-column
                  prop="mateK3Code"
                  label="K3物料号"
                  width="120"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                  prop="categoryName"
                  label="物料类别"
                  width="120"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                  prop="mateName"
                  label="物料名称"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                  prop="mateModel"
                  label="物料规格"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                  prop="fStockQty"
                  label="库存数量"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                  prop="fAuxPriceDiscount"
                  label="最新采购单价"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                  prop="suppCode"
                  label="供应商编号"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                  prop="suppChineseName"
                  label="供应商名称"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                  prop="remark"
                  label="备注"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                  label="操作"
                  width="200"
                >
                  <template slot-scope="scope">
                    <el-button icon="el-icon-search" size="mini" @click="viewMateriel(scope.row)" circle></el-button>
                    <el-button v-if="permit.EDIT" type="primary" size="mini" @click="showEditDialog(scope.row)" icon="el-icon-edit" circle></el-button>
                    <MessageBox v-if="permit.DELETE" 
                      @callConfirm="doDelete(scope.row)"
                      title="提示"
                      contents="此操作将永久删除该行, 是否继续?"
                      confirmTitle="确认删除"
                    ></MessageBox>
                    <el-button type="primary" size="mini" @click="showStock(scope.row)" icon="el-icon-share" circle></el-button>
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
          </el-tab-pane>
          <el-tab-pane label="K3同步物料信息">
            <template>
              <el-table
                ref="materielK3Table"
                :data="materielK3Table"
                tooltip-effect="dark"
                style="width: 100%"
                highlight-current-row
                border
              >
                <el-table-column
                  type="selection"
                  width="40"
                >
                </el-table-column>
                <el-table-column
                  prop="fItemId"
                  label="K3物料Id"
                  width="100"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                  prop="fCategoryName"
                  label="物料类别"
                  width="120"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                  prop="fNumber"
                  label="物料编号"
                  show-overflow-tooltip
                  width="140"
                >
                </el-table-column>
                <el-table-column
                  prop="fName"
                  label="物料名称"
                  show-overflow-tooltip
                  width="160"
                >
                </el-table-column>
                <el-table-column
                  prop="fModel"
                  label="物料规格"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                  prop="fFullName"
                  label="物料名称全称"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                  prop="fStockQty"
                  label="库存数量"
                  show-overflow-tooltip
                >
                </el-table-column>

              </el-table>
            </template>
            <div class="block">
              <el-pagination
                class="pull-right clearfix"
                @current-change="changePageK3"
                @size-change="SizeChangeK3"
                :current="1"
                :current-page.sync="queryK3Params.page"
                :page-sizes="pageSizesList"
                :page-size="queryK3Params.rows"
                layout="total, sizes, prev, pager, next, jumper"
                :page-size-opts="pageSizesList"
                :total="totalK3Count"
              >
              </el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>

        <!--  新增物料 -->
        <el-dialog
          :title="dialogTitle"
          :visible.sync="dialog.dialogVisible"
          width="35%"
        >
          <el-form
            :model="materielForm"
            ref="dialog.formItem"
            :rules="dialog.ruleForm"
            style="width:80%"
          >
            <el-form-item
              label="物料ID"
              :label-width="formLabelWidth"
              style="display: none"
              prop="categoryId"
            >
              <el-input
                v-model="materielForm.categoryId"
                v-bind:readonly="isReadOnly"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="物料名称"
              :label-width="formLabelWidth"
              prop="mateName"
            >
              <el-input
                v-model="materielForm.mateName"
                v-bind:readonly="isReadOnly"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="物料全称"
              :label-width="formLabelWidth"
              prop="mateFullName"
            >
              <el-input
                v-model="materielForm.mateFullName"
                v-bind:readonly="isReadOnly"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="K3物料号"
              :label-width="formLabelWidth"
              prop="mateK3Code"
            >
              <el-input
                v-model="materielForm.mateK3Code"
                v-bind:readonly="isReadOnly"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="规格"
              :label-width="formLabelWidth"
              prop="mateModel"
            >
              <el-input
                v-model="materielForm.mateModel"
                v-bind:readonly="isReadOnly"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="物料类别"
              :label-width="formLabelWidth"
              prop="categoryName"
            >
              <el-input
                v-model="materielForm.categoryName"
                v-bind:readonly="isReadOnly"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="供应商名称"
              :label-width="formLabelWidth"
              prop="suppChineseName"
            >
              <!--   <el-input v-model="materielForm.suppChineseName" v-bind:readonly="isReadOnly"></el-input> -->
              <el-autocomplete
                v-model="materielForm.suppChineseName"
                v-bind:readonly="isReadOnly"
                :fetch-suggestions="querySupplier"
                style="width: 100%"
              >
              </el-autocomplete>
            </el-form-item>
            <el-form-item
              label="供应商编号"
              :label-width="formLabelWidth"
              prop="SuppCode"
            >
              <el-input
                v-model="materielForm.SuppCode"
                v-bind:readonly="isReadOnly"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="备注"
              :label-width="formLabelWidth"
              prop="remark"
            >
              <el-input
                v-model="materielForm.remark"
                v-bind:readonly="isReadOnly"
              ></el-input>
            </el-form-item>
          </el-form>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="dialog.dialogVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="OK"
            >确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import {
  addMaterielInfo,
  getMaterielList,
  delMaterielInfo,
  editMateriel,
  getStockList
} from "@/api/materiel";
import {getPermByRouterCode} from '@/api/perm'
import MessageBox from "@/components/Dialog/MessageBox.vue";
export default {
  name: "materielManage",
  components: {
    MessageBox
  },
  data() {
    return {
      menuTree: [],
      showMenuTree: false,
      isReadOnly: true,
      isdisabled: true,
      dialog: {
        loading: false,
        dialogVisible: false,
        ruleForm: {
          mateName: [
            { required: true, message: "请填物料名称", trigger: "blur" }
          ],
          categoryName: [
            { required: true, message: "请选择物料类别", trigger: "blur" }
          ],
          mateModel: [
            { required: true, message: "请填写规格", trigger: "blur" }
          ]
        }
      },
      materielForm: {},
      K3CodeCheck: "请选择",
      editCheckId: "",
      rolesDate: [],
      multipleSelection: [],
      dialogTitle: "新增物料",
      categoryOptions: {},
      formLabelWidth: "100px",
      formQuery: {
        mateModel: "",
        mateName: ""
      },
      suppliers: [],
      currentRow: [],
      materielTable: [{}],
      materielK3Table: [{}],
      tree: {
        data: [{ expand: true, label: "电阻类", children: [] }]
      },
      queryParams: {
        page: 1,
        rows: 10,
        pkParent: -1
      },
      queryK3Params: {
        page: 1,
        rows: 10,
        pkParent: -1
      },
      pageSizesList: [10, 20, 30, 40, 50, 100],
      totalCount: 0, //数据的总条数,
      totalK3Count: 0,
      loading: false,
      permit:{
        //权限控制
        SEARCH:false,
        ADD:false,
        EDIT:false,
        DELETE:false
      },
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
            this.permit.ADD = true;
            this.permit.EDIT = true;
            this.permit.DELETE = true;
          }else{
            var list = response.data;
            for(var i = 0; i < list.length; i++){
              if(list[i].permCode == "SEARCH") this.permit.SEARCH = true;
              if(list[i].permCode == "ADD") this.permit.ADD = true;
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
      this.loading = true;
      let suppGrade = 1;
      getMaterielList(
        this.formQuery.mateK3Code,
        this.formQuery.mateName,
        this.queryParams.rows,
        this.queryParams.page,
        this.queryK3Params.rows,
        this.queryK3Params.page
      ).then(response => {
        if (!response.result) {
          this.$Message.error(response.msg);
          return
        }
        this.materielTable = response.data.listSrm.rows;
        this.totalCount = response.data.listSrm.total;
        //K3
        this.materielK3Table = response.data.listK3.rows;
        this.totalK3Count = response.data.listK3.total;
        this.loading = false;
      });
    },
    showAddDialog() {
      this.materielForm = { id: "" };
      this.isdisabled = false;
      this.isReadOnly = false;
      this.dialog.dialogVisible = true;
    },
    /*新增&编辑*/
    OK() {
      if (
        typeof this.materielForm.id != undefined &&
        typeof this.materielForm.id == "number"
      ) {
        this.$refs["dialog.formItem"].validate(valid => {
          if (valid) {
            editMateriel(this.materielForm).then(response => {
              if (response.result) {
                this.dialog.dialogVisible = false;
                this.getData();
              } else {
                this.$Message.error(res.msg);
              }
            });
          }
        });
      } else {
        this.$refs["dialog.formItem"].validate(valid => {
          if (valid) {
            addMaterielInfo(this.materielForm).then(response => {
              if (response.result) {
                this.dialog.dialogVisible = false;
                this.getData();
              } else {
                this.$message.error(res.msg);
              }
            });
          }
        });
      }
    },
    //删除
    doDelete(row) {
      let id = row.id;
      delMaterielInfo(id).then(response => {
        if (response.result) {
          this.$message({
            message: response.msg,
            type: "success"
          });
          this.getData();
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
    //查看库存
    showStock(row){
      this.loading = true;
      let code = row.mateK3Code;
      getStockList(code).then(response => {
        if(response.result){
          alert(response.msg);
        }else {
          this.$Message.error(response.msg);
        }
        this.loading = false;
      });
    },
    //编辑
    showEditDialog(row) {
      this.materielForm = Object.assign({}, row);
      this.dialogTitle = "编辑物料";
      this.dialog.dialogVisible = true;
      this.isReadOnly = false;
      this.isdisabled = false;
    },
    //查看物料
    viewMateriel(row) {
      /*  let r = params.row;*/
      this.materielForm = {
        categoryId: row.categoryId,
        mateName: row.mateName,
        categoryName: row.categoryName,
        mateModel: row.mateModel
      };
      this.isReadOnly = true;
      this.isdisabled = true;
      this.dialog.dialogVisible = true;
    },
    querySupplier(){

    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    importExecl() {
      if (!this.currentRow) {
        this.$message.error("请选择要分配角色的用户");
        return;
      }
    },
    cancel() {
      this.dialog.modal_dialog = false;
    },
    changePage(page) {
      this.queryParams.page = page;
      this.getData();
    },
    changePageK3(page) {
      this.queryK3Params.page = page;
      this.getData();
    },
    SizeChange(size) {
      this.queryParams.rows = size;
      this.getData();
    },
    SizeChangeK3(size) {
      this.queryK3Params.rows = size;
      this.getData();
    },
    checkChange(item, node, self) {
      if (node == true) {
        //点击未选中复选框
        this.editCheckId = item.id;
        this.$refs.tree.setCheckedKeys([item.id]);
      } else {
        if (this.editCheckId == item.id) {
          //点击已选中复选框，保证至少一个选中
          this.$refs.tree.setCheckedKeys([item.id]);
        }
      }
    },
    nodeClick(item, node, self) {
      this.editCheckId = item.id;
      this.K3CodeCheck = item.label;
      this.$refs.tree.setCheckedKeys([item.id]);
    }
  }
};
</script>
<style>
.block {
  text-align: right;
  margin-top: 10px;
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
