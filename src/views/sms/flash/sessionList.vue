<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Tickets } from '@element-plus/icons-vue'
import { getFlashSessionListAPI, flashSessionUpdateStatusByIdAPI, flashSessionDeleteByIdAPI, flashSessionCreateAPI, flashSessionUpdateByIdAPI } from '@/apis/flashSession'
import type { SmsFlashPromotionSession } from '@/types/flash'
import { formatTime } from '@/utils/datetime'

// 秒杀时间段列表数据
const list = ref<SmsFlashPromotionSession[]>([])
// 加载状态
const listLoading = ref(false)
// 获取列表数据
const getList = async () => {
  listLoading.value = true
  try {
    const res = await getFlashSessionListAPI()
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

// 默认秒杀场次对象
const defaultFlashSession: SmsFlashPromotionSession = {
  name: '',
  status: 0
}
// 当前操作的秒杀场次
const flashSession = ref(Object.assign({}, defaultFlashSession))
// 编辑框显示状态
const dialogVisible = ref(false)
// 是否为编辑模式
const isEdit = ref(false)

// 添加时间段
const handleAdd = () => {
  dialogVisible.value = true
  isEdit.value = false
  flashSession.value = Object.assign({}, defaultFlashSession)
}

// 状态改变
const handleStatusChange = async (index: number, row: SmsFlashPromotionSession) => {
  try {
    await ElMessageBox.confirm('是否要修改该状态?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await flashSessionUpdateStatusByIdAPI(row.id!, { status: row.status })
    ElMessage.success('修改成功!')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('更新状态失败:', error)
    }
    ElMessage.info('取消修改')
    getList()
  }
}

// 更新时间段
const handleUpdate = (index: number, row: SmsFlashPromotionSession) => {
  dialogVisible.value = true
  isEdit.value = true
  flashSession.value = Object.assign({}, row)
  if (row.startTime) {
    flashSession.value.startTime = row.startTime
  }
  if (row.endTime) {
    flashSession.value.endTime = row.endTime
  }
}

// 删除时间段
const handleDelete = async (index: number, row: SmsFlashPromotionSession) => {
  try {
    await ElMessageBox.confirm('是否要删除该时间段?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await flashSessionDeleteByIdAPI(row.id!)
    ElMessage.success('删除成功!')
    getList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除时间段失败:', error)
    }
  }
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
      await flashSessionUpdateByIdAPI(flashSession.value.id!, flashSession.value)
      ElMessage.success('修改成功！')
      dialogVisible.value = false
      getList()
    } else {
      await flashSessionCreateAPI(flashSession.value)
      ElMessage.success('添加成功！')
      dialogVisible.value = false
      getList()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('处理时间段失败:', error)
    }
  }
}
</script>

<template>
  <div class="app-container">
    <el-card shadow="never" class="operate-container">
      <el-icon class="el-icon-middle">
        <Tickets />
      </el-icon>
      <span>数据列表</span>
      <el-button class="btn-add" @click="handleAdd()">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="flashSessionTable" :data="list" style="width: 100%;" v-loading="listLoading" border>
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
        <el-table-column label="启用" align="center">
          <template #default="scope">
            <el-switch @change="handleStatusChange(scope.$index, scope.row)" :active-value="1" :inactive-value="0"
              v-model="scope.row.status">
            </el-switch>
          </template>
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
    <el-dialog title="添加时间段" v-model="dialogVisible" width="40%">
      <el-form :model="flashSession" ref="flashSessionForm" label-width="150px">
        <el-form-item label="秒杀时间段名称：">
          <el-input v-model="flashSession.name" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="每日开始时间：">
          <el-time-picker v-model="flashSession.startTime" placeholder="请选择时间">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="每日结束时间：">
          <el-time-picker v-model="flashSession.endTime" placeholder="请选择时间">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-radio-group v-model="flashSession.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">不启用</el-radio>
          </el-radio-group>
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

<style scoped>
.operate-container {
  margin-top: 0;
}
</style>
