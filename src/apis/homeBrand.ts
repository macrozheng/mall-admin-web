import type { CommonPage } from '@/types/common'
import type { HomeBrandQueryParam, SmsHomeBrand } from '@/types/homeBrand'
import http from '@/utils/http'

/**
 * 分页查询推荐品牌
 */
export function getHomeBrandListAPI(params: HomeBrandQueryParam) {
  return http<CommonPage<SmsHomeBrand>>({
    url: '/home/brand/list',
    method: 'get',
    params: params,
  })
}

/**
 * 批量修改推荐品牌状态
 */
export function homeBrandUpdateRecommendStatusAPI(params: {
  /** 品牌推荐ID */
  ids: string
  /** 品牌推荐状态 */
  recommendStatus: number
}) {
  return http({
    url: '/home/brand/update/recommendStatus',
    method: 'post',
    params: params,
  })
}

/**
 * 批量删除推荐品牌
 */
export function homeBrandDeleteByIdsAPI(params: { ids: string }) {
  return http({
    url: '/home/brand/delete',
    method: 'post',
    params: params,
  })
}

/**
 * 添加首页推荐品牌
 */
export function homeBrandCreateAPI(data: SmsHomeBrand[]) {
  return http({
    url: '/home/brand/create',
    method: 'post',
    data: data,
  })
}

/**
 * 修改推荐品牌排序
 */
export function homeBrandUpdateSortAPI(params: { id: number; sort: number }) {
  return http({
    url: '/home/brand/update/sort/' + params.id,
    method: 'post',
    params: params,
  })
}
