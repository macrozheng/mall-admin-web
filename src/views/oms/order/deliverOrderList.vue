<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Tickets } from '@element-plus/icons-vue'
import { orderUpdateDeliveryAPI } from '@/apis/order'
import type { OmsOrder, OmsOrderDeliveryParam } from '@/types/order'
import { useOrderStore } from '@/stores/order'

// 获取路由对象
const router = useRouter()
// 获取 订单store
const orderStore = useOrderStore()

// 默认物流公司选项
const defaultLogisticsCompanies = ["顺丰快递", "圆通快递", "中通快递", "韵达快递"]

// 发货订单列表数据
const list = ref<OmsOrder[]>([])
// 物流公司选项
const companyOptions = ref<string[]>(defaultLogisticsCompanies)

// 根据订单对象获取详细地址
const fortmatAddress = (order: OmsOrder) => {
  return order.receiverProvince + order.receiverCity + order.receiverRegion + order.receiverDetailAddress
}

// 组件挂载后初始化数据
onMounted(() => {
  list.value = orderStore.deliverOrderList
  // 清空store中的数据
  orderStore.setDeliverOrderList([])
})

// 取消操作
const cancel = () => {
  router.back()
}

// 确认发货操作
const confirm = async () => {
  try {
    await ElMessageBox.confirm('是否要进行发货操作?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const deliveryParamList: OmsOrderDeliveryParam[] = list.value.map(item => ({
      orderId: item.id,
      deliverySn: item.orderSn,
      deliveryCompany: item.deliveryCompany
    }))
    await orderUpdateDeliveryAPI(deliveryParamList)
    router.back()
    ElMessage({
      type: 'success',
      message: '发货成功!'
    })
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage({
        type: 'info',
        message: '已取消发货'
      })
    }
  }
}
</script>

<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <el-icon class="el-icon-middle">
        <Tickets />
      </el-icon>
      <span>发货列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="deliverOrderTable" style="width: 100%;" :data="list" border>
        <el-table-column label="订单编号" width="180" align="center">
          <template #default="scope">{{ scope.row.orderSn }}</template>
        </el-table-column>
        <el-table-column label="收货人" width="150" align="center">
          <template #default="scope">{{ scope.row.receiverName }}</template>
        </el-table-column>
        <el-table-column label="手机号码" width="160" align="center">
          <template #default="scope">{{ scope.row.receiverPhone }}</template>
        </el-table-column>
        <el-table-column label="邮政编码" width="160" align="center">
          <template #default="scope">{{ scope.row.receiverPostCode }}</template>
        </el-table-column>
        <el-table-column label="收货地址" align="center">
          <template #default="scope">{{ fortmatAddress(scope.row) }}</template>
        </el-table-column>
        <el-table-column label="配送方式" width="200" align="center">
          <template #default="scope">
            <el-select placeholder="请选择物流公司" v-model="scope.row.deliveryCompany">
              <el-option v-for="item in companyOptions" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="物流单号" width="180" align="center">
          <template #default="scope">
            <el-input v-model="scope.row.deliverySn"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 15px;text-align: center">
        <el-button @click="cancel">取消</el-button>
        <el-button @click="confirm" type="primary">确定</el-button>
      </div>
    </div>
  </div>
</template>

<style></style>
