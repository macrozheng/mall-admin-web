import type { PageParam } from './common'

/** 资源信息 */
export type UmsResource = {
  /** ID */
  id?: number
  /** 创建时间 */
  createTime?: string
  /** 资源名称 */
  name: string
  /** 资源URL */
  url: string
  /** 描述 */
  description?: string
  /** 资源分类ID */
  categoryId: number
  /** 是否被选中，前端使用 */
  checked?: boolean
}

/** 资源分类信息 */
export type UmsResourceCategory = {
  /** ID */
  id?: number
  /** 创建时间 */
  createTime?: string
  /** 分类名称 */
  name: string
  /** 排序 */
  sort: number
  /** 是否被选中，前端使用 */
  checked?: boolean
}

/** 资源列表查询参数 */
export type ResourceQueryParam = PageParam & {
  /** 资源名称关键字 */
  nameKeyword?: string
  /** 资源路径关键字 */
  urlKeyword?: string
  /** 资源分类ID */
  categoryId?: number
}
