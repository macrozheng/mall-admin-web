<script setup lang="ts">
import { ref, computed } from 'vue'

// 定义组件的props
const props = defineProps({
  modelValue: Boolean
})

// 定义组件的emits
const emit = defineEmits(['update:modelValue'])

// 默认物流列表数据
const defaultLogisticsList = [
  { name: '订单已提交，等待付款', time: '2017-04-01 12:00:00 ' },
  { name: '订单付款成功', time: '2017-04-01 12:00:00 ' },
  { name: '在北京市进行下级地点扫描，等待付款', time: '2017-04-01 12:00:00 ' },
  { name: '在分拨中心广东深圳公司进行卸车扫描，等待付款', time: '2017-04-01 12:00:00 ' },
  { name: '在广东深圳公司进行发出扫描', time: '2017-04-01 12:00:00 ' },
  { name: '到达目的地网点广东深圳公司，快件将很快进行派送', time: '2017-04-01 12:00:00 ' },
  { name: '订单已签收，期待再次为您服务', time: '2017-04-01 12:00:00 ' }
]

// 物流列表数据
const logisticsList = ref(Object.assign([], defaultLogisticsList))

// 控制对话框显示的计算属性
const visible = computed({
  get() {
    return props.modelValue
  },
  set(visible) {
    emit('update:modelValue', visible)
  }
})

// 发出输入事件
const emitInput = (val: boolean) => {
  emit('update:modelValue', val)
}

// 处理关闭对话框
const handleClose = () => {
  emitInput(false)
}
</script>

<template>
  <el-dialog title="订单跟踪" v-model="visible" :before-close="handleClose" width="40%">
    <el-steps direction="vertical" :active="6" finish-status="success" space="50px">
      <el-step v-for="item in logisticsList" :key="item.name" :title="item.name" :description="item.time"></el-step>
    </el-steps>
  </el-dialog>
</template>

<style></style>
