import type { SmsFlashPromotionSession } from '@/types/flash'
import http from '@/utils/http'

/**
 * 获取全部可选场次及其数量
 */
export function getFlashSessionSelectListAPI(params: { flashPromotionId: number }) {
  return http<SmsFlashPromotionSession[]>({
    url: '/flashSession/selectList',
    method: 'get',
    params: params,
  })
}

/**
 * 获取全部场次
 */
export function getFlashSessionListAPI() {
  return http<SmsFlashPromotionSession[]>({
    url: '/flashSession/list',
    method: 'get',
  })
}

/**
 * 根据ID修改场次启用状态
 */
export function flashSessionUpdateStatusByIdAPI(id: number, params: { status: number }) {
  return http({
    url: '/flashSession/update/status/' + id,
    method: 'post',
    params: params,
  })
}

/**
 * 根据ID删除场次
 * @param id
 * @returns
 */
export function flashSessionDeleteByIdAPI(id: number) {
  return http({
    url: '/flashSession/delete/' + id,
    method: 'post',
  })
}

/**
 * 添加场次
 */
export function flashSessionCreateAPI(data: SmsFlashPromotionSession) {
  return http({
    url: '/flashSession/create',
    method: 'post',
    data: data,
  })
}

/**
 * 修改场次
 */
export function flashSessionUpdateByIdAPI(id: number, data: SmsFlashPromotionSession) {
  return http({
    url: '/flashSession/update/' + id,
    method: 'post',
    data: data,
  })
}
