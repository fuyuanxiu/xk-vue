<template>
  <!-- <a class="operatIcon colorRed"  @click="open"><i class="el-icon-delete"></i> </a> -->
  <el-button type="primary" size="mini" @click="updataK3">同步数据</el-button>
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
   updataK3() {   
        var _this = this
        this.$confirm(this.contents, this.title, {
          distinguishCancelAndClose: true,
          confirmButtonText: this.confirmTitle,
          cancelButtonText: '取消',
          showClose :true,
          type: 'warning'         
        }).then(() => {
          _this.$emit('callConfirm2');
        }).catch(() => {
          this.$message({
          type: 'info',
          message: '已取消同步'
        }); 
      });
     } 
    }
}
</script>
