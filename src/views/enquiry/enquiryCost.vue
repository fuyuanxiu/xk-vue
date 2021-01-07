<template>
  <div>
       <el-card>
          <el-row>
            <el-col :span="12">
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
                  <el-button
                    type="primary"
                    size="mini"
                    @click="handleSubmit('formQuery')"
                  >查找</el-button>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="6">
              <el-button-group size="mini">
                <el-button
                  type="primary"
                  icon="el-icon-upload2"
                  @click="showAddDialog()"
                >导入询价单</el-button>
                <!-- <el-button type="primary" @click="importExecl">导入EXCEL</el-button> -->
              </el-button-group>
            </el-col>
          </el-row>
        </el-card>        
    <!-- vue解析的excel数据 -->
    <el-table
      v-show="!isShowTable"
      :data="tableData"
      border
      style="width: 100%;margin-top:20px;"
    >
      <el-table-column
        v-for="item of tableHeader"
        :prop="item"
        :label="item"
        :key="item"
        show-overflow-tooltip
      />
    </el-table>
  </div>
</template>
<script>

export default {
  name: "enquiryCost",
  components: {

  },
  data() {
    return {
      formQuery: {
        mateModel: "",
        mateName: ""
      },      
      queryParams: {
        page: 1,
        rows: 10,
        pkParent: -1
      },     
      pageSizesList: [10, 20, 30, 40, 50, 100],
      totalCount: 0, //数据的总条数,
      totalK3Count: 0
    };
  },
  created() {
    this.getData();
  },
  mounted() {
    //this.$refs.tree.setCheckedKeys([1]); //预先选中id为1的节点;
  },
  methods: {
    handleSubmit(name) {
      this.getData();
    },
 


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
