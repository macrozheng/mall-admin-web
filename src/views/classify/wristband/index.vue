<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float:right"
          type="primary"
          @click="handleSearchList()"
          size="small">
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 20px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="标识名称：">
            <el-input v-model="listQuery.name" class="input-width" placeholder="标识名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="固话码：">
            <el-input v-model="listQuery.fixedCode" class="input-width" placeholder="固话码" clearable></el-input>
          </el-form-item>
          <el-form-item label="绑定人员编号：">
            <el-input v-model="listQuery.boundPersonNum" class="input-width" placeholder="绑定人员编号" clearable></el-input>
          </el-form-item>
          <el-form-item label="使用状态：">
            <el-select v-model="listQuery.status" placeholder="全部" clearable class="input-width">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 操作按钮 -->
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加</el-button>
    </el-card>

    <!-- 列表 -->
    <div class="table-container">
      <el-table ref="wristbandTable"
                :data="list"
                style="width: 100%"
                v-loading="listLoading"
                border>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.$index + 1}}</template>
        </el-table-column>
        <el-table-column label="标识名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="固化码" align="center">
          <template slot-scope="scope">{{scope.row.fixedCode}}</template>
        </el-table-column>
        <el-table-column label="绑定人员编号" align="center" width="200">
          <template slot-scope="scope">{{scope.row.boundPersonNum || 0}}</template>
        </el-table-column>
        <el-table-column label="创建时间" width="160" align="center">
          <template slot-scope="scope">{{scope.row.createdAt }}</template>
        </el-table-column>
        <el-table-column label="更新时间" width="160" align="center">
          <template slot-scope="scope">{{scope.row.updatedAt}}</template>
        </el-table-column>
        <el-table-column label="使用状态" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleStatusChange(scope.row)"
              :active-value="0"
              :inactive-value="1"
              v-model="scope.row.status">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="绑定状态" width="100" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.bounded === 1 ? 'success' : 'info'">
              {{scope.row.bounded === 1 ? '已绑定' : '未绑定'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :total="total">
      </el-pagination>
    </div>

    <!-- 添加/编辑对话框 -->
    <el-dialog
      :title="isEdit?'编辑标识':'添加标识'"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form :model="wristband"
                ref="wristbandForm"
                label-width="150px" size="small">
        <el-form-item label="标识名称：">
          <el-input v-model="wristband.name" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="固定码：">
          <el-input v-model="wristband.fixedCode" style="width: 250px"></el-input>
        </el-form-item>
        
        <el-form-item label="启用状态：">
          <el-radio-group v-model="wristband.status">
            <el-radio :label="0">启用</el-radio>
            <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {fetchList, createWristband, updateWristband, deleteWristband} from '@/api/classify/wristband';

const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
  name: null,
  fixedCode: null,
  boundPersonNum: null,
  status: null
};

const defaultWristband = {
  id: null,
  name: null,
  fixedCode: null,
  status: 0,
  enabled: 1
};

export default {
  name: 'Wristband',
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: false,
      dialogVisible: false,
      wristband: Object.assign({}, defaultWristband),
      isEdit: false,
      statusOptions: [
        {
          label: '使用中',
          value: 0
        },
        {
          label: '未使用',
          value: 1
        }
      ]
    }
  },
  created() {
    this.getList();
  },
  methods: {
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    handleAdd() {
      this.dialogVisible = true;
      this.isEdit = false;
      this.wristband = Object.assign({}, defaultWristband);
    },
    handleStatusChange(row) {
      this.$confirm('是否要修改该状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateWristband({id: row.id, status: row.status}).then(response => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          });
          this.getList();
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消修改'
        });
        this.getList();
      });
    },
    handleDelete(row) {
      this.$confirm('是否要删除该标识?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteWristband(row.id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getList();
        });
      });
    },
    handleUpdate(row) {
      this.dialogVisible = true;
      this.isEdit = true;
      this.wristband = Object.assign({}, row);
    },
    handleDialogConfirm() {
      if (this.isEdit) {
        updateWristband(this.wristband).then(response => {
          this.$message({
            message: '修改成功！',
            type: 'success'
          });
          this.dialogVisible = false;
          this.getList();
        })
      } else {
        createWristband(this.wristband).then(response => {
          this.$message({
            message: '添加成功！',
            type: 'success'
          });
          this.dialogVisible = false;
          this.getList();
        })
      }
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.input-width {
  width: 203px;
}
</style> 