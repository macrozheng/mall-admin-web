<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Tickets } from '@element-plus/icons-vue'
import { getFlashListAPI, flashUpdateStatusByIdAPI, flashDeleteByIdAPI, flashCreateAPI, flashUpdateByIdAPI } from '@/apis/flash'
import { formatDate } from '@/utils/datetime'
import type { SmsFlashPromotion } from '@/types/flash'
import type { PageParam } from '@/types/common'

// 获取路由
const router = useRouter()

// 列表查询参数
const listQuery = ref<PageParam>({
  pageNum: 1,
  pageSize: 10,
  keyword: ''
})
// 列表数据
const list = ref<SmsFlashPromotion[]>([])
// 总条数
const total = ref<number>(0)
// 加载张图
const listLoading = ref(false)
// 获取列表数据
const getList = async () => {
  listLoading.value = true
  try {
    const res = await getFlashListAPI(listQuery.value)
    listLoading.value = false
    list.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    listLoading.value = false
    console.error('获取秒杀活动列表失败:', error)
  }
}

// 组件挂载时获取数据
onMounted(() => {
  getList()
})

// 默认秒杀活动对象
const defaultSmsFlashPromotion: SmsFlashPromotion = {
  title: '',
  status: 0
}
// 当前操作的秒杀活动对象
const flashPromotion = ref(Object.assign({}, defaultSmsFlashPromotion))
// 编辑框是否可见
const dialogVisible = ref(false)
// 是否为编辑状态
const isEdit = ref(false)

// 重置搜索条件
const handleResetSearch = () => {
  listQuery.value = { pageNum: 0, pageSize: 10 }
}

// 搜索列表
const handleSearchList = () => {
  listQuery.value.pageNum = 1
  getList()
}

// 每页大小改变
const handleSizeChange = (val: number) => {
  listQuery.value.pageNum = 1
  listQuery.value.pageSize = val
  getList()
}

// 当前页改变
const handleCurrentChange = (val: number) => {
  listQuery.value.pageNum = val
  getList()
}

// 添加活动
const handleAdd = () => {
  dialogVisible.value = true
  isEdit.value = false
  flashPromotion.value = Object.assign({}, defaultSmsFlashPromotion)
}

// 显示时间段列表
const handleShowSessionList = () => {
  router.push({ path: '/sms/flashSession' })
}

// 状态改变
const handleStatusChange = async (index: number, row: SmsFlashPromotion) => {
  try {
    await ElMessageBox.confirm('是否要修改该状态?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await flashUpdateStatusByIdAPI(row.id!, { status: row.status })
    ElMessage.success('修改成功!')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('更新状态失败:', error)
    }
    ElMessage.info('取消修改')
    getList()
  }
}

// 删除活动
const handleDelete = async (index: number, row: SmsFlashPromotion) => {
  try {
    await ElMessageBox.confirm('是否要删除该活动?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await flashDeleteByIdAPI(row.id!)
    ElMessage.success('删除成功!')
    getList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除活动失败:', error)
    }
  }
}

// 更新活动
const handleUpdate = (index: number, row: SmsFlashPromotion) => {
  dialogVisible.value = true
  isEdit.value = true
  flashPromotion.value = Object.assign({}, row)
}

// 处理对话框确认
const handleDialogConfirm = async () => {
  await ElMessageBox.confirm('是否要确认?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  try {
    if (isEdit.value) {
      await flashUpdateByIdAPI(flashPromotion.value.id!, flashPromotion.value)
      ElMessage.success('修改成功！')
      dialogVisible.value = false
      getList()
    } else {
      await flashCreateAPI(flashPromotion.value)
      ElMessage.success('添加成功！')
      dialogVisible.value = false
      getList()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('处理活动失败:', error)
    }
  }
}

// 选择时间段
const handleSelectSession = (index: number, row: SmsFlashPromotion) => {
  router.push({ path: '/sms/selectSession', query: { flashPromotionId: row.id } })
}

// 格式化活动状态
const formatActiveStatus = (row: SmsFlashPromotion) => {
  const nowDate = new Date()
  const startDate = new Date(row.startDate!)
  const endDate = new Date(row.endDate!)
  if (nowDate.getTime() >= startDate.getTime() && nowDate.getTime() <= endDate.getTime()) {
    return '活动进行中'
  } else if (nowDate.getTime() > endDate.getTime()) {
    return '活动已结束'
  } else {
    return '活动未开始'
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
          <el-form-item label="活动名称：">
            <el-input v-model="listQuery.keyword" class="input-width" placeholder="活动名称" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <el-icon class="el-icon-middle">
        <Tickets />
      </el-icon>
      <span>数据列表</span>
      <el-button class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加活动</el-button>
      <el-button class="btn-add" @click="handleShowSessionList()">秒杀时间段列表</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="flashTable" :data="list" style="width: 100%;" v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="100" align="center">
          <template #default="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="活动标题" align="center">
          <template #default="scope">{{ scope.row.title }}</template>
        </el-table-column>
        <el-table-column label="活动状态" width="140" align="center">
          <template #default="scope">{{ formatActiveStatus(scope.row) }}</template>
        </el-table-column>
        <el-table-column label="开始时间" width="140" align="center">
          <template #default="scope">{{ formatDate(scope.row.startDate) }}</template>
        </el-table-column>
        <el-table-column label="结束时间" width="140" align="center">
          <template #default="scope">{{ formatDate(scope.row.endDate) }}</template>
        </el-table-column>
        <el-table-column label="上线/下线" width="200" align="center">
          <template #default="scope">
            <el-switch @change="handleStatusChange(scope.$index, scope.row)" :active-value="1" :inactive-value="0"
              v-model="scope.row.status">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button size="small" type="primary" link @click="handleSelectSession(scope.$index, scope.row)">设置商品
            </el-button>
            <el-button size="small" type="primary" link @click="handleUpdate(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button size="small" type="primary" link @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
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
    <el-dialog title="添加活动" v-model="dialogVisible" width="40%">
      <el-form :model="flashPromotion" ref="SmsFlashPromotionForm" label-width="150px">
        <el-form-item label="活动标题：">
          <el-input v-model="flashPromotion.title" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="开始时间：">
          <el-date-picker v-model="flashPromotion.startDate" type="date" placeholder="请选择时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间：">
          <el-date-picker v-model="flashPromotion.endDate" type="date" placeholder="请选择时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="上线/下线">
          <el-radio-group v-model="flashPromotion.status">
            <el-radio :label="1">上线</el-radio>
            <el-radio :label="0">下线</el-radio>
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

<style></style>
