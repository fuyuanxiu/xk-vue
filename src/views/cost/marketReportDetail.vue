<template>
  <div element-loading-text="数据加载中，请稍等">
    <!-- <Row> -->
    <el-collapse
      v-model="activeNames"
    >
      <el-collapse-item
        title="设置"
        name="1"
        class="collapse"
      >
        <el-row>
          <el-col :span="24" style="margin-bottom:-10px;">
            <el-form
              ref="formQuery"
              :inline="true"
              :model="formQuery"
              :label-position="labelPosition"
              class="demo-form-inline"
              label-width="60px"
            >
              <el-col :span="24" style="margin-bottom:-10px;margin-top:5px;">
                <el-form-item label="客户">
                  <el-input v-model="formQuery.bsCustomer" style="width:170px"/>
                </el-form-item>
                <el-form-item label="机型">
                  <el-input v-model="formQuery.bsMachine" style="width:170px"/>
                </el-form-item>
                <el-form-item label="BOM单">
                  <el-input v-model="formQuery.bsBomCode" :readonly="true" style="width:170px"/>
                </el-form-item>
                <el-form-item label="文件ID" style="display: none;">
                  <el-input v-model="formQuery.bsFileId" :readonly="true" style="width:170px"/>
                </el-form-item>
                <el-form-item label="折扣规则">
                  <el-select
                    v-model="formQuery.bsDiscountId"
                    placeholder="折扣规则"
                    style="width:170px"
                    filterable
                  >
                    <el-option
                      v-for="item in optionDiscount"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24" style="margin-bottom:-10px;margin-top:5px;">
                <el-form-item label="工序流">
                  <el-select
                    v-model="formQuery.bsFlowId"
                    placeholder="工序流"
                    style="width:170px"
                    filterable
                  >
                    <el-option
                      v-for="item in optionFlow"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-button :disabled="checked" type="primary" @click="doSave()">保存设置</el-button>
                <el-button v-if="permit.CHECK" :disabled="formQuery.id&&checked==false?false:true" style="margin-left:10px" type="primary" @click="check">审核</el-button>
                <el-button v-if="permit.UNCHECK" :disabled="formQuery.id&&checked?false:true" type="success" @click="backcheck">反审核</el-button>
              </el-col>
              <el-col>
                <el-form-item style="margin-left:40px;">
                  <!-- <el-button type="primary" @click="doSave()">保存设置</el-button> -->
                  <el-button :disabled="checked" type="primary" @click="showAdd()">新增工序流</el-button>
                  <el-button type="primary" @click="downloadDoc()">导出报价明细</el-button>
                  <el-button type="primary" @click="downloadAll()">导出报价单(工时+钢网夹具)</el-button>
                  <el-button type="primary" @click="toQtReport()">BOM物料清单</el-button>
                  <el-button type="primary" @click="toWorkHour()">工时-报价单</el-button>
                  <el-button type="primary" @click="toFixture()">钢网夹具-报价单</el-button>
                </el-form-item>
              </el-col>
            </el-form>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>

    <el-table :data="iTable" class="market-table">
      <el-table-column type="index" label="序号" width="50" show-overflow-tooltip/>
      <el-table-column prop="bsMachine" label="机型" show-overflow-tooltip width="80">
        <!--<template scope="scope">
          <span>{{ scope.row.marketReport ? scope.row.marketReport.bsMachine : "" }}</span>
        </template> -->
      </el-table-column>
      <el-table-column prop="bsProject" label="项目" width="100" show-overflow-tooltip>
      <template scope="scope">
          <span>{{ scope.row.prName ? scope.row.prName:scope.row.bsProject }}</span>
        </template>
        </el-table-column>
      <!-- <el-table-column prop="bsProcess" label="工序" width="120" show-overflow-tooltip>
        <template scope="scope">
          <span>{{ getProcessName(scope.row) ? getProcessName(scope.row) : "" }}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="bsFee" label="规格" width="100">
        <template scope="scope">
          <span>{{ getFeeName(scope.row) ? getFeeName(scope.row) : "" }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="bsQty" label="数量" width="101" show-overflow-tooltip>
        <template scope="scope">
          <el-input-number
            :precision="2"
            :controls="false"
            v-model="scope.row.bsQty"
            :disabled="checked"
            clearable
            align="left"
            width="80"
            @keyup.enter.native="getValue(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="bsUnit" label="单位" min-width="150" show-overflow-tooltip/>
      <el-table-column label="订单50K" align="center">
        <el-table-column prop="price1" label="单价1" width="101" show-overflow-tooltip>
          <template scope="scope" >
            <el-input-number
              :precision="3"
              :controls="false"
              :disabled="checked"
              v-model="scope.row.price1"
              clearable
              align="left"
              width="80"
              @keyup.enter.native="getValue(scope.row)"
            />
            <!-- @keyup.enter.native="getValue(scope.row, 0,'price1')" -->
            <!-- <span>{{ returnFloat_2(scope.row.price1) }}</span> -->
          </template>
        </el-table-column>
        <el-table-column prop="price1Total" label="金额1" width="80" show-overflow-tooltip>
          <template scope="scope">
            <!-- <span>{{ returnFloat_2(scope.row.price1Total) }}</span> -->
            <span>{{ count(scope.row.price1,scope.row.bsQty) }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="订单5K" align="center">
        <el-table-column prop="price2" label="单价2" width="80" show-overflow-tooltip>
          <template scope="scope">
            <el-input-number
              :precision="3"
              :controls="false"
              :disabled="checked"
              v-model="scope.row.price2"
              clearable
              align="left"
              width="80"
              @keyup.enter.native="getValue(scope.row)"
            />
            <!-- <span>{{ returnFloat_2(scope.row.price2) }}</span> -->
          </template>
        </el-table-column>
        <el-table-column prop="price2Total" label="金额2" width="80" show-overflow-tooltip>
          <template scope="scope">
            <!-- <span>{{ returnFloat_2(scope.row.price2Total) }}</span> -->
            <span>{{ count(scope.row.price2,scope.row.bsQty) }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="订单1000以下" align="center">
        <el-table-column prop="price3" label="单价3" width="80" show-overflow-tooltip>
          <template scope="scope">
            <!-- <span>{{ returnFloat_2(scope.row.price3) }}</span> -->
            <el-input-number
              :precision="3"
              :controls="false"
              :disabled="checked"
              v-model="scope.row.price3"
              clearable
              align="left"
              width="80"
              @keyup.enter.native="getValue(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="price3Total" label="金额3" width="80" show-overflow-tooltip>
          <template scope="scope">
            <!-- <span>{{ returnFloat_2(scope.row.price3Total) }}</span> -->
            <span>{{ count(scope.row.price3,scope.row.bsQty) }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <!-- <el-table-column prop="price1" label="单价1" width="80" show-overflow-tooltip>
        <template scope="scope">
          <span>{{ returnFloat_2(scope.row.price1) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="price1Total" label="金额1" width="80" show-overflow-tooltip>
        <template scope="scope">
          <span>{{ returnFloat_2(scope.row.price1Total) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="price2" label="单价2" width="80" show-overflow-tooltip>
        <template scope="scope">
          <span>{{ returnFloat_2(scope.row.price2) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="price2Total" label="金额2" width="80" show-overflow-tooltip>
        <template scope="scope">
          <span>{{ returnFloat_2(scope.row.price2Total) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="price3" label="单价3" width="80" show-overflow-tooltip>
        <template scope="scope">
          <span>{{ returnFloat_2(scope.row.price3) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="price3Total" label="金额3" width="80" show-overflow-tooltip>
        <template scope="scope">
          <span>{{ returnFloat_2(scope.row.price3Total) }}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="bsRemark" label="备注" width="150" show-overflow-tooltip/>
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button :disabled="checked" type="primary" icon="el-icon-edit" size="mini" circle title="编辑" @click="showEdit(scope.row)"/>
          <messagebox
            :disabled="checked"
            title="提示"
            contents="此操作将永久删除该行, 是否继续?"
            confirm-title="确认删除"
            @callConfirm="delData(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        :current="1"
        :current-page.sync="queryParams.page"
        :page-sizes="pageSizesList"
        :page-size="queryParams.rows"
        :page-size-opts="pageSizesList"
        :total="totalCount"
        class="pull-right clearfix"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="changePage"
        @size-change="sizeChange"
      />
    </div>

    <!-- fyx-新增工序 -->
    <el-dialog :visible.sync="add_dialog.dataVisible" title="新增工序" width="500px">
      <el-form
        ref="add_dialog.keyruleForm"
        :model="addForm"
        :rules="add_dialog.keyruleForm"
        :inline="true"
        label-position="right"
        label-width="110px">
        <el-form-item label="机型" prop="bsMachine" label-position="left">
          <el-input v-model="addForm.bsMachine" :disabled="true" style="width:218px;"/>
        </el-form-item>
        <el-form-item label="项目流" prop="bsFlowId">
          <el-select
            v-model="addForm.bsFlowId"
            placeholder="项目(工序)"
            style="width:218px"
            filterable>
            <el-option
              v-for="item in optionFlow"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="el-icon-close" @click="add_dialog.dataVisible = false">取 消</el-button>
        <el-button class="el-icon-check" type="primary" @click="addFlowBtn()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 新增详情 -->
    <el-dialog :visible.sync="dialog.dataVisible" title="新增详情" width="500px">
      <el-form
        ref="dialog.keyruleForm"
        :model="dataForm"
        :rules="dialog.keyruleForm"
        :inline="true"
        label-position="right"
        label-width="110px">
        <el-form-item label="机型" prop="bsMachine" label-position="left">
          <el-input v-model="dataForm.bsMachine" :disabled="true" style="width:218px;"/>
        </el-form-item>
        <el-form-item label="项目(工序)" prop="bsProcessId">
          <el-select
            v-model="dataForm.bsProcessId"
            placeholder="项目(工序)"
            style="width:218px"
            filterable>
            <el-option
              v-for="item in optionProcess"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="规格(计费)" prop="bsFeeId">
          <el-select
            v-model="dataForm.bsFeeId"
            placeholder="规格(计费)"
            style="width:218px"
            filterable>
            <el-option
              v-for="item in optionFee"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数量" prop="bsQty">
          <el-input v-model="dataForm.bsQty" style="width:218px;"/>
        </el-form-item>
        <el-form-item label="单位" prop="bsUnit">
          <el-input v-model="dataForm.bsUnit" style="width:218px;"/>
        </el-form-item>
        <el-form-item label="单价(50K)" prop="price1">
          <el-input v-model="dataForm.price1" style="width:218px;"/>
        </el-form-item>
        <el-form-item label="单价(5K)" prop="price2">
          <el-input v-model="dataForm.price2" style="width:218px;"/>
        </el-form-item>
        <el-form-item label="单价(<1000)" prop="price3">
          <el-input v-model="dataForm.price3" style="width:218px;"/>
        </el-form-item>
        <el-form-item label="备注" prop="bsRemark">
          <el-input v-model="dataForm.bsRemark" style="width:218px;"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="el-icon-close" @click="dialog.dataVisible = false">取 消</el-button>
        <el-button class="el-icon-check" type="primary" @click="addBtn()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑详情 -->
    <el-dialog :visible.sync="dialogEdit.dataVisible" title="编辑详情" width="500px">
      <el-form
        ref="dialogEdit.keyruleForm"
        :model="dataFormEdit"
        :rules="dialogEdit.keyruleForm"
        :inline="true"
        label-position="right"
        label-width="110px">
        <el-form-item label="机型" prop="bsMachine" label-position="left">
          <el-input v-model="dataFormEdit.bsMachine" :disabled="true" style="width:218px;"/>
        </el-form-item>
        <el-form-item label="项目" prop="bsProject" label-position="left">
          <el-input v-model="dataFormEdit.bsProject" :disabled="true" style="width:218px;"/>
        </el-form-item>
        <el-form-item label="规格(计费)" prop="bsFeeName">
          <el-input v-model="dataFormEdit.bsFeeId" :disabled="true" style="width:218px;"/>
        </el-form-item>
        <el-form-item label="规格(计费)" prop="bsFeeId">
          <el-input v-model="dataFormEdit.bsFeeId" :disabled="true" style="width:218px;"/>
        </el-form-item>
        <el-form-item label="数量" prop="bsQty">
          <el-input v-model="dataFormEdit.bsQty" style="width:218px;"/>
        </el-form-item>
        <el-form-item label="单位" prop="bsUnit">
          <el-input v-model="dataFormEdit.bsUnit" style="width:218px;"/>
        </el-form-item>
        <el-form-item label="单价(50K)" prop="price1">
          <el-input v-model="dataFormEdit.price1" style="width:218px;"/>
        </el-form-item>
        <el-form-item label="单价(5K)" prop="price2">
          <el-input v-model="dataFormEdit.price2" style="width:218px;"/>
        </el-form-item>
        <el-form-item label="单价(<1000)" prop="price3">
          <el-input v-model="dataFormEdit.price3" style="width:218px;"/>
        </el-form-item>
        <el-form-item label="备注" prop="bsRemark">
          <el-input v-model="dataFormEdit.bsRemark" style="width:218px;"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="el-icon-close" @click="dialogEdit.dataVisible = false">取 消</el-button>
        <el-button class="el-icon-check" type="primary" @click="editBtn()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import messagebox from '@/components/Dialog/MessageBox.vue'
import { getPermission } from '@/api/role'
import { getReport, addReport, editReport, delReport, getDetail, addDetail, editDetail, delDetail, getDetailList, getExcelSplit } from '@/api/marketReport'
import { editCheckStatus, editUncheckStatus, getCheckStatu, getReportId } from '../../api/marketReport'
import { getPermByRouterCode } from '../../api/perm'
export default {
  name: 'MarketReportDetail',
  components: { messagebox },
  data() {
    return {
      checked: false,
      labelPosition: 'right',
      activeNames: ['1'],
      optionDiscount: [],
      optionFlow: [],
      optionProcess: [],
      optionFee: [],
      iTable: [],
      formQuery: {
        id: null,
        bsCustomer: '',
        bsMachine: '',
        bsBomCode: '',
        bsFileId: null,
        bsDiscountId: null,
        bsFlowId: null,
        feeId2: null, // 计费方式-工时ID
        feeId3: null// 计费方式-夹具ID
      },
      queryParams: {
        keyword: '',
        page: 1,
        rows: 15
      },
      pageSizesList: [10, 15, 20, 30, 40, 50, 100],
      totalCount: 0, // 数据的总条数,
      addForm: {
        bsMachine: '',
        bsReportId: '',
        bsProcessId: ''
      },
      // 新增弹出框数据
      dataForm: {
        bsMachine: '',
        bsReportId: '',
        bsProcessId: '',
        bsFeeId: '',
        bsQty: '',
        bsUnit: '',
        price1: '',
        price2: '',
        price3: '',
        bsRemark: ''
      },
      add_dialog: {
        dataVisible: false,
        keyruleForm: {
          bsReportId: [
            { required: true, message: '必填项', trigger: 'blur' }
          ],
          bsFlowId: [
            { required: true, message: '请选择工序流', trigger: 'blur' }
          ]

        }
      },
      dialog: {
        dataVisible: false,
        keyruleForm: {
          bsReportId: [
            { required: true, message: '必填项', trigger: 'blur' }
          ],
          bsProcessId: [
            { required: true, message: '请选择项目(工序)', trigger: 'blur' }
          ]

        }
      },
      // 编辑弹出框数据
      dataFormEdit: {
        id: '',
        bsMachine: '',
        bsReportId: '',
        bsProcessId: '',
        bsFeeId: '',
        bsQty: '',
        bsUnit: '',
        price1: '',
        price2: '',
        price3: '',
        bsRemark: ''
      },
      dialogEdit: {
        dataVisible: false,
        keyruleForm: {
          bsReportId: [
            { required: true, message: '必填项', trigger: 'blur' }
          ],
          bsProcessId: [
            { required: true, message: '请选择项目(工序)', trigger: 'blur' }
          ]

        }
      },
      fileId: '',
      currentRow: [],
      multipleSelection: [],
      // el-tag类型转换
      statusFilter(status) {
        const statusMap = {
          0: 'info',
          1: 'info'
        }
        return statusMap[status]
      },
      // 清单类型显示转换
      formatStatus(status) {
        const statusMap = {
          0: '否',
          1: '是'
        }
        return statusMap[status]
      },
      isBomPrice: false,// 是否有查看价格权限
      permit:{
        //权限控制
        CHECK:false,
        UNCHECK:false
      }
    }
  },
  computed: {

  },
  created() {
    // 非新增
    // this.getCheckStatus(this.formQuery.id)
    this.getPermit()
    if (this.$route.query.bomCode) {
      this.getDetailByBomCode(this.$route.query.bomCode, this.$route.query.fileId)
    }
    // 获取当前角色的操作权限
    // getPermission().then(response => {
    //   if(response.result){
    //       if(response.data.isSuper == 1){
    //         this.isBomPrice = true;
    //       }else{
    //         //查看价格权限
    //         if(response.data.perm != "" && response.data.perm.indexOf("BOM_PRICE") >= 0){
    //           this.isBomPrice = true;
    //         }
    //       }
    //   }else{
    //     this.$message.error(response.msg);
    //   }
    // });
  },
  methods: {
    // 数字保留6位小数
    returnFloat(value) {
      if (value == null || value == undefined) {
        return '0.000000'
      }
      var value = Math.round(parseFloat(value) * 1000000) / 1000000
      var xsd = value.toString().split('.')
      if (xsd.length == 1) {
        value = value.toString() + '.000000'
        return value
      }
      // 如果存在小数，则循环添加0，直到6位小数
      if (xsd.length > 1) {
        var after = ''
        for (var i = 0; i < (6 - xsd[1].length); i++) {
          after = after.toString() + '0'
        }
        value = value.toString() + after
        // if(xsd[1].length<2){
        //   value=value.toString()+"0";
        // }
        return value
      }
    },
    count(price, num) {
      return this.returnFloat_2(price * num)
    },
    // 数字保留3位小数
    returnFloat_2(value) {
      if (value == null || value == undefined) {
        return '0.000'
      }
      var value = Math.round(parseFloat(value) * 1000) / 1000
      var xsd = value.toString().split('.')
      if (xsd.length == 1) {
        value = value.toString() + '.000'
        return value
      }
      // 如果存在小数，则循环添加0，直到6位小数
      if (xsd.length > 1) {
        var after = ''
        for (var i = 0; i < (3 - xsd[1].length); i++) {
          after = after.toString() + '0'
        }
        value = value.toString() + after
        return value
      }
    },
    // 根据bomCode获取详情
    getDetailByBomCode(bomCode, fileId) {
      getDetail(bomCode).then(response => {
        if (!response.result) {
          this.$message.error(response.msg)
          return
        }
        // 填充下拉框数据
        this.optionDiscount = []
        this.optionDiscount.push({ vlaue: '', label: '无' })
        response.data.disList.forEach(element => {
          var option = { value: element.id, label: element.bsCode + '(' + element.bsName + ')' }
          this.optionDiscount.push(option)
        })
        this.optionFlow = []
        this.optionFlow.push({ vlaue: '', label: '无' })
        response.data.flowList.forEach(element => {
          var option = { value: element.id, label: element.bsCode + '(' + element.bsName + ')' }
          this.optionFlow.push(option)
        })
        this.optionProcess = []
        this.optionProcess.push({ vlaue: '', label: '无' })
        response.data.processList.forEach(element => {
          var option = { value: element.id, label: element.bsCode + '(' + element.bsName + ')' }
          this.optionProcess.push(option)
        })
        this.optionFee = []
        this.optionFee.push({ vlaue: '', label: '无' })
        response.data.feeList.forEach(element => {
          var option = { value: element.id, label: element.bsName }
          this.optionFee.push(option)
        })
        // 填充表格数据

        // 填充参数设置
        this.formQuery.id = response.data.report.id
        this.formQuery.bsCustomer = response.data.report.bsCustomer
        this.formQuery.bsMachine = response.data.report.bsMachine
        this.formQuery.bsBomCode = bomCode
        this.formQuery.bsFileId = fileId
        this.formQuery.bsDiscountId = response.data.report.bsDiscountId
        this.formQuery.bsFlowId = response.data.report.bsFlowId
        this.formQuery.feeId2 = response.data.feeId2
        this.formQuery.feeId3 = response.data.feeId3
        this.getCheckStatus(this.formQuery.id)
        this.getDetailList()
      })
    },
    // 保存
    doSave() {
      const filter = Object.assign({}, this.formQuery)
      if (this.formQuery.id) {
        // 编辑
        editReport(filter).then(response => {
          if (response.result) {
            this.$message.success(response.msg)
            this.getDetailByBomCode(this.formQuery.bsBomCode, this.formQuery.bsFileId)
          } else {
            this.$message.error(response.msg)
          }
        })
      } else {
        // 新增
        addReport(filter).then(response => {
          if (response.result) {
            this.$message.success(response.msg)
            this.getDetailByBomCode(this.formQuery.bsBomCode, this.formQuery.bsFileId)
          } else {
            this.$message.error(response.msg)
          }
        })
      }
    },
    // 获取详情列表数据
    getDetailList() {
      if (this.formQuery.id) {
        const filter = Object.assign({}, { keyword: '', fileId: this.formQuery.bsFileId, reportId: this.formQuery.id, rows: this.queryParams.rows, page: this.queryParams.page })
        getDetailList(filter).then(response => {
          if (response.result) {
            this.iTable = response.data.rows
            this.totalCount = response.data.total
          }
        })
      }
    },
    getValue(row_new) {
      const row = row_new
      console.log(row)
      delete row.pkModifiedBy
      delete row.pkCreatedBy
      delete row.createdTime
      delete row.modifiedTime
      delete row.marketReport
      delete row.fee

      console.log(row)

      editDetail(row).then(response => {
        if (response.result) {
          // this.$message.success(response.msg);
          // this.dialog.dataVisible=false;
          this.getDetailList()
        } else {
          this.$message.error(response.msg)
        }
      })
    },
    // 转换工序
    getProcessName(row) {
      var processName = ''
      if (row.bsType == 1) {
        processName = row.processInfo ? row.processInfo.bsName : ''
      } else {
        processName = 'BOM物料清单'
      }
      return processName
    },
    // 转换计费方式
    getFeeName(row) {
      var feeName = ''
      if (row.bsType == 1) {
        feeName = row.bsFee ? row.bsFee : ''
      } else {
        feeName = 'SMD'
      }
      return feeName
    },
    changePage(page) {
      this.queryParams.page = page
      this.getDetailList()
    },
    sizeChange(size) {
      this.queryParams.rows = size
      this.getDetailList()
    },
    // 新增详情
    showAdd() {
      this.add_dialog.dataVisible = true
      const newRow = {
        bsMachine: this.formQuery.bsMachine,
        bsReportId: this.formQuery.id,
        bsFlowId: ''
      }
      this.addForm = Object.assign(newRow)
      // this.dialog.dataVisible = true;
      // const newRow = {
      //   bsMachine:this.formQuery.bsMachine,
      //   bsReportId:this.formQuery.id,
      //   bsProcessId: '',
      //   bsFeeId:'',
      //   bsQty:'',
      //   bsUnit:'',
      //   price1:'',
      //   price2:'',
      //   price3:'',
      //   bsRemark:''
      // }
      // this.dataForm = Object.assign(newRow);
    },
    addBtn() {
      const filter = Object.assign({}, this.dataForm)
      this.$refs['dialog.keyruleForm'].validate((valid) => {
        if (valid) {
          addDetail(filter).then(response => {
            if (response.result) {
              this.$message.success(response.msg)
              this.dialog.dataVisible = false
              this.getDetailList()
            } else {
              this.$message.error(response.msg)
            }
          })
        }
      })
    },
    addFlowBtn() {
      const filter = Object.assign({}, this.addForm)
      this.$refs['add_dialog.keyruleForm'].validate((valid) => {
        if (valid) {
          addDetail(filter).then(response => {
            if (response.result) {
              this.$message.success(response.msg)
              this.dialog.dataVisible = false
              this.getDetailList()
            } else {
              this.$message.error(response.msg)
            }
          })
        }
      })
    },
    // 编辑详情
    showEdit(row) {
      console.log(row)
      this.dialogEdit.dataVisible = true
      const newRow = {
        id: row.id,
        bsMachine: this.formQuery.bsMachine,
        bsReportId: this.formQuery.id,
        bsProject: row.bsProject,
        bsFeeId: row.bsFeeId,
        baFeeName: this.getFeeName(row),
        bsQty: row.bsQty,
        bsUnit: row.bsUnit,
        price1: row.price1,
        price2: row.price2,
        price3: row.price3,
        bsRemark: row.bsRemark
      }
      this.dataFormEdit = Object.assign(newRow)
    },
    editBtn() {
      const filter = Object.assign({}, this.dataFormEdit)
      this.$refs['dialogEdit.keyruleForm'].validate((valid) => {
        if (valid) {
          editDetail(filter).then(response => {
            if (response.result) {
              this.$message.success(response.msg)
              this.dialogEdit.dataVisible = false
              this.getDetailList()
            } else {
              this.$message.error(response.msg)
            }
          })
        }
      })
    },
    // 删除详情
    delData(row) {
      const id = row.id
      delDetail(id).then(response => {
        if (response.result) {
          this.$message({
            message: response.msg,
            type: 'success'
          })
          this.getDetailList()
        } else {
          this.$message.error(response.msg)
        }
      })
    },

    // 选中行
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 导出
    downloadDoc() {
      var bomCode = this.formQuery.bsBomCode
      window.location.href = process.env.BASE_API + '/marketReport/getExcel?bomCode=' + bomCode
    },
    // 导出(工时和钢网夹具)
    downloadAll() {
      var reportId = this.formQuery.id
      var feeId2 = this.formQuery.feeId2
      var feeId3 = this.formQuery.feeId3
      window.location.href = process.env.BASE_API + '/marketReport/getExcelAll?reportId=' + reportId + '&&feeId2=' + feeId2 + '&&feeId3=' + feeId3
    },
    // 查看BOM报价详情报表
    toQtReport() {
      this.$router.push({ path: 'marketReportDetail2', query: { bomCode: this.formQuery.bsBomCode, fileId: this.formQuery.bsFileId }})
    },
    // 查看工时-报价单详情报表
    toWorkHour() {
      this.$router.push({ path: 'marketReportDetail3', query: { reportId: this.formQuery.id, feeId: this.formQuery.feeId2 }})
    },
    // 查看钢网夹具-报价单详情报表
    toFixture() {
      this.$router.push({ path: 'marketReportDetail4', query: { reportId: this.formQuery.id, feeId: this.formQuery.feeId3 }})
    },

    check() {
      this.$confirm('是否确认审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'

      }).then(() => {
        this.checked = true
        editCheckStatus(this.formQuery.id)
        this.$message({
          type: 'success',
          message: '审核成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消审核'
        })
      })
    }, backcheck() {
      this.$confirm('是否确认反审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.checked = false
        editUncheckStatus(this.formQuery.id)
        this.$message({
          type: 'success',
          message: '反审核成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消反审核'
        })
      })
    }, getCheckStatus(id) {
      getCheckStatu(id).then(res => {
        if (res.result) {
          if (res.data) {
            this.checked = true
          }
        }
      })
    },
    // 获取权限
    getPermit() {
      var routePath = this.$route.name;
      getPermByRouterCode(routePath).then(res => {
        if (res.result) {
          if (res.data == 'admin') {
              this.permit.CHECK= true;
            this.permit.UNCHECK=true;
          }else{
            var list = res.data;
            for(var i = 0; i < list.length; i++){
               if(list[i].permCode == "CHECK") this.permit.CHECK = true;
              if(list[i].permCode == "UNCHECK") this.permit.UNCHECK=true;
            }
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    }

  }

}
</script>
<style type="text/css">
/*.demo-form-inline {
  padding: 10px;
}*/
.demo-form-inline .el-form-item__label {
  font-size: 12px;
  font-family: "Microsoft YaHei";
  margin-left:15px;
}
.collapse .el-collapse-item__header {
  font-size: 13px;
  /*height: 30px;
  line-height:38px;*/
}
.Operation {
  font-size: 13px;
  /*cursor: pointer;*/
}
.el-table .success-row {
  background: #9fe0a6 !important ;
}
.el-table .warning-row {
  background: #f6a556 !important ;
}
/*.sometable{
  width: 100%;height: 100%;
}*/
.sometable th {
  background: none !important;

}
.priceTotal {
  display: flex;
  height: 70px;
  background: #f7f8fd;
  border: 1px solid #e2e7f0;
}
.priceTotal li {
  list-style: none;
  flex: 1;
  /* text-align: center;*/
  height: 100%;
  background: none;
  border-right: 1px solid #e2e7f0;
  cursor: pointer;
  padding-left: 15px;
  position: relative;
}
.priceTotal p.label {
  color: #96a6b6;
}
.priceTotal .num {
  font-size: 18px;
/*  height: 8px;*/
  margin-top: 10px;
}
.priceTotal p.num1 {
  color: #fb7884;
  /* text-align:center; */
}
.priceTotal p.num2 {
  color: #03a9f3;
}
.priceTotal p.num3 {
  color: #9675ce;
}
.progressbox {
  position: relative;
}
.progressbox .total {
  position: absolute;
  right: -5%;
  top: -2px;
  font-size: 14px;
}
.downBtn {
  position: absolute;
  right: 44px;
  top: 4px;
  width: 50px;
  height: 50px;
}
.demo .el-switch__label {
  position: absolute;
  display: none;
  color: #fff;
}
/*打开时文字位置设置*/
.demo .el-switch__label--right {
  z-index: 1;
  right: -3px;
}
.el-switch__label *{
  font-size: 12px;
}
/*关闭时文字位置设置*/
.demo .el-switch__label--left {
  z-index: 1;
  left: 19px;
}
/*显示文字*/
.demo .el-switch__label.is-active {
  display: block;
}
.demo.el-switch .el-switch__core,
.el-switch .el-switch__label {
  width: 50px !important;
}
.doc-upload-input{
  display: none;
  z-index: -9999;
}
.mateFooter{
  box-sizing: border-box;
  background: #fff;
  text-align: center;
  max-width: 1000px;
  display: table-cell;
  vertical-align: middle;
  width: 1000px;
  height: 50px;
}
.market-table .el-input-number--mini{
  width: 80px;
}
</style>
