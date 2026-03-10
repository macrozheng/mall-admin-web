import type { PageParam } from './common'
import type { OmsCompanyAddress } from './companyAddress'

/** 订单退货申请 */
export type OmsOrderReturnApply = {
  /** 主键ID */
  id: number
  /** 订单id */
  orderId: number
  /** 收货地址表id */
  companyAddressId: number
  /** 退货商品id */
  productId: number
  /** 订单编号 */
  orderSn: string
  /** 申请时间 */
  createTime: string
  /** 会员用户名 */
  memberUsername: string
  /** 退款金额 */
  returnAmount: number
  /** 退货人姓名 */
  returnName: string
  /** 退货人电话 */
  returnPhone: string
  /** 申请状态：0->待处理；1->退货中；2->已完成；3->已拒绝 */
  status: number
  /** 处理时间 */
  handleTime: string
  /** 商品图片 */
  productPic: string
  /** 商品名称 */
  productName: string
  /** 商品品牌 */
  productBrand: string
  /** 商品销售属性：颜色：红色；尺码：xl; */
  productAttr: string
  /** 退货数量 */
  productCount: number
  /** 商品单价 */
  productPrice: number
  /** 商品实际支付单价 */
  productRealPrice: number
  /** 原因 */
  reason: string
  /** 描述 */
  description: string
  /** 凭证图片，以逗号隔开 */
  proofPics: string
  /** 处理备注 */
  handleNote: string
  /** 处理人员 */
  handleMan: string
  /** 收货人 */
  receiveMan: string
  /** 收货时间 */
  receiveTime: string
  /** 收货备注 */
  receiveNote: string
}

/** 退货申请查询参数 */
export type ReturnApplyQueryParam = PageParam & {
  /** 服务单号 */
  id?: number
  /** 收货人姓名/号码 */
  receiverKeyword?: string
  /** 申请状态：0->待处理；1->退货中；2->已完成；3->已拒绝 */
  status?: number
  /** 申请时间 */
  createTime?: string
  /** 处理人员 */
  handleMan?: string
  /** 处理时间 */
  handleTime?: string
}

/** 订单退货申请结果封装 */
export type OmsOrderReturnApplyResult = OmsOrderReturnApply & {
  /** 公司收货地址 */
  companyAddress: OmsCompanyAddress
}

/** 退货申请状态更新参数 */
export type OmsUpdateStatusParam = {
  /** 服务单号 */
  id: number
  /** 收货地址关联id */
  companyAddressId: number
  /** 确认退款金额 */
  returnAmount: number
  /** 处理备注 */
  handleNote: string
  /** 处理人 */
  handleMan: string
  /** 收货备注 */
  receiveNote: string
  /** 收货人 */
  receiveMan: string
  /** 申请状态：1->退货中；2->已完成；3->已拒绝 */
  status: number
}
