<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Tickets } from '@element-plus/icons-vue'
import { getMenuListByParentIdAPI, deleteMenuByIdAPI, menuUpdateHiddenByIdAPI } from '@/apis/menu.ts'
import type { UmsMenu } from '@/types/menu'
import type { PageParam } from '@/types/common'

// 获取路由对象
const router = useRouter()
const route = useRoute()

// 菜单列表查询参数
const listQuery = ref<PageParam>({
  pageNum: 1,
  pageSize: 10
})
// 菜单列表数据
const list = ref<UmsMenu[]>([])
// 父级菜单ID
const parentId = ref(0)
// 分页总数
const total = ref<number>()
// 表格加载状态
const listLoading = ref(true)
// 重置父ID
const resetParentId = () => {
  listQuery.value.pageNum = 1
  if (route.query.parentId) {
    parentId.value = Number(route.query.parentId)
  } else {
    parentId.value = 0
  }
}
// 获取菜单列表
const getList = async () => {
  listLoading.value = true
  try {
    const response = await getMenuListByParentIdAPI(parentId.value, listQuery.value)
    listLoading.value = false
    list.value = response.data.list
    total.value = response.data.total
  } catch (error) {
    listLoading.value = false
    console.error('获取菜单列表失败:', error)
  }
}

// 组件挂载后执行
onMounted(() => {
  resetParentId()
  getList()
})

// 处理添加菜单
const handleAddMenu = () => {
  router.push('/ums/addMenu')
}

// 处理每页条数变化
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

// 处理隐藏状态变化
const handleHiddenChange = async (index: number, row: UmsMenu) => {
  await menuUpdateHiddenByIdAPI(row.id!, { hidden: row.hidden })
  ElMessage({
    message: '修改成功',
    type: 'success',
    duration: 1000
  })
}

// 处理显示下级
const handleShowNextLevel = (index: number, row: UmsMenu) => {
  router.push({ path: '/ums/menu', query: { parentId: row.id } })
}

// 处理更新
const handleUpdate = (index: number, row: UmsMenu) => {
  router.push({ path: '/ums/updateMenu', query: { id: row.id } })
}

// 处理删除
const handleDelete = async (index: number, row: UmsMenu) => {
  await ElMessageBox.confirm('是否要删除该菜单', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  try {
    await deleteMenuByIdAPI(row.id!)
    ElMessage({
      message: '删除成功',
      type: 'success',
      duration: 1000
    })
    getList()
  } catch (error) {
    console.error('删除菜单失败:', error)
  }
}

// 监听路由变化
watch(() => route, () => {
  resetParentId()
  getList()
}, { deep: true })

// 级别过滤器
const levelFilter = (value: number) => {
  if (value === 0) {
    return '一级'
  } else if (value === 1) {
    return '二级'
  }
  return ''
}

// 禁用下级过滤器
const disableNextLevel = (value: number) => {
  if (value === 0) {
    return false
  } else {
    return true
  }
}
</script>

<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <el-icon class="el-icon-middle">
        <Tickets />
      </el-icon>
      <span>数据列表</span>
      <el-button class="btn-add" @click="handleAddMenu()">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="menuTable" style="width: 100%" :data="list" v-loading="listLoading" border>
        <el-table-column label="编号" width="100" align="center">
          <template #default="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="菜单名称" align="center">
          <template #default="scope">{{ scope.row.title }}</template>
        </el-table-column>
        <el-table-column label="菜单级数" width="100" align="center">
          <template #default="scope">{{ levelFilter(scope.row.level) }}</template>
        </el-table-column>
        <el-table-column label="前端名称" align="center">
          <template #default="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="前端图标" width="100" align="center">
          <template #default="scope"><svg-icon :icon-class="scope.row.icon"></svg-icon></template>
        </el-table-column>
        <el-table-column label="是否显示" width="100" align="center">
          <template #default="scope">
            <el-switch @change="handleHiddenChange(scope.$index, scope.row)" :active-value="0" :inactive-value="1"
              v-model="scope.row.hidden">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="100" align="center">
          <template #default="scope">{{ scope.row.sort }}</template>
        </el-table-column>
        <el-table-column label="设置" width="120" align="center">
          <template #default="scope">
            <el-button type="primary" size="small" link :disabled="disableNextLevel(scope.row.level)"
              @click="handleShowNextLevel(scope.$index, scope.row)">查看下级
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button size="small" type="primary" link @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button size="small" type="primary" link @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper" :page-size="listQuery.pageSize" :page-sizes="[10, 15, 20]"
        v-model:current-page="listQuery.pageNum" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<style scoped></style>
