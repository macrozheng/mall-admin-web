import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { OmsOrder } from '@/types/order'

export const useOrderStore = defineStore('order', () => {
  // 批量发货时临时存储的订单列表（用于页面间传递数据）
  const deliverOrderList = ref<OmsOrder[]>([])

  // 设置需要传递的订单列表
  const setDeliverOrderList = (list: OmsOrder[]) => {
    deliverOrderList.value = list
  }

  return {
    deliverOrderList,
    setDeliverOrderList,
  }
})
