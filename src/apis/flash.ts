import type { PageParam } from '@/types/common'
import type { SmsFlashPromotion } from '@/types/flash'
import http from '@/utils/http'

/**
 * 根据活动名称分页查询活动
 */
export function getFlashListAPI(params: PageParam) {
  return http({
    url: '/flash/list',
    method: 'get',
    params: params,
  })
}
/**
 * 修改活动上下线状态
 */
export function flashUpdateStatusByIdAPI(id: number, params: { status: number }) {
  return http({
    url: '/flash/update/status/' + id,
    method: 'post',
    params: params,
  })
}
/**
 * 根据ID删除活动
 */
export function flashDeleteByIdAPI(id: number) {
  return http({
    url: '/flash/delete/' + id,
    method: 'post',
  })
}
/**
 * 添加活动
 */
export function flashCreateAPI(data: SmsFlashPromotion) {
  return http({
    url: '/flash/create',
    method: 'post',
    data: data,
  })
}
/**
 * 根据ID修改活动
 */
export function flashUpdateByIdAPI(id: number, data: SmsFlashPromotion) {
  return http({
    url: '/flash/update/' + id,
    method: 'post',
    data: data,
  })
}
