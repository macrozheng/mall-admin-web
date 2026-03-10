import type { UmsMemberLevel } from '@/types/memberLevel'
import http from '@/utils/http'

/**
 * 查询所有会员等级
 */
export function getMemberLevelListAPI(params: { defaultStatus: number }) {
  return http<UmsMemberLevel[]>({
    url: '/memberLevel/list',
    method: 'get',
    params: params,
  })
}
