/** 首页品牌 */
export type SmsHomeBrand = {
  /** ID */
  id?: number
  /** 品牌ID */
  brandId: number
  /** 品牌名称 */
  brandName: string
  /** 推荐状态：0->未推荐；1->推荐中 */
  recommendStatus?: number
  /** 排序 */
  sort?: number
}

/** 首页品牌列表查询参数 */
export type HomeBrandQueryParam = PageParam & {
  /** 品牌名称 */
  brandName?: string
  /** 推荐状态：0->未推荐；1->推荐中 */
  recommendStatus?: number
}
