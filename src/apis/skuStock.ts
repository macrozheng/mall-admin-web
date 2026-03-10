import type { PmsSkuStock } from '@/types/skuStock'
import http from '@/utils/http'

/**
 * 根据商品ID及sku编码模糊搜索sku库存
 */
export function getSkuListByPidAPI(pid: number, params: { keyword?: string }) {
  return http<PmsSkuStock[]>({
    url: '/sku/' + pid,
    method: 'get',
    params: params,
  })
}

/**
 * 根据商品ID批量更新sku库存信息
 */
export function skuUpdateByPidAPI(pid: number, data: PmsSkuStock[]) {
  return http({
    url: '/sku/update/' + pid,
    method: 'post',
    data: data,
  })
}
