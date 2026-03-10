import type { PageParam } from './common'

/** 首页新品推荐实体 */
export type SmsHomeNewProduct = {
  /** ID */
  id?: number
  /** 商品ID */
  productId: number
  /** 商品名称 */
  productName: string
  /** 推荐状态：0->未推荐；1->推荐中 */
  recommendStatus?: number
  /** 排序 */
  sort?: number
}

/** 首页新品推荐列表查询参数 */
export type NewProductQueryParam = PageParam & {
  /** 商品名称 */
  productName?: string
  /** 推荐状态：0->未推荐；1->推荐中 */
  recommendStatus?: number
}
