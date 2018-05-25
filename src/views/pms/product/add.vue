<template> 
  <el-card class="form-container" shadow="never">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="first" name="first">first</el-tab-pane>
      <el-tab-pane label="second" name="second">second</el-tab-pane>
      <el-tab-pane label="third" name="third">third</el-tab-pane>
      <el-tab-pane label="fourth" name="fourth">fourth</el-tab-pane>
    </el-tabs>
  </el-card>
</template>
<script>
  export default {
    name: 'addProduct',
    data() {
      return {activeName: 'first'}
    }
  }
</script>
<style></style>


