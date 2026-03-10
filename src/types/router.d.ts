import type { RouteRecordRaw } from 'vue-router'

/** vue-router路由扩展 */
export type RouteRecordExt = RouteRecordRaw & {
  /** 前端隐藏 */
  hidden?: boolean
  /** 前端排序 */
  sort?: number
  /** 下级子路由 */
  children?: RouteRecordExt[]
  /** 是否永远显示 */
  alwaysShow?: boolean
}
