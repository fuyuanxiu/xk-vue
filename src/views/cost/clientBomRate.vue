<template>
  <div v-loading="load" element-loading-text="数据加载中，请稍等">
    <!-- <Row> -->
    <el-row style="margin-bottom:5px;margin-top:5px;">
      <el-col :span="4">
        <upload-excel-component
          v-if='isUpload'
          v-on:afterUpload="afterUpload"
          :on-success="handleSuccess"
          :before-upload="beforeUpload"          
        >
        </upload-excel-component>
      </el-col>
      <el-col :span="16">
        <el-button
          type="button"
          @click="toList"
        >查看历史记录</el-button>
      <MessageBoxDelete
          @callConfirm="doDelete(fileId)"
          title="提示"
          contents="此操作将永久删除该行, 是否继续?"
          confirmTitle="确认删除"
      ></MessageBoxDelete>        
      <!--   <el-button
            type="success"
            class="el-icon-message"
            @click="startActions()"
        >发送待办</el-button>  -->      
      </el-col>
      <el-col :span="5">
        <!-- <el-button
          type="button"
          @click="toInstructions"
        >操作说明<svg-icon icon-class="help" /></el-button> -->
      </el-col>
    </el-row>
    <el-collapse
      v-model="activeNames"
      v-show="isShow"
    >
      <el-collapse-item
        title="设置参数"
        name="1"
        class="collapse"
      >
        <el-row>
          <el-col :span="24" style="margin-bottom:-10px;">
            <el-form
              :inline="true"
              ref="formQuery"
              :model="formQuery"
              :rules="rules"
              class="demo-form-inline"
              label-width="60px"
              :label-position="labelPosition"
            >
              <el-col :span="24" style="margin-bottom:-10px;margin-top:5px;">
                <el-form-item
                  label="规格"
                  prop="standardCol"                 
                >
                  <el-select
                  :disabled="isChecked"
                    v-model="formQuery.standardCol"
                    placeholder="规格列"
                    style="width:175px"
                  >
                    <el-option
                      v-for="item in optionHearder"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="数量"
                  prop="quantityCol"
                >
                  <el-select
                  :disabled="isChecked"
                    v-model="formQuery.quantityCol"
                    placeholder="数量列"
                    style="width:170px"
                  >
                    <el-option
                      v-for="item in optionHearder"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="类别" prop="categoryCol">
                  <el-select
                  :disabled="isChecked"
                    v-model="formQuery.categoryCol"
                    placeholder="类别列"
                    style="width:178px"
                  >
                    <el-option
                      v-for="item in optionHearder"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="名称">
                  <el-select
                  :disabled="isChecked"
                    v-model="formQuery.nameCol"
                    placeholder="名称列"
                    style="width:170px"
                  >
                    <el-option
                      v-for="item in optionHearder"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24" style="margin-bottom:-10px;margin-top:5px;">
                <el-form-item label="封装">
                  <el-select
                  :disabled="isChecked"
                    v-model="formQuery.packageCol"
                    placeholder="封装列"
                    style="width:170px"
                  >
                    <el-option
                      v-for="item in optionHearder"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="制造商">
                  <el-select
                  :disabled="isChecked"
                    v-model="formQuery.makerCol"
                    placeholder="制造商列"
                    style="width:170px"
                  >
                    <el-option
                      v-for="item in optionHearder"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="品牌料号">
                  <el-select 
                  :disabled="isChecked"
                    v-model="formQuery.brandNumberCol"
                    placeholder="品牌料号"
                    style="width:185px"
                  >
                    <el-option
                      v-for="item in optionHearder"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="位号">
                  <el-select
                  :disabled="isChecked"
                    v-model="formQuery.placeNumberCol"
                    placeholder="位号"
                    style="width:170px"
                  >
                    <el-option
                      v-for="item in optionHearder"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>                              
              </el-col>
              <el-col :span="24" style="margin-bottom:-10px;margin-top:5px;">
                <el-form-item label="选中比例">
                   <el-input :disabled="isChecked" v-model="formQuery.bomCheck" style="width:170px"></el-input>
                </el-form-item>
                <el-form-item label="限制比例">
                   <el-input :disabled="isChecked" v-model="formQuery.bomLimit" style="width:170px"></el-input>
                </el-form-item>
                <el-form-item label="是否筛选客供料"  prop="" style="width: 232px" label-width="140px">
                    <el-switch class="demo"
                    :disabled="isChecked"
                    v-model="formQuery.isCustomer"
                    :active-value="1"
                    :inactive-value="0"
                    active-text="是"
                    inactive-text="否"
                    active-color="#13ce66"
                    inactive-color="#ccc">
                  </el-switch>
                </el-form-item>   
                <el-form-item label="是否筛选已匹配的物料" prop="" label-width="140px">
                    <el-switch class="demo"
                    :disabled="isChecked"
                    v-model="formQuery.isMatchAll"
                    :active-value="1"
                    :inactive-value="0"
                    active-text="是"
                    inactive-text="否"
                    active-color="#13ce66"
                    inactive-color="#ccc">
                  </el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="24" style="margin-bottom:-10px;margin-top:5px;">
                <el-form-item label="匹配数量">
                   <el-input :disabled="isChecked" v-model="formQuery.bomLimitNum" style="width:170px"></el-input>
                </el-form-item>
                <el-form-item label="规格的分隔符" label-width="140px">
                  <!-- <el-input v-model="suppChineseName" placeholder="分隔符有'/'，'，'，'；'三种"></el-input> -->
                  <el-checkbox-group :disabled="isChecked" v-model="checkList" >
                    <el-checkbox label="1">/</el-checkbox>
                    <el-checkbox label="2">,</el-checkbox>
                    <el-checkbox label="3">;</el-checkbox>
                    <el-checkbox label="4">-</el-checkbox>
                    <el-checkbox label="5">、</el-checkbox>
                    <el-checkbox label="6">*</el-checkbox>
                    <el-checkbox label="7">空格</el-checkbox>
                    <el-checkbox label="8">中文逗号</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
              <el-col :span="24" style="margin-bottom:-10px;margin-top:5px;">
                <el-form-item label="套数">
                   <el-input :disabled="isChecked" v-model="formQuery.bomNumber" style="width:170px"></el-input>
                </el-form-item>
                <el-form-item label="排序方案">
                  <el-select
                  :disabled="isChecked"
                    v-model="formQuery.bsSortPlan"
                    placeholder="排序方案"
                    style="width:170px"
                  >
                    <el-option
                      v-for="item in optionSort"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="K3代码">
                  <el-input :disabled="isChecked" v-model="formQuery.bomK3CodeCol" style="width:170px"></el-input>
                </el-form-item>
                <el-form-item label="K3代码导入人">
                   <el-input v-model="formQuery.personName" :disabled="true" style="width:170px"></el-input>
                </el-form-item>
                <!-- <el-form-item label="选中比例">
                   <el-input  v-model="formQuery.bomCheck" style="width:170px"></el-input>
                </el-form-item>
                <el-form-item label="限制比例">
                   <el-input  v-model="formQuery.bomLimit" style="width:170px"></el-input>
                </el-form-item>
                <el-form-item label="匹配数量">
                   <el-input  v-model="formQuery.bomLimitNum" style="width:170px"></el-input>
                </el-form-item> -->
              </el-col>
              <el-col>                               
                <el-form-item style="margin-left:40px;">
                  <el-button type="primary" @click="doSimilarity('formQuery')">开始匹配K3数据</el-button>
                  <el-button type="primary" @click="clickParent">新料询价</el-button>
                  <el-button type="primary" @click="exportBom()">导出Excel</el-button>
                  <el-button v-if="isBomPrice" type="primary" @click="exportBomPrice()">导出Excel(含价格)</el-button>
                  <el-button type="primary" @click="copy()">复制</el-button>
                  <el-button type="primary" @click="showDoc()">附件管理</el-button>
                  <el-button type="primary" @click="toggleSelection()">勾选未匹配行</el-button>
                  <upload-code-component
                    v-if='isUpload'
                    v-on:afterUpload="afterUpload"
                    :on-success="handleSuccess"
                    :before-upload="beforeUpload"
                    v-bind:bomParamId="bomParamsId"    
                    v-bind:fileId="fileId"  
                    v-bind:bomK3CodeCol="formQuery.bomK3CodeCol"   
                  >
                  </upload-code-component>
                </el-form-item>
                 <el-button v-if="permit.CHECK" :disabled="isChecked"  size="mini" type="primary" @click="check(checkId)">审核</el-button>
                <el-button v-if="permit.UNCHECK" :disabled="!isChecked" size="mini"  type="success" @click="uncheck(checkId)">反审核</el-button>
              </el-col>         
            </el-form>
          </el-col>
        </el-row>
      </el-collapse-item>
      <el-collapse-item
        title="汇总信息"
        name="2"
        class="collapse"
        v-if="isShowTable"
      >
        <!--汇总行-->
        <el-row style="margin-bottom:10px;">
          <el-col
            :span='1'
            style="margin-left:10px;"
          >
            <el-tag>进度:</el-tag>
            <!-- <el-slider v-model="fillNum"  :max="totalNum"></el-slider> :color="fillPercent=='100'?'greed':'red'" -->
          </el-col>
          <el-col
            :span="20"
            class="progressbox"
          >
            <el-progress
              :text-inside="true"
              :stroke-width="18" 
              :color="color"
              :percentage="fillPercent"
              status="exception"
            ></el-progress>
            <span class="total">总数:{{this.totalNum}}</span>
          </el-col>
        </el-row>
        <ul class="priceTotal" v-if="isBomPrice">
          <li>
            <p class="num1 num">{{this.fAuxPriceTotal}}</p>
            <p class="label">最近采购价汇总</p>
            <div class="downBtn">
              <el-button 
                round
              > <svg-icon icon-class="excel" style="width:45px;height:45px" /></el-button>
            </div>
          </li>
          <li>
            <p class="num2 num">{{this.fAuxPrice3MonthMaxTotal}}</p>
            <p class="label">三个月之内最高价汇总</p>
            <div class="downBtn">
              <el-button
                round
              ><svg-icon icon-class="excel" style="width:45px;height:45px" /></el-button>
            </div>
          </li>
          <li>
            <p class="num3 num">{{this.fAuxPrice3MonthMinTotal}}</p>
            <p class="label">三个月之内最低价汇总</p>
            <div class="downBtn">
              <el-button
                round
              ><svg-icon icon-class="excel" style="width:45px;height:45px" /></el-button>
            </div>
          </li>
        </ul>
      </el-collapse-item>
    </el-collapse>

    <!-- </Row> -->

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
    <!-- 后台解析到的excel数据 -->
   
    <el-table 
      ref="multipleTable"
      class="sometable"
      max-height="600"
      v-show="isShowTable"
      :data="tableData"
      border
      :row-class-name="tableRowClassName"
      style="overflow-x:auto"
      row-key="CusBomId"
      :expand-row-keys="expands"
      @expand-change="rowExpand"
      @row-click="rowClick"    
      @selection-change="handleSelectionChange"
    >
       <!-- @select="handleSelectionChange"     -->
     <el-table-column
      type="selection"      
      width="45">
    </el-table-column>
   <!--  <el-table-column  width="45">
     <template slot-scope="scope">
     <el-checkbox v-model="scope.row.checked" @change.native="getCurrentRow(scope.$index)"></el-checkbox>
     </template>
    </el-table-column> -->
    <el-table-column
        type="expand"
        prop="children"
      >

        <template slot-scope="props">
          <el-form
            label-position="left"
            inline
            class="demo-table-expand"
          >
            <!-- <el-form :inline="true" ref="formMath" :model="formMath" :rules="rules"  class="demo-form-inline">
            <el-col>
              <el-form-item label="匹配前" >
               <el-input   type="number" >{{ props.row.CusBomId }}</el-input>
            </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" @click="doSimilarity('formQuery')">开始匹配K3数据</el-button>
            </el-form-item>
            </el-col>
        </el-form> -->
            <el-button type="primary" @click="showMateView(props.row.CusBomId)" style="margin-top:10px;margin-left:47px;">查询物料</el-button>
            <el-table
              :data="props.row.childrenData"
              border
              v-loading="loading"
              element-loading-text="数据加载中，请稍等"
              :highlight-current-row="true"
              style="width: 1154px;margin-top:10px;margin-left:47px;font-size: 12px"
            >
              <!-- <el-table-column
                prop="fItemId"
                label="K3物料Id"
                width="80"
                show-overflow-tooltip
                fixed
              /> -->
              <el-table-column 
                label="序号" 
                type="index" 
                width="50"
                show-overflow-tooltip
                fixed
              />
              <el-table-column
                prop="fNumber"
                label="物料编号"
                width="110"
                show-overflow-tooltip
                fixed
              />
              <el-table-column
                prop="fName"
                label="物料名称"
                width="90"
                show-overflow-tooltip
              />
              <el-table-column
                prop="fModel"               
                label="物料规格"
                width="283"
                show-overflow-tooltip
              />
              <el-table-column
                prop="mateCusName"
                label="品牌"
                width="100"
                show-overflow-tooltip
              />
              <el-table-column
                prop="mateCusCode"
                label="品牌料号"
                width="100"
                show-overflow-tooltip
              />
              <el-table-column
                prop="ratio"
                label="匹配率"
                width="100"
                show-overflow-tooltip
              />
              <el-table-column
                prop="fStockQty"
                label="库存数量"
                width="100"
                show-overflow-tooltip
              />
              <el-table-column
                v-if="isBomPrice" 
                prop="fStockPrice"
                label="库存单价"
                width="100"
                show-overflow-tooltip
              >
                <template scope="scope">
                  <span>{{returnFloat(scope.row.fStockPrice)}}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="isBomPrice" 
                prop="fAuxPriceDiscount"
                label="最近采购价"
                width="80"
                show-overflow-tooltip                
              >
                <template scope="scope">
                  <span>{{returnFloat(scope.row.fAuxPriceDiscount)}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="suppChineseName"
                label="供应商"
                width="100"
                show-overflow-tooltip
              />
              <el-table-column
                v-if="isBomPrice" 
                prop="fStockPriceTotal"
                label="库存金额"
                width="100"
                show-overflow-tooltip
              >
                <template scope="scope">
                  <span>{{returnFloat(scope.row.fStockPriceTotal)}}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="isBomPrice" 
                prop="fAuxPriceDiscountTotal"
                label="最近采购金额"
                width="80"
                show-overflow-tooltip                
              >
                <template scope="scope">
                  <span>{{returnFloat(scope.row.fAuxPriceDiscountTotal)}}</span>
                </template>
              </el-table-column>
              <el-table-column 
                v-if="isBomPrice" 
                prop="price1" 
                label="价格1" 
                width="80" 
                show-overflow-tooltip>
                <template scope="scope">
                  <span>{{returnFloat(scope.row.price1)}}</span>
                </template>
              </el-table-column>
              <el-table-column 
                v-if="isBomPrice" 
                prop="price2" 
                label="价格2" 
                width="80" 
                show-overflow-tooltip>
                <template scope="scope">
                  <span>{{returnFloat(scope.row.price2)}}</span>
                </template>
              </el-table-column>
              <el-table-column 
                v-if="isBomPrice" 
                prop="price3" 
                label="价格3" 
                width="80" 
                show-overflow-tooltip>
                <template scope="scope">
                  <span>{{returnFloat(scope.row.price3)}}</span>
                </template>
              </el-table-column>
              <el-table-column 
                v-if="isBomPrice" 
                prop="price4" 
                label="价格4" 
                width="80" 
                show-overflow-tooltip>
                <template scope="scope">
                  <span>{{returnFloat(scope.row.price4)}}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="isBomPrice" 
                prop="fAuxPrice3MonthMax"
                label="三个月内的最高价"
                width="100"
                show-overflow-tooltip
              >
                <template scope="scope">
                  <span>{{returnFloat(scope.row.fAuxPrice3MonthMax)}}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="isBomPrice" 
                prop="fAuxPrice3MonthMin"
                label="三个月内的最低价"
                width="100"
                show-overflow-tooltip
              >
                <template scope="scope">
                  <span>{{returnFloat(scope.row.fAuxPrice3MonthMin)}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="smtPoints"
                label="SMT点数"
                width="100"
                show-overflow-tooltip
              />
              <!-- 20200406-sxw-添加SMT焊盘数量 -->
              <el-table-column
                prop="smtFeetQty"
                label="SMT焊盘数量"
                width="100"
                show-overflow-tooltip
              />
              <el-table-column
                prop="smtPointsTotal"
                label="SMT点数总和"
                width="100"
                show-overflow-tooltip
              />
              <el-table-column
                prop="modifiedName"
                label="修改人"
                width="100"
                show-overflow-tooltip
              />
              <el-table-column
                label="状态"
                width="100"
                fixed="right"
              >
                <template slot-scope="scope1">
                  <span v-if="scope1.row.checkStatus===0" style="color:green;font-weight:bold;">未选中</span>
                  <span v-if="scope1.row.checkStatus===1" style="color:red;font-weight:bold;">已选中</span>
                </template>
              </el-table-column>
              <el-table-column
                label="取消/选中"
                width="100"
                fixed="right"
              >
                <template slot-scope="scope1">
                  <!-- <el-switch
                    v-model="scope1.row.checkStatus"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-value="1"
                    inactive-value="0"
                    :change="doCheck(scope1.row.checkStatus,scope1.row)"
                  >
                  </el-switch> -->
                  <el-button
                  :disabled="isChecked"
                    type="success"
                    v-if="scope1.row.checkStatus===0"
                    icon="el-icon-check"
                    @click="doCheck('1',scope1.row)"
                  >选中</el-button>
                  <el-button
                  :disabled="isChecked"
                    type="danger"
                    v-if="scope1.row.checkStatus===1"
                    icon="el-icon-close"
                    @click="doCheck('0',scope1.row)"
                  >取消</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column
        label="筛选大类"
        width="100"
      >      
        <template slot-scope="scope">
          <el-select
          :disabled="isChecked"
            v-model="scope.row.mateCategory"
            clearable
            placeholder="请选择物料大类"
            @change="onSelectedCategory($event, scope.row)"
          >
            <el-option
              v-for="item in meriOption"
              :key="item.fNumber"
              :label="item.fName"
              :value="item.fNumber"
            >
              <span style="float: left">{{ item.fNumber }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.fName }}</span>
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        label="是否匹配"
        width="80">
        <template scope="scope">
          <span>{{ formatStatus(scope.row.checkStatus) }}</span>
          <!-- <el-tag :type="statusFilter(scope.row.checkStatus)">{{ formatStatus(scope.row.checkStatus)}}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column
        v-for="item of tableHeader"
        :prop="item"
        :label="item"
        :key="item"
        v-if="item!='mateCategory'"
        width="100"
        show-overflow-tooltip
      /> <!-- v-if="item!='mateCategory'" -->
      <el-table-column
        prop="checkCode"
        label="选中的物料号"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="fStockQty"
        label="库存数量"
        width="110"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        v-if="isBomPrice" 
        prop="fStockPrice"
        label="库存单价"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        v-if="isBomPrice" 
        prop="fStockPriceTotal"
        label="库存金额"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        v-if="isBomPrice" 
        prop="fAuxPriceDiscount"
        label="最新采购价"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        v-if="isBomPrice" 
        prop="fAuxPriceDiscountTotal"
        label="最新采购金额"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <!-- 新料询价 -->
    <matermodel ref="modelChild" :visible="dialog.modal_dialog" :multipleSelection="multipleSelection"></matermodel>
    <!-- 附件管理 -->
    <el-dialog title="附件管理" :visible.sync="dialog.docVisible" width="500px">
      <div>
        <input ref="doc-upload-input" class="doc-upload-input" type="file" @change="addDoc" />
        <el-button style="margin-bottom: 10px;" size="mini" type="primary" @click="addDocBefore">添加附件</el-button>
      </div>
      <el-table border :data="docList" tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="no" label="序号" show-overflow-tooltip width="60" />
        <el-table-column prop="bsDocName" label="附件名称" show-overflow-tooltip />
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-download" size="mini" @click="downloadDoc(scope.row.bsDocId)" circle></el-button>
            <MessageBoxDelete @callConfirm="deleteDoc(scope.row)" title="提示" contents="此操作将永久删除该行, 是否继续?" confirmTitle="确认删除"></MessageBoxDelete>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button class="el-icon-check" type="primary" @click="dialog.docVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <!-- K3物料列表 -->
    <el-dialog title="K3物料列表" :visible.sync="showMateVisible" width="1000px">
      <div>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="物料编号">
            <el-input v-model="mateCode" placeholder="请准确输入物料编号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchMate">查找</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table border :data="showMateList" tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="mateK3Code" label="编号" show-overflow-tooltip />
        <el-table-column prop="mateName" label="名称" show-overflow-tooltip />
        <el-table-column prop="mateModel" label="规格" show-overflow-tooltip />
        <el-table-column prop="suppChineseName" label="供应商名称" show-overflow-tooltip />
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <el-button type="primary" @click="chooseMate(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="mateFooter">
        <el-button type="primary" @click="showMateVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getPermByRouterCode} from '@/api/perm'
import UploadExcelComponent from "./components/UploadExcel.vue";
import { getK3Bom,getBomMatch,getBomData,doCheckMateriel,delBom,copyBom,updateCheck,getReviewStatus,reverseCheck } from "@/api/cost";
import {getUserList} from '@/api/user'
import MessageBoxDelete from "./components/MessageBox.vue";
import matermodel from "./components/materModel.vue";
import { addDoc,deleteDoc,getDocList } from '@/api/costFile';
import { getPermission } from '@/api/role';
import { getMateList,addMate } from '@/api/costMate';
import UploadCodeComponent from "./components/UploadCode.vue";
export default {
  inject: ['reload'],
  name: "clientBomRate",
  components: { UploadExcelComponent,MessageBoxDelete,matermodel,UploadCodeComponent },
  data() {
    return {
      isChecked:false,
      checkId:null,     
      tableData: [],
      permit:{
        CHECK:false,
        UNCHECK:false
      },      
      tableHeader: [],
      dropCol: [],
      labelPosition:'right',
      isUpload: true,
      isShow: false,
      isShowTable: false,
      activeNames: ["1"],     
      optionHearder: [],
      optionUser:[],
      optionSort:[],
      bomIds:[],
      formQuery: {
        standardCol: "",
        categoryCol: "",
        nameCol: "",
        quantityCol: "",
        packageCol: "",
        makerCol: "",
        brandNumberCol: "",
        placeNumberCol: "",
        isCustomer:0,
        isMatchAll:0,
        bomNumber:1,
        bomCheck:0.6,
        bomLimit:0.0,
        bomLimitNum:5,
        bsSortPlan:0,
        bomK3CodeCol: "",
        personName: ""
      },
      checkList: ["1", "2"],
      fileId: "",
      expands: [],
      expandTableData: [],
      rules: {
        standardCol: [
          { required: true, message: "请选择规格列", trigger: "change" }
        ],
        quantityCol: [
          { required: true, message: "请选择数量列", trigger: "change" }
        ],
        categoryCol: [
          { required: true, message: "请选择类别列", trigger: "change" }
        ]
      },
      load:false,
      formMath: {
        mathNum: "",
        mathRatio: ""
      },
      arrID:[],
      filters: {},
      currentRow: [],
      fillPercent: 0,
      fAuxPriceTotal: 0,
      fAuxPrice3MonthMaxTotal: 0,
      fAuxPrice3MonthMinTotal: 0,
      fillNum: 0, //已勾选数量
      totalNum: 0,       
      color:'#f56c6c',
      bomParamsId:"",
   /*   dialogVisible: false, */
      loading: false,
      dialog: {
        //loading: false,      
        formItem: {            
           id:'',
           userName:'',
           remark:''         
        },
        ruleForm: {
          roleCode: [
              { required: true, message: '请填选人员', trigger: 'blur' }
          ],      
        },
        docVisible: false,
        bsFileId: 0
      },
      multipleSelection: [],
      docList:[],
      // el-tag类型转换
      statusFilter(status) {
        const statusMap = {
          0: "info",
          1: "info"
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
      isBomPrice: false,//是否有查看价格权限
      showMateVisible: false,//K3物料显示列表
      mateCode: '',//K3物料编号搜索
      showMateList: [],//K3物料列表
      showCusBomId: 0,//物料选择框的CusBomId
    };
  },
  created() {  
    this.getPermit();
    if (this.$route.query.Id) {
      this.checkId=this.$route.query.Id
      console.log(this.checkId)
    }
    this.getStatu(this.checkId)
    //非新增
    if (this.$route.query.fileId) {
      this.getBomDateByFileId(this.$route.query.fileId);
    }
    //获取当前角色的操作权限
    getPermission().then(response => {
      if(response.result){
          if(response.data.isSuper == 1){
            this.isBomPrice = true;
          }else{
            //查看价格权限
            if(response.data.perm != "" && response.data.perm.indexOf("BOM_PRICE") >= 0){
              this.isBomPrice = true;
            }
          }
      }else{
        this.$message.error(response.msg);
      }
    });
  },
  computed:{
     
  },
  methods: {
    getPermit(){
      var routerCode = this.$route.name;
      getPermByRouterCode(routerCode).then(response => {
        if(response.result){
          if(response.data == "admin"){
            this.permit.CHECK= true;
            this.permit.UNCHECK=true;
          }else{
            var list = response.data;
            for(var i = 0; i < list.length; i++){
               if(list[i].permCode == "CHECK") this.permit.CHECK = true;
              if(list[i].permCode == "UNCHECK") this.permit.UNCHECK=true;
            }
          }
        }else{
          this.$message.error(res.msg);
        }
      });
    },
     returnFloat(value){
       if(value == null || value == undefined){
        return "0.000000";
       }
       var value=Math.round(parseFloat(value)*1000000)/1000000;
       var xsd=value.toString().split(".");
       if(xsd.length==1){
        value=value.toString()+".000000";
        return value;
       }
       //如果存在小数，则循环添加0，直到6位小数
       if(xsd.length>1){
        var after = "";
        for(var i = 0; i < (6-xsd[1].length); i++){
          after = after.toString() + "0";
        }
        value = value.toString() + after;
        // if(xsd[1].length<2){
        //   value=value.toString()+"0";
        // }
       return value;
       }
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.checkStatus == 1) {
        return "success-row";
      } else {
        return "warning-row";
      }
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (isLt1M) {
        return true;
      }
      this.$message({
        message: "Please do not upload files larger than 1m in size.",
        type: "warning"
      });
      return false;
    },
    handleSuccess({ results, header }) {
      this.optionHearder = [];
      this.optionHearder.push({ value: "", label: "无"});

      this.isUpload = true;
      this.tableData = results;
      this.tableHeader = header;

      this.tableHeader.forEach(element => {
        var option = { value: element, label: element };
        this.optionHearder.push(option);
      });

      this.isShow = true;
    },
    afterUpload(fileId) {
      //获取该文件的fid
      this.fileId = fileId;
      this.getBomDateByFileId(fileId);
    },
    doSimilarity(formName) {    
      this.load=true;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let filter = Object.assign(
                {},
                this.formQuery,
                {splitList:this.checkList.toString()},
                {fileId:this.fileId}
            );
            getK3Bom(filter).then(response => {
               if (!response.result) {
              this.$message.error(response.msg);
              return;
            }
            this.$message.info("匹配成功，请点击行展开查看!");
            this.tableHeader = response.data.header;
            this.tableData = response.data.results;
            this.isShowTable = true;
            this.load=false;
            location.reload();
          });
        } else {
          this.load=false;
          this.$message.error("请设置好规格、数量和类别对应的列！");
          return false;
        }
      });
    },
    getBomDateByFileId(fileId) {
      //根据fileId获取参数设置信息以及bom信息
      getBomData(fileId).then(response => {
        if (!response.result) {
          this.$message.error(response.msg);
          return;
        }
        //填充表格数据
        this.tableHeader = response.data.header;
        this.tableData = response.data.results;

        //填充下拉框数据
        this.optionHearder = [];
        this.optionHearder.push({ value: "", label: "无"});
        this.tableHeader.forEach(element => {
          var option = { value: element, label: element };
          this.optionHearder.push(option);
        });

        this.meriOption = response.data.listCategory;

        this.optionSort = [];
        this.optionSort.push({ value: 0, label: "1.匹配率优先排序(按匹配率、库存数量倒序排序)"});
        var sortPlanNum = response.data.sortPlanNum;
        var sortPlanStr = "2.库存优先排序(在方案1的基础上，当匹配率都小于" + sortPlanNum + "时，按库存数量、匹配率倒序排序)"
        this.optionSort.push({ value: 1, label: sortPlanStr});

        //填充参数设置
        this.formQuery.standardCol = response.data.bomParams.standardCol;
        this.formQuery.quantityCol = response.data.bomParams.quantityCol;
        if (response.data.bomParams.categoryCol)
          this.formQuery.categoryCol = response.data.bomParams.categoryCol;
        if(response.data.bomParams.nameCol)
          this.formQuery.nameCol = response.data.bomParams.nameCol;
        if (response.data.bomParams.packageCol)
          this.formQuery.packageCol = response.data.bomParams.packageCol;
        if (response.data.bomParams.makerCol)
          this.formQuery.makerCol = response.data.bomParams.makerCol;
        if(response.data.bomParams.brandNumberCol)
          this.formQuery.brandNumberCol = response.data.bomParams.brandNumberCol;
        if(response.data.bomParams.placeNumberCol)
          this.formQuery.placeNumberCol = response.data.bomParams.placeNumberCol;
        if(response.data.bomParams.checkList)
          this.checkList = response.data.bomParams.checkList.split(","); //checkList字符串转换成数组
        if(response.data.bomParams.isCustomer)
          this.formQuery.isCustomer = response.data.bomParams.isCustomer;
        if(response.data.bomParams.bomNumber)
          this.formQuery.bomNumber = response.data.bomParams.bomNumber;
        if(response.data.bomParams.bomCheck)
          this.formQuery.bomCheck = response.data.bomParams.bomCheck;
        if(response.data.bomParams.bomLimit)
          this.formQuery.bomLimit = response.data.bomParams.bomLimit;
        if(response.data.bomParams.bomLimitNum)
          this.formQuery.bomLimitNum = response.data.bomParams.bomLimitNum;
        if(response.data.bomParams.bsSortPlan)
          this.formQuery.bsSortPlan = response.data.bomParams.bsSortPlan;
        if(response.data.bomParams.bomK3CodeCol)
          this.formQuery.bomK3CodeCol = response.data.bomParams.bomK3CodeCol;
        if(response.data.bomParams.personName)
          this.formQuery.personName = response.data.bomParams.personName;
        
          this.bomParamsId = response.data.bomParams.id;

        //填充进度数据
        this.fillPercent =
          (response.data.totalCost.chosenNum /
            response.data.totalCost.totalNum) *
          100;
          if(this.fillPercent == 100)this.color = 'green'
       // this.fillNum =  response.data.totalCost.chosenNum;
        this.totalNum = response.data.totalCost.totalNum;

        this.fAuxPriceTotal = response.data.totalCost.fAuxPriceDiscount;
        this.fAuxPrice3MonthMaxTotal =
          response.data.totalCost.fAuxPrice3MonthMax;
        this.fAuxPrice3MonthMinTotal =
          response.data.totalCost.fAuxPrice3MonthMin;

        //设置控件的展示
        this.fileId = fileId;
        this.isShowTable = true;
        this.isShow = true;
      });
    },
    doCheck(isCheck, rows) {
      doCheckMateriel(rows.id, isCheck).then(response => {
        if (!response.result) {
          this.$message.error(response.msg);
          return;
        }
        this.$message.info("操作成功!");
        this.currentRow.childrenData = response.data.bomMatchList;

        this.currentRow.checkStatus = isCheck; //改变行颜色
        this.currentRow.checkCode = response.data.bomList.checkCode; //获取选中的K3物料号
        this.currentRow.fStockQty = response.data.bomList.fStockQty;//获取选中的库存数量
        this.currentRow.fStockPrice = this.returnFloat(response.data.bomList.fStockPrice);//获取选中的库存单价
        this.currentRow.fStockPriceTotal = this.returnFloat(response.data.bomList.fStockPriceTotal);//获取选中的库存金额
        this.currentRow.fAuxPriceDiscount = this.returnFloat(response.data.bomList.fAuxPriceDiscount); //获取选中的最新采购价
        this.currentRow.fAuxPriceDiscountTotal = this.returnFloat(response.data.bomList.fAuxPriceDiscountTotal); //获取选中的最新采购金额

        //填充进度数据
        this.fillPercent =
          (response.data.totalCost.chosenNum /
            response.data.totalCost.totalNum) *
          100;

        this.fAuxPriceTotal = response.data.totalCost.fAuxPriceDiscount;
        this.fAuxPrice3MonthMaxTotal =
          response.data.totalCost.fAuxPrice3MonthMax;
        this.fAuxPrice3MonthMinTotal =
          response.data.totalCost.fAuxPrice3MonthMin;
      });
    },
    toInstructions() {
      this.$router.push({ path: "instructionsCost", query: this.$route.query });
    },
    toList() {
      this.$router.push({ path: "clientBomList", query: this.$route.query });
    },
    onSelectedCategory(event, row) {
       console.log(event)
      // console.log(row)
      this.rowClick(row, "", "");
    },

    //在<table>里，我们已经设置row的key值设置为每行数据id：row-key="id"
    rowClick(row, event, expandedRows) {
      this.currentRow = row;
      //获取匹配数据
      if (!row.childrenData || event == "") {
        this.loading = true;
        var topNum = this.formQuery.bomLimitNum;
        var matchNum = this.formQuery.bomLimit;
        var settingValue = this.formQuery.bomCheck;
        getBomMatch(row.CusBomId, row.mateCategory, topNum, matchNum, settingValue).then(response => {
          if (!response.result) {
            this.$message.error(response.msg);
            return;
          }
          //20190307-fyx-数据填充
          row.childrenData = response.data.bomMatchList;//匹配的物料表
          this.currentRow.checkStatus =  response.data.bomList.checkStatus; //改变行颜色
        this.currentRow.checkCode = response.data.bomList.checkCode; //获取选中的K3物料号
        this.currentRow.fStockQty = response.data.bomList.fStockQty;//获取选中的库存数量
        this.currentRow.fStockPrice = this.returnFloat(response.data.bomList.fStockPrice);//获取选中的库存单价
        this.currentRow.fStockPriceTotal = this.returnFloat(response.data.bomList.fStockPriceTotal);//获取选中的库存金额
        this.currentRow.fAuxPriceDiscount = this.returnFloat(response.data.bomList.fAuxPriceDiscount); //获取选中的最新采购价
        this.currentRow.fAuxPriceDiscountTotal = this.returnFloat(response.data.bomList.fAuxPriceDiscountTotal); //获取选中的最新采购金额
        //填充进度数据
        this.fillPercent =
          (response.data.totalCost.chosenNum /
            response.data.totalCost.totalNum) *
          100;
          if(this.fillPercent == 100)this.color = 'green'
       // this.fillNum =  response.data.totalCost.chosenNum;
        this.totalNum = response.data.totalCost.totalNum;

        this.fAuxPriceTotal = response.data.totalCost.fAuxPriceDiscount;
        this.fAuxPrice3MonthMaxTotal =
          response.data.totalCost.fAuxPrice3MonthMax;
        this.fAuxPrice3MonthMinTotal =
          response.data.totalCost.fAuxPrice3MonthMin;

          this.loading = false;
        });
      }

      //--end
      Array.prototype.remove = function(val) {
        let index = this.indexOf(val);
        if (index > -1) {
          this.splice(index, 1);
        }
      };

      if (this.expands.indexOf(row.CusBomId) < 0) {
        this.expands = [];
        if(this.bomParamsId)this.expands.push(row.CusBomId);
      } else {
        if(event != "")this.expands.remove(row.CusBomId);
      }
    },
    // 展开父表格数据 并查询该数据下的子数据
    rowExpand(row, expandedRows) {
      // 打印父任务内容 
      // console.log(row)
        var topNum = this.formQuery.bomLimitNum;
        var matchNum = this.formQuery.bomLimit;
        var settingValue = this.formQuery.bomCheck;
        getBomMatch(row.CusBomId, row.mateCategory, topNum, matchNum, settingValue).then(response => {
          if (!response.result) {
            this.$message.error(response.msg);
            return;
          }
          //20190307-fyx-数据填充
          row.childrenData = response.data.bomMatchList;//匹配的物料表
          this.currentRow.checkStatus =  response.data.bomList.checkStatus; //改变行颜色
        this.currentRow.checkCode = response.data.bomList.checkCode; //获取选中的K3物料号
        this.currentRow.fStockQty = response.data.bomList.fStockQty;//获取选中的库存数量
        this.currentRow.fStockPrice = this.returnFloat(response.data.bomList.fStockPrice);//获取选中的库存单价
        this.currentRow.fStockPriceTotal = this.returnFloat(response.data.bomList.fStockPriceTotal);//获取选中的库存金额
        this.currentRow.fAuxPriceDiscount = this.returnFloat(response.data.bomList.fAuxPriceDiscount); //获取选中的最新采购价
        this.currentRow.fAuxPriceDiscountTotal = this.returnFloat(response.data.bomList.fAuxPriceDiscountTotal); //获取选中的最新采购金额
        //填充进度数据
        this.fillPercent =
          (response.data.totalCost.chosenNum /
            response.data.totalCost.totalNum) *
          100;
          if(this.fillPercent == 100)this.color = 'green'
       // this.fillNum =  response.data.totalCost.chosenNum;
        this.totalNum = response.data.totalCost.totalNum;

        this.fAuxPriceTotal = response.data.totalCost.fAuxPriceDiscount;
        this.fAuxPrice3MonthMaxTotal =
          response.data.totalCost.fAuxPrice3MonthMax;
        this.fAuxPrice3MonthMinTotal =
          response.data.totalCost.fAuxPrice3MonthMin;

          this.loading = false;
        });
      //如果展开行数大于1
      if(expandedRows.length>1){
        //shift() 方法用于把数组的第一个元素从其中删除，并返回第一个元素的值。
        expandedRows.shift();
      }
    },    

     /*删除*/
    doDelete(rowID) {      
      let id = rowID;
      delBom(id).then(response => {
        if (response.result) {
          this.$message({
            message: response.msg,
            type: 'success'
          });
          this.$router.push({ path: 'clientBomList', query: {}});
        } else {
          this.$message.error(response.msg);
        }
      })
    }, 

    //选中行
    handleSelectionChange(val){ 
    this.multipleSelection = val;
    }, 
    clickParent() {      
      this.$refs.modelChild.showDialog();
    },
    //导出Excel
    exportBom(){   
      window.location.href =
      process.env.BASE_API + "/customerBom/getBomExcel?fileId=" + this.fileId;
    },
    //20190429-Shen 导出Excel（含价格）
    exportBomPrice(){
      window.location.href = process.env.BASE_API + "/customerBom/getBomExcelPrice?fileId=" + this.fileId;
    },
    //20190508-Shen 客户BOM复制
    copy(){
      let fileId = this.$route.query.fileId;
      copyBom(fileId).then(response => {
        if (response.result) {
          this.$message({
            message: response.msg,
            type: 'success'
          });
          this.$router.push({ path: 'clientBomList', query: {}});
        } else {
          this.$message.error(response.msg);
        }
      })
    },
    // //20190509-Shen 表头label
    // labelToChinese(item){
    //   if(item=='checkCode'){
    //     item = "选中的物料号";
    //   }
    //   if(item=='fStockQty'){
    //     item = "库存数量";
    //   }
    //   if(item=='fStockPrice'){
    //     item = "库存单价";
    //   }
    //   if(item=='fStockPriceTotal'){
    //     item = "库存金额";
    //   }
    //   if(item == 'fAuxPriceDiscount'){
    //     item = "最新采购价";
    //   }
    //   if(item=='fAuxPriceDiscountTotal'){
    //     item = "最新采购金额";
    //   }
    //   return item;
    // },
    //附件管理
    showDoc(){
      this.dialog.docVisible = true;
      this.dialog.bsFileId = this.fileId;
      getDocList(this.fileId,'').then(response => {
        if(response.result){
          this.docList = response.data;
        }else{
          this.$message.error(response.msg);
        }
      });
    },
    //添加附件
    addDoc(e){
      //获取上传的附件
      const files = e.target.files;
      const rawFile = files[0];
      //封装数据
      let formData = new FormData();
      formData.append('file', rawFile);
      formData.append('bsFileId', this.dialog.bsFileId);
      addDoc(formData).then(response => {
        if(response.result){
          getDocList(this.dialog.bsFileId,'').then(response => {
            if(response.result){
              this.docList = response.data;
            }
          });
          this.$message.info(response.msg);
        }else{
          this.$message.error(response.msg);
        }
      });
    },
    addDocBefore() {
      this.$refs['doc-upload-input'].click();
    },
    //删除附件
    deleteDoc(row){
      var id = row.id;
      deleteDoc(id).then(response => {
        if(response.result){
          getDocList(this.dialog.bsFileId,'').then(response => {
            if(response.result){
              this.docList = response.data;
            }
          });
          this.$message.info(response.msg);
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
    //20190828-Shen-勾选未匹配行
    toggleSelection() {
      var tableData = this.tableData;
      var multiData = [];
      for(var i = 0; i < tableData.length; i++){
        var currentRow = tableData[i];
        if(currentRow.checkStatus != 1){
          multiData.push(currentRow);
        }
      }
      if(multiData.length > 0){
        multiData.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row, true);
        });
      }
    },
    showMateView(cusBomId) {
      this.showCusBomId = cusBomId;
      this.showMateVisible = true;
    },
    searchMate() {
      let filter=Object.assign({},{"mateCode":this.mateCode});
      getMateList(filter).then(response => {
        if (response.result) {
          this.showMateList = response.data;
        } else {
          this.$message.error(response.msg);
        }
      })
    },
    chooseMate(row) {
      this.showMateVisible = false;
      let filter=Object.assign({},{"id":row.id,"cusBomId":this.showCusBomId});
      addMate(filter).then(response => {
        if(response.result){
          var bomMatchId = response.data.id;
          //选中刚刚选择的物料
          doCheckMateriel(bomMatchId, 1).then(res => {
            if(res.result){
              this.currentRow.childrenData = res.data.bomMatchList;
              this.currentRow.checkStatus = 1; //改变行颜色
              this.currentRow.checkCode = res.data.bomList.checkCode; //获取选中的K3物料号
              this.currentRow.fStockQty = res.data.bomList.fStockQty;//获取选中的库存数量
              this.currentRow.fStockPrice = this.returnFloat(res.data.bomList.fStockPrice);//获取选中的库存单价
              this.currentRow.fStockPriceTotal = this.returnFloat(res.data.bomList.fStockPriceTotal);//获取选中的库存金额
              this.currentRow.fAuxPriceDiscount = this.returnFloat(res.data.bomList.fAuxPriceDiscount); //获取选中的最新采购价
              this.currentRow.fAuxPriceDiscountTotal = this.returnFloat(res.data.bomList.fAuxPriceDiscountTotal); //获取选中的最新采购金额
              //填充进度数据
              this.fillPercent = (res.data.totalCost.chosenNum / res.data.totalCost.totalNum) * 100;
              this.fAuxPriceTotal = res.data.totalCost.fAuxPriceDiscount;
              this.fAuxPrice3MonthMaxTotal = res.data.totalCost.fAuxPrice3MonthMax;
              this.fAuxPrice3MonthMinTotal = res.data.totalCost.fAuxPrice3MonthMin;
            }else{
              this.$message.error(response.msg);
            }
          })
        }else{
          this.$message.error(response.msg);
        }
      });
    },
     check(id) {
      this.$confirm('是否确认审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
        
      }).then(() => {
        updateCheck(id)
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
    uncheck(id) {
   this.$confirm('是否确认反审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        reverseCheck(id)
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
    },
    getStatu(id){
      getReviewStatus(id).then(res=>{
        if(res.result){
          if(res.data){
           this.isChecked=true
          }
        }
      })
    }
  }
};
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
</style>