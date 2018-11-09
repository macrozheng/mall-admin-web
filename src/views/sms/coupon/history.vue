<template> 
  <div class="app-container">
    <div class="table-layout">
      <el-row>
        <el-col :span="4" class="table-cell-title">名称</el-col>
        <el-col :span="4" class="table-cell-title">优惠券类型</el-col>
        <el-col :span="4" class="table-cell-title">可使用商品</el-col>
        <el-col :span="4" class="table-cell-title">使用门槛</el-col>
        <el-col :span="4" class="table-cell-title">面值</el-col>
        <el-col :span="4" class="table-cell-title">状态</el-col>
      </el-row>
      <el-row>
        <el-col :span="4" class="table-cell">{{coupon.name}}</el-col>
        <el-col :span="4" class="table-cell">{{coupon.type | formatType}}</el-col>
        <el-col :span="4" class="table-cell">{{coupon.useType | formatUseType}}</el-col>
        <el-col :span="4" class="table-cell">满{{coupon.minPoint}}元可用</el-col>
        <el-col :span="4" class="table-cell">{{coupon.amount}}元</el-col>
        <el-col :span="4" class="table-cell">{{coupon.endTime | formatStatus}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4" class="table-cell-title">有效期</el-col>
        <el-col :span="4" class="table-cell-title">总发行量</el-col>
        <el-col :span="4" class="table-cell-title">已领取</el-col>
        <el-col :span="4" class="table-cell-title">待领取</el-col>
        <el-col :span="4" class="table-cell-title">已使用</el-col>
        <el-col :span="4" class="table-cell-title">未使用</el-col>
      </el-row>
      <el-row>
        <el-col :span="4" class="table-cell" style="font-size: 13px">
          {{coupon.startTime|formatDate}}至{{coupon.endTime|formatDate}}
        </el-col>
        <el-col :span="4" class="table-cell">{{coupon.publishCount}}</el-col>
        <el-col :span="4" class="table-cell">{{coupon.receiveCount}}</el-col>
        <el-col :span="4" class="table-cell">{{coupon.publishCount-coupon.receiveCount}}</el-col>
        <el-col :span="4" class="table-cell">{{coupon.useCount}}</el-col>
        <el-col :span="4" class="table-cell">{{coupon.publishCount-coupon.useCount}}</el-col>
      </el-row>
    </div>
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
          <el-form-item label="使用状态：">
            <el-select v-model="listQuery.useStatus" placeholder="全部" clearable class="input-width">
              <el-option v-for="item in useTypeOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单编号：">
            <el-input v-model="listQuery.orderSn" class="input-width" placeholder="订单编号"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
  import {formatDate} from '@/utils/date';
  import {getCoupon} from '@/api/coupon';

  const defaultTypeOptions = [
    {
      label: '全场赠券',
      value: 0
    },
    {
      label: '会员赠券',
      value: 1
    },
    {
      label: '购物赠券',
      value: 2
    },
    {
      label: '注册赠券',
      value: 3
    }
  ];
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    useStatus: null,
    orderSn: null,
    couponId: null
  };
  const defaultUseTypeOptions= [
    {
      label: "未使用",
      value: 0
    },
    {
      label: "已使用",
      value: 1
    },
    {
      label: "已过期",
      value: 2
    }
  ];
  export default {
    name: 'couponHistoryList',
    data() {
      return {
        coupon: {},
        listQuery: Object.assign({}, defaultListQuery),
        useTypeOptions:Object.assign({},defaultUseTypeOptions)
      }
    },
    created() {
      getCoupon(this.$route.query.id).then(response => {
        this.coupon = response.data;
      });
      this.listQuery.couponId=this.$route.query.id;
    },
    filters: {
      formatType(type) {
        for (let i = 0; i < defaultTypeOptions.length; i++) {
          if (type === defaultTypeOptions[i].value) {
            return defaultTypeOptions[i].label;
          }
        }
        return '';
      },
      formatUseType(useType) {
        if (useType === 0) {
          return '全场通用';
        } else if (useType === 1) {
          return '指定分类';
        } else {
          return '指定商品';
        }
      },
      formatPlatform(platform) {
        if (platform === 1) {
          return '移动平台';
        } else if (platform === 2) {
          return 'PC平台';
        } else {
          return '全平台';
        }
      },
      formatDate(time) {
        if (time == null || time === '') {
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd')
      },
      formatStatus(endTime) {
        let now = new Date().getTime();
        if (endTime > now) {
          return '未过期'
        } else {
          return '已过期';
        }
      }
    },
    methods: {}
  }
</script>
<style scoped>
  .app-container {
    width: 80%;
    margin: 20px auto;
  }

  .filter-container {
    margin-top: 20px;
  }

  .table-layout {
    margin-top: 20px;
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
  }

  .table-cell {
    height: 60px;
    line-height: 40px;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    text-align: center;
    overflow: hidden;
  }

  .table-cell-title {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    background: #F2F6FC;
    text-align: center;
    font-size: 14px;
    color: #303133;
  }
</style>


