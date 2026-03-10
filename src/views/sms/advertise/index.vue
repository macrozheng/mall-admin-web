<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Tickets } from '@element-plus/icons-vue'
import { getHomeAdvertiseListAPI, homeAdvertiseUpdateStatusAPI, deleteHomeAdvertiseAPI } from '@/apis/homeAdvertise'
import { formatDateTime } from '@/utils/datetime'
import type { HomeAdvertiseQueryParam, SmsHomeAdvertise } from '@/types/homeAdvertist'

// 获取路由
const router = useRouter()

// 列表查询参数
const listQuery = ref<HomeAdvertiseQueryParam>({
  pageNum: 1,
  pageSize: 10
})
// 轮播位置选项
const typeOptions = ref([
  {
    label: 'PC首页轮播',
    value: 0
  },
  {
    label: 'APP首页轮播',
    value: 1
  }
])
// 列表数据
const list = ref<SmsHomeAdvertise[]>([])
// 总条数
const total = ref(0)
// 加载状态
const listLoading = ref(false)
// 获取列表数据
const getList = async () => {
  listLoading.value = true
  const res = await getHomeAdvertiseListAPI(listQuery.value)
  listLoading.value = false
  list.value = res.data.list
  total.value = res.data.total
}

// 组件挂载后执行
onMounted(() => {
  getList()
})

// 选中的条目
const multipleSelection = ref<SmsHomeAdvertise[]>([])
// 批量操作类型
const operates = ref([
  {
    label: "删除",
    value: 0
  }
])
// 档期批量操作类型
const operateType = ref()

// 重置搜索
const handleResetSearch = () => {
  listQuery.value = { pageNum: 1, pageSize: 10 }
}

// 搜索列表
const handleSearchList = () => {
  listQuery.value.pageNum = 1
  getList()
}

// 处理表格选择变化
const handleSelectionChange = (val: SmsHomeAdvertise[]) => {
  multipleSelection.value = val
}

// 处理分页大小变化
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

// 处理状态更新
const handleUpdateStatus = async (index: number, row: SmsHomeAdvertise) => {
  try {
    await ElMessageBox.confirm('是否要修改上线/下线状态?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await homeAdvertiseUpdateStatusAPI({ id: row.id!, status: row.status! })
    getList()
    ElMessage.success({
      type: 'success',
      message: '修改成功!'
    })
  } catch {
    getList()
  }
}

// 删除广告
const deleteHomeAdvertise = async (ids: number[]) => {
  await ElMessageBox.confirm('是否要删除该广告?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await deleteHomeAdvertiseAPI({ ids: ids.join(',') })
  getList()
  ElMessage.success({
    type: 'success',
    message: '删除成功!'
  })
}

// 处理删除
const handleDelete = async (index: number, row: SmsHomeAdvertise) => {
  await deleteHomeAdvertise([row.id!])
}

// 处理批量操作
const handleBatchOperate = async () => {
  if (multipleSelection.value.length < 1) {
    ElMessage.warning({
      message: '请选择一条记录',
      duration: 1000
    })
    return
  }
  if (operateType.value === 0) {
    //删除
    await deleteHomeAdvertise(multipleSelection.value.map(item => item.id!))
  } else {
    ElMessage.warning({
      message: '请选择批量操作类型',
      duration: 1000
    })
  }
}

// 处理添加
const handleAdd = () => {
  router.push({ path: '/sms/addAdvertise' })
}

// 处理更新
const handleUpdate = (index: number, row: SmsHomeAdvertise) => {
  router.push({ path: '/sms/updateAdvertise', query: { id: row.id } })
}

// 格式化类型
const formatType = (type: number) => {
  if (type === 1) {
    return 'APP首页轮播'
  } else {
    return 'PC首页轮播'
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
      <div style="margin-top: 25px">
        <el-form :inline="true" :model="listQuery" label-width="140px">
          <el-form-item label="广告名称：">
            <el-input v-model="listQuery.name" class="input-width" placeholder="广告名称"></el-input>
          </el-form-item>
          <el-form-item label="广告位置：">
            <el-select v-model="listQuery.type" placeholder="全部" clearable class="input-width">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="到期时间：">
            <el-date-picker class="input-width" v-model="listQuery.endTime" value-format="yyyy-MM-dd" type="date"
              placeholder="请选择时间">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <el-icon class="el-icon-middle">
        <Tickets />
      </el-icon>
      <span>数据列表</span>
      <el-button class="btn-add" @click="handleAdd()">添加广告</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="homeAdvertiseTable" :data="list" style="width: 100%" @selection-change="handleSelectionChange"
        v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="100" align="center">
          <template #default="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="广告名称" align="center">
          <template #default="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="广告位置" width="120" align="center">
          <template #default="scope">{{ formatType(scope.row.type) }}</template>
        </el-table-column>
        <el-table-column label="广告图片" width="180" align="center">
          <template #default="scope"><img style="height: 80px;width: 150px;" :src="scope.row.pic"></template>
        </el-table-column>
        <el-table-column label="时间" width="240" align="center">
          <template #default="scope">
            <p>开始时间：{{ formatDateTime(scope.row.startTime) }}</p>
            <p>到期时间：{{ formatDateTime(scope.row.endTime) }}</p>
          </template>
        </el-table-column>
        <el-table-column label="上线/下线" width="100" align="center">
          <template #default="scope">
            <el-switch @change="handleUpdateStatus(scope.$index, scope.row)" :active-value="1" :inactive-value="0"
              v-model="scope.row.status">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="点击次数" width="100" align="center">
          <template #default="scope">{{ scope.row.clickCount }}</template>
        </el-table-column>
        <el-table-column label="生成订单" width="100" align="center">
          <template #default="scope">{{ scope.row.orderCount }}</template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template #default="scope">
            <el-button size="small" type="primary" link @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button size="small" type="primary" link @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select v-model="operateType" placeholder="批量操作">
        <el-option v-for="item in operates" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button style="margin-left: 20px" class="search-button" @click="handleBatchOperate()" type="primary">
        确定
      </el-button>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper" :page-size="listQuery.pageSize" :page-sizes="[5, 10, 15]"
        v-model:current-page="listQuery.pageNum" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<style scoped>
.input-width {
  width: 203px;
}
</style>
