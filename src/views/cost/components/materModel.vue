<template>
  <div>
     <el-dialog  :visible.sync="dialog.modal_dialog" title="新料询价" width="450px" :modal="true" :close-on-click-modal="false" :close-on-press-escape="true" append-to-body>
            <p>
                <el-form :model="dialog.formItem" ref="addmateForm" :rules="dialog.ruleForm" :label-width="'100px'" >
    
                <el-row>
                   <el-col :span="20">
                        <el-form-item label="id" prop="todoerBy" style="display: none"  >
                            <el-input v-model="dialog.formItem.id" size="small" placeholder="请输入" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                    <el-form-item label="选择人员" prop="userName" style="font-size: 14px!important" >
                      <el-autocomplete v-model="dialog.formItem.userName"  
                        :fetch-suggestions="getUser" @select="handleSelectUser" style="width:250px" >
                    </el-autocomplete>
                    </el-form-item>  
                     <!-- <el-form-item
                      label="询价日期"
                      prop="bsStartDate"
                    >
                      <el-date-picker
                        style="width:250px"
                        v-model="dialog.formItem.bsStartDate"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期"
                      >
                      </el-date-picker>
                    </el-form-item> 
                    <el-form-item
                      label="截止时间"
                      prop="bsEndDate"
                    >
                      <el-date-picker
                        style="width:250px"
                        v-model="dialog.formItem.bsEndDate"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期"
                      >
                      </el-date-picker>
              </el-form-item>   -->               
                </el-col>                  
              </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="备注" prop="bsRemark" style="font-size: 14px!important;">
                            <el-input style="width:250px;" v-model="dialog.formItem.bsRemark" size="small" type="textarea" placeholder="请输入..."></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                </el-form>
                <div slot="footer">
                    <el-button type="primary" size="small" :loading="false" @click="cancel">取 消</el-button>
                    <el-button type="primary" size="small" :loading="dialog.loading" @click="doSend()">确 定</el-button>
                </div>
            </p>
        </el-dialog>
  </div>
</template>
<script>
import {doSendTodo } from "@/api/cost";
import { doCreateEnquiry,getUserList } from '@/api/enquiryBom';
export default {
   props:['multipleSelection'],
  data(){
    return{       
      dialog: {
        loading: false, 
         modal_dialog: false,      
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
        },
     
    }
  },
  
  methods: {
     //显示模态框填选人员
    showDialog(){      
     
      /*if(this.multipleSelection==null||this.multipleSelection.length==0){               
            this.$message.error('请选择要操作的新料!');
            return
        }*/
        this.dialog.modal_dialog = true;                             
    }, 
    //获取用户
    getUser(queryString, cb){             
        getUserList().then(response=>{
            if(response.result){
               //this.optionUser=response.data.rows;        
                this.param = response.data.map(function (row) {
                row.value = row.userName;
                return row;
            });
            cb(this.param);
        
            }else{
               this.$message.error(response.msg);    
            }
        })
    },
    
    handleSelectUser(item){       
       this.dialog.formItem.id=item.id;
    },
   
    //取消     
     cancel() {
        this.dialog.modal_dialog = false;
    },   
    //发送待办消息/生成询价单
    doSend(){        
       this.bomIds = [];
       this.multipleSelection.forEach(elment => {
       this.bomIds.push(elment.CusBomId)
    }) 
       let arrID = this.bomIds.toString();   
       let param=Object.assign(
          {bomIds:arrID},
          {fileId:this.$route.query.fileId},
          {todoerBy:this.dialog.formItem.id},
          {bsRemark:this.dialog.formItem.bsRemark}
        )
      
     if(typeof(this.dialog.formItem.id)!=undefined && typeof(this.dialog.formItem.id)=="number") {  
      doCreateEnquiry(param).then(response => {                                        
             this.dialog.loading = false;
                 if(response.result) {
                    this.dialog.loading = false;
                    this.dialog.modal_dialog= false
                   this.$message({
                    message: response.msg,
                    type: 'success'
                 });
                 }else {
                this.$message.error(res.msg);
            }
        })   

     }
    },
 }
}
</script>
