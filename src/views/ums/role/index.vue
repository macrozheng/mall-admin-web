<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { dayjs, ElMessage, ElMessageBox } from 'element-plus'
import { Search, Tickets } from '@element-plus/icons-vue'
import { getRoleListAPI, roleCreateAPI, roleUpdateByIdAPI, roleUpdateStatusAPI, roleDeleteByIdsAPI } from '@/apis/role'
import type { UmsRole } from '@/types/role'
import type { PageParam } from '@/types/common'

// 获取路由对象
const router = useRouter()

// 列表查询参数
const listQuery = ref<PageParam>({
  pageNum: 1,
  pageSize: 10,
  keyword: ''
})
// 角色列表数据
const list = ref<UmsRole[]>([])
// 表格加载状态
const listLoading = ref(false)
// 分页总数
const total = ref(0)
// 获取角色列表
const getList = async () => {
  listLoading.value = true
  try {
    const response = await getRoleListAPI(listQuery.value)
    listLoading.value = false
    list.value = response.data.list
    total.value = response.data.total
  } catch (error) {
    listLoading.value = false
    console.error('获取角色列表失败:', error)
  }
}

// 组件挂载后初始化数据
onMounted(() => {
  getList()
})

// 当前操作的角色对象
const role = ref<UmsRole>({
  name: '',
  adminCount: 0,
  status: 1
})
// 编辑对话框是否可见
const dialogVisible = ref(false)
// 是否编辑状态
const isEdit = ref(false)

// 重置搜索条件
const handleResetSearch = () => {
  listQuery.value.pageNum = 1
  listQuery.value.keyword = ''
}

// 处理搜索
const handleSearchList = () => {
  listQuery.value.pageNum = 1
  getList()
}

// 每页大小变化
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

// 处理添加角色
const handleAdd = () => {
  dialogVisible.value = true
  isEdit.value = false
  role.value = {
    name: '',
    adminCount: 0,
    status: 1
  }
}

// 处理状态变化
const handleStatusChange = async (index: number, row: UmsRole) => {
  try {
    await ElMessageBox.confirm('是否要修改该状态?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await roleUpdateStatusAPI(row.id!, { status: row.status })
    ElMessage.success('修改成功!')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('更新状态失败:', error)
      // 如果取消或失败，重新获取列表以恢复状态
      getList()
    }
  }
}

// 处理删除
const handleDelete = async (index: number, row: UmsRole) => {
  try {
    await ElMessageBox.confirm('是否要删除该角色?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const ids = []
    ids.push(row.id)
    await roleDeleteByIdsAPI({ ids: ids.toString() })
    ElMessage.success('删除成功!')
    getList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
    }
  }
}

// 处理更新
const handleUpdate = (index: number, row: UmsRole) => {
  dialogVisible.value = true
  isEdit.value = true
  // 深拷贝row对象，避免直接修改原始数据
  role.value = { ...row }
}

// 处理对话框确认
const handleDialogConfirm = async () => {
  try {
    await ElMessageBox.confirm('是否要确认?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    if (isEdit.value) {
      await roleUpdateByIdAPI(role.value.id!, role.value)
      ElMessage.success('修改成功！')
    } else {
      await roleCreateAPI(role.value)
      ElMessage.success('添加成功！')
    }
    dialogVisible.value = false
    getList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('操作失败:', error)
    }
  }
}

// 处理选择菜单
const handleSelectMenu = (index: number, row: UmsRole) => {
  router.push({ path: '/ums/allocMenu', query: { roleId: row.id } })
}

// 处理选择资源
const handleSelectResource = (index: number, row: UmsRole) => {
  router.push({ path: '/ums/allocResource', query: { roleId: row.id } })
}

// 日期格式化函数
const formatDateTime = (time: string) => {
  if (!time) {
    return 'N/A'
  }
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
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
        <el-button style="float: right" @click="handleSearchList()" type="primary" size="default">
          查询搜索
        </el-button>
        <el-button style="float: right; margin-right: 15px" @click="handleResetSearch()" size="default">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="default" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input v-model="listQuery.keyword" class="input-width" placeholder="角色名称" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <el-icon class="el-icon-middle">
        <Tickets />
      </el-icon>
      <span>数据列表</span>
      <el-button size="default" class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="roleTable" :data="list" style="width: 100%;" v-loading="listLoading" border>
        <el-table-column label="编号" width="100" align="center">
          <template #default="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="角色名称" align="center">
          <template #default="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="描述" align="center">
          <template #default="scope">{{ scope.row.description }}</template>
        </el-table-column>
        <el-table-column label="用户数" width="100" align="center">
          <template #default="scope">{{ scope.row.adminCount }}</template>
        </el-table-column>
        <el-table-column label="添加时间" width="160" align="center">
          <template #default="scope">{{ formatDateTime(scope.row.createTime) }}</template>
        </el-table-column>
        <el-table-column label="是否启用" width="140" align="center">
          <template #default="scope">
            <el-switch @change="handleStatusChange(scope.$index, scope.row)" :active-value="1" :inactive-value="0"
              v-model="scope.row.status">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template #default="scope">
            <el-row>
              <el-col :span="12">
                <el-button size="small" type="primary" link @click="handleSelectMenu(scope.$index, scope.row)">分配菜单
                </el-button>
              </el-col>
              <el-col :span="12">
                <el-button size="small" type="primary" link @click="handleSelectResource(scope.$index, scope.row)">分配资源
                </el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-button size="small" type="primary" link @click="handleUpdate(scope.$index, scope.row)">
                  编辑
                </el-button>
              </el-col>
              <el-col :span="12">
                <el-button size="small" type="primary" link @click="handleDelete(scope.$index, scope.row)">删除
                </el-button>
              </el-col>
            </el-row>
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
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑角色' : '添加角色'" width="40%">
      <el-form :model="role" label-width="150px" size="default">
        <el-form-item label="角色名称：">
          <el-input v-model="role.name" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="描述：">
          <el-input v-model="role.description" type="textarea" :rows="5" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="是否启用：">
          <el-radio-group v-model="role.status">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false" size="default">取 消</el-button>
          <el-button type="primary" @click="handleDialogConfirm()" size="default">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style></style>
