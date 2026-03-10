<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox, ElTree } from 'element-plus'
import { getMenuTreeListAPI } from '@/apis/menu.ts' // 修改路径为apis
import { roleListMenuByRoleIdAPI, roleAllocMenuAPI } from '@/apis/role' // 修改路径为apis
import type { TreeNodeData } from 'element-plus/es/components/tree/src/tree.type'
import type { UmsMenuNode } from '@/types/menu'

// 获取路由参数
const router = useRouter()
const route = useRoute()

// 当前角色ID
const roleId = ref<number>()
// 所有菜单树形结构列表
const menuTreeList = ref<UmsMenuNode[]>([])
// 创建对树组件的引用
const treeRef = ref<InstanceType<typeof ElTree>>()
// 定义树组件属性
const defaultProps = {
  children: 'children',
  label: 'title'
}
// 获取菜单树列表
const treeList = async () => {
  const res = await getMenuTreeListAPI()
  menuTreeList.value = res.data
}
// 获取角色对应的菜单
const getRoleMenu = async () => {
  const res = await roleListMenuByRoleIdAPI(roleId.value!)
  const menuList = res.data
  const checkedMenuIds = menuList.filter(item => item.parentId !== 0).map(item => item.id!)
  treeRef.value!.setCheckedKeys(checkedMenuIds)
}

// 页面创建时执行
onMounted(() => {
  roleId.value = Number(route.query.roleId)
  treeList()
  getRoleMenu()
})

// 保存菜单分配
const handleSave = async () => {
  const checkedNodes = treeRef.value!.getCheckedNodes() as TreeNodeData[]
  const checkedMenuIds = new Set<number>()
  checkedNodes.forEach(item => {
    checkedMenuIds.add(item.id)
    if (item.parentId !== 0) {
      checkedMenuIds.add(item.parentId)
    }
  })
  await ElMessageBox.confirm('是否分配菜单？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await roleAllocMenuAPI({ roleId: roleId.value!, menuIds: Array.from(checkedMenuIds).join(',') })
  ElMessage({
    message: '分配成功',
    type: 'success',
    duration: 1000
  })
  router.back()
}

// 清空选中项
const handleClear = () => {
  treeRef.value!.setCheckedKeys([])
}
</script>

<template>
  <el-card class="form-container" shadow="never">
    <el-tree ref="treeRef" :data="menuTreeList" show-checkbox default-expand-all node-key="id" :props="defaultProps"
      highlight-current>
    </el-tree>
    <div style="margin-top: 20px" align="center">
      <el-button type="primary" @click="handleSave()">保存</el-button>
      <el-button @click="handleClear()">清空</el-button>
    </div>
  </el-card>
</template>

<style scoped></style>
