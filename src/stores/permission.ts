import { defineStore } from 'pinia'
import { shallowRef } from 'vue'
import { asyncRouterMap, constantRouterMap } from '@/router/index'
import type { UmsMenu } from '@/types/menu'
import type { RouteRecordExt } from '@/types/router'

//判断是否有权限访问该菜单
function hasPermission(menus: UmsMenu[], route: RouteRecordExt) {
  if (route.name) {
    const currMenu = getMenu(route.name as string, menus)
    if (currMenu != null) {
      //设置菜单的标题、图标和可见性
      if (currMenu.title != null && currMenu.title !== '') {
        route.meta!.title = currMenu.title
      }
      if (currMenu.icon != null && currMenu.title !== '') {
        route.meta!.icon = currMenu.icon
      }
      if (currMenu.hidden != null) {
        route.hidden = currMenu.hidden !== 0
      }
      if (currMenu.sort != null) {
        route.sort = currMenu.sort
      }
      return true
    } else {
      route.sort = 0
      if (route.hidden !== undefined && route.hidden === true) {
        route.sort = -1
        return true
      } else {
        return false
      }
    }
  } else {
    return true
  }
}

// 根据路由名称获取菜单
function getMenu(name: string, menus: UmsMenu[]) {
  return menus.find(menu => name === menu.name) || null
}

// 对菜单进行排序
function sortRouters(accessedRouters: RouteRecordExt[]) {
  accessedRouters.forEach(router => {
    if (router.children && router.children.length > 0) {
      router.children.sort((a, b) => compare(a, b))
    }
  })
  accessedRouters.sort((a, b) => compare(a, b))
}

// 降序比较函数
function compare(a: RouteRecordExt, b: RouteRecordExt) {
  if (a.sort && b.sort) {
    return b.sort - a.sort
  } else {
    return 0
  }
}

export const usePermissionStore = defineStore('permission', () => {
  // 所有路由，静态路由+动态路由
  const routers = shallowRef(constantRouterMap)
  // 有权限访问的动态路由
  const addRouters = shallowRef<RouteRecordExt[]>([])
  // 是否为测试模式
  const testMode = false

  // 生成可访问的路由表
  const generateRoutes = (data: { menus: UmsMenu[]; username: string }) => {
    const { menus, username } = data
    const accessedRouters = asyncRouterMap.filter(v => {
      // 测试模式下admin帐号直接返回所有菜单
      if (testMode && username === 'admin') return true
      if (hasPermission(menus, v)) {
        if (v.children && v.children.length > 0) {
          v.children = v.children.filter(child => {
            if (hasPermission(menus, child)) {
              return child
            }
            return false
          })
          return v
        } else {
          return v
        }
      }
      return false
    })
    //对菜单进行排序
    sortRouters(accessedRouters)
    addRouters.value = accessedRouters
    routers.value = constantRouterMap.concat(accessedRouters)
  }

  return {
    routers,
    addRouters,
    generateRoutes,
  }
})

// 默认导出保持兼容性
export default usePermissionStore
