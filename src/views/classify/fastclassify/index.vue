<template>
  <div class="classify-container">
    <!-- 左侧区域 -->
    <div class="left-panel">
      <div class="panel-content">
        <!-- 开关控制行 -->
        <div class="switch-row">
          <div class="switch-item">
            <span class="label">开启辨识</span>
            <el-switch
              v-model="recognition.face"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </div>
          <div class="switch-item">
            <span class="label">证照识别</span>
            <el-switch
              v-model="recognition.idCard"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </div>
        </div>

        <!-- 分类时间和卡号行 -->
        <div class="form-row">
          <div class="form-item">
            <span class="label">分类时间：</span>
            <el-date-picker
              v-model="currentTime"
              type="datetime"
              placeholder="选择日期时间"
              default-time="12:00:00"
            >
            </el-date-picker>
          </div>
          <div class="form-item card-number">
            <span class="label">卡号：</span>
            <el-input
              v-model="cardNumber"
              placeholder="请输入卡号"
              class="card-input"
            ></el-input>
            <el-button type="primary" size="small" @click="readCard"
              >读取</el-button
            >
          </div>
        </div>

        <!-- 绑定标识和姓名行 -->
        <div class="form-row">
          <div class="form-item">
            <span class="label">绑定标识：</span>
            <el-input v-model="identifier" placeholder="请输入标识"></el-input>
          </div>
          <div class="form-item">
            <span class="label">姓名：</span>
            <el-input v-model="name" placeholder="请输入姓名"></el-input>
          </div>
        </div>

        <!-- 备注行 -->
        <div class="form-row">
          <div class="form-item full-width">
            <span class="label">备注：</span>
            <el-input
              type="textarea"
              v-model="remark"
              :rows="4"
              placeholder="请输入备注信息"
            ></el-input>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧区域 -->
    <div class="right-panel">
      <div class="panel-content">右侧内容区域</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FastClassify",
  data() {
    return {
      recognition: {
        face: false,
        idCard: false,
      },
      cardNumber: "",
      identifier: "",
      name: "",
      remark: "",
      currentTime: new Date(),
    };
  },
  methods: {
    readCard() {
      // 读取卡号的方法
      console.log("读取卡号");
      console.log(this.currentTime);
    },
  },
  mounted() {
    // 更新当前时间
    // setInterval(() => {
    //   this.currentTime = new Date().toLocaleString();
    // }, 1000);
    console.log(this.currentTime);
  },
};
</script>

<style lang="scss" scoped>
.classify-container {
  height: 100%;
  display: flex;
  background-color: #f5f7fa;
  padding: 10px;
  gap: 10px;

  // 左侧面板
  .left-panel {
    flex: 0 0 45%;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);

    .panel-content {
      height: 100%;
      padding: 20px;

      // 开关行样式
      .switch-row {
        display: flex;
        justify-content: flex-start;
        gap: 40px;
        margin-bottom: 20px;

        .switch-item {
          display: flex;
          align-items: center;
          gap: 10px;

          .label {
            font-size: 14px;
            color: #606266;
          }
        }
      }

      // 表单行样式
      .form-row {
        display: flex;
        gap: 20px;
        margin-bottom: 20px;

        .form-item {
          flex: 1;
          display: flex;
          align-items: center;

          &.full-width {
            width: 100%;
          }

          .label {
            width: 80px;
            font-size: 14px;
            color: #606266;
            text-align: right;
          }

          .value {
            color: #303133;
          }

          .el-input {
            flex: 1;
          }
        }

        .card-number {
          display: flex;
          gap: 10px;

          .card-input {
            width: 150px;
          }
        }
      }
    }
  }

  // 右侧面板
  .right-panel {
    flex: 0 0 55%; // 固定宽度55%
    background-color: #3c6bb1; // 稍微深一点的背景色
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);

    .panel-content {
      height: 100%;
      padding: 20px;
    }
  }
}
</style>