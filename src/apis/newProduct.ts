import type { CommonPage } from '@/types/common'
import type { NewProductQueryParam, SmsHomeNewProduct } from '@/types/newProduct'
import http from '@/utils/http'

/**
 * 分页查询首页新品
 */
export function getHomeNewProductListAPI(params: NewProductQueryParam) {
  return http<CommonPage<SmsHomeNewProduct>>({
    url: '/home/newProduct/list',
    method: 'get',
    params: params,
  })
}

/**
 * 批量修改首页新品状态
 */
export function homeNewProductUpdateRecommendStatusAPI(params: {
  ids: string
  recommendStatus: number
}) {
  return http({
    url: '/home/newProduct/update/recommendStatus',
    method: 'post',
    params: params,
  })
}

/**
 * 批量删除首页新品
 */
export function homeNewProductDeleteByIdsAPI(params: { ids: string }) {
  return http({
    url: '/home/newProduct/delete',
    method: 'post',
    params: params,
  })
}

/**
 * 批量添加首页新品
 */
export function homeNewProductCreateAPI(data: SmsHomeNewProduct[]) {
  return http({
    url: '/home/newProduct/create',
    method: 'post',
    data: data,
  })
}

/**
 * 根据ID修改首页新品排序
 */
export function homeNewProductUpdateSortByIdAPI(params: { id: number; sort: number }) {
  return http({
    url: '/home/newProduct/update/sort/' + params.id,
    method: 'post',
    params: params,
  })
}
