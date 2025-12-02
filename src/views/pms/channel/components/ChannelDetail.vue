<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="channel"
             :rules="rules"
             ref="channelForm"
             label-width="150px">
      <el-form-item label="渠道名称：" prop="name">
        <el-input v-model="channel.name" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="渠道编码：" prop="code">
         <el-input v-model="channel.code" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="状态：">
        <el-radio-group v-model="channel.status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序：">
        <el-input v-model="channel.sort" class="input-width"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('channelForm')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('channelForm')">重置</el-button>
        <el-button @click="goBack()">返回</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import {createChannel, getChannel, updateChannel} from '@/api/channel'
  const defaultChannel = {
    id: null,
    name: '',
    code: '',
    status: 1,
    sort: 0
  };

  export default {
    name: "ChannelDetail",
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        channel: Object.assign({}, defaultChannel),
        rules: {
          name: [
            {required: true, message: '请输入渠道名称', trigger: 'blur'},
            {min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入渠道编码', trigger: 'blur'},
            {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
          ]
        }
      };
    },
    created() {
      if (this.isEdit) {
        getChannel(this.$route.query.id).then(response => {
          this.channel = response.data;
        });
      }else{
        this.channel = Object.assign({},defaultChannel);
      }
    },
    methods: {      
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (this.isEdit) {
                updateChannel(this.$route.query.id, this.channel).then(response => {
                  this.$refs[formName].resetFields();
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration:1000
                  });
                  this.$router.back();
                });
              } else {
                createChannel(this.channel).then(response => {
                  this.$refs[formName].resetFields();
                  this.channel = Object.assign({},defaultChannel);
                  this.$message({
                    message: '提交成功',
                    type: 'success',
                    duration:1000
                  });
                  this.$router.back();
                });
              }
            });
          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration: 1000
            });
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.channel = Object.assign({}, defaultChannel);
      },
      goBack() {
        this.$router.back();
      }
    }
  }
</script>

<style scoped>
  .input-width {
    width: 400px;
  }
</style>