<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Tickets } from '@element-plus/icons-vue'
import { getOrderListAPI, orderUpdateCloseAPI, orderDeleteByIdsAPI } from '@/apis/order'
import LogisticsDialog from '@/views/oms/order/components/logisticsDialog.vue'
import { formatDateTime } from '@/utils/datetime'
import type { OmsOrder, OrderQueryParam } from '@/types/order'
import { useOrderStore } from '@/stores/order'

// 获取路由对象
const router = useRouter()

// 获取订单存储store
const orderStore = useOrderStore()

// 订单列表查询参数
const listQuery = ref<OrderQueryParam>({
  pageNum: 1,
  pageSize: 10
})
// 订单列表数据
const list = ref<OmsOrder[]>([])
// 表格数据加载进度条
const listLoading = ref(true)
// 分页组件参数
const total = ref(0)
// 获取订单列表数据
const getList = async () => {
  listLoading.value = true
  try {
    const response = await getOrderListAPI(listQuery.value)
    listLoading.value = false
    list.value = response.data.list
    total.value = response.data.total
  } catch (error) {
    listLoading.value = false
    console.error('获取订单列表失败:', error)
  }
}

// 组件挂载后初始化列表信息
onMounted(() => {
  getList()
})

// 表格中被选中的行
const multipleSelection = ref<OmsOrder[]>([])
// 批量操作类型
const operateType = ref<number>()

// 关闭订单对话框相关数据
const closeOrderData = ref({
  dialogVisible: false,
  content: '',
  orderIds: [] as number[]
})

// 物流对话框可见性
const logisticsDialogVisible = ref(false)

// 订单状态选项
const statusOptions = [
  {
    label: '待付款',
    value: 0
  },
  {
    label: '待发货',
    value: 1
  },
  {
    label: '已发货',
    value: 2
  },
  {
    label: '已完成',
    value: 3
  },
  {
    label: '已关闭',
    value: 4
  }
]

// 订单类型选项
const orderTypeOptions = [
  {
    label: '正常订单',
    value: 0
  },
  {
    label: '秒杀订单',
    value: 1
  }
]

// 订单来源选项
const sourceTypeOptions = [
  {
    label: 'PC订单',
    value: 0
  },
  {
    label: 'APP订单',
    value: 1
  }
]

// 批量操作选项
const operateOptions = [
  {
    label: "批量发货",
    value: 1
  },
  {
    label: "关闭订单",
    value: 2
  },
  {
    label: "删除订单",
    value: 3
  }
]

// 格式化支付方式
const formatPayType = (value: number) => {
  if (value === 1) {
    return '支付宝'
  } else if (value === 2) {
    return '微信'
  } else {
    return '未支付'
  }
}

// 格式化订单来源
const formatSourceType = (value: number) => {
  if (value === 1) {
    return 'APP订单'
  } else {
    return 'PC订单'
  }
}

// 格式化订单状态
const formatStatus = (value: number) => {
  if (value === 1) {
    return '待发货'
  } else if (value === 2) {
    return '已发货'
  } else if (value === 3) {
    return '已完成'
  } else if (value === 4) {
    return '已关闭'
  } else if (value === 5) {
    return '无效订单'
  } else {
    return '待付款'
  }
}

// 处理重置搜索
const handleResetSearch = () => {
  listQuery.value = { pageNum: 1, pageSize: 10 }
}

// 处理搜索列表
const handleSearchList = () => {
  listQuery.value.pageNum = 1
  getList()
}

// 处理表格选中状态变化
const handleSelectionChange = (val: OmsOrder[]) => {
  multipleSelection.value = val
}

// 处理查看订单
const handleViewOrder = (index: number, row: OmsOrder) => {
  router.push({ path: '/oms/orderDetail', query: { id: row.id } })
}

// 处理关闭订单
const handleCloseOrder = (index: number, row: OmsOrder) => {
  closeOrderData.value.dialogVisible = true
  closeOrderData.value.orderIds = [row.id!]
}

// 处理订单发货
const handleDeliveryOrder = (index: number, row: OmsOrder) => {
  orderStore.setDeliverOrderList([row])
  router.push({ path: '/oms/deliverOrderList' })
}

// 处理查看物流
const handleViewLogistics = (index: number, row: OmsOrder) => {
  logisticsDialogVisible.value = true
  console.log(index, row)
}

// 处理删除订单
const handleDeleteOrder = async (index: number, row: OmsOrder) => {
  const ids = [row.id!]
  await deleteOrderFn(ids)
}

// 处理批量操作
const handleBatchOperate = async () => {
  if (!multipleSelection.value || multipleSelection.value.length < 1) {
    ElMessage({
      message: '请选择要操作的订单',
      type: 'warning',
      duration: 1000
    })
    return
  }
  if (operateType.value === 1) {
    // 批量发货
    const listItems = multipleSelection.value.filter(item => item.status === 1)
    if (!listItems || listItems.length < 1) {
      ElMessage({
        message: '选中订单中没有可以发货的订单',
        type: 'warning',
        duration: 1000
      })
      return
    }
    orderStore.setDeliverOrderList(listItems)
    router.push({ path: '/oms/deliverOrderList' })
  } else if (operateType.value === 2) {
    // 关闭订单
    closeOrderData.value.orderIds = multipleSelection.value.filter(item => item.status === 0)
      .map(item => item.id)
    closeOrderData.value.dialogVisible = true
  } else if (operateType.value === 3) {
    // 删除订单
    const ids = multipleSelection.value.filter(item => item.status === 4)
      .map(item => item.id)
    await deleteOrderFn(ids)
  }
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

// 处理确认关闭订单
const handleCloseOrderConfirm = async () => {
  if (!closeOrderData.value.content) {
    ElMessage({
      message: '操作备注不能为空',
      type: 'warning',
      duration: 1000
    })
    return
  }
  const orderIds = closeOrderData.value.orderIds.join(',')
  await orderUpdateCloseAPI({ ids: orderIds, note: closeOrderData.value.content })
  closeOrderData.value.orderIds = []
  closeOrderData.value.dialogVisible = false
  getList()
  ElMessage({
    message: '修改成功',
    type: 'success',
    duration: 1000
  })
}

// 删除订单函数
const deleteOrderFn = async (ids: number[]) => {
  await ElMessageBox.confirm('是否要进行该删除操作?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await orderDeleteByIdsAPI({ ids: ids.join(',') })
  ElMessage({
    message: '删除成功！',
    type: 'success',
    duration: 1000
  })
  getList()
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
      <div style="margin-top: 20px">
        <el-form :inline="true" :model="listQuery" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input v-model="listQuery.orderSn" class="input-width" placeholder="订单编号"></el-input>
          </el-form-item>
          <el-form-item label="收货人：">
            <el-input v-model="listQuery.receiverKeyword" class="input-width" placeholder="收货人姓名/手机号码"></el-input>
          </el-form-item>
          <el-form-item label="提交时间：">
            <el-date-picker class="input-width" v-model="listQuery.createTime" value-format="yyyy-MM-dd" type="date"
              placeholder="请选择时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="订单状态：">
            <el-select v-model="listQuery.status" class="input-width" placeholder="全部" clearable>
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单分类：">
            <el-select v-model="listQuery.orderType" class="input-width" placeholder="全部" clearable>
              <el-option v-for="item in orderTypeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单来源：">
            <el-select v-model="listQuery.sourceType" class="input-width" placeholder="全部" clearable>
              <el-option v-for="item in sourceTypeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <el-icon class="el-icon-middle">
        <Tickets />
      </el-icon>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="orderTable" :data="list" style="width: 100%;" @selection-change="handleSelectionChange"
        v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="80" align="center">
          <template #default="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="订单编号" width="180" align="center">
          <template #default="scope">{{ scope.row.orderSn }}</template>
        </el-table-column>
        <el-table-column label="提交时间" width="180" align="center">
          <template #default="scope">{{ formatDateTime(scope.row.createTime) }}</template>
        </el-table-column>
        <el-table-column label="用户账号" align="center">
          <template #default="scope">{{ scope.row.memberUsername }}</template>
        </el-table-column>
        <el-table-column label="订单金额" width="120" align="center">
          <template #default="scope">￥{{ scope.row.totalAmount }}</template>
        </el-table-column>
        <el-table-column label="支付方式" width="120" align="center">
          <template #default="scope">{{ formatPayType(scope.row.payType) }}</template>
        </el-table-column>
        <el-table-column label="订单来源" width="120" align="center">
          <template #default="scope">{{ formatSourceType(scope.row.sourceType) }}</template>
        </el-table-column>
        <el-table-column label="订单状态" width="120" align="center">
          <template #default="scope">{{ formatStatus(scope.row.status) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button size="small" @click="handleViewOrder(scope.$index, scope.row)">查看订单</el-button>
            <el-button size="small" @click="handleCloseOrder(scope.$index, scope.row)"
              v-show="scope.row.status === 0">关闭订单</el-button>
            <el-button size="small" @click="handleDeliveryOrder(scope.$index, scope.row)"
              v-show="scope.row.status === 1">订单发货</el-button>
            <el-button size="small" @click="handleViewLogistics(scope.$index, scope.row)"
              v-show="scope.row.status === 2 || scope.row.status === 3">订单跟踪</el-button>
            <el-button size="small" type="danger" @click="handleDeleteOrder(scope.$index, scope.row)"
              v-show="scope.row.status === 4">删除订单</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select v-model="operateType" placeholder="批量操作">
        <el-option v-for="item in operateOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button style="margin-left: 20px" class="search-button" @click="handleBatchOperate()" type="primary">
        确定
      </el-button>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper" v-model:current-page="listQuery.pageNum"
        :page-size="listQuery.pageSize" :page-sizes="[5, 10, 15]" :total="total">
      </el-pagination>
    </div>
    <el-dialog title="关闭订单" v-model="closeOrderData.dialogVisible" width="30%">
      <span style="vertical-align: top">操作备注：</span>
      <el-input style="width: 80%" type="textarea" :rows="5" placeholder="请输入内容" v-model="closeOrderData.content">
      </el-input>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeOrderData.dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleCloseOrderConfirm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <logistics-dialog v-model="logisticsDialogVisible"></logistics-dialog>
  </div>
</template>

<style scoped>
.input-width {
  width: 203px
}
</style>
