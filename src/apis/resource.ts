import type { CommonPage } from '@/types/common'
import type { ResourceQueryParam, UmsResource } from '@/types/resource'
import http from '@/utils/http'

/**
 * 查询所有后台资源
 */
export function fetchAllResourceList() {
  return http<UmsResource[]>({
    url: '/resource/listAll',
    method: 'get',
  })
}

/**
 * 分页模糊查询后台资源
 */
export function getResourceListAPI(params: ResourceQueryParam) {
  return http<CommonPage<UmsResource>>({
    url: '/resource/list',
    method: 'get',
    params: params,
  })
}

/**
 * 添加后台资源
 */
export function resourceCreateAPI(data: UmsResource) {
  return http({
    url: '/resource/create',
    method: 'post',
    data: data,
  })
}

/**
 * 修改后台资源
 */
export function resourceUpdateAPI(id: number, data: UmsResource) {
  return http({
    url: '/resource/update/' + id,
    method: 'post',
    data: data,
  })
}

/**
 * 根据ID删除后台资源
 */
export function resourceDeleteByIdAPI(id: number) {
  return http({
    url: '/resource/delete/' + id,
    method: 'post',
  })
}
