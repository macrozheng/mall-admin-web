<template> 
  <div class="app-container">
    <div class="filter-container">
      <span>输入搜索：</span>
      <el-input
        size="small"
        style="width: 200px"
        v-model="listQuery.keyword"
        placeholder="品牌名称/关键字"
      ></el-input>
      <el-button
        class="search-button"
        @click="searchBrandList()"
        type="primary"
        size="small">
        查询结果
      </el-button>
    </div>
    <el-table ref="brandTable"
              :data="list"
              style="width: 100%"
              @selection-change="handleSelectionChange"
              v-loading="listLoading"
              border>
      <el-table-column type="selection" width="60" align="center"></el-table-column>
      <el-table-column label="编号" width="80" align="center">
        <template slot-scope="scope">{{scope.row.id}}</template>
      </el-table-column>
      <el-table-column label="品牌名称" align="center">
        <template slot-scope="scope">{{scope.row.name}}</template>
      </el-table-column>
      <el-table-column label="品牌首字母" width="100" align="center">
        <template slot-scope="scope">{{scope.row.firstLetter}}</template>
      </el-table-column>
      <el-table-column label="排序" width="80" align="center">
        <template slot-scope="scope">{{scope.row.sort}}</template>
      </el-table-column>
      <el-table-column label="品牌制造商" width="100" align="center">
        <template slot-scope="scope">
          <el-switch
            @change="handleFactoryStatusChange(scope.$index, scope.row)"
            :active-value="1"
            :inactive-value="0"
            v-model="scope.row.factoryStatus">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="是否显示" width="100" align="center">
        <template slot-scope="scope">
          <el-switch
            @change="handleShowStatusChange(scope.$index, scope.row)"
            :active-value="1"
            :inactive-value="0"
            v-model="scope.row.showStatus">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="相关" width="220" align="center">
        <template slot-scope="scope">
          <span>商品：</span>
          <el-button
            size="mini"
            type="text"
            @click="handleProductList(scope.$index, scope.row)">100
          </el-button>
          <span>评价：</span>
          <el-button
            size="mini"
            type="text"
            @click="handleProductCommentList(scope.$index, scope.row)">1000
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="batch-operate-container">
      <el-select
        size="small"
        v-model="operateValue" placeholder="批量操作">
        <el-option
          v-for="item in operates"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button
        style="margin-left: 20px"
        class="search-button"
        @click="handleBatchOperate()"
        type="primary"
        size="small">
        确定
      </el-button>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        layout="total, prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import {fetchList} from '@/api/brand'

  export default {
    name: 'brandList',
    data() {
      return {
        operates:[
          {
            label:"显示品牌",
            value:"showBrand"
          },
          {
            label:"隐藏品牌",
            value:"hideBrand"
          }
          ],
        operateValue:null,
        listQuery: {
          keyword: null,
          pageNum: 1,
          pageSize: 10
        },
        list: null,
        total: null,
        listLoading: true,
        multipleSelection: []
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
          this.totalPage = response.data.totalPage;
          this.pageSize = response.data.pageSize;
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        console.log(index, row);
      },
      handleProductList(index, row) {
        console.log(index, row);
      },
      handleProductCommentList(index, row) {
        console.log(index, row);
      },
      handleFactoryStatusChange(index, row) {
        console.log(index, row);
      },
      handleShowStatusChange(index, row) {
        console.log(index, row);
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      searchBrandList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      handleBatchOperate() {
        console.log(this.operateValue);
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .pagination-container {
    display: inline-block;
    float: right;
    margin-top: 20px;
  }

  .filter-container {
    margin-bottom: 20px;
  }

  .search-button {
    float: right;
  }
  .batch-operate-container{
    display: inline-block;
    margin-top: 20px;
  }
</style>


