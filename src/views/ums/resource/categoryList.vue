<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { dayjs, ElMessage, ElMessageBox } from 'element-plus'
import { Tickets } from '@element-plus/icons-vue'
import { resourceCategoryListAllAPI, resourceCategoryCreateAPI, resourceCategoryUpdateAPI, resourceCategoryDeleteByIdAPI } from '@/apis/resourceCategory'
import type { UmsResourceCategory } from '@/types/resource'

// 资源分类列表数据
const list = ref<UmsResourceCategory[]>([])
// 加载状态
const listLoading = ref(false)
// 获取列表数据
const getList = async () => {
  listLoading.value = true
  try {
    const res = await resourceCategoryListAllAPI()
    listLoading.value = false
    list.value = res.data
  } catch (error) {
    listLoading.value = false
    console.error('获取资源分类列表失败:', error)
  }
}

// 组件挂载时获取数据
onMounted(() => {
  getList()
})

// 默认资源分类对象
const defaultResourceCategory: UmsResourceCategory = {
  name: '',
  sort: 0
}
// 当前操作的资源分类
const resourceCategory = ref(Object.assign({}, defaultResourceCategory))
// 编辑框是否可见
const dialogVisible = ref(false)
// 编辑状态
const isEdit = ref(false)

// 添加资源分类
const handleAdd = () => {
  dialogVisible.value = true
  isEdit.value = false
  resourceCategory.value = Object.assign({}, defaultResourceCategory)
}

// 更新资源分类
const handleUpdate = (index: number, row: UmsResourceCategory) => {
  dialogVisible.value = true
  isEdit.value = true
  resourceCategory.value = Object.assign({}, row)
}

// 删除资源分类
const handleDelete = async (index: number, row: UmsResourceCategory) => {
  await ElMessageBox.confirm('是否要删除该分类?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  try {
    await resourceCategoryDeleteByIdAPI(row.id!)
    ElMessage.success('删除成功!')
    getList()
  } catch (error) {
    console.error('删除资源分类失败:', error)
  }
}

// 处理对话框确认
const handleDialogConfirm = async () => {
  await ElMessageBox.confirm('是否要确认?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  if (isEdit.value) {
    try {
      await resourceCategoryUpdateAPI(resourceCategory.value.id!, resourceCategory.value)
      ElMessage.success('修改成功！')
      dialogVisible.value = false
      getList()
    } catch (error) {
      console.error('更新资源分类失败:', error)
    }
  } else {
    try {
      await resourceCategoryCreateAPI(resourceCategory.value)
      ElMessage.success('添加成功！')
      dialogVisible.value = false
      getList()
    } catch (error) {
      console.error('创建资源分类失败:', error)
    }
  }

}

// 日期格式化过滤器函数
const formatDateTime = (time: string) => {
  if (!time) {
    return 'N/A'
  }
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}
</script>

<template>
  <div class="app-container">
    <el-card shadow="never" class="operate-container">
      <el-icon class="el-icon-middle">
        <tickets />
      </el-icon>
      <span>数据列表</span>
      <el-button class="btn-add" @click="handleAdd()">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="resourceCategoryTable" :data="list" style="width: 100%;" v-loading="listLoading" border>
        <el-table-column label="编号" width="100" align="center">
          <template #default="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="名称" align="center">
          <template #default="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template #default="scope">{{ formatDateTime(scope.row.createTime) }}</template>
        </el-table-column>
        <el-table-column label="排序" align="center">
          <template #default="scope">{{ scope.row.sort }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button size="small" type="primary" link @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button size="small" type="primary" link @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="添加分类" v-model="dialogVisible" width="40%">
      <el-form :model="resourceCategory" ref="resourceCategoryForm" label-width="150px" size="small">
        <el-form-item label="名称：">
          <el-input v-model="resourceCategory.name" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="排序：">
          <el-input v-model="resourceCategory.sort" style="width: 250px"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleDialogConfirm()">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style></style>
