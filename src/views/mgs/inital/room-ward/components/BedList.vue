<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="50%"
    @close="handleClose"
    destroy-on-close
    class="custom-dialog"
  >
    <div class="dialog-content">
      <div class="bed-list-container">
        <!-- 顶部操作按钮 -->
        <div class="operation-bar">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="handleAdd"
          >
            新增床位
          </el-button>
        </div>

        <!-- 床位列表 -->
        <el-table
          v-loading="listLoading"
          :data="bedList"
          style="width: 100%"
          height="315px"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          />
          <el-table-column
            prop="bedNumber"
            label="床位编号"
            align="center"
            width="120"
          />
          <el-table-column
            prop="bedName"
            label="床位名称"
            align="center"
            min-width="120"
          />
          <el-table-column label="状态" align="center" width="100">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                :active-value="0"
                :inactive-value="1"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="(val) => handleStatus(scope.row, val)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="180">
            <template slot-scope="scope">
              <div class="button-group">
                <el-button
                  size="mini"
                  type="primary"
                  plain
                  @click="handleEdit(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  plain
                  @click="handleDelete(scope.row)"
                >
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 - 移到表格容器内 -->
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
          >
          </el-pagination>
        </div>
    </div>

    <!-- 新增/编辑床位弹窗 -->
    <el-dialog
      :title="isEdit ? '编辑床位' : '新增床位'"
      :visible.sync="bedDialogVisible"
      width="30%"
      append-to-body
    >
      <el-form
        :model="bedForm"
        :rules="bedRules"
        ref="bedForm"
        label-width="80px"
      >
        <el-form-item label="床位名称" prop="bedName">
          <el-input
            v-model="bedForm.bedName"
            placeholder="输入床位名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="bedDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitBed">确 定</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import {
  createBed,
  updateBed,
  deleteBed,
  updateStatus,
  fetchList,
} from "@/api/mgs/room-bed/bed";

export default {
  name: "BedList",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    room: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      bedList: [],
      listLoading: false,
      total: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 5,
      },
      bedDialogVisible: false,
      isEdit: false,
      bedForm: {
        bedName: "",
        roomNumber: "",
      },
      bedRules: {
        bedName: [
          { required: true, message: "请输入床位名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    title() {
      return `${this.room.roomName} - 床位列表`;
    },
  },
  methods: {
    // 获取床位列表
    getBedList() {
      if (!this.room || !this.room.id) {
        return; // 如果没有房间信息，直接返回
      }

      this.listLoading = true;
      const params = {
        ...this.listQuery,
        roomId: this.room.id,
      };

      fetchList(params)
        .then((response) => {
          const { list, total } = response.data;
          this.bedList = list;
          this.total = total;
        })
        .catch(() => {
          this.$message.error("获取床位列表失败");
        })
        .finally(() => {
          this.listLoading = false;
        });
    },

    // 处理分页
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getBedList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getBedList();
    },

    // 新增床位
    handleAdd() {
      this.isEdit = false;
      this.bedForm = {
        bedName: "",
        roomNumber: this.room.roomNumber,
        roomId: this.room.id,
      };
      this.bedDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.bedForm.clearValidate();
      });
    },

    // 编辑床位
    handleEdit(row) {
      this.isEdit = true;
      this.bedForm = { ...row };
      this.bedDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.bedForm.clearValidate();
      });
    },

    // 删除床位
    handleDelete(row) {
      this.$confirm("是否要删除该床位?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteBed(row.id).then((response) => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getBedList();
          this.$emit("refresh"); // 通知父组件刷新
        });
      });
    },

    // 更新床位状态
    handleStatus(row, status) {
      updateBed({ bedNumber: row.bedNumber, status: status }).then(response => {
        this.$message({
          type: 'success',
          message: `${row.bedName}已${status === 0 ? '启用' : '禁用'}`
        });
        this.getBedList();
        this.$emit('refresh');
      }).catch(() => {
        // 如果失败，恢复开关状态
        row.status = status === 0 ? 1 : 0;
      });
    },

    // 提交床位表单
    submitBed() {
      this.$refs.bedForm.validate((valid) => {
        if (valid) {
          const request = this.isEdit
            ? updateBed(this.bedForm)
            : createBed(this.bedForm);

          request.then((response) => {
            this.$message({
              message: `${this.isEdit ? "修改" : "添加"}成功！`,
              type: "success",
            });
            this.bedDialogVisible = false;
            this.getBedList();
            this.$emit("refresh"); // 通知父组件刷新
          });
        }
      });
    },

    // 关闭弹窗
    handleClose() {
      this.bedList = [];
      this.$emit("update:visible", false);
    },
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        console.log("visible changed:", val); // 添加调试日志
        if (val && this.room) {
          console.log("room:", this.room); // 添加调试日志
          this.getBedList();
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.custom-dialog .el-dialog__body {
  padding: 0 20px !important;
}
.dialog-content {
  position: relative;
  height: 400px;
  .operation-bar {
    display: flex;
    justify-content: flex-end;
    padding-right: 20px;
    box-sizing: border-box;
    // margin-bottom: 10px;
  }

  .pagination-container {
    position: absolute;
    bottom: 15px;
    right: 20px;
    margin-bottom: 0px; 
}
}

</style>