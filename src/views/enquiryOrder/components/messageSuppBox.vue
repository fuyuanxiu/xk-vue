<template>
   <el-button type="success" size="mini" @click="open()">通知供应商</el-button>  
</template>
<script>
export default {
  props: {
    contents: {
      type: String,
      default: '这是一段内容'
    },
    title: {
      type: String,
      default: '标题名称'
    },
    confirmTitle: {
      type: String,
      default: '确认'
    }
  },

  methods: {
   open() {
        var _this = this
        this.$confirm(this.contents, this.title, {
          distinguishCancelAndClose: true,
          confirmButtonText: this.confirmTitle,
          cancelButtonText: '取消',
          showClose :true,
          type: 'warning'         
        }).then(() => {
          _this.$emit('callConfirm');
        }).catch(() => {
          this.$message({
          type: 'info',
          message: '已取消通知供应商'
        }); 
      });
     } 
    }
}
</script>
