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
              class="date-picker-custom"
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
          <el-tabs
            v-model="currentStatus"
            type="card"
            @tab-click="handleTabClick"
          >
            <el-tab-pane
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :name="item.value"
            >
            </el-tab-pane>
          </el-tabs>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-upload2"
            @click="handleImport"
          >
            导入
          </el-button>
        </div>

        <!-- 搜索栏 -->
        <div class="search-bar">
          <div class="left-section">
            <el-input
              v-model="listQuery.name"
              placeholder="请输入姓名"
              style="width: 200px"
              class="filter-item"
              @keyup.enter.native="handleFilter"
            />
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              @click="handleFilter"
            >
              搜索
            </el-button>
            <el-button size="small" @click="resetQuery"> 重置 </el-button>
          </div>
          <div class="right-section">
            <el-button
              type="primary"
              icon="el-icon-view"
              size="small"
              @click="handlePreview"
            >
              预览
            </el-button>
          </div>
        </div>

        <!-- 数据列表 -->
        <el-table
          v-loading="listLoading"
          :data="list"
          style="width: 100%"
          border
        >
          <el-table-column
            type="index"
            label="序号"
            width="50"
            align="center"
          />
          <el-table-column 
            prop="suggestion" 
            label="处置建议" 
            align="center"
            min-width="100"
            show-overflow-tooltip
          />
          <el-table-column 
            prop="patientName" 
            label="姓名" 
            align="center"
            min-width="80"
            show-overflow-tooltip
          />
          <el-table-column
            prop="toDepartmentName"
            label="去往组室"
            align="center"
            min-width="100"
            show-overflow-tooltip
          />
          <el-table-column
            prop="transferTime"
            label="时间"
            align="center"
            width="160"
          />
          <el-table-column
            prop="dataOriginalDescription"
            label="数据来源"
            align="center"
            min-width="100"
            show-overflow-tooltip
          />
          <el-table-column 
            label="操作" 
            width="100" 
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="handleChangeDestination(scope.row)"
              >
                更改去向
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="listQuery.pageNum"
            :page-sizes="[5, 10, 15]"
            :page-size="listQuery.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchList } from "@/api/classify/fastClassify";
import {fetchList as  fetchDepartmentList, bedCountOfRoomList } from "@/api/mgs/room-bed/department";
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
        { label: "已分类病人", value: "0" },
        { label: "未分类病人", value: "unclassified" },
        { label: "已驳回病人", value: "2" },
      ],
      currentStatus: "0", // 修改默认值为"0"，对应已分类病人
      // 列表相关数据
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        pageNum: 1,
        pageSize: 5,
        name: "",
        transferStatus: 0, // 确保初始值与 currentStatus 对应
      },
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
      fetchDepartmentList().then((response) => {
        this.departments = response.data;
        // 如果有组室数据，默认选中第一个
        if (this.departments && this.departments.length > 0) {
          this.selectDepartment(this.departments[0]);
        }
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
        this.rooms = response.data;
      });
    },

    // 选择病房
    selectRoom(room) {
      this.selectedRoom = room.roomId;
    },

    // 切换状态
    switchStatus(status) {
      this.currentStatus = status;
      this.listQuery.transferStatus = status;
      this.listQuery.pageNum = 1;
      this.getList();
    },

    // 获取列表数据
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then((response) => {
        const { list, total } = response.data;
        this.list = list;
        this.total = total;
        this.listLoading = false;
      });
    },

    // 搜索
    handleFilter() {
      this.listQuery.pageNum = 1;
      this.getList();
    },

    // 重置搜索
    resetQuery() {
      this.listQuery.name = "";
      this.handleFilter();
    },

    // 导入
    handleImport() {
      // 实现导入功能
    },

    // 预览
    handlePreview() {
      // 实现预览功能
    },

    // 更改去向
    handleChangeDestination(row) {
      // 实现更改去向功能
    },

    // 分页方法
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },

    // 修改状态切换方法
    handleTabClick(tab) {
      this.listQuery.transferStatus = this.currentStatus;
      this.listQuery.pageNum = 1;
      this.getList();
    },
  },
  created() {
    this.getDepartments();
    this.getList();
  },
  mounted() {
    console.log(this.currentTime);
  },
};
</script>

<style lang="scss" scoped>
.classify-container {
  height: 96vh;
  display: flex;
  background-color: #f5f7fa;
  padding: 10px;
  gap: 6px;

  // 左侧面板
  .left-panel {
    width: 45%;
    // flex: 0 0 45%;
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

          .date-picker-custom {
            width: 200px;
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

          // .card-input {
          //   width: 150px;
          // }
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
    // flex: 0 0 55%;
    width: 55%;
    background-color: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    overflow: hidden; // 防止内容溢出

    .panel-content {
      padding: 20px;
      height: 100%;
      display: flex;
      flex-direction: column;

      // 状态切换栏样式
      .status-bar {
        flex-shrink: 0; // 防止压缩
        display: flex;
        justify-content: space-between;
        align-items: center;
        // padding: 0 0 0 0;
        // border-bottom: 1px solid #ebeef5;
        background-color: #fff;

        :deep(.el-tabs) {
          flex: 1;

          .el-tabs__header {
            margin: 0;
          }

          .el-tabs__nav-wrap::after {
            display: none;
          }

          .el-tabs__item {
            height: 50px;
            line-height: 50px;
            font-size: 14px;
            color: #606266;

            &.is-active {
              color: #2e7256;
              font-weight: 500;
            }

            &:hover {
              color: #2e7256;
            }
          }

          .el-tabs__active-bar {
            background-color: #2e7256;
          }
        }

        .el-button {
          margin-left: 20px;
        }
      }

      // 搜索栏样式
      .search-bar {
        flex-shrink: 0; // 防止压缩
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 0 15px 0;
        background-color: #fff;

        .left-section {
          display: flex;
          gap: 10px;
        }
      }

      // 表格容器
      .el-table {
        flex: 1;
        
        ::v-deep {
          .el-table__body-wrapper {
            overflow-x: hidden;
          }

          // 确保单元格内容不会换行
          .cell {
            white-space: nowrap;
          }
        }
      }

      // 分页容器
      .pagination-container {
        flex-shrink: 0; // 防止压缩
        padding: 15px 20px;
        text-align: right;
        background-color: #fff;
        // border-top: 1px solid #f0f0f0;
      }
    }
  }
}

.pagination-container {
  padding: 15px 20px;
  text-align: right;
}
</style>