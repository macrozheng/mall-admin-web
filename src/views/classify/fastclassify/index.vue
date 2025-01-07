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

        <!-- 处置建议行 -->
        <div class="form-row">
          <div class="form-item full-width">
            <span class="label">处置建议：</span>
            <el-checkbox-group v-model="suggestions">
              <el-checkbox label="处置1">处置1</el-checkbox>
              <el-checkbox label="处置2">处置2</el-checkbox>
              <el-checkbox label="处置3">处置3</el-checkbox>
              <el-checkbox label="处置4">处置4</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>

        <!-- 去向选择行 -->
        <div class="form-row">
          <div class="form-item full-width">
            <span class="label">去向：</span>
            <div class="department-list">
              <div
                v-for="item in departments"
                :key="item.id"
                class="department-item"
                :class="{ active: selectedDepartment === item.id }"
                @click="selectDepartment(item)"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>

        <!-- 病房列表行 -->
        <div class="form-row" v-if="rooms.length > 0">
          <div class="form-item full-width">
            <span class="label">病房：</span>
            <div class="room-list">
              <div class="room-grid">
                <div
                  v-for="room in rooms"
                  :key="room.roomId"
                  class="room-item"
                  :class="{ active: selectedRoom === room.roomId }"
                  @click="selectRoom(room)"
                >
                  <div class="room-name">{{ room.roomName }}</div>
                  <div class="bed-count">
                    可用床位：{{ room.availableBedCount }}张
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧区域 -->
    <div class="right-panel">
      <div class="panel-content">
        <!-- 状态切换栏 -->
        <div class="status-bar">
          <div 
            v-for="(item, index) in statusList" 
            :key="index"
            class="status-item"
            :class="{ active: currentStatus === item.value }"
            @click="switchStatus(item.value)"
          >
            {{ item.label }}
          </div>
        </div>

        <!-- 列表内容区域 -->
        <div class="list-content">
          <!-- 根据currentStatus显示不同的列表内容 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchList, bedCountOfRoomList } from "@/api/mgs/room-bed/department";

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
      suggestions: [], // 处置建议多选值
      departments: [], // 组室列表
      selectedDepartment: null, // 选中的组室ID
      rooms: [
        { roomId: 1, roomName: "1号病房", availableBedCount: 10 },
        { roomId: 2, roomName: "2号病房", availableBedCount: 10 },
        { roomId: 3, roomName: "3号病房", availableBedCount: 10 },
        { roomId: 4, roomName: "4号病房", availableBedCount: 10 },
        { roomId: 3, roomName: "3号病房", availableBedCount: 10 },
        { roomId: 4, roomName: "4号病房", availableBedCount: 10 },
        { roomId: 3, roomName: "3号病房", availableBedCount: 10 },
        { roomId: 4, roomName: "4号病房", availableBedCount: 10 },
        
      ], // 病房列表
      selectedRoom: null, // 选中的病房ID
      // 状态列表
      statusList: [
        { label: '已分类伤员', value: 'classified' },
        { label: '未分类伤员', value: 'unclassified' },
        { label: '已驳回伤员', value: 'rejected' }
      ],
      currentStatus: 'classified', // 当前选中的状态
    };
  },
  methods: {
    readCard() {
      // 读取卡号的方法
      console.log("读取卡号");
      console.log(this.currentTime);
    },

    // 获取组室列表
    getDepartments() {
      fetchList().then((response) => {
        this.departments = response.data;
      });
    },

    // 选择组室
    selectDepartment(department) {
      this.selectedDepartment = department.id;
      this.selectedRoom = null; // 清空已选择的病房
      this.getRoomList(department.id);
    },

    // 获取病房列表
    getRoomList(departmentId) {
      bedCountOfRoomList({ departmentId: departmentId }).then((response) => {
        // this.rooms = response.data;
      });
    },

    // 选择病房
    selectRoom(room) {
      this.selectedRoom = room.roomId;
    },

    // 切换状态
    switchStatus(status) {
      this.currentStatus = status;
      // 这里可以根据状态加载不同的数据
    }
  },
  created() {
    this.getDepartments();
  },
  mounted() {
    console.log(this.currentTime);
  },
};
</script>

<style lang="scss" scoped>
.classify-container {
  height: 93vh;
  display: flex;
  background-color: #f5f7fa;
  padding: 10px;
  gap: 6px;

  // 左侧面板
  .left-panel {
    flex: 0 0 45%;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(41, 1, 1, 0.05);

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

          // 添加多选框组的样式
          .el-checkbox-group {
            display: flex;
            gap: 30px;
            flex: 1;
            padding-left: 10px;
          }
        }

        .card-number {
          display: flex;
          gap: 10px;

          .card-input {
            width: 150px;
          }
        }

        .department-list {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          flex: 1;
          padding-left: 10px;

          .department-item {
            padding: 8px 20px;
            border-radius: 4px;
            background-color: #f5f7fa;
            color: #606266;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 1px solid transparent;

            &:hover {
              border-color: #2e7256;
              color: #2e7256;
            }

            &.active {
              background-color: #2e7256;
              color: #ffffff;
              border-color: #2e7256;
            }
          }
        }

        .room-list {
          flex: 1;
          padding-left: 10px;

          .room-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr); // 修改为每行四个
            gap: 15px;
            width: 100%;

            .room-item {
              border-radius: 4px;
              cursor: pointer;
              transition: all 0.3s ease;
              border: 1px solid transparent;
              overflow: hidden; // 确保内部元素不会溢出

              &:hover {
                border-color: #2e7256;
              }

              &.active {
                border-color: #2e7256;

                .room-name {
                  background-color: #2e7256;
                  color: #ffffff;
                }

                .bed-count {
                  background-color: #40875f;
                  color: #ffffff;
                }
              }

              .room-name {
                padding: 10px 15px;
                font-size: 14px;
                color: #303133;
                font-weight: 500;
                background-color: #e4e7ed;
                text-align: center;
                transition: all 0.3s ease;
              }

              .bed-count {
                padding: 8px 15px;
                font-size: 12px;
                color: #606266;
                background-color: #f5f7fa;
                text-align: center;
                transition: all 0.3s ease;
              }
            }
          }
        }
      }
    }
  }

  // 右侧面板
  .right-panel {
    flex: 0 0 45%;
    background-color: #ffffff; // 改为白色背景
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);

    .panel-content {
      height: 100%;
      // padding: 20px;

      // 状态切换栏样式
      .status-bar {
        display: flex;
        gap: 10px;
        // margin-bottom: 20px;

        .status-item {
          background-color: #f5f7fa;
          border-radius: 4px;
          padding: 8px 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid transparent;
          font-size: 14px;
          color: #606266;
          text-align: center;

          &:hover {
            border-color: #2e7256;
            color: #2e7256;
          }

          &.active {
            background-color: #2e7256;
            color: #ffffff;
            font-weight: 600;
          }
        }
      }

      // 列表内容区域样式
      .list-content {
        height: calc(100% - 90px); // 减去状态栏的高度
        background-color: #f8f9fb;
        border-radius: 6px;
        padding: 15px;
      }
    }
  }
}
</style>