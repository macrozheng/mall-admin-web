import type { CommonPage, PageParam } from '@/types/common'
import type { UmsMenu } from '@/types/menu'
import type { UmsRole } from '@/types/role'
import http from '@/utils/http'

/**
 * 获取所有角色列表
 */
export function getRoleListAllAPI() {
  return http<UmsRole[]>({
    url: '/role/listAll',
    method: 'get',
  })
}

/**
 * 根据角色名称分页获取角色列表
 */
export function getRoleListAPI(params: PageParam) {
  return http<CommonPage<UmsRole>>({
    url: '/role/list',
    method: 'get',
    params: params,
  })
}

/**
 * 添加角色
 */
export function roleCreateAPI(data: UmsRole) {
  return http({
    url: '/role/create',
    method: 'post',
    data: data,
  })
}

/**
 * 根据ID修改角色
 */
export function roleUpdateByIdAPI(id: number, data: UmsRole) {
  return http({
    url: '/role/update/' + id,
    method: 'post',
    data: data,
  })
}

/**
 * 修改角色状态启用状态
 */
export function roleUpdateStatusAPI(id: number, params: { status: number }) {
  return http({
    url: '/role/updateStatus/' + id,
    method: 'post',
    params: params,
  })
}

/**
 * 根据ids批量删除角色
 */
export function roleDeleteByIdsAPI(params: { ids: string }) {
  return http({
    url: '/role/delete',
    method: 'post',
    params: params,
  })
}

/**
 * 根据角色ID获取菜单列表
 */
export function roleListMenuByRoleIdAPI(id: number) {
  return http<UmsMenu[]>({
    url: '/role/listMenu/' + id,
    method: 'get',
  })
}

/**
 * 给角色分配菜单
 */
export function roleAllocMenuAPI(params: {
  /** 角色ID */
  roleId: number
  /** 菜单ID，多个以逗号分割 */
  menuIds: string
}) {
  return http({
    url: '/role/allocMenu',
    method: 'post',
    params: params,
  })
}

/**
 * 获取角色相关资源
 */
export function roleListResourceById(id: number) {
  return http({
    url: '/role/listResource/' + id,
    method: 'get',
  })
}

/**
 * 给角色分配资源
 */
export function roleAllocResourceAPI(params: {
  /** 角色ID */
  roleId: number
  /** 资源ID，多个以逗号分割 */
  resourceIds: string
}) {
  return http({
    url: '/role/allocResource',
    method: 'post',
    params: params,
  })
}
