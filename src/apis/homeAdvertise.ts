import type { CommonPage } from '@/types/common'
import type { HomeAdvertiseQueryParam, SmsHomeAdvertise } from '@/types/homeAdvertist'
import http from '@/utils/http'

/**
 * 分页查询首页广告
 */
export function getHomeAdvertiseListAPI(params: HomeAdvertiseQueryParam) {
  return http<CommonPage<SmsHomeAdvertise>>({
    url: '/home/advertise/list',
    method: 'get',
    params: params,
  })
}

/**
 * 修改上下线状态
 */
export function homeAdvertiseUpdateStatusAPI(params: { id: number; status: number }) {
  return http({
    url: '/home/advertise/update/status/' + params.id,
    method: 'post',
    params: params,
  })
}

/**
 * 批量删除广告
 */
export function deleteHomeAdvertiseAPI(params: { ids: string }) {
  return http({
    url: '/home/advertise/delete',
    method: 'post',
    params: params,
  })
}

/**
 * 添加广告
 */
export function homeAdvertiseCreateAPI(data: SmsHomeAdvertise) {
  return http({
    url: '/home/advertise/create',
    method: 'post',
    data: data,
  })
}

/**
 * 根据ID获取广告详情
 */
export function getHomeAdvertiseByIdAPI(id: number) {
  return http({
    url: '/home/advertise/' + id,
    method: 'get',
  })
}

/**
 * 根据ID修改广告
 */
export function homeAdvertiseUpdateAPI(id: number, data: SmsHomeAdvertise) {
  return http({
    url: '/home/advertise/update/' + id,
    method: 'post',
    data: data,
  })
}
