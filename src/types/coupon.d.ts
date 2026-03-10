import type { PageParam } from './common'

/** 优惠券信息 */
export type SmsCoupon = {
  /** ID */
  id?: number
  /** 优惠券类型；0->全场赠券；1->会员赠券；2->购物赠券；3->注册赠券 */
  type: number
  /** 优惠券名称 */
  name: string
  /** 使用平台：0->全部；1->移动；2->PC */
  platform: number
  /** 数量 */
  count?: number
  /** 金额 */
  amount: number
  /** 每人限领张数 */
  perLimit: number
  /** 使用门槛；0表示无门槛 */
  minPoint?: number
  /** 开始时间 */
  startTime?: string
  /** 结束时间 */
  endTime?: string
  /** 使用类型：0->全场通用；1->指定分类；2->指定商品 */
  useType: number
  /** 备注 */
  note?: string
  /** 发行数量 */
  publishCount?: number
  /** 已使用数量 */
  useCount?: number
  /** 领取数量 */
  receiveCount?: number
  /** 可以领取的日期 */
  enableTime?: string
  /** 优惠码 */
  code?: string
  /** 可领取的会员类型：0->无限时 */
  memberLevel?: number
}

/** 优惠券扩展 */
export type SmsCouponExt = SmsCoupon & {
  /** 优惠券绑定的商品 */
  productRelationList?: CouponSelectProductOptionVo[]
  /** 优惠券绑定的商品分类 */
  productCategoryRelationList?: CouponProductCateRelationVo[]
}

/** 优惠券和商品分类关系 */
export type CouponProductCateRelationVo = {
  /** 商品分类ID */
  productCategoryId?: number
  /** 商品分类名称 */
  productCategoryName?: string
  /** 父级分类名称 */
  parentCategoryName?: string
}

/** 优惠券指定商品选择对象 */
export type CouponSelectProductOptionVo = {
  /** 商品ID */
  productId?: number
  /** 商品名称 */
  productName: string
  /** 商品SN码 */
  productSn: string
}

/** 优惠券列表查询参数 */
export type CouponQueryParam = PageParam & {
  /** 查询名称 */
  name?: string
  /** 优惠券类型 */
  type?: number
}

/** 优惠券历史记录 */
export type SmsCouponHistory = {
  /** ID */
  id?: number
  /** 优惠券ID */
  couponId?: number
  /** 会员ID */
  memberId?: number
  /** 优惠码 */
  couponCode?: string
  /** 领取人昵称 */
  memberNickname?: string
  /** 获取类型：0->后台赠送；1->主动获取 */
  getType?: number
  /** 创建时间 */
  createTime?: string
  /** 使用状态：0->未使用；1->已使用；2->已过期 */
  useStatus?: number
  /** 使用时间 */
  useTime?: string
  /** 订单ID */
  orderId?: number
  /** 订单号码 */
  orderSn?: string
}

/** 优惠券历史列表查询参数 */
export type CouponHistoryQueryParam = PageParam & {
  /** 使用状态：0->未使用；1->已使用；2->已过期 */
  useStatus?: number
  /** 订单号码 */
  orderSn?: string
  /** 优惠券ID */
  couponId?: number
}
