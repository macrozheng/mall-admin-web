import type { CommonPage } from '@/types/common'
import type { RecommendProductQueryParam, SmsHomeRecommendProduct } from '@/types/recommendProduct'
import http from '@/utils/http'

/**
 * 分页查询首页新品
 */
export function getHomeRecommendProductListAPI(params: RecommendProductQueryParam) {
  return http<CommonPage<SmsHomeRecommendProduct>>({
    url: '/home/recommendProduct/list',
    method: 'get',
    params: params,
  })
}

/**
 * 批量修改首页新品状态
 */
export function homeRecommendProductUpdateRecommendStatusAPI(params: {
  ids: string
  recommendStatus: number
}) {
  return http({
    url: '/home/recommendProduct/update/recommendStatus',
    method: 'post',
    params: params,
  })
}

/**
 * 批量删除首页新品
 */
export function homeRecommendProductDeleteByIdsAPI(params: { ids: string }) {
  return http({
    url: '/home/recommendProduct/delete',
    method: 'post',
    params: params,
  })
}

/**
 * 批量添加首页新品
 */
export function homeRecommendProductCreateAPI(data: SmsHomeRecommendProduct[]) {
  return http({
    url: '/home/recommendProduct/create',
    method: 'post',
    data: data,
  })
}

/**
 * 根据ID修改首页新品排序
 */
export function homeRecommendProductUpdateSortByIdAPI(params: { id: number; sort: number }) {
  return http({
    url: '/home/recommendProduct/update/sort/' + params.id,
    method: 'post',
    params: params,
  })
}
