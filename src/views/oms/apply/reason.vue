<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Tickets } from '@element-plus/icons-vue'
import { getReturnReasonListAPI, returnReasonDeleteByIdsAPI, returnReasonUpdateStatusAPI, returnReasonCreateAPI, getReturnReasonByIdAPI, returnReasonUpdateAPI } from '@/apis/returnReason'
import { formatDateTime } from '@/utils/datetime'
import type { PageParam } from '@/types/common'
import type { OmsOrderReturnReason } from '@/types/returnReason'

// 列表查询参数
const listQuery = ref<PageParam>({
  pageNum: 1,
  pageSize: 10
})
// 列表数据
const list = ref<OmsOrderReturnReason[]>([])
// 列表总条数
const total = ref(0)
// 表格中被选中的行
const multipleSelection = ref<OmsOrderReturnReason[]>([])
// 表格数据加载进度条
const listLoading = ref(true)
// 获取列表数据
const getList = async () => {
  listLoading.value = true
  const res = await getReturnReasonListAPI(listQuery.value)
  listLoading.value = false
  list.value = res.data.list
  total.value = res.data.total
}

// 组件挂载后加载数据
onMounted(() => {
  getList()
})

// reason对象默认值
const defaultReturnReason: OmsOrderReturnReason = {
  name: '',
  sort: 0,
  status: 1,
}
// 编辑框是否可见
const dialogVisible = ref(false)
// 当前操作的reason对象
const returnReason = ref(Object.assign({}, defaultReturnReason))
// 当前操作的reasonId,为null时表示新增
const operateReasonId = ref<number>()

// 批量操作类型
const operateType = ref()
// 所有批量操作
const operateOptions = ref([
  {
    label: "删除",
    value: 1
  }
])

const handleAdd = () => {
  dialogVisible.value = true
  operateReasonId.value = undefined
  returnReason.value = Object.assign({}, defaultReturnReason)
}

const handleConfirm = async () => {
  if (!operateReasonId.value) {
    // 添加操作
    await returnReasonCreateAPI(returnReason.value)
    dialogVisible.value = false
    operateReasonId.value = undefined
    ElMessage({
      message: '添加成功！',
      type: 'success',
      duration: 1000
    })
    getList()
  } else {
    // 编辑操作
    await returnReasonUpdateAPI(operateReasonId.value, returnReason.value)
    dialogVisible.value = false
    operateReasonId.value = undefined
    ElMessage({
      message: '修改成功！',
      type: 'success',
      duration: 1000
    })
    getList()
  }
}

const handleUpdate = async (index: number, row: OmsOrderReturnReason) => {
  dialogVisible.value = true
  operateReasonId.value = row.id
  const res = await getReturnReasonByIdAPI(row.id!)
  returnReason.value = res.data
}

const handleDelete = (index: number, row: OmsOrderReturnReason) => {
  const ids = []
  ids.push(row.id!)
  deleteReasonMethod(ids)
}

const handleSelectionChange = (val: OmsOrderReturnReason[]) => {
  multipleSelection.value = val
}

const handleStatusChange = async (index: number, row: OmsOrderReturnReason) => {
  const ids = []
  ids.push(row.id)
  await returnReasonUpdateStatusAPI({ ids: ids.join(','), status: row.status })
  ElMessage({
    message: '状态修改成功',
    type: 'success'
  })
}

const handleBatchOperate = () => {
  if (!multipleSelection.value || multipleSelection.value.length < 1) {
    ElMessage({
      message: '请选择要操作的条目',
      type: 'warning',
      duration: 1000
    })
    return
  }
  if (operateType.value === 1) {
    deleteReasonMethod(multipleSelection.value.map(item => item.id!))
  }
}

const handleSizeChange = (val: number) => {
  listQuery.value.pageNum = 1
  listQuery.value.pageSize = val
  getList()
}

const handleCurrentChange = (val: number) => {
  listQuery.value.pageNum = val
  getList()
}

const deleteReasonMethod = async (ids: number[]) => {
  await ElMessageBox.confirm('是否要进行该删除操作?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await returnReasonDeleteByIdsAPI({ ids: ids.join(',') })
  ElMessage({
    message: '删除成功！',
    type: 'success',
    duration: 1000
  })
  listQuery.value.pageNum = 1
  getList()
}
</script>

<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <el-icon class="el-icon-middle">
        <Tickets />
      </el-icon>
      <span>数据列表</span>
      <el-button @click="handleAdd" class="btn-add">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="returnReasonTable" :data="list" style="width: 100%;" @selection-change="handleSelectionChange"
        v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="80" align="center">
          <template v-slot="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="原因类型" align="center">
          <template v-slot="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="排序" width="100" align="center">
          <template v-slot="scope">{{ scope.row.sort }}</template>
        </el-table-column>
        <el-table-column label="是否可用" align="center">
          <template v-slot="scope">
            <el-switch v-model="scope.row.status" @change="handleStatusChange(scope.$index, scope.row)"
              :active-value="1" :inactive-value="0">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="添加时间" width="180" align="center">
          <template v-slot="scope">{{ formatDateTime(scope.row.createTime) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template v-slot="scope">
            <el-button size="small" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select v-model="operateType" placeholder="批量操作">
        <el-option v-for="item in operateOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button style="margin-left: 20px" class="search-button" @click="handleBatchOperate" type="primary">
        确定
      </el-button>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper" v-model:current-page="listQuery.pageNum"
        :page-size="listQuery.pageSize" :page-sizes="[5, 10, 15]" :total="total">
      </el-pagination>
    </div>
    <el-dialog title="添加退货原因" v-model="dialogVisible" width="30%">
      <el-form :model="returnReason" ref="reasonForm" label-width="150px">
        <el-form-item label="原因类型：">
          <el-input v-model="returnReason.name" class="input-width"></el-input>
        </el-form-item>
        <el-form-item label="排序：">
          <el-input v-model="returnReason.sort" class="input-width"></el-input>
        </el-form-item>
        <el-form-item label="是否启用：">
          <el-switch v-model="returnReason.status" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleConfirm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.input-width {
  width: 80%
}
</style>
