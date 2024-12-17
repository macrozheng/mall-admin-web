<template>
  <div class="ward-manage">
    <div class="ward-container">
      <!-- 左侧组室选择栏 -->
      <div class="ward-sidebar">
        <div
          v-for="(tab, index) in tabs"
          :key="index"
          class="tab"
          @click="selectedTab(index)"
          :class="{ active: selectedIndex === index }"
        >
          {{ tab.label }}
        </div>
      </div>

      <!-- 右侧病房卡片列表 -->
      <div class="ward-content">
        <div class="room-list">
          <el-row :gutter="20">
            <el-col :span="6" v-for="room in rooms" :key="room.id">
              <div class="room-wrapper">
                <el-card class="room-card" shadow="hover">
                  <div class="room-card-content">
                    <div class="room-status">
                      <el-tag
                        size="small"
                        :type="room.status === 0 ? 'success' : 'info'"
                      >
                        {{ room.status === 0 ? "正常使用" : "维护中" }}
                      </el-tag>
                    </div>

                    <div class="room-name">{{ room.roomName }}</div>
                    <div class="room-stats">
                      <div class="stats-item">
                        <span class="label">已启用</span>
                        <span class="value">{{ room.enableNum }}张</span>
                      </div>
                      <div class="divider"></div>
                      <div class="stats-item">
                        <span class="label">总床位</span>
                        <span class="value">{{ room.capacity }}张</span>
                      </div>
                    </div>

                    <div class="room-actions">
                      <el-button
                        type="danger"
                        size="mini"
                        @click.stop="handleDeleteRoom(room)"
                      >
                        删除
                      </el-button>
                      <el-button
                        type="warning"
                        size="mini"
                        @click.stop="handleEditRoom(room)"
                      >
                        修改
                      </el-button>
                      <el-button
                        type="primary"
                        size="mini"
                        @click.stop="showBedList(room)"
                      >
                        查看
                      </el-button>
                    </div>
                  </div>
                </el-card>
              </div>
            </el-col>

            <!-- 新增病房卡片 -->
            <el-col :span="6">
              <div class="room-wrapper">
                <el-card
                  class="room-card add-card"
                  shadow="hover"
                  @click.native="handleAddRoom"
                >
                  <div class="add-content">
                    <i class="el-icon-plus"></i>
                    <span>新增病房</span>
                  </div>
                </el-card>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>

    <bed-list
      v-if="bedListVisible"
      :visible.sync="bedListVisible"
      :room="currentRoom"
      @refresh="getList"
    />

    <!-- 添加修改病房的弹窗 -->
    <el-dialog
      title="修改病房信息"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="handleEditDialogClose"
    >
      <el-form
        :model="editForm"
        ref="editForm"
        :rules="editRules"
        label-width="80px"
        class="dialog-form"
      >
        <el-form-item label="病房名称" prop="roomName">
          <el-input
            v-model="editForm.roomName"
            placeholder="请输入病房名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="总床位数" prop="capacity">
          <el-input-number
            v-model="editForm.capacity"
            :min="1"
            :max="20"
            controls-position="right"
            style="width: 100%"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEdit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加新增病房的弹窗 -->
    <el-dialog
      title="新增病房"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="handleAddDialogClose"
    >
      <el-form
        :model="addForm"
        ref="addForm"
        :rules="formRules"
        label-width="80px"
        class="dialog-form"
      >
        <el-form-item label="病房名称" prop="roomName">
          <el-input
            v-model="addForm.roomName"
            placeholder="请输入病房名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="总床位数" prop="capacity">
          <el-input-number
            v-model="addForm.capacity"
            :min="1"
            :max="20"
            controls-position="right"
            style="width: 100%"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  createRoom,
  updateRoom,
  deleteRoom,
  updateStatus,
  fetchList,
} from "@/api/mgs/room-bed/room";
import BedList from "./components/BedList.vue";

const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  departmentNum: null,
  status: null,
};

const defaultRoom = {
  id: null,
  departmentNum: null,
  roomNumber: null,
  roomName: null,
  capacity: 0,
  enableNum: 0,
  status: 0,
};

export default {
  name: "WardManage",
  components: {
    BedList,
  },
  data() {
    return {
      tabs: [
        { name: "sr-dep", label: "收容" },
        { name: "zz-dep", label: "重症" },
        { name: "crb-dep", label: "传染病" },
        { name: "ss-dep", label: "手术" },
      ],
      selectedIndex: 0,
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: false,
      rooms: [],
      bedListVisible: false,
      currentRoom: null,
      editDialogVisible: false,
      editForm: Object.assign({}, defaultRoom),
      editRules: {
        roomName: [
          { required: true, message: "请输入病房名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
        capacity: [
          { required: true, message: "请输入总床位数", trigger: "blur" },
        ],
      },
      addDialogVisible: false,
      addForm: Object.assign({}, defaultRoom),
      formRules: {
        name: [
          { required: true, message: "请输入病房名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
        totalBeds: [
          { required: true, message: "请输入总床位数", trigger: "blur" },
        ],
      },
    };
  },

  computed: {
    getDialogTitle() {
      return this.currentRoom ? `${this.currentRoom.roomName} - 床位列表` : "";
    },
    getBedList() {
      return this.currentRoom ? this.currentRoom.beds : [];
    },
  },
  methods: {
    // 获取病房列表
    getList() {
      this.listLoading = true;
      this.listQuery.departmentNum = this.tabs[this.selectedIndex].name;
      fetchList(this.listQuery).then((response) => {
        this.listLoading = false;
        this.rooms = response.data.list;
        this.total = response.data.total;
      });
    },

    // 切换组室
    selectedTab(index) {
      this.selectedIndex = index;
      this.listQuery.pageNum = 1;
      this.getList();
    },

    // 删除病房
    handleDeleteRoom(room) {
      this.$confirm("是否要删除该病房?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteRoom(room.roomNumber).then((response) => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getList();
        });
      });
    },

    // 修改病房信息
    submitEdit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          const updateData = {
            roomNumber: this.editForm.roomNumber,
            capacity: this.editForm.capacity,
            departmentNum: this.editForm.departmentNum,
          };

          updateRoom(updateData).then((response) => {
            this.$message({
              message: "修改成功！",
              type: "success",
            });
            this.editDialogVisible = false;
            this.getList();
          });
        }
      });
    },

    handleAddRoom() {
      // 重置表单
      this.addForm = Object.assign({}, defaultRoom);
      // 显示新增对话框
      this.addDialogVisible = true;
      // 等待 DOM 更新后聚焦
      this.$nextTick(() => {
        this.$refs.addForm.clearValidate();
        this.$refs.addForm.$el.querySelector("input").focus();
      });
    },
    // 新增病房
    submitAdd() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.addForm.departmentNum = this.tabs[this.selectedIndex].name;
          createRoom(this.addForm).then((response) => {
            this.$message({
              message: "添加成功！",
              type: "success",
            });
            this.addDialogVisible = false;
            this.getList();
          });
        }
      });
    },

    // 更新床位状态
    handleBedStatus(bed, status) {
      updateStatus(bed.id, { enabled: status }).then((response) => {
        bed.enabled = status;
        if (this.currentRoom) {
          this.currentRoom.usedBeds = this.currentRoom.beds.filter(
            (b) => b.enabled
          ).length;
        }
        this.$message({
          type: "success",
          message: `${bed.name}已${status ? "启用" : "禁用"}`,
        });
      });
    },

    // 处理分页
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },

    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },

    // 重置表单
    handleAddDialogClose() {
      this.$refs.addForm.resetFields();
      this.addForm = Object.assign({}, defaultRoom);
    },

    handleEditDialogClose() {
      this.$refs.editForm.resetFields();
      this.editForm = Object.assign({}, defaultRoom);
    },
    showBedList(room) {
      console.log("显示病床列表", room);
      if (!room) {
        this.$message.warning("病房信息不存在");
        return;
      }
      this.bedListVisible = true;
      this.currentRoom = { ...room };
      console.log('bedListVisible:', this.bedListVisible);
      console.log('currentRoom:', this.currentRoom);
    },
    handleBedListClose() {
      this.bedListVisible = false;
      this.currentRoom = null;
    },
    handleEditRoom(room) {
      this.editForm = {
        id: room.id,
        roomName: room.roomName,
        capacity: room.capacity,
        roomNumber: room.roomNumber,
        departmentNum: room.departmentNum,
      };
      this.editDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.editForm.clearValidate();
      });
    },
  },
  created() {
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.ward-manage {
  padding: 5px 0px 0px 5px;
  background-color: #f5f7fa;
  height: 100%;
  position: relative;

  .ward-container {
    display: flex;
    gap: 0;
    height: 100%;
    position: relative;

    .ward-sidebar {
      width: 40px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
      position: absolute;
      left: 5px;
      top: 0;
      z-index: 2;

      .tab {
        margin-top: 6px;
        height: 80px;
        background: #e4e7ed;
        font-size: 14px;
        color: #606266;
        writing-mode: vertical-lr;
        text-align: center;
        line-height: 40px;
        letter-spacing: 4px;
        border-radius: 6px 0 0 6px;
        cursor: pointer;
        transition: all 0.3s ease;
        border-right: 3px solid transparent;

        &:hover {
          color: #2e7256;
          font-weight: 500;
          background: #d8e7e1;
          border-right-color: #2e7256;
        }

        &.active {
          color: #2e7256;
          font-weight: 600;
          background: #c2dfd5;
          border-right-color: #2e7256;
          box-shadow: -2px 0 8px rgba(46, 114, 86, 0.15);
          position: relative;
          z-index: 1;
        }

        &:nth-child(2) {
          margin-top: 8px;
        }
        &:nth-child(3) {
          margin-top: 8px;
        }
        &:nth-child(4) {
          margin-top: 8px;
        }
      }
    }

    .ward-content {
      flex: 1;
      min-width: 0;
      background-color: #ffffff;
      border-radius: 8px;
      padding: 10px 10px 10px 55px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
      backdrop-filter: blur(10px);
      position: relative;
      margin-left: 0;

      .room-list {
        margin-top: 0;
        position: relative;
        z-index: 1;

        .room-wrapper {
          cursor: pointer;
          margin-bottom: 20px;

          &:hover {
            .room-card {
              transform: translateY(-4px);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
          }

          .room-card {
            height: 140px;
            transition: all 0.3s ease;
            border-radius: 8px;
            background-color: #ffffff;
            border: 1px solid #ebeef5;

            .room-card-content {
              height: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 15px;
              position: relative;

              .room-status {
                position: absolute;
                top: 12px;
                right: 12px;

                .el-tag {
                  padding: 0 10px;
                }
              }

              .room-name {
                font-size: 18px;
                font-weight: bold;
                color: #2e7256;
                margin-bottom: 12px;
                margin-top: 10px;
                text-align: center;
              }

              .room-stats {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 12px;
                width: 100%;

                .stats-item {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  padding: 0 12px;

                  .label {
                    font-size: 12px;
                    color: #909399;
                    margin-bottom: 2px;
                  }

                  .value {
                    font-size: 16px;
                    color: #2e7256;
                    font-weight: bold;
                  }
                }

                .divider {
                  width: 1px;
                  height: 24px;
                  background-color: #e4e7ed;
                  margin: 0 8px;
                }
              }

              .room-actions {
                position: absolute;
                bottom: 12px;
                right: 12px;
                display: flex;
                justify-content: flex-end;

                .el-button {
                  padding: 5px 8px;
                  min-width: 45px;
                  font-size: 12px;
                }
              }
            }
          }
        }
      }
    }
  }
}

.bed-dialog {
  /deep/ .el-dialog {
    min-width: 400px;
    max-width: 500px;

    .el-dialog__header {
      padding: 15px 20px;
      border-bottom: 1px solid #ebeef5;
    }

    .el-dialog__body {
      padding: 15px;
      max-height: 350px;
    }
  }

  .bed-list-container {
    padding: 0;

    /deep/ .el-table {
      margin: 0;

      th {
        padding: 8px 0;
        background-color: #f5f7fa;
        color: #606266;
        font-weight: 600;
      }

      td {
        padding: 6px 0;
      }

      .button-group {
        display: flex;
        justify-content: center;
        gap: 8px;
      }

      .el-button {
        padding: 6px 12px;
      }

      .el-table__body-wrapper {
        &::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        &::-webkit-scrollbar-thumb {
          border-radius: 3px;
          background: #dcdfe6;
        }

        &::-webkit-scrollbar-track {
          border-radius: 3px;
          background: #f5f7fa;
        }
      }
    }
  }
}

/deep/ {
  .el-card__body {
    padding: 0;
    height: 100%;
  }

  .el-card {
    &.is-always-shadow,
    &.is-hover-shadow:focus,
    &.is-hover-shadow:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }
}

.add-card {
  height: 140px;
  cursor: pointer;
  border: 1px dashed #dcdfe6;
  background-color: #fafafa;
  transition: all 0.3s ease;

  &:hover {
    border-color: #2e7256;
    transform: translateY(-4px);

    .add-content {
      color: #2e7256;
    }
  }

  .add-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #909399;
    transition: all 0.3s ease;

    i {
      font-size: 24px;
      margin-bottom: 8px;
    }

    span {
      font-size: 14px;
    }
  }
}

// 确保新增卡片的样式与其他卡片一致
.room-wrapper {
  .add-card.room-card {
    margin: 0;
    box-shadow: none;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }
}

.dialog-form {
  padding: 0 20px;

  :deep(.el-form-item) {
    margin-bottom: 20px;

    .el-form-item__content {
      width: calc(100% - 80px); // 减去label的宽度

      .el-input,
      .el-input-number {
        width: 100%;
      }
    }
  }
}
</style> 