<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Tickets } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCouponListAPI, couponDeleteByIdAPI } from '@/apis/coupon'
import { formatDate } from '@/utils/datetime'
import type { CouponQueryParam, SmsCoupon } from '@/types/coupon'
import { couponPlatforms, couponTypes } from '@/utils/constant'

// 获取路由
const router = useRouter()

// 列表查询参数
const listQuery = ref<CouponQueryParam>({ pageNum: 1, pageSize: 10 })
// 类型选项
const typeOptions = ref(couponTypes)
// 列表数据
const list = ref<SmsCoupon[]>([])
// 总数
const total = ref<number>(0)
// 加载状态
const listLoading = ref<boolean>(false)
// 多选数据
const multipleSelection = ref<SmsCoupon[]>([])

// 获取列表数据
const getList = async () => {
  listLoading.value = true
  try {
    const response = await getCouponListAPI(listQuery.value)
    listLoading.value = false
    list.value = response.data.list
    total.value = response.data.total
  } catch (error) {
    listLoading.value = false
    console.error('获取优惠券列表失败:', error)
  }
}

// 组件挂载时获取数据
onMounted(() => {
  getList()
})

// 重置搜索条件
const handleResetSearch = () => {
  listQuery.value = { pageNum: 1, pageSize: 10 }
}

// 搜索列表
const handleSearchList = () => {
  listQuery.value.pageNum = 1
  getList()
}

// 处理多选变化
const handleSelectionChange = (val: SmsCoupon[]) => {
  multipleSelection.value = val
}

// 处理页面大小变化
const handleSizeChange = (val: number) => {
  listQuery.value.pageNum = 1
  listQuery.value.pageSize = val
  getList()
}

// 处理当前页变化
const handleCurrentChange = (val: number) => {
  listQuery.value.pageNum = val
  getList()
}

// 添加优惠券
const handleAdd = () => {
  router.push({ path: '/sms/addCoupon' })
}

// 查看优惠券
const handleView = (index: number, row: SmsCoupon) => {
  router.push({ path: '/sms/couponHistory', query: { id: row.id } })
}

// 更新优惠券
const handleUpdate = (index: number, row: SmsCoupon) => {
  router.push({ path: '/sms/updateCoupon', query: { id: row.id } })
}

// 删除优惠券
const handleDelete = async (index: number, row: SmsCoupon) => {
  try {
    await ElMessageBox.confirm('是否进行删除操作?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await couponDeleteByIdAPI(row.id!)
    ElMessage({
      type: 'success',
      message: '删除成功!'
    })
    getList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除优惠券失败:', error)
    }
  }
}

// 格式化类型
const formatType = (type: number) => {
  const findItem = typeOptions.value.find(item => item.value === type)
  return findItem?.label
}

// 格式化使用类型
const formatUseType = (useType: number) => {
  if (useType === 0) {
    return '全场通用'
  } else if (useType === 1) {
    return '指定分类'
  } else {
    return '指定商品'
  }
}

// 格式化平台
const formatPlatform = (platform: number) => {
  const findItem = couponPlatforms.find(item => item.value === platform)
  return findItem?.label
}

// 格式化状态
const formatStatus = (endTime: string) => {
  const now = new Date().getTime()
  const endDate = new Date(endTime)
  if (endDate.getTime() > now) {
    return '未过期'
  } else {
    return '已过期'
  }
}
</script>

<template>
  <div class="app-container">
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
          <el-form-item label="优惠券名称：">
            <el-input v-model="listQuery.name" class="input-width" placeholder="优惠券名称"></el-input>
          </el-form-item>
          <el-form-item label="优惠券类型：">
            <el-select v-model="listQuery.type" placeholder="全部" clearable class="input-width">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <el-icon class="el-icon-middle">
        <Tickets />
      </el-icon>
      <span>数据列表</span>
      <el-button class="btn-add" @click="handleAdd()">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="couponTable" :data="list" style="width: 100%;" @selection-change="handleSelectionChange"
        v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="100" align="center">
          <template #default="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="优惠劵名称" align="center">
          <template #default="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="优惠券类型" width="100" align="center">
          <template #default="scope">{{ formatType(scope.row.type) }}</template>
        </el-table-column>
        <el-table-column label="可使用商品" width="100" align="center">
          <template #default="scope">{{ formatUseType(scope.row.useType) }}</template>
        </el-table-column>
        <el-table-column label="使用门槛" width="140" align="center">
          <template #default="scope">满{{ scope.row.minPoint }}元可用</template>
        </el-table-column>
        <el-table-column label="面值" width="100" align="center">
          <template #default="scope">{{ scope.row.amount }}元</template>
        </el-table-column>
        <el-table-column label="适用平台" width="100" align="center">
          <template #default="scope">{{ formatPlatform(scope.row.platform) }}</template>
        </el-table-column>
        <el-table-column label="有效期" width="180" align="center">
          <template #default="scope">{{ formatDate(scope.row.startTime) }}至{{ formatDate(scope.row.endTime)
          }}</template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template #default="scope">{{ formatStatus(scope.row.endTime) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button size="small" type="primary" link @click="handleView(scope.$index, scope.row)">查看</el-button>
            <el-button size="small" type="primary" link @click="handleUpdate(scope.$index, scope.row)">
              编辑</el-button>
            <el-button size="small" type="primary" link @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
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
.input-width {
  width: 203px;
}
</style>
