import type { OmsOrderSetting } from '@/types/orderSetting'
import http from '@/utils/http'

/**
 * 获取指定订单设置
 */
export function getOrderSettingByIdAPI(id: number) {
  return http<OmsOrderSetting>({
    url: '/orderSetting/' + id,
    method: 'get',
  })
}

/**
 * 修改指定订单设置
 */
export function orderSettingUpdateByIdAPI(id: number, data: OmsOrderSetting) {
  return http({
    url: '/orderSetting/update/' + id,
    method: 'post',
    data: data,
  })
}
