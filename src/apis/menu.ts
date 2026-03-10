import type { CommonPage, PageParam } from '@/types/common'
import type { UmsMenu, UmsMenuNode } from '@/types/menu'
import http from '@/utils/http'

/**
 *  树形结构返回所有菜单列表
 */
export function getMenuTreeListAPI() {
  return http<UmsMenuNode[]>({
    url: '/menu/treeList',
    method: 'get',
  })
}

/**
 * 根据上级菜单ID分页查询菜单
 */
export function getMenuListByParentIdAPI(parentId: number, params: PageParam) {
  return http<CommonPage<UmsMenu>>({
    url: '/menu/list/' + parentId,
    method: 'get',
    params: params,
  })
}

/**
 * 根据ID删除后台菜单
 */
export function deleteMenuByIdAPI(id: number) {
  return http({
    url: '/menu/delete/' + id,
    method: 'post',
  })
}

/**
 * 添加后台菜单
 */
export function menuCreateAPI(data: UmsMenu) {
  return http({
    url: '/menu/create',
    method: 'post',
    data: data,
  })
}

/**
 * 修改后台菜单
 */
export function updateMenu(id: number, data: UmsMenu) {
  return http({
    url: '/menu/update/' + id,
    method: 'post',
    data: data,
  })
}

/**
 * 根据ID获取菜单详情
 */
export function getMenuByIdAPI(id: number) {
  return http<UmsMenu>({
    url: '/menu/' + id,
    method: 'get',
  })
}

/**
 * 根据ID修改菜单显示状态
 */
export function menuUpdateHiddenByIdAPI(id: number, params: { hidden: number }) {
  return http({
    url: '/menu/updateHidden/' + id,
    method: 'post',
    params: params,
  })
}
