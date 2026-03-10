import type { CommonPage } from '@/types/common'
import type { PmsProduct, PmsProductParam, ProductQueryParam } from '@/types/product'
import http from '@/utils/http'

/**
 * 查询商品
 */
export function getProductListAPI(params: ProductQueryParam) {
  return http<CommonPage<PmsProduct>>({
    url: '/product/list',
    method: 'get',
    params: params,
  })
}

/**
 * 批量修改删除状态
 */
export function productUpdateDeleteStatusAPI(params: { ids: string; deleteStatus: number }) {
  return http({
    url: '/product/update/deleteStatus',
    method: 'post',
    params: params,
  })
}

/**
 * 批量设为新品
 */
export function productUpdateNewStatusAPI(params: { ids: string; newStatus: number }) {
  return http({
    url: '/product/update/newStatus',
    method: 'post',
    params: params,
  })
}

/**
 * 批量推荐商品
 */
export function productUpdateRecommendStatusAPI(params: { ids: string; recommendStatus: number }) {
  return http({
    url: '/product/update/recommendStatus',
    method: 'post',
    params: params,
  })
}

/**
 * 批量上下架商品
 */
export function productUpdatePublishStatusAPI(params: { ids: string; publishStatus: number }) {
  return http({
    url: '/product/update/publishStatus',
    method: 'post',
    params: params,
  })
}

/**
 * 创建商品
 */
export function productCreateAPI(data: PmsProductParam) {
  return http({
    url: '/product/create',
    method: 'post',
    data: data,
  })
}

/**
 * 根据ID修改商品信息
 */
export function productUpdateByIdAPI(id: number, data: PmsProductParam) {
  return http({
    url: '/product/update/' + id,
    method: 'post',
    data: data,
  })
}

/**
 * 根据商品id获取商品编辑信息
 */
export function getPruductUpdateInfoAPI(id: number) {
  return http<PmsProductParam>({
    url: '/product/updateInfo/' + id,
    method: 'get',
  })
}
