<template> 
  <div class="app-container">
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
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input v-model="listQuery.id" style="width: 203px" placeholder="服务单号"></el-input>
          </el-form-item>
          <el-form-item label="处理状态：">
            <el-select v-model="listQuery.status" placeholder="全部" clearable>
              <el-option v-for="item in statusOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请时间：">
            <el-date-picker
              v-model="listQuery.createTime"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="操作人员：">
            <el-input v-model="listQuery.handleMan" style="width: 203px" placeholder="全部"></el-input>
          </el-form-item>
          <el-form-item label="处理时间：">
            <el-date-picker
              v-model="listQuery.handleTime"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择时间">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="returnApplyTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="服务单号" width="180" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="申请时间" width="180" align="center">
          <template slot-scope="scope">{{scope.row.createTime | formatTime}}</template>
        </el-table-column>
        <el-table-column label="用户账号" align="center">
          <template slot-scope="scope">{{scope.row.memberUsername}}</template>
        </el-table-column>
        <el-table-column label="退款金额" width="180" align="center">
          <template slot-scope="scope">￥{{scope.row.productRealPrice*scope.row.productCount}}</template>
        </el-table-column>
        <el-table-column label="申请状态" width="180" align="center">
          <template slot-scope="scope">{{scope.row.status | formatStatus}}</template>
        </el-table-column>
        <el-table-column label="处理时间" width="180" align="center">
          <template slot-scope="scope">{{scope.row.handleTime | formatTime}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
            size="mini"
            @click="handleViewOrder(scope.$index, scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import {formatDate} from '@/utils/date';
  import {fetchList} from '@/api/returnApply';
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    id: null,
    receiverKeyword: null,
    status: null,
    createTime: null,
    handleMan: null,
    handleTime: null
  };
  const defaultStatusOptions=[
    {
      label: '待处理',
      value: 0
    },
    {
      label: '退货中',
      value: 1
    },
    {
      label: '已完成',
      value: 2
    },
    {
      label: '已拒绝',
      value: 3
    }
  ];
  export default {
    name:'returnApplyList',
    data() {
      return {
        listQuery:Object.assign({},defaultListQuery),
        statusOptions: Object.assign({},defaultStatusOptions),
        list:null,
        total:null,
        listLoading:false,
        multipleSelection:[]
      }
    },
    created(){
      this.getList();
    },
    filters:{
      formatTime(time) {
        if(time==null||time===''){
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      formatStatus(status){
        for(let i=0;i<defaultStatusOptions.length;i++){
          if(status===defaultStatusOptions[i].value){
            return defaultStatusOptions[i].label;
          }
        }
      }
    },
    methods:{
      handleSelectionChange(val){
        this.multipleSelection = val;
      },
      getList(){
        this.listLoading=true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
      }
    }
  }
</script>
<style></style>


