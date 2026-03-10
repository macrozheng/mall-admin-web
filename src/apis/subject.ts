import type { CommonPage, PageParam } from '@/types/common'
import type { CmsSubject } from '@/types/subject'
import http from '@/utils/http'

/**
 * 获取全部商品专题
 */
export function getSubjectListAllAPI() {
  return http<CmsSubject[]>({
    url: '/subject/listAll',
    method: 'get',
  })
}

/**
 * 根据专题名称分页获取商品专题
 */
export function getSubjectListAPI(params: PageParam) {
  return http<CommonPage<CmsSubject>>({
    url: '/subject/list',
    method: 'get',
    params: params,
  })
}
