import type { PageParam } from './common'

/** 订单信息 */
export type OmsOrder = {
  /** 订单id */
  id: number
  /** 会员id */
  memberId?: number
  /** 优惠券id */
  couponId?: number
  /** 订单编号 */
  orderSn?: string
  /** 提交时间 */
  createTime: string
  /** 用户帐号 */
  memberUsername?: string
  /** 订单总金额 */
  totalAmount: number
  /** 应付金额（实际支付金额） */
  payAmount: number
  /** 运费金额 */
  freightAmount: number
  /** 促销优化金额（促销价、满减、阶梯价） */
  promotionAmount?: number
  /** 积分抵扣金额 */
  integrationAmount?: number
  /** 优惠券抵扣金额 */
  couponAmount?: number
  /** 管理员后台调整订单使用的折扣金额 */
  discountAmount: number
  /** 支付方式：0->未支付；1->支付宝；2->微信 */
  payType: number
  /** 订单来源：0->PC订单；1->app订单 */
  sourceType: number
  /** 订单状态：0->待付款；1->待发货；2->已发货；3->已完成；4->已关闭；5->无效订单 */
  status: number
  /** 订单类型：0->正常订单；1->秒杀订单 */
  orderType: number
  /** 物流公司(配送方式) */
  deliveryCompany?: string
  /** 物流单号 */
  deliverySn?: string
  /** 自动确认时间（天） */
  autoConfirmDay?: number
  /** 可以获得的积分 */
  integration?: number
  /** 可以活动的成长值 */
  growth?: number
  /** 活动信息 */
  promotionInfo: string
  /** 发票类型：0->不开发票；1->电子发票；2->纸质发票 */
  billType?: number
  /** 发票抬头 */
  billHeader?: string
  /** 发票内容 */
  billContent?: string
  /** 收票人电话 */
  billReceiverPhone?: string
  /** 收票人邮箱 */
  billReceiverEmail?: string
  /** 收货人姓名 */
  receiverName?: string
  /** 收货人电话 */
  receiverPhone?: string
  /** 收货人邮编 */
  receiverPostCode?: string
  /** 省份/直辖市 */
  receiverProvince: string
  /** 城市 */
  receiverCity?: string
  /** 区 */
  receiverRegion?: string
  /** 详细地址 */
  receiverDetailAddress?: string
  /** 订单备注 */
  note?: string
  /** 确认收货状态：0->未确认；1->已确认 */
  confirmStatus?: number
  /** 删除状态：0->未删除；1->已删除 */
  deleteStatus?: number
  /** 下单时使用的积分 */
  useIntegration?: number
  /** 支付时间 */
  paymentTime: string
  /** 发货时间 */
  deliveryTime: string
  /** 确认收货时间 */
  receiveTime: string
  /** 评价时间 */
  commentTime: string
  /** 修改时间 */
  modifyTime?: string
}

/** 订单商品项 */
export type OmsOrderItem = {
  /** 商品项id */
  id: number
  /** 订单id */
  orderId: number
  /** 订单编号 */
  orderSn: string
  /** 商品id */
  productId: number
  /** 商品图片 */
  productPic: string
  /** 商品名称 */
  productName: string
  /** 商品品牌 */
  productBrand: string
  /** 商品货号 */
  productSn: string
  /** 销售价格 */
  productPrice: number
  /** 购买数量 */
  productQuantity: number
  /** 商品sku编号 */
  productSkuId: number
  /** 商品sku条码 */
  productSkuCode: string
  /** 商品分类id */
  productCategoryId: number
  /** 商品促销名称 */
  promotionName: string
  /** 商品促销分解金额 */
  promotionAmount: number
  /** 优惠券优惠分解金额 */
  couponAmount: number
  /** 积分优惠分解金额 */
  integrationAmount: number
  /** 该商品经过优惠后的分解金额 */
  realAmount: number
  /** 赠送积分 */
  giftIntegration: number
  /** 赠送成长值 */
  giftGrowth: number
  /** 商品销售属性 */
  productAttr: string
}

/** 订单操作历史 */
export type OmsOrderOperateHistory = {
  /** 历史记录id */
  id: number
  /** 订单id */
  orderId: number
  /** 操作人：用户；系统；后台管理员 */
  operateMan: string
  /** 操作时间 */
  createTime: string
  /** 订单状态：0->待付款；1->待发货；2->已发货；3->已完成；4->已关闭；5->无效订单 */
  orderStatus: number
  /** 备注 */
  note: string
}

/** 订单列表查询参数 */
export type OrderQueryParam = PageParam & {
  /** 订单编号 */
  orderSn?: string
  /** 收货人姓名/号码 */
  receiverKeyword?: string
  /** 订单状态：0->待付款；1->待发货；2->已发货；3->已完成；4->已关闭；5->无效订单 */
  status?: number
  /** 订单类型：0->正常订单；1->秒杀订单 */
  orderType?: number
  /** 订单来源：0->PC订单；1->app订单 */
  sourceType?: number
  /** 订单提交时间 */
  createTime?: string
}

/** 订单发货参数 */
export type OmsOrderDeliveryParam = {
  /** 订单id */
  orderId: number
  /** 物流公司 */
  deliveryCompany?: string
  /** 物流单号 */
  deliverySn?: string
}

/** 订单详情信息 */
export type OmsOrderDetail = OmsOrder & {
  /** 订单商品列表 */
  orderItemList: OmsOrderItem[]
  /** 订单操作记录列表 */
  historyList: OmsOrderOperateHistory[]
}

/** 订单收货人信息参数 */
export type OmsReceiverInfoParam = {
  /** 订单ID */
  orderId: number
  /** 收货人姓名 */
  receiverName?: string
  /** 收货人电话 */
  receiverPhone?: string
  /** 收货人邮编 */
  receiverPostCode?: string
  /** 详细地址 */
  receiverDetailAddress?: string
  /** 省份/直辖市 */
  receiverProvince?: string
  /** 城市 */
  receiverCity?: string
  /** 区 */
  receiverRegion?: string
  /** 订单状态：0->待付款；1->待发货；2->已发货；3->已完成；4->已关闭；5->无效订单 */
  status: number
}

/** 订单费用信息参数 */
export type OmsMoneyInfoParam = {
  /** 订单ID */
  orderId: number
  /** 运费金额 */
  freightAmount: number
  /** 管理员后台调整订单所使用的折扣金额 */
  discountAmount: number
  /** 订单状态：0->待付款；1->待发货；2->已发货；3->已完成；4->已关闭；5->无效订单 */
  status: number
}
