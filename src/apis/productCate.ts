import type { CommonPage, PageParam } from '@/types/common'
import type { PmsProductCategory, PmsProductCategoryExt } from '@/types/productCate'
import http from '@/utils/http'

/**
 * 查询所有一级分类及子分类
 */
export function getProductCategoryListWithChildrenAPI() {
  return http<PmsProductCategoryExt[]>({
    url: '/productCategory/list/withChildren',
    method: 'get',
  })
}

/**
 * 分页查询商品分类
 */
export function getProductCategoryListAPI(parentId: number, params: PageParam) {
  return http<CommonPage<PmsProductCategory>>({
    url: '/productCategory/list/' + parentId,
    method: 'get',
    params: params,
  })
}

/**
 * 根据ID删除商品分类
 */
export function productCategoryDeleteByIdAPI(id: number) {
  return http({
    url: '/productCategory/delete/' + id,
    method: 'post',
  })
}

/**
 * 添加商品分类
 */
export function productCategoryCreateAPI(data: PmsProductCategory) {
  return http({
    url: '/productCategory/create',
    method: 'post',
    data: data,
  })
}

/**
 * 修改商品分类
 */
export function productCategoryUpdateByIdAPI(id: number, data: PmsProductCategory) {
  return http({
    url: '/productCategory/update/' + id,
    method: 'post',
    data: data,
  })
}

/**
 * 根据ID获取商品分类
 */
export function getProductCategoryByIdAPI(id: number) {
  return http<PmsProductCategory>({
    url: '/productCategory/' + id,
    method: 'get',
  })
}

/**
 * 批量修改显示状态
 */
export function productCategoryUpdateShowStatusAPI(params: { ids: string; showStatus: number }) {
  return http({
    url: '/productCategory/update/showStatus',
    method: 'post',
    params: params,
  })
}

/**
 * 批量修改导航栏显示状态
 */
export function productCategoryUpdateNavStatusAPI(params: { ids: string; navStatus: number }) {
  return http({
    url: '/productCategory/update/navStatus',
    method: 'post',
    params: params,
  })
}
