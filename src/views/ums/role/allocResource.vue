<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { fetchAllResourceList } from '@/apis/resource.ts'
import { resourceCategoryListAllAPI } from '@/apis/resourceCategory.ts'
import { roleAllocResourceAPI, roleListResourceById } from '@/apis/role'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UmsResource, UmsResourceCategory } from '@/types/resource'

// 获取路由
const router = useRouter()
const route = useRoute()

// 当前操作的角色ID
const roleId = ref<number>()
// 所有资源列表
const allResource = ref<UmsResource[]>([])
// 所有资源分类列表
const allResourceCate = ref<UmsResourceCategory[]>([])
// 获取所有资源分类列表
const getAllResourceCateList = async () => {
  const res = await resourceCategoryListAllAPI()
  allResourceCate.value = res.data
  allResourceCate.value.forEach(item => item.checked = false)
}
// 获取所有资源列表
const getAllResourceList = async () => {
  const res = await fetchAllResourceList()
  allResource.value = res.data
  allResource.value.forEach(item => item.checked = false)
}

// 根据角色获取已分配资源并设置选中状态
const getResourceByRole = async () => {
  const res = await roleListResourceById(roleId.value!)
  const allocResource = res.data
  allResource.value.forEach(item => {
    item.checked = getResourceChecked(item.id!, allocResource)
  })
  allResourceCate.value.forEach(item => {
    item.checked = isAllChecked(item.id!)
  })
}

// 页面挂载时执行
onMounted(async () => {
  roleId.value = Number(route.query.roleId)
  await getAllResourceCateList()
  await getAllResourceList()
  await getResourceByRole()
})

// 根据分类ID获取资源
const getResourceByCate = (categoryId: number) => {
  return allResource.value.filter(item => item.categoryId === categoryId)
}

// 检查资源是否被选中
const getResourceChecked = (resourceId: number, allocResource: UmsResource[]) => {
  const index = allocResource.findIndex(item => item.id === resourceId)
  return index > -1
}

// 检查分类是否半选状态
const isIndeterminate = (categoryId: number) => {
  const cateResources = getResourceByCate(categoryId)
  return !(cateResources.every(item => item.checked === true) || cateResources.every(item => item.checked === false))
}

// 检查分类是否全选
const isAllChecked = (categoryId: number) => {
  const cateResources = getResourceByCate(categoryId)
  return cateResources.every(item => item.checked === true)
}

// 保存资源分配
const handleSave = async () => {
  await ElMessageBox.confirm('是否分配资源？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  const checkedResourceIds = new Set<number>()
  if (allResource.value && allResource.value.length > 0) {
    allResource.value.forEach(item => {
      if (item.checked) {
        checkedResourceIds.add(item.id!)
      }
    })
  }
  await roleAllocResourceAPI({ roleId: roleId.value!, resourceIds: Array.from(checkedResourceIds).join(',') })
  ElMessage({
    message: '分配成功',
    type: 'success',
    duration: 1000
  })
  router.back()
}

// 清空选中项
const handleClear = () => {
  allResourceCate.value.forEach(item => {
    item.checked = false
  })
  allResource.value.forEach(item => {
    item.checked = false
  })
}

// 处理全选改变事件
const handleCheckAllChange = (cate: UmsResourceCategory) => {
  const cateResources = getResourceByCate(cate.id!)
  cateResources.forEach(item => item.checked = cate.checked)
}

// 处理单个资源选中事件
const handleCheckChange = (resource: UmsResource) => {
  allResourceCate.value.forEach(item => {
    if (item.id === resource.categoryId) {
      item.checked = isAllChecked(resource.categoryId)
    }
  })
}
</script>

<template>
  <el-card class="form-container" shadow="never">
    <div v-for="(cate, index) in allResourceCate" :class="index === 0 ? 'top-line' : null" :key="'cate' + cate.id">
      <el-row class="table-layout" style="background: #F2F6FC;">
        <el-checkbox v-model="cate.checked" :indeterminate="isIndeterminate(cate.id!)"
          @change="handleCheckAllChange(cate)">
          {{ cate.name }}
        </el-checkbox>
      </el-row>
      <el-row class="table-layout">
        <el-col :span="8" v-for="resource in getResourceByCate(cate.id!)" :key="resource.id" style="padding: 4px 0">
          <el-checkbox v-model="resource.checked" @change="handleCheckChange(resource)">
            {{ resource.name }}
          </el-checkbox>
        </el-col>
      </el-row>
    </div>
    <div style="margin-top: 20px" align="center">
      <el-button type="primary" @click="handleSave()">保存</el-button>
      <el-button @click="handleClear()">清空</el-button>
    </div>
  </el-card>
</template>

<style scoped>
.table-layout {
  padding: 20px;
  border-left: 1px solid #DCDFE6;
  border-right: 1px solid #DCDFE6;
  border-bottom: 1px solid #DCDFE6;
}

.top-line {
  border-top: 1px solid #DCDFE6;
}
</style>
