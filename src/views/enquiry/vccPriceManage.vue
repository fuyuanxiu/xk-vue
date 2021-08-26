<template>
  <div>
    <el-card style="padding-bottom: 0;border:none;">
      <el-row>
        <el-col :span="8">
          <el-form :inline="true" :model="formQuery" class="demo-form-inline">
            <el-form-item label="关键字:">
              <el-input v-model="formQuery.keyword" placeholder="关键字" class="search-input"/>
            </el-form-item>
            <el-form-item>
              <el-button v-if="permit.SEARCH" type="primary" @click="getData">查找</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6">
          <el-button-group size="samll">
            <el-button v-if="permit.IMPORT" type="primary" icon="el-icon-upload" @click="importExecl">导入EXCEL</el-button>
            <el-button v-if="permit.EXPORT" type="primary" icon="el-icon-download" @click="Addsupplier('addsupplier')">导出EXCEL</el-button>
          </el-button-group>
        </el-col>
        <!-- <el-col :span="6">
                     <el-button-group size="samll">
                     <el-button v-if="permit.IMPORT" type="primary" icon="el-icon-upload" @click="importExecl">导入EXCEL</el-button>
                     </el-button-group>
                </el-col> -->
      </el-row>
    </el-card>
    <template>
      <el-table
        ref="multipleTable"
        :data="supplierTable"
        tooltip-effect="dark"
        style="width: 100%"
        border
        highlight-current-row
        @selection-change="handleSelectionChange">
        <el-table-column type="index" label="序号" width="50" show-overflow-tooltip/>
        <el-table-column
          prop="suppCode"
          label="VCC价格编号"
          width="150"
          show-overflow-tooltip
        />
        <el-table-column
          prop="suppChineseName"
          label="物料代码"
          width="100"
          show-overflow-tooltip/>
        <el-table-column
          prop="suppK3Code"
          label="供应商信息"
          width="120"
          show-overflow-tooltip/>
        <el-table-column
          prop="suppAliaName"
          label="交易方式"
          width="90"/>
        <el-table-column
          prop="suppGrade"
          label="币种"
          width="70"
          align="center"
          show-overflow-tooltip>
          <template scope="scope">
            <span :class="{orange:scope.row.suppGrade==1 ,green:scope.row.suppGrade==2, gray:scope.row.suppGrade==3}">{{ $t('supplier.Status['+scope.row.suppGrade+']') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="suppContactName"
          label="生效日期"
          width="110"
          show-overflow-tooltip/>
        <el-table-column
          prop="suppMobile"
          width="90"
          label="价格"
          align="center"
          show-overflow-tooltip/>
        <el-table-column
          prop="suppEmail"
          width="80"
          label="项目信息"
          align="center"
          show-overflow-tooltip/>
        <el-table-column
          prop="createdTime"
          label="LOA"
          width="50"
          show-overflow-tooltip/>
        <el-table-column
          prop="createdTime"
          label="LTA"
          width="50"
          show-overflow-tooltip/>
        <el-table-column label="操作" width="140" fixed="right">
          <template slot-scope="scope">
            <el-button icon="el-icon-search" size="mini" circle @click="viewSupplier('addsupplier',scope.row)"/>
            <el-button v-if="permit.EDIT" type="primary" size="mini" icon="el-icon-edit" circle @click="showEditDialog('addsupplier',scope.row)"/>
            <!--    <a class="operatIcon colorRed"  @click="doDelete(scope.row)"><i class="el-icon-delete"></i> </a> -->
            <MessageBox v-if="permit.DELETE" title="提示" contents="此操作将永久删除该行, 是否继续?" confirm-title="确认删除" @callConfirm="doDelete(scope.row)"/>
          </template>
        </el-table-column>

      </el-table>
    </template>
    <div class="block">
      <el-pagination :current="1" :current-page.sync="queryParams.page" :page-sizes="pageSizesList" :page-size="queryParams.rows" :page-size-opts="pageSizesList" :total="totalCount" class="pull-right clearfix" layout="total, sizes, prev, pager, next, jumper" @current-change="changePage" @size-change="SizeChange"/>
    </div>
    <!--end-->
  </div>

</template>
<script>
// import {getlistWithTobe,delSupplierInfo,uplaodFile,updateStatus} from '@/api/supplier'
import { getPermByRouterCode } from '@/api/perm'
import MessageBox from '@/components/Dialog/MessageBox.vue'
export default {
  name: 'VccPriceManage',
  components: {
    MessageBox
  },
  data() {
    return {
      dialogVisible: false,
      rolesDate: [],
      multipleSelection: [],
      checkedRolesDate: [],
      value4: [],
      formQuery: {
        keyword: ''
      },
      currentRow: [],
      supplierTable: [{

      }],
      queryParams: {
        page: 1,
        rows: 15,
        pkParent: -1
      },
      pageSizesList: [10, 15, 20, 30, 40, 50, 100],
      totalCount: 0, // 数据的总条数,
      permit: {
        // 权限控制
        SEARCH: false,
        IMPORT: false,
        EXPORT: false
      }
    }
  },
  created() {
    this.getData()
    this.getPermit()
  },
  // watch:{
  // '$route':"getData"
  // },
  methods: {
    handleSubmit(name) {
      this.getData()
    },
    getPermit() {
      var routerCode = this.$route.name
      getPermByRouterCode(routerCode).then(response => {
        if (response.result) {
          if (response.data == 'admin') {
            this.permit.SEARCH = true
            this.permit.IMPORT = true
            this.permit.EXPORT = true
          } else {
            var list = response.data
            for (var i = 0; i < list.length; i++) {
              if (list[i].permCode == 'SEARCH') this.permit.SEARCH = true
              if (list[i].permCode == 'IMPORT') this.permit.IMPORT = true
              if (list[i].permCode == 'EXPORT') this.permit.EXPORT = true
            }
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    getData() {
    //   //let suppGrade=1;
    // let filter = Object.assign(
    //     {},
    //     this.formQuery,
    //     this.queryParams
    //   );
    //   getlistWithTobe(filter).then(response => {
    //     if (!response.data) {
    //       reject('error')
    //     }
    //     this.supplierTable = response.data.rows;
    //     this.totalCount = response.data.total;
    //   })
    },
    Addsupplier(url) {
      this.$router.push({ path: url })
    },

    // 获取被选中的行的数量
    getSelectedCount() {
      return this.multipleSelection.length
    },
    // 获取被选中的行的数据的id，放到一个数组中
    getSelectedIds() {
      const ids = []
      this.multipleSelection.map((item) => {
        ids.push(item.id)
      })
      return ids
    },
    // 编辑
    showEditDialog(url, row) {
      this.$store.commit('updateSupplierDataStates', row)
      this.$router.push({ path: url, query: { id: row.id, type: 'edite' }})
    },
    // 查看供应商详情
    viewSupplier(url, row) {
      this.$store.commit('updateSupplierDataStates', row)
      this.$router.push({ path: url, query: { id: row.id, type: 'view' }})
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    importExecl() {
      if (!this.multipleSelection) {
        this.$message.error('请选择操作行')
        return
      }
    },
    cancel() {
      this.dialog.modal_dialog = false
    },
    changePage(page) {
      this.queryParams.page = page
      this.getData()
    },
    SizeChange(size) {
      this.queryParams.rows = size
      this.getData()
    }
  }
}
</script>
<style>
    .block {
    text-align: right;
    margin-top: 10px;
}

</style>
