import type { CommonPage } from '@/types/common'
import type {
  OmsOrderReturnApply,
  OmsOrderReturnApplyResult,
  OmsUpdateStatusParam,
  ReturnApplyQueryParam,
} from '@/types/returnApply'
import http from '@/utils/http'

/**
 * 分页查询退货申请
 */
export function getReturnApplyListAPI(params: ReturnApplyQueryParam) {
  return http<CommonPage<OmsOrderReturnApply>>({
    url: '/returnApply/list',
    method: 'get',
    params: params,
  })
}

/**
 * 批量删除退货申请
 */
export function returnApplyDeleteByIdsAPI(params: { ids: string }) {
  return http({
    url: '/returnApply/delete',
    method: 'post',
    params: params,
  })
}

/**
 * 修改退货申请状态
 */
export function returnApplyUpdateStatusAPI(id: number, data: OmsUpdateStatusParam) {
  return http({
    url: '/returnApply/update/status/' + id,
    method: 'post',
    data: data,
  })
}

/**
 * 获取退货申请详情
 */
export function getReturnApplyByIdAPI(id: number) {
  return http<OmsOrderReturnApplyResult>({
    url: '/returnApply/' + id,
    method: 'get',
  })
}
