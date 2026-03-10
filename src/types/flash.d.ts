import type { PageParam } from './common'
import type { PmsProduct } from './product'

/** 秒杀活动信息 */
export type SmsFlashPromotion = {
  /** ID */
  id?: number
  /** 秒杀时间段名称 */
  title: string
  /** 开始日期 */
  startDate?: string
  /** 结束日期 */
  endDate?: string
  /** 上下线状态 */
  status: number
  /** 创建时间 */
  createTime?: string
}

/** 秒杀时间段信息 */
export type SmsFlashPromotionSession = {
  /** 编号 */
  id?: number
  /** 场次名称 */
  name: string
  /** 每日开始时间 */
  startTime?: string
  /** 每日结束时间 */
  endTime?: string
  /** 启用状态：0->不启用；1->启用 */
  status: number
  /** 创建时间 */
  createTime?: string
  /** 商品数量 */
  productCount?: number
}

/** 秒杀活动商品关系信息 */
export type SmsFlashPromotionProductRelation = {
  /** 编号 */
  id?: number
  /** 秒杀活动ID */
  flashPromotionId: number
  /** 秒杀时间段ID */
  flashPromotionSessionId: number
  /** 商品ID */
  productId: number
  /** 限时购价格 */
  flashPromotionPrice?: number
  /** 限时购数量 */
  flashPromotionCount?: number
  /** 每人限购数量 */
  flashPromotionLimit?: number
  /** 排序 */
  sort?: number
  /** 关联商品 */
  product?: PmsProduct
}

/** 秒杀商品列表查询参数 */
export type FlashProductQueryParam = PageParam & {
  /** 秒杀活动ID */
  flashPromotionId?: number
  /** 秒杀场次ID */
  flashPromotionSessionId?: number
}
