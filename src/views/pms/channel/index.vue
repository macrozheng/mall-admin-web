<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          @click="handleSearchList()"
          type="primary"
          size="small">
          查询结果
        </el-button>
        <el-button
          style="float: right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="渠道名称：">
            <el-input style="width: 203px" v-model="listQuery.name" placeholder="渠道名称"></el-input>
          </el-form-item>
          <el-form-item label="渠道类型：">
            <el-select v-model="listQuery.type" placeholder="全部" clearable>
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select v-model="listQuery.status" placeholder="全部" clearable>
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
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        class="btn-add"
        @click="handleAddChannel()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="channelTable"
                :data="list"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="80" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="渠道名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="渠道编码" width="120" align="center">
          <template slot-scope="scope">{{scope.row.code}}</template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleStatusChange(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.status">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180" align="center">
          <template slot-scope="scope">{{scope.row.createTime | formatTime}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.$index, scope.row)">编辑
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
  </div>
</template>

<script>
  import {formatDate} from '@/utils/date';
  import {fetchList, deleteChannel} from '@/api/channel';

  export default {
    name: 'channelList',
    data() {
      return {
        listQuery: {
          name: null,
          type: null,
          status: null,
          pageNum: 1,
          pageSize: 5
        },
        list: [],
        total: 0,
        listLoading: true,
        multipleSelection: [],
        typeOptions: [
          {value: 0, label: '线上渠道'},
          {value: 1, label: '线下渠道'},
          {value: 2, label: '代理商'},
          {value: 3, label: '分销商'}
        ],
        statusOptions: [
          {value: 1, label: '启用'},
          {value: 0, label: '禁用'}
        ]
      }
    },
    created() {
      this.getList();
    },
    filters: {
      formatTime(time) {
        if (time == null || time === '') {
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      typeFilter(type) {
        const typeMap = {
          0: '线上渠道',
          1: '线下渠道', 
          2: '代理商',
          3: '分销商'
        };
        return typeMap[type] || '未知';
      }
    },
    methods: {
      handleResetSearch() {
        this.listQuery = {
          name: null,
          type: null,
          status: null,
          pageNum: 1,
          pageSize: 5
        };
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
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
      handleAddChannel() {
        this.$router.push({path: '/pms/addChannel'});
      },
      handleStatusChange(index, row) {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        });
      },
      handleUpdate(index, row) {
        this.$router.push({path: '/pms/updateChannel', query: {id: row.id}});
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该渠道?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteChannel(row.id).then(() => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
            this.getList();
          });
        });
      },
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
          this.totalPage = response.data.totalPage;
          this.pageSize = response.data.pageSize;
        });
      }
    }
  }
</script>

<style scoped>
  .filter-container {
    margin-bottom: 30px;
  }

  .operate-container {
    margin-bottom: 30px;
  }

  .operate-container .btn-add {
    float: right;
    margin-right: 20px;
  }

  .table-container {
    margin-bottom: 30px;
  }

  .pagination-container {
    display: flex;
    justify-content: center;
  }
</style>