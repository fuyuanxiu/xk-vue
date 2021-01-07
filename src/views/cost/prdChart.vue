<template>
  <div v-loading="loading" element-loading-text="数据加载中，请稍等">
    <el-card style="padding-bottom: 0; background: #f0f2f5; margin-bottom: -18px; height:auto;">
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="formQuery" class="demo-form-inline">
            <el-form-item label="产品号">
              <el-input v-model="formQuery.mateK3Code" placeholder="产品号"></el-input>
            </el-form-item>
            <el-form-item label="起始日期" prop="startDate">
              <el-date-picker  
                style="width:186px;"   
                :picker-options="startTime"                      
                v-model="formQuery.startDate"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束日期" prop="endDate">
              <el-date-picker  
                style="width:186px;"                         
                v-model="formQuery.endDate"
                :picker-options="endTime"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button v-if="permit.SEARCH" type="primary" size="mini" @click="getData">查找</el-button>
            </el-form-item>
          </el-form> 
        </el-col>            
      </el-row>
    </el-card> 
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" v-show="isShow"/>
    </el-row>
  </div> 
</template>
<script>
//import LineChart from '../dashboard/admin/components/LineChart'
import LineChart from '@/components/Charts/LineChart.vue'
import { getPrdChart } from '@/api/cost'
import {getPermByRouterCode} from '@/api/perm'

const lineChartData = {
  legendData: [],
  xAxisData: [],
  sereisList: []
}

export default {
  name: 'prdChart',
  components: {
    LineChart
  },
  data() {
    return {
      formQuery: {
        mateK3Code: "",
        startDate: this.initDate(),//默认半年前日期
        endDate: new Date()//默认当前日期
      },
      lineChartData: lineChartData,
      legendData: [],
      sereisList: [],
      xAxisData: [],
      isShow:false,
    /* start 开始时间小于今天,结束时间不能大于开始时间 */
      startTime: {
        disabledDate: time => {
          if (this.formQuery.endData) {
            return (
              time.getTime() > new Date(this.formQuery.endData).getTime()
            );
          } else {
            return time.getTime() > Date.now();
          }
        }
      },
      endTime:{
        disabledDate: time => {           
          if (this.formQuery.startDate) {
            return (
              time.getTime() > Date.now() ||
              time.getTime() < new Date(this.formQuery.startDate).getTime()
            );
          } else {
            return time.getTime() > Date.now();
          }
        }
      },
      loading: false,
      permit:{
        //权限控制
        SEARCH:false
      },
    }
  },
  created() {
    this.getPermit();
  },
  methods: {
    getPermit(){
      var routerCode = this.$route.name;
      getPermByRouterCode(routerCode).then(response => {
        if(response.result){
          if(response.data == "admin"){
            this.permit.SEARCH = true;
          }else{
            var list = response.data;
            for(var i = 0; i < list.length; i++){
              if(list[i].permCode == "SEARCH") this.permit.SEARCH = true;
            }
          }
        }else{
          this.$message.error(res.msg);
        }
      });
    },
    getData() {
      this.loading = true;
      this.isShow = false;
      //物料编号：01.10.00010、01.10.10130、04.04.00202
       let filter=Object.assign(
            {},
            this.formQuery
        )
      getPrdChart(filter).then(response => {
        this.loading = false;
        if (response.result) {
          //初始化数据
          this.initChartData()
          this.isShow = true;
          response.data.forEach(element => {
            //封装legend
            this.legendData.push(element[0].pcTypeName)
            lineChartData.legendData = this.legendData;
            //封装series
            var seriesData = [];
            this.xAxisData = [];
            element.forEach(ele => {
              seriesData.push(ele.pcPrice);
              //封装xAxis
              this.xAxisData.push(ele.pcMonth)
            })
            var sereisMap = {
              name: element[0].pcTypeName,
              // smooth: true,//是否平滑展示
              type: 'line',
              data: seriesData,
              animationDuration: 2800
            }
            this.sereisList.push(sereisMap);
          });
          this.lineChartData.sereisList = this.sereisList
          this.lineChartData.xAxisData = this.xAxisData
          this.lineChartData = lineChartData
          //console.log(this.lineChartData)
        } else {
          debugger;
          this.$message.error(response.msg);
        }

      });
    },
    initChartData(){
      //初始化参数
      this.legendData = []
      this.sereisList  = []
      this.xAxisData = []

      this.lineChartData.sereisList = []
      this.lineChartData.xAxisData = []
      this.lineChartData.legendData = [];

    },
    //初始化时间（半年前）
    initDate(){
      var now = new Date();
      now.setTime(now.getTime() - 6*30*24*60*60*1000);
      return now;
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