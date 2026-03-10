<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Tickets } from '@element-plus/icons-vue'
import { getFlashSessionSelectListAPI } from '@/apis/flashSession'
import type { SmsFlashPromotionSession } from '@/types/flash'
import { formatTime } from '@/utils/datetime'

// 获取路由
const router = useRouter()
const route = useRoute()

// 秒杀时间段列表
const list = ref<SmsFlashPromotionSession[]>([])
// 加载状态
const listLoading = ref(false)

// 获取列表数据
const getList = async () => {
  listLoading.value = true
  try {
    const res = await getFlashSessionSelectListAPI({ flashPromotionId: Number(route.query.flashPromotionId) })
    listLoading.value = false
    list.value = res.data
  } catch (error) {
    listLoading.value = false
    console.error('获取秒杀时间段列表失败:', error)
  }
}

// 组件挂载时获取数据
onMounted(() => {
  getList()
})

// 显示关联商品
const handleShowRelation = (index: number, row: SmsFlashPromotionSession) => {
  router.push({
    path: '/sms/flashProductRelation',
    query: {
      flashPromotionId: route.query.flashPromotionId,
      flashPromotionSessionId: row.id
    }
  })
}
</script>

<template>
  <div class="app-container">
    <el-card shadow="never" class="operate-container">
      <el-icon class="el-icon-middle">
        <Tickets />
      </el-icon>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="selectSessionTable" :data="list" style="width: 100%;" v-loading="listLoading" border>
        <el-table-column label="编号" width="100" align="center">
          <template #default="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="秒杀时间段名称" align="center">
          <template #default="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="每日开始时间" align="center">
          <template #default="scope">{{ formatTime(scope.row.startTime) }}</template>
        </el-table-column>
        <el-table-column label="每日结束时间" align="center">
          <template #default="scope">{{ formatTime(scope.row.endTime) }}</template>
        </el-table-column>
        <el-table-column label="商品数量" align="center">
          <template #default="scope">{{ scope.row.productCount }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button size="small" type="primary" link @click="handleShowRelation(scope.$index, scope.row)">商品列表
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style scoped>
.operate-container {
  margin-top: 0;
}
</style>
