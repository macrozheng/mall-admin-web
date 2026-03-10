<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { formatDate, formatDateTime } from '@/utils/datetime'
import { Search } from '@element-plus/icons-vue'
import { getCouponByIdAPI, getCouponHistoryListAPI } from '@/apis/coupon'
import type { CouponHistoryQueryParam, SmsCoupon, SmsCouponHistory } from '@/types/coupon'
import { couponTypes } from '@/utils/constant'
import { useRoute } from 'vue-router'

// 获取路由
const route = useRoute()
// 优惠券详情
const coupon = ref<SmsCoupon>({} as SmsCoupon)
// 优惠券历史列表查询参数
const listQuery = ref<CouponHistoryQueryParam>({
  pageNum: 1,
  pageSize: 10,
})
// 优惠券历史列表数据
const list = ref<SmsCouponHistory[]>([])
// 总记录数
const total = ref(0)
// 表格数据加载状态
const listLoading = ref(false)
// 获取列表数据
const getList = async () => {
  listLoading.value = true
  try {
    const response = await getCouponHistoryListAPI(listQuery.value)
    listLoading.value = false
    list.value = response.data.list
    total.value = response.data.total
  } catch (error) {
    listLoading.value = false
    console.error('获取优惠券历史列表失败:', error)
  }
}

// 使用状态选项
const useTypeOptions = ref([
  { label: "未使用", value: 0 },
  { label: "已使用", value: 1 },
  { label: "已过期", value: 2 }
])

// 页面加载完成后获取数据
onMounted(async () => {
  // 获取优惠券详情
  const couponRes = await getCouponByIdAPI(Number(route.query.id))
  coupon.value = couponRes.data
  // 设置优惠券ID用于查询历史记录
  listQuery.value.couponId = Number(route.query.id)
  getList()
})

// 重置搜索条件
const handleResetSearch = () => {
  listQuery.value = {
    pageNum: 1,
    pageSize: 10,
    couponId: Number(route.query.id)
  }
}

// 搜索列表
const handleSearchList = async () => {
  listQuery.value.pageNum = 1
  await getList()
}

// 每页条数变化
const handleSizeChange = (val: number) => {
  listQuery.value.pageNum = 1
  listQuery.value.pageSize = val
  getList()
}

// 当前页变化
const handleCurrentChange = (val: number) => {
  listQuery.value.pageNum = val
  getList()
}

// 优惠券类型过滤器
const formatType = (type: number) => {
  const found = couponTypes.find(option => option.value === type)
  return found ? found.label : ''
}

// 优惠券使用类型过滤器
const formatUseType = (useType: number) => {
  if (useType === 0) {
    return '全场通用'
  } else if (useType === 1) {
    return '指定分类'
  } else {
    return '指定商品'
  }
}

// 优惠券过期状态过滤器
const formatStatus = (endTime: string | number | Date) => {
  if (!endTime) return ''
  const endTimeDate = new Date(endTime).getTime()
  const now = new Date().getTime()
  return endTimeDate > now ? '未过期' : '已过期'
}

// 获取类型过滤器
const formatGetType = (type: number) => {
  if (type === 1) {
    return '主动获取'
  } else {
    return '后台赠送'
  }
}

// 优惠券历史使用类型过滤器
const formatCouponHistoryUseType = (useType: number) => {
  if (useType === 0) {
    return '未使用'
  } else if (useType === 1) {
    return '已使用'
  } else {
    return '已过期'
  }
}
</script>

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
        <el-col :span="4" class="table-cell">{{ coupon.name }}</el-col>
        <el-col :span="4" class="table-cell">{{ formatType(coupon.type) }}</el-col>
        <el-col :span="4" class="table-cell">{{ formatUseType(coupon.useType) }}</el-col>
        <el-col :span="4" class="table-cell">满{{ coupon.minPoint }}元可用</el-col>
        <el-col :span="4" class="table-cell">{{ coupon.amount }}元</el-col>
        <el-col :span="4" class="table-cell">{{ formatStatus(coupon.endTime!) }}</el-col>
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
          {{ formatDate(coupon.startTime!) }}至{{ formatDate(coupon.endTime!) }}
        </el-col>
        <el-col :span="4" class="table-cell">{{ coupon.publishCount }}</el-col>
        <el-col :span="4" class="table-cell">{{ coupon.receiveCount }}</el-col>
        <el-col :span="4" class="table-cell">{{ coupon.publishCount! - coupon.receiveCount! }}</el-col>
        <el-col :span="4" class="table-cell">{{ coupon.useCount }}</el-col>
        <el-col :span="4" class="table-cell">{{ coupon.publishCount! - coupon.useCount! }}</el-col>
      </el-row>
    </div>
    <el-card class="filter-container" shadow="never">
      <div>
        <el-icon class="el-icon-middle">
          <Search />
        </el-icon>
        <span>筛选搜索</span>
        <el-button style="float:right" type="primary" @click="handleSearchList()">
          查询搜索
        </el-button>
        <el-button style="float:right;margin-right: 15px" @click="handleResetSearch()">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" label-width="140px">
          <el-form-item label="使用状态：">
            <el-select v-model="listQuery.useStatus" placeholder="全部" clearable style="width: 150px;">
              <el-option v-for="item in useTypeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单编号：">
            <el-input v-model="listQuery.orderSn" class="input-width" placeholder="订单编号"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="table-container">
      <el-table ref="couponHistoryTable" :data="list" style="width: 100%;" v-loading="listLoading" border>
        <el-table-column label="优惠码" width="160" align="center">
          <template #default="scope">{{ scope.row.couponCode }}</template>
        </el-table-column>
        <el-table-column label="领取会员" width="140" align="center">
          <template #default="scope">{{ scope.row.memberNickname }}</template>
        </el-table-column>
        <el-table-column label="领取方式" width="100" align="center">
          <template #default="scope">{{ formatGetType(scope.row.getType) }}</template>
        </el-table-column>
        <el-table-column label="领取时间" width="160" align="center">
          <template #default="scope">{{ formatDateTime(scope.row.createTime) }}</template>
        </el-table-column>
        <el-table-column label="当前状态" width="140" align="center">
          <template #default="scope">{{ formatCouponHistoryUseType(scope.row.useStatus) }}</template>
        </el-table-column>
        <el-table-column label="使用时间" width="160" align="center">
          <template #default="scope">{{ formatDateTime(scope.row.useTime) }}</template>
        </el-table-column>
        <el-table-column label="订单编号" align="center">
          <template #default="scope">{{ scope.row.orderSn === null ? 'N/A' : scope.row.orderSn }}</template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper" v-model:current-page="listQuery.pageNum"
        :page-size="listQuery.pageSize" :page-sizes="[5, 10, 15]" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

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
