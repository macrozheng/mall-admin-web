import type { CommonPage } from '@/types/common'
import type {
  OmsMoneyInfoParam,
  OmsOrder,
  OmsOrderDeliveryParam,
  OmsOrderDetail,
  OmsReceiverInfoParam,
  OrderQueryParam,
} from '@/types/order'
import http from '@/utils/http'

/**
 * 分页查询订单列表
 */
export function getOrderListAPI(params: OrderQueryParam) {
  return http<CommonPage<OmsOrder>>({
    url: '/order/list',
    method: 'get',
    params: params,
  })
}

/**
 * 批量关闭订单
 */
export function orderUpdateCloseAPI(params: { ids: string; note: string }) {
  return http({
    url: '/order/update/close',
    method: 'post',
    params: params,
  })
}

/**
 * 批量删除订单
 */
export function orderDeleteByIdsAPI(params: { ids: string }) {
  return http({
    url: '/order/delete',
    method: 'post',
    params: params,
  })
}

/**
 * 批量发货
 */
export function orderUpdateDeliveryAPI(data: OmsOrderDeliveryParam[]) {
  return http({
    url: '/order/update/delivery',
    method: 'post',
    data: data,
  })
}

/**
 * 获取订单详情：订单信息、商品信息、操作记录
 */
export function getOrderDetailByIdAPI(id: number) {
  return http<OmsOrderDetail>({
    url: '/order/' + id,
    method: 'get',
  })
}

/**
 * 修改收货人信息
 */
export function orderUpdateReceiverInfoAPI(data: OmsReceiverInfoParam) {
  return http({
    url: '/order/update/receiverInfo',
    method: 'post',
    data: data,
  })
}

/**
 * 修改订单费用信息
 */
export function orderUpdateMoneyInfoAPI(data: OmsMoneyInfoParam) {
  return http({
    url: '/order/update/moneyInfo',
    method: 'post',
    data: data,
  })
}

/**
 * 备注订单
 */
export function orderUpdateNoteAPI(params: { id: number; note: string; status: number }) {
  return http({
    url: '/order/update/note',
    method: 'post',
    params: params,
  })
}
