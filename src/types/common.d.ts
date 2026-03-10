/** 通用返回结果封装类 */
export type CommonResult<T> = {
  /** 状态码 */
  code: number
  /** 提示信息 */
  message: string
  /** 封装数据 */
  data: T
}

/** 通用分页结果封装类 */
export type CommonPage<T> = {
  /** 当前页码 */
  pageNum: number
  /** 每页数量 */
  pageSize: number
  /** 总页数 */
  totalPage: number
  /** 总条数 */
  total: number
  /** 分页数据 */
  list: T[]
}

/** 通用分页请求参数 */
export type PageParam = {
  /** 当前页码，从1开始 */
  pageNum: number
  /** 每页数量，默认10 */
  pageSize: number
  /** 查询关键字 */
  keyword?: string
}

/** el-cascader级联选择器数据结构 */
export type ElCascaderDataVo = {
  /** 显示标签 */
  label: string
  /** 对应ID */
  value: number
  /** 下级数据 */
  children?: ElCascaderDataVo[]
}

/** el-select选择器数据结构 */
export type ElSelectDataVo = {
  /** 显示标签 */
  label: string
  /** 对应值 */
  value: string | number
}

/** el-transfer穿梭框数据结构 */
export type ElTransferDataVo = {
  /** 绑定key */
  key?: number
  /** 显示标签 */
  label?: string
  /** 是否可用 */
  disabled?: boolean
}
