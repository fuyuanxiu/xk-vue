<template>
  <div class="">
    <el-card
      class="box-card"
      shadow="hover"
    >
      <div
        slot="header"
        class="clearfix"
      >
        <span class="sroreIcon"><i
            class="iconfont"
            style="font-size: 14px;margin-right:5px;"
          >&#xe693;</i>Excel导出</span>
      </div>
    </el-card>
    <el-card shadow="naver" v-loading="loading" element-loading-text="数据加载中，请稍等">
      <el-row>
        <el-col :span="12" class="colInfo">
          <label class="labelInfo">拆分单元格：</label>
          <!--上传控件-->
          <input id="uplaodInput" ref="doc-upload-input" class="doc-upload-input" type="file" @change="addDoc" />
          <el-button type="primary" @click="addDocBefore()" title="上传">上传Excel文件</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import { uplaodFile } from '@/api/file';
export default {
  name: "excelSplit",
  data() {
    return {
      fileId: null,
      loading: false
    };
  },
  created() {
    
  },
  methods: {
    //上传
    addDoc(e) {
      //获取上传的文件
      const files = e.target.files;
      const rawFile = files[0];
      if(rawFile != null && rawFile != undefined){
        //封装数据
        let formData = new FormData();
        formData.append('file', rawFile);
        uplaodFile(formData).then(response => {
          if(response.result){
            this.fileId = response.data.id;
            //上传成功后下载拆分单元格后的Excel文件
            this.downloadDoc(response.data.id);
            this.$message.info("操作成功");
            document.getElementById('uplaodInput').value = null;//清空input的value值
          }else{
            this.$message.error(response.msg);
          }
        });
      }
    },
    addDocBefore() {
      this.$refs['doc-upload-input'].click();
    },
    //下载文件
    downloadDoc(fileId) {
      window.location.href = process.env.BASE_API + "/excel/downloadExcel?fileId="+fileId;
    },
    

  }
};
</script>
<style  scoped>
.sroreIcon {
  color: #42b983 !important;
  font-size: 14px;
}
.labelInfo {
  display: inline-block;
  font-size: 14px;
  margin-left:30px;
}
.btnDataInfo {
  display: inline-block;
}
.colInfo {
  margin-top: 10px;
}
.doc-upload-input{
  display: none;
  z-index: -9999;
}
</style>
 
