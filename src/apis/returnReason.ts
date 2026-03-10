import type { CommonPage, PageParam } from '@/types/common'
import type { OmsOrderReturnReason } from '@/types/returnReason'
import http from '@/utils/http'

/**
 * 分页查询退货原因
 */
export function getReturnReasonListAPI(params: PageParam) {
  return http<CommonPage<OmsOrderReturnReason>>({
    url: '/returnReason/list',
    method: 'get',
    params: params,
  })
}

/**
 * 批量删除退货原因
 */
export function returnReasonDeleteByIdsAPI(params: { ids: string }) {
  return http({
    url: '/returnReason/delete',
    method: 'post',
    params: params,
  })
}

/**
 * 修改退货原因启用状态
 */
export function returnReasonUpdateStatusAPI(params: { ids: string; status: number }) {
  return http({
    url: '/returnReason/update/status',
    method: 'post',
    params: params,
  })
}

/**
 * 添加退货原因
 */
export function returnReasonCreateAPI(data: OmsOrderReturnReason) {
  return http({
    url: '/returnReason/create',
    method: 'post',
    data: data,
  })
}

/**
 * 获取单个退货原因详情信息
 */
export function getReturnReasonByIdAPI(id: number) {
  return http<OmsOrderReturnReason>({
    url: '/returnReason/' + id,
    method: 'get',
  })
}

/**
 * 修改退货原因
 */
export function returnReasonUpdateAPI(id: number, data: OmsOrderReturnReason) {
  return http({
    url: '/returnReason/update/' + id,
    method: 'post',
    data: data,
  })
}
