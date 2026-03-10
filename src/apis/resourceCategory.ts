import type { UmsResourceCategory } from '@/types/resource'
import http from '@/utils/http'

/**
 * 查询所有后台资源分类
 */
export function resourceCategoryListAllAPI() {
  return http<UmsResourceCategory[]>({
    url: '/resourceCategory/listAll',
    method: 'get',
  })
}

/**
 * 添加后台资源分类
 */
export function resourceCategoryCreateAPI(data: UmsResourceCategory) {
  return http({
    url: '/resourceCategory/create',
    method: 'post',
    data: data,
  })
}

/**
 * 修改后台资源分类
 */
export function resourceCategoryUpdateAPI(id: number, data: UmsResourceCategory) {
  return http({
    url: '/resourceCategory/update/' + id,
    method: 'post',
    data: data,
  })
}

/**
 * 根据ID删除后台资源分类
 */
export function resourceCategoryDeleteByIdAPI(id: number) {
  return http({
    url: '/resourceCategory/delete/' + id,
    method: 'post',
  })
}
