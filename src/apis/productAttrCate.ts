import type { CommonPage, PageParam } from '@/types/common'
import type {
  PmsProductAttributeCategory,
  PmsProductAttributeCategoryExt,
} from '@/types/productAttr'
import http from '@/utils/http'

/**
 * 获取所有商品属性分类及其下属性
 */
export function productAttributeCategoryListWithAttrAPI() {
  return http<PmsProductAttributeCategoryExt[]>({
    url: '/productAttribute/category/list/withAttr',
    method: 'get',
  })
}

/**
 * 分页获取所有商品属性分类
 */
export function getProductAttributeCategoryListAPI(params: PageParam) {
  return http<CommonPage<PmsProductAttributeCategory>>({
    url: '/productAttribute/category/list',
    method: 'get',
    params: params,
  })
}

/**
 * 添加商品属性分类
 */
export function productAttributeCategoryCreateAPI(name: string) {
  return http({
    url: '/productAttribute/category/create',
    method: 'post',
    params: { name: name },
  })
}

/**
 * 删除单个商品属性分类
 */
export function productAttributeCategoryDeleteById(id: number) {
  return http({
    url: '/productAttribute/category/delete/' + id,
    method: 'get',
  })
}

/**
 * 修改商品属性分类
 */
export function productAttributeCategoryUpdateAPI(id: number, name: string) {
  return http({
    url: '/productAttribute/category/update/' + id,
    method: 'post',
    params: { name: name },
  })
}
