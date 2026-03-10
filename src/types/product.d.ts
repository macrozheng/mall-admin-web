import type { PageParam } from './common'
import type { PmsProductAttributeValue } from './productAttr'
import type { PmsSkuStock } from './skuStock'

export type PmsProduct = {
  /** ID */
  id?: number
  /** 品牌ID */
  brandId?: number
  /** 产品分类ID */
  productCategoryId?: number
  /** 运费模板ID */
  feightTemplateId?: number
  /** 属性分类ID */
  productAttributeCategoryId?: number
  /** 名称 */
  name: string
  /** 图片 */
  pic?: string
  /** 货号 */
  productSn: string
  /** 删除状态：0->未删除；1->已删除 */
  deleteStatus?: number
  /** 上架状态：0->下架；1->上架 */
  publishStatus?: number
  /** 新品状态:0->不是新品；1->新品 */
  newStatus?: number
  /** 推荐状态；0->不推荐；1->推荐 */
  recommandStatus?: number
  /** 审核状态：0->未审核；1->审核通过 */
  verifyStatus?: number
  /** 排序 */
  sort?: number
  /** 销量 */
  sale?: number
  /** 价格 */
  price?: number
  /** 促销价格 */
  promotionPrice?: number
  /** 赠送的成长值 */
  giftGrowth?: number
  /** 赠送的积分 */
  giftPoint?: number
  /** 限制使用的积分数 */
  usePointLimit?: number
  /** 副标题 */
  subTitle?: string
  /** 市场价 */
  originalPrice?: number
  /** 库存 */
  stock?: number
  /** 库存预警值 */
  lowStock?: number
  /** 单位 */
  unit?: string
  /** 商品重量，默认为克 */
  weight?: number
  /** 是否为预告商品：0->不是；1->是 */
  previewStatus?: number
  /** 以逗号分割的产品服务：1->无忧退货；2->快速退款；3->免费包邮 */
  serviceIds?: string
  /** 关键词 */
  keywords?: string
  /** 备注 */
  note?: string
  /** 画册图片，连产品图片限制为5张，以逗号分割 */
  albumPics?: string
  /** 详情标题 */
  detailTitle?: string
  /** 促销开始时间 */
  promotionStartTime?: string
  /** 促销结束时间 */
  promotionEndTime?: string
  /** 活动限购数量 */
  promotionPerLimit?: number
  /** 促销类型：0->没有促销使用原价;1->使用促销价；2->使用会员价；3->使用阶梯价格；4->使用满减价格；5->限时购 */
  promotionType?: number
  /** 品牌名称 */
  brandName?: string
  /** 商品分类名称 */
  productCategoryName?: string
  /** 商品描述 */
  description?: string
  /** 详情描述 */
  detailDesc?: string
  /** 产品详情网页内容 */
  detailHtml?: string
  /** 移动端网页详情 */
  detailMobileHtml?: string
}

/** 商品列表查询参数 */
export type ProductQueryParam = PageParam & {
  /** 上架状态 */
  publishStatus?: number
  /** 审核状态 */
  verifyStatus?: number
  /** 商品货号 */
  productSn?: string
  /** 商品分类编号 */
  productCategoryId?: number
  /** 商品品牌编号 */
  brandId?: number
}

/** 创建和修改商品的请求参数 */
export type PmsProductParam = PmsProduct & {
  /** 商品阶梯价格设置 */
  productLadderList?: PmsProductLadder[]
  /** 商品满减价格设置 */
  productFullReductionList?: PmsProductFullReduction[]
  /** 商品会员价格设置 */
  memberPriceList?: PmsMemberPrice[]
  /** 商品的sku库存信息 */
  skuStockList?: PmsSkuStock[]
  /** 商品参数及自定义规格属性 */
  productAttributeValueList?: PmsProductAttributeValue[]
  /** 专题和商品关系  */
  subjectProductRelationList?: CmsSubjectProductRelation[]
  /** 优选专区和商品的关系  */
  prefrenceAreaProductRelationList?: CmsPrefrenceAreaProductRelation[]
  /** 商品所选分类的父id */
  cateParentId?: number
  /** 秒杀商品数数量 */
  flashPromotionCount: number
  /** 秒杀活动ID */
  flashPromotionId: number
  /** 秒杀商品价格 */
  flashPromotionPrice: number
  /** 秒杀排序价格 */
  flashPromotionSort: number
}

/** 商品阶梯价格 */
export type PmsProductLadder = {
  /** ID */
  id?: number
  /** 商品ID */
  productId?: number
  /** 满足的商品数量 */
  count: number
  /** 折扣 */
  discount?: number
  /** 折后价格 */
  price?: number
}

/** 商品满减价格设置 */
export type PmsProductFullReduction = {
  /** ID */
  id?: number
  /** 商品ID */
  productId?: number
  /** 满足金额 */
  fullPrice?: number
  /** 减免金额 */
  reducePrice?: number
}

/** 商品会员价格 */
export type PmsMemberPrice = {
  /** ID */
  id?: number
  /** 商品ID */
  productId?: number
  /** 会员等级ID */
  memberLevelId?: number
  /** 会员价格 */
  memberPrice?: number
  /** 会员等级名称 */
  memberLevelName?: string
}

/** 专题和商品关系 */
export type CmsSubjectProductRelation = {
  /** ID */
  id?: number
  /** 专题ID */
  subjectId?: number
  /** 商品ID */
  productId?: number
}

/** 优选专区和商品的关系 */
export type CmsPrefrenceAreaProductRelation = {
  /** ID */
  id?: number
  /** 优选专区ID */
  prefrenceAreaId?: number
  /** 商品ID */
  productId?: number
}
