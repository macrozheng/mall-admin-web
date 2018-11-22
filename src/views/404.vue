<template>
  <div>
    <div class="app-container">
      <el-col :span="12">
        <img :src="img_404" alt="404" class="img-style">
      </el-col>
      <el-col :span="12">
        <div style="margin-left: 100px;margin-top: 60px">
          <h1 class="color-main">OOPS!</h1>
          <h2 style="color: #606266">很抱歉，页面它不小心迷路了！</h2>
          <div style="color:#909399;font-size: 14px">请检查您输入的网址是否正确，请点击以下按钮返回主页或者发送错误报告</div>
          <el-button style="margin-top: 20px" type="primary" round @click="handleGoMain">返回首页</el-button>
        </div>
      </el-col>
    </div>
  </div>
</template>

<script>
  import img_404 from '@/assets/images/gif_404.gif';

  export default {
    name: 'wrongPage',
    data() {
      return {
        img_404
      }
    },
    methods: {
      handleGoMain() {
        this.$router.push({path: '/'})
      }
    },
  }
</script>

<style scoped>
  .app-container {
    width: 80%;
    margin: 120px auto;
  }

  .img-style {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
</style>
