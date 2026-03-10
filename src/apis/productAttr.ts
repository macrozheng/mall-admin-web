import type { CommonPage, PageParam } from '@/types/common'
import type { PmsProductAttribute, ProductAttrInfo } from '@/types/productAttr'
import http from '@/utils/http'

/**
 * 根据商品分类的ID获取商品属性及属性分类ID
 */
export function getProductAttrInfoByCateIdAPI(cateId: number) {
  return http<ProductAttrInfo[]>({
    url: '/productAttribute/attrInfo/' + cateId,
    method: 'get',
  })
}

/**
 * 根据分类ID查询属性列表或参数列表
 */
export function getProductAttributeListAPI(cid: number, params: PageParam & { type: number }) {
  return http<CommonPage<PmsProductAttribute>>({
    url: '/productAttribute/list/' + cid,
    method: 'get',
    params: params,
  })
}

/**
 * 批量删除商品属性
 */
export function productAttributeDeleteByIds(params: { ids: string }) {
  return http({
    url: '/productAttribute/delete',
    method: 'post',
    params: params,
  })
}

/**
 * 添加商品属性信息
 */
export function productAttributeCreateAPI(data: PmsProductAttribute) {
  return http({
    url: '/productAttribute/create',
    method: 'post',
    data: data,
  })
}

/**
 * 修改商品属性信息
 */
export function productAttributeUpdateAPI(id: number, data: PmsProductAttribute) {
  return http({
    url: '/productAttribute/update/' + id,
    method: 'post',
    data: data,
  })
}

/**
 * 根据ID查询商品属性
 */
export function getProductAttributeByIdAPI(id: number) {
  return http<PmsProductAttribute>({
    url: '/productAttribute/' + id,
    method: 'get',
  })
}
