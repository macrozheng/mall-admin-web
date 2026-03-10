import type { PageParam } from './common'

/** 首页广告实体 */
export type SmsHomeAdvertise = {
  /** ID */
  id?: number
  /** 广告名称 */
  name?: string
  /** 轮播位置：0->PC首页轮播；1->app首页轮播 */
  type?: number
  /** 图片 */
  pic?: string
  /** 开始时间 */
  startTime?: string
  /** 结束时间 */
  endTime?: string
  /** 上下线状态：0->下线；1->上线 */
  status?: number
  /** 点击数 */
  clickCount?: number
  /** 下单数 */
  orderCount?: number
  /** 链接地址 */
  url?: string
  /** 备注 */
  note?: string
  /** 排序 */
  sort?: number
}

/** 首页广告列表查询参数 */
export type HomeAdvertiseQueryParam = PageParam & {
  /** 广告名称 */
  name?: string
  /** 轮播位置：0->PC首页轮播；1->app首页轮播 */
  type?: number
  /** 结束时间 */
  endTime?: string
}
