import type { CommonPage } from '@/types/common'
import type { HomeSubjectQueryParam, SmsHomeRecommendSubject } from '@/types/homeSubject'
import http from '@/utils/http'

/**
 * 分页查询专题推荐
 */
export function getHomeRecommendSubjectListAPI(params: HomeSubjectQueryParam) {
  return http<CommonPage<SmsHomeRecommendSubject>>({
    url: '/home/recommendSubject/list',
    method: 'get',
    params: params,
  })
}

/**
 * 批量修改专题推荐状态
 */
export function homeRecommendSubjectUpdateRecommendStatusAPI(params: {
  /** 推荐ID */
  ids: string
  /** 推荐状态 */
  recommendStatus: number
}) {
  return http({
    url: '/home/recommendSubject/update/recommendStatus',
    method: 'post',
    params: params,
  })
}

/**
 * 批量删除专题推荐
 */
export function homeRecommendSubjectDeleteByIdsAPI(params: { ids: string }) {
  return http({
    url: '/home/recommendSubject/delete',
    method: 'post',
    params: params,
  })
}

/**
 * 批量添加首页专题推荐
 */
export function homeRecommendSubjectCreateAPI(data: SmsHomeRecommendSubject[]) {
  return http({
    url: '/home/recommendSubject/create',
    method: 'post',
    data: data,
  })
}

/**
 * 修改专题推荐排序
 */
export function homeRecommendSubjectUpdateSortAPI(params: { id: number; sort: number }) {
  return http({
    url: '/home/recommendSubject/update/sort/' + params.id,
    method: 'post',
    params: params,
  })
}
