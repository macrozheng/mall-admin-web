/** 订单设置信息 */
export type OmsOrderSetting = {
  /** ID */
  id: number
  /** 秒杀订单超时关闭时间(分) */
  flashOrderOvertime?: number
  /** 正常订单超时时间(分) */
  normalOrderOvertime?: number
  /** 发货后自动确认收货时间（天） */
  confirmOvertime?: number
  /** 自动完成交易时间，不能申请售后（天） */
  finishOvertime?: number
  /** 订单完成后自动好评时间（天） */
  commentOvertime?: number
}
