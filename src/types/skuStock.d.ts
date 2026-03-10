/** SKU库存信息 */
export type PmsSkuStock = {
  /** ID */
  id?: number
  /** 产品ID */
  productId?: number
  /** sku编码 */
  skuCode?: string
  /** 价格 */
  price?: number
  /** 库存 */
  stock?: number
  /** 预警库存 */
  lowStock?: number
  /** 展示图片 */
  pic?: string
  /** 销量 */
  sale?: number
  /** 单品促销价格 */
  promotionPrice?: number
  /** 锁定库存 */
  lockStock?: number
  /** 商品销售属性，json格式 */
  spData?: string
}
