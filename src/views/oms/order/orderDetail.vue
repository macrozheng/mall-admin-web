<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox, type CascaderOption } from 'element-plus'
import { Warning } from '@element-plus/icons-vue'
import { getOrderDetailByIdAPI, orderUpdateReceiverInfoAPI, orderUpdateMoneyInfoAPI, orderUpdateCloseAPI, orderUpdateNoteAPI, orderDeleteByIdsAPI } from '@/apis/order'
import LogisticsDialog from '@/views/oms/order/components/logisticsDialog.vue'
import type { OmsOrder, OmsOrderDetail, OmsReceiverInfoParam } from '@/types/order'
import { formatDateTime } from '@/utils/datetime'
import { pcaTextArr } from 'element-china-area-data'

// 获取路由对象
const router = useRouter()
const route = useRoute()

// 订单ID
const id = ref<number>()
// 订单详情数据
const order = ref<OmsOrderDetail>({} as OmsOrderDetail)

// 组件挂载后获取订单详情
onMounted(async () => {
  id.value = Number(route.query.id)
  const res = await getOrderDetailByIdAPI(id.value!)
  order.value = res.data
})

// 修改收货人信息对话框可见性
const receiverDialogVisible = ref(false)
// 收货人信息
const receiverInfo = ref<OmsReceiverInfoParam>({} as OmsReceiverInfoParam)
// 当前选中的省市区三级联动
const selectedRegions = ref<string[]>([])

// 修改费用信息对话框可见性
const moneyDialogVisible = ref(false)
// 费用信息
const moneyInfo = ref({ orderId: 0, freightAmount: 0, discountAmount: 0, status: 0 })

// 发送站内信对话框可见性
const messageDialogVisible = ref(false)
// 站内信内容
const message = ref({ title: '', content: '' })

// 关闭订单对话框可见性
const closeDialogVisible = ref(false)
// 关闭订单信息
const closeInfo = ref({ note: '', id: 0 })

// 备注订单对话框可见性
const markOrderDialogVisible = ref(false)
// 备注订单信息
const markInfo = ref({ id: 0, note: '' })

// 物流对话框可见性
const logisticsDialogVisible = ref(false)

// 格式化空值
const formatNull = (value: string | undefined) => {
  if (!value) {
    return '暂无'
  } else {
    return value
  }
}

// 格式化长文本
const formatLongText = (value: string | undefined) => {
  if (!value) {
    return '暂无'
  } else if (value.length > 8) {
    return value.substring(0, 8) + '...'
  } else {
    return value
  }
}

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

// 格式化订单类型
const formatOrderType = (value: number) => {
  if (value === 1) {
    return '秒杀订单'
  } else {
    return '正常订单'
  }
}

// 格式化地址
const formatAddress = (order: OmsOrder) => {
  let str = order.receiverProvince || ''
  if (order.receiverCity != null) {
    str += "  " + order.receiverCity
  }
  str += "  " + (order.receiverRegion || '')
  str += "  " + (order.receiverDetailAddress || '')
  return str
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

// 格式化支付状态
const formatPayStatus = (value: number) => {
  if (value === 0) {
    return '未支付'
  } else if (value === 4) {
    return '已退款'
  } else {
    return '已支付'
  }
}

// 格式化发货状态
const formatDeliverStatus = (value: number) => {
  if (value === 0 || value === 1) {
    return '未发货'
  } else {
    return '已发货'
  }
}

// 格式化商品属性
const formatProductAttr = (value: string) => {
  if (value == null) {
    return ''
  } else {
    const attr = JSON.parse(value)
    let result = ''
    for (let i = 0; i < attr.length; i++) {
      result += attr[i].key
      result += ":"
      result += attr[i].value
      result += ";"
    }
    return result
  }
}

// 格式化步骤状态
const formatStepStatus = (value: number) => {
  if (value === 1) {
    //待发货
    return 2
  } else if (value === 2) {
    //已发货
    return 3
  } else if (value === 3) {
    //已完成
    return 4
  } else {
    //待付款、已关闭、无限订单
    return 1
  }
}

// 选择地区
const onSelectRegionChange = () => {
  receiverInfo.value.receiverProvince = selectedRegions.value[0]
  receiverInfo.value.receiverCity = selectedRegions.value[1]
  receiverInfo.value.receiverRegion = selectedRegions.value[2]
}

// 显示修改收货人信息对话框
const showUpdateReceiverDialog = () => {
  receiverDialogVisible.value = true
  receiverInfo.value = {
    orderId: order.value.id,
    receiverName: order.value.receiverName,
    receiverPhone: order.value.receiverPhone,
    receiverPostCode: order.value.receiverPostCode,
    receiverDetailAddress: order.value.receiverDetailAddress,
    receiverProvince: order.value.receiverProvince,
    receiverCity: order.value.receiverCity,
    receiverRegion: order.value.receiverRegion,
    status: order.value.status
  }
  // 初始化地址选择器中数据
  selectedRegions.value = []
  selectedRegions.value[0] = receiverInfo.value.receiverProvince!
  selectedRegions.value[1] = receiverInfo.value.receiverCity!
  selectedRegions.value[2] = receiverInfo.value.receiverRegion!
}

// 处理更新收货人信息
const handleUpdateReceiverInfo = async () => {
  await ElMessageBox.confirm('是否要修改收货信息?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await orderUpdateReceiverInfoAPI(receiverInfo.value)
  receiverDialogVisible.value = false
  ElMessage({
    type: 'success',
    message: '修改成功!'
  })
  const response = await getOrderDetailByIdAPI(id.value!)
  order.value = response.data
}

// 显示修改费用信息对话框
const showUpdateMoneyDialog = () => {
  moneyDialogVisible.value = true
  moneyInfo.value.orderId = order.value.id
  moneyInfo.value.freightAmount = order.value.freightAmount
  moneyInfo.value.discountAmount = order.value.discountAmount
  moneyInfo.value.status = order.value.status
}

// 处理更新费用信息
const handleUpdateMoneyInfo = async () => {
  await ElMessageBox.confirm('是否要修改费用信息?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await orderUpdateMoneyInfoAPI(moneyInfo.value)
  moneyDialogVisible.value = false
  ElMessage({
    type: 'success',
    message: '修改成功!'
  })
  const response = await getOrderDetailByIdAPI(id.value!)
  order.value = response.data
}

// 显示发送站内信对话框
const showMessageDialog = () => {
  messageDialogVisible.value = true
  message.value.title = ''
  message.value.content = ''
}

// 处理发送站内信
const handleSendMessage = async () => {
  await ElMessageBox.confirm('是否要发送站内信?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  console.log('站内信功能暂未实现，模拟发送。。。')
  messageDialogVisible.value = false
  ElMessage({
    type: 'success',
    message: '发送成功!'
  })
}

// 显示关闭订单对话框
const showCloseOrderDialog = () => {
  closeDialogVisible.value = true
  closeInfo.value.note = ''
  closeInfo.value.id = id.value!
}

// 处理关闭订单
const handleCloseOrder = async () => {
  try {
    await ElMessageBox.confirm('是否要关闭?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await orderUpdateCloseAPI({ ids: closeInfo.value.id.toString(), note: closeInfo.value.note })
    closeDialogVisible.value = false
    ElMessage({
      type: 'success',
      message: '订单关闭成功!'
    })

    const response = await getOrderDetailByIdAPI(id.value!)
    order.value = response.data
  } catch (error) {
    if (error !== 'cancel') {
      console.error('关闭订单失败:', error)
    }
  }
}

// 显示备注订单对话框
const showMarkOrderDialog = () => {
  markOrderDialogVisible.value = true
  markInfo.value.id = id.value!
  markInfo.value.note = ''
}

// 处理备注订单
const handleMarkOrder = async () => {
  await ElMessageBox.confirm('是否要备注订单?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await orderUpdateNoteAPI({ id: markInfo.value.id, note: markInfo.value.note, status: order.value.status })
  markOrderDialogVisible.value = false
  ElMessage({
    type: 'success',
    message: '订单备注成功!'
  })
  const response = await getOrderDetailByIdAPI(id.value!)
  order.value = response.data
}

// 处理删除订单
const handleDeleteOrder = async () => {
  try {
    await ElMessageBox.confirm('是否要进行该删除操作?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await orderDeleteByIdsAPI({ ids: id.value!.toString() })
    ElMessage({
      message: '删除成功！',
      type: 'success',
      duration: 1000
    })
    router.back()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除订单失败:', error)
    }
  }
}

// 显示物流对话框
const showLogisticsDialog = () => {
  logisticsDialogVisible.value = true
}

</script>

<template>
  <div class="detail-container">
    <div>
      <el-steps :active="formatStepStatus(order.status)" finish-status="success" align-center>
        <el-step title="提交订单" :description="order.createTime ? formatDateTime(order.createTime) : ''"></el-step>
        <el-step title="支付订单" :description="order.paymentTime ? formatDateTime(order.paymentTime) : ''"></el-step>
        <el-step title="平台发货" :description="order.deliveryTime ? formatDateTime(order.deliveryTime) : ''"></el-step>
        <el-step title="确认收货" :description="order.receiveTime ? formatDateTime(order.receiveTime) : ''"></el-step>
        <el-step title="完成评价" :description="order.commentTime ? formatDateTime(order.commentTime) : ''"></el-step>
      </el-steps>
    </div>
    <el-card shadow="never" style="margin-top: 15px">
      <div class="operate-container">
        <el-icon class="color-danger el-icon-middle" style="margin-left: 15px;">
          <Warning />
        </el-icon>
        <span class="color-danger">当前订单状态：{{ formatStatus(order.status) }}</span>
        <div class="operate-button-container" v-show="order.status === 0">
          <el-button size="small" @click="showUpdateReceiverDialog">修改收货人信息</el-button>
          <el-button size="small" @click="showUpdateMoneyDialog">修改费用信息</el-button>
          <el-button size="small" @click="showMessageDialog">发送站内信</el-button>
          <el-button size="small" @click="showCloseOrderDialog">关闭订单</el-button>
          <el-button size="small" @click="showMarkOrderDialog">备注订单</el-button>
        </div>
        <div class="operate-button-container" v-show="order.status === 1">
          <el-button size="small" @click="showUpdateReceiverDialog">修改收货人信息</el-button>
          <el-button size="small" @click="showMessageDialog">发送站内信</el-button>
          <el-button size="small">取消订单</el-button>
          <el-button size="small" @click="showMarkOrderDialog">备注订单</el-button>
        </div>
        <div class="operate-button-container" v-show="order.status === 2 || order.status === 3">
          <el-button size="small" @click="showLogisticsDialog">订单跟踪</el-button>
          <el-button size="small" @click="showMessageDialog">发送站内信</el-button>
          <el-button size="small" @click="showMarkOrderDialog">备注订单</el-button>
        </div>
        <div class="operate-button-container" v-show="order.status === 4">
          <el-button size="small" @click="handleDeleteOrder">删除订单</el-button>
          <el-button size="small" @click="showMarkOrderDialog">备注订单</el-button>
        </div>
      </div>
      <!-- 其余模板内容保持不变，由于篇幅限制，这里省略了大部分模板代码 -->
      <!-- 请参考原始文件补充完整模板内容 -->
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">基本信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="4" class="table-cell-title">订单编号</el-col>
          <el-col :span="4" class="table-cell-title">发货单流水号</el-col>
          <el-col :span="4" class="table-cell-title">用户账号</el-col>
          <el-col :span="4" class="table-cell-title">支付方式</el-col>
          <el-col :span="4" class="table-cell-title">订单来源</el-col>
          <el-col :span="4" class="table-cell-title">订单类型</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell">{{ order.orderSn }}</el-col>
          <el-col :span="4" class="table-cell">暂无</el-col>
          <el-col :span="4" class="table-cell">{{ order.memberUsername }}</el-col>
          <el-col :span="4" class="table-cell">{{ formatPayType(order.payType) }}</el-col>
          <el-col :span="4" class="table-cell">{{ formatSourceType(order.sourceType) }}</el-col>
          <el-col :span="4" class="table-cell">{{ formatOrderType(order.orderType) }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell-title">配送方式</el-col>
          <el-col :span="4" class="table-cell-title">物流单号</el-col>
          <el-col :span="4" class="table-cell-title">自动确认收货时间</el-col>
          <el-col :span="4" class="table-cell-title">订单可得优币</el-col>
          <el-col :span="4" class="table-cell-title">订单可得成长值</el-col>
          <el-col :span="4" class="table-cell-title">活动信息</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell">{{ formatNull(order.deliveryCompany) }}</el-col>
          <el-col :span="4" class="table-cell">{{ formatNull(order.deliverySn) }}</el-col>
          <el-col :span="4" class="table-cell">{{ order.autoConfirmDay }}天</el-col>
          <el-col :span="4" class="table-cell">{{ order.integration }}</el-col>
          <el-col :span="4" class="table-cell">{{ order.growth }}</el-col>
          <el-col :span="4" class="table-cell">
            <el-popover placement="top-start" title="活动信息" width="200" trigger="hover" :content="order.promotionInfo">
              <template v-slot:reference>
                <span>{{ formatLongText(order.promotionInfo) }}</span>
              </template>
            </el-popover>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">收货人信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">收货人</el-col>
          <el-col :span="6" class="table-cell-title">手机号码</el-col>
          <el-col :span="6" class="table-cell-title">邮政编码</el-col>
          <el-col :span="6" class="table-cell-title">收货地址</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">{{ order.receiverName }}</el-col>
          <el-col :span="6" class="table-cell">{{ order.receiverPhone }}</el-col>
          <el-col :span="6" class="table-cell">{{ order.receiverPostCode }}</el-col>
          <el-col :span="6" class="table-cell">{{ formatAddress(order) }}</el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">商品信息</span>
      </div>
      <el-table ref="orderItemTable" :data="order.orderItemList" style="width: 100%;margin-top: 20px" border>
        <el-table-column label="商品图片" width="120" align="center">
          <template v-slot="scope">
            <img :src="scope.row.productPic" style="height: 80px">
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template v-slot="scope">
            <p>{{ scope.row.productName }}</p>
            <p>品牌：{{ scope.row.productBrand }}</p>
          </template>
        </el-table-column>
        <el-table-column label="价格/货号" width="160" align="center">
          <template v-slot="scope">
            <p>价格：￥{{ scope.row.productPrice }}</p>
            <p>货号：{{ scope.row.productSn }}</p>
          </template>
        </el-table-column>
        <el-table-column label="属性" width="160" align="center">
          <template v-slot="scope">
            {{ formatProductAttr(scope.row.productAttr) }}
          </template>
        </el-table-column>
        <el-table-column label="数量" width="120" align="center">
          <template v-slot="scope">
            {{ scope.row.productQuantity }}
          </template>
        </el-table-column>
        <el-table-column label="小计" width="120" align="center">
          <template v-slot="scope">
            ￥{{ scope.row.productPrice * scope.row.productQuantity }}
          </template>
        </el-table-column>
      </el-table>
      <div style="float: right;margin: 20px">
        合计：<span class="color-danger">￥{{ order.totalAmount }}</span>
      </div>
      <div style="margin-top: 60px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">费用信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">商品合计</el-col>
          <el-col :span="6" class="table-cell-title">运费</el-col>
          <el-col :span="6" class="table-cell-title">优惠券</el-col>
          <el-col :span="6" class="table-cell-title">积分抵扣</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">￥{{ order.totalAmount }}</el-col>
          <el-col :span="6" class="table-cell">￥{{ order.freightAmount }}</el-col>
          <el-col :span="6" class="table-cell">-￥{{ order.couponAmount }}</el-col>
          <el-col :span="6" class="table-cell">-￥{{ order.integrationAmount }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-title">活动优惠</el-col>
          <el-col :span="6" class="table-cell-title">折扣金额</el-col>
          <el-col :span="6" class="table-cell-title">订单总金额</el-col>
          <el-col :span="6" class="table-cell-title">应付款金额</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">-￥{{ order.promotionAmount }}</el-col>
          <el-col :span="6" class="table-cell">-￥{{ order.discountAmount }}</el-col>
          <el-col :span="6" class="table-cell">
            <span class="color-danger">￥{{ order.totalAmount + order.freightAmount }}</span>
          </el-col>
          <el-col :span="6" class="table-cell">
            <span class="color-danger">￥{{ order.payAmount + order.freightAmount - order.discountAmount }}</span>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">操作信息</span>
      </div>
      <el-table style="margin-top: 20px;width: 100%" ref="orderHistoryTable" :data="order.historyList" border>
        <el-table-column label="操作者" width="120" align="center">
          <template v-slot="scope">
            {{ scope.row.operateMan }}
          </template>
        </el-table-column>
        <el-table-column label="操作时间" width="160" align="center">
          <template v-slot="scope">
            {{ formatDateTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="订单状态" width="120" align="center">
          <template v-slot="scope">
            {{ formatStatus(scope.row.orderStatus) }}
          </template>
        </el-table-column>
        <el-table-column label="付款状态" width="120" align="center">
          <template v-slot="scope">
            {{ formatPayStatus(scope.row.orderStatus) }}
          </template>
        </el-table-column>
        <el-table-column label="发货状态" width="120" align="center">
          <template v-slot="scope">
            {{ formatDeliverStatus(scope.row.orderStatus) }}
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template v-slot="scope">
            {{ scope.row.note }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="修改收货人信息" v-model="receiverDialogVisible" width="40%">
      <el-form :model="receiverInfo" ref="receiverInfoForm" label-width="150px">
        <el-form-item label="收货人姓名：">
          <el-input v-model="receiverInfo.receiverName" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-input v-model="receiverInfo.receiverPhone" style="width: 200px">
          </el-input>
        </el-form-item>
        <el-form-item label="邮政编码：">
          <el-input v-model="receiverInfo.receiverPostCode" style="width: 200px">
          </el-input>
        </el-form-item>
        <el-form-item label="所在区域：">
          <el-cascader v-model="selectedRegions" :options="(pcaTextArr as CascaderOption[])"
            @change="onSelectRegionChange" placeholder="请选择省市区"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址：">
          <el-input v-model="receiverInfo.receiverDetailAddress" type="textarea" :rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="receiverDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleUpdateReceiverInfo">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="修改费用信息" v-model="moneyDialogVisible" width="40%">
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">商品合计</el-col>
          <el-col :span="6" class="table-cell-title">运费</el-col>
          <el-col :span="6" class="table-cell-title">优惠券</el-col>
          <el-col :span="6" class="table-cell-title">积分抵扣</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">￥{{ order.totalAmount }}</el-col>
          <el-col :span="6" class="table-cell">
            <el-input v-model.number="moneyInfo.freightAmount" size="small"><template
                v-slot:prepend>￥</template></el-input>
          </el-col>
          <el-col :span="6" class="table-cell">-￥{{ order.couponAmount }}</el-col>
          <el-col :span="6" class="table-cell">-￥{{ order.integrationAmount }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-title">活动优惠</el-col>
          <el-col :span="6" class="table-cell-title">折扣金额</el-col>
          <el-col :span="6" class="table-cell-title">订单总金额</el-col>
          <el-col :span="6" class="table-cell-title">应付款金额</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">-￥{{ order.promotionAmount }}</el-col>
          <el-col :span="6" class="table-cell">
            <el-input v-model.number="moneyInfo.discountAmount" size="small"><template
                v-slot:prepend>-￥</template></el-input>
          </el-col>
          <el-col :span="6" class="table-cell">
            <span class="color-danger">￥{{ order.totalAmount + moneyInfo.freightAmount }}</span>
          </el-col>
          <el-col :span="6" class="table-cell">
            <span class="color-danger">￥{{ order.payAmount + moneyInfo.freightAmount - moneyInfo.discountAmount
            }}</span>
          </el-col>
        </el-row>
      </div>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="moneyDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleUpdateMoneyInfo">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="发送站内信" v-model="messageDialogVisible" width="40%">
      <el-form :model="message" ref="receiverInfoForm" label-width="150px">
        <el-form-item label="标题：">
          <el-input v-model="message.title" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="内容：">
          <el-input v-model="message.content" type="textarea" :rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="messageDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSendMessage">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="关闭订单" v-model:visible="closeDialogVisible" width="40%">
      <el-form :model="closeInfo" label-width="150px">
        <el-form-item label="操作备注：">
          <el-input v-model="closeInfo.note" type="textarea" :rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="closeDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleCloseOrder">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="备注订单" v-model="markOrderDialogVisible" width="40%">
      <el-form :model="markInfo" label-width="150px">
        <el-form-item label="操作备注：">
          <el-input v-model="markInfo.note" type="textarea" :rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="markOrderDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleMarkOrder">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <logistics-dialog v-model="logisticsDialogVisible"></logistics-dialog>
  </div>
</template>

<style scoped>
.detail-container {
  width: 80%;
  padding: 20px 20px 20px 20px;
  margin: 20px auto;
}

.operate-container {
  background: #F2F6FC;
  height: 80px;
  margin: -20px -20px 0;
  line-height: 80px;
}

.operate-button-container {
  float: right;
  margin-right: 20px
}

.table-layout {
  margin-top: 20px;
  border-left: 1px solid #DCDFE6;
  border-top: 1px solid #DCDFE6;
}

.table-cell {
  height: 60px;
  line-height: 40px;
  border-right: 1px solid #DCDFE6;
  border-bottom: 1px solid #DCDFE6;
  padding: 10px;
  font-size: 14px;
  color: #606266;
  text-align: center;
  overflow: hidden;
}

.table-cell-title {
  border-right: 1px solid #DCDFE6;
  border-bottom: 1px solid #DCDFE6;
  padding: 10px;
  background: #F2F6FC;
  text-align: center;
  font-size: 14px;
  color: #303133;
}
</style>
