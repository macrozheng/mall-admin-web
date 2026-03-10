/** 退货原因 */
export type OmsOrderReturnReason = {
  /** ID */
  id?: number
  /** 退货类型 */
  name: string
  /** 排序 */
  sort: number
  /** 状态：0->不启用；1->启用 */
  status: number
  /** 添加时间 */
  createTime?: string
}
