/** 会员等级信息 */
export type UmsMemberLevel = {
  /** ID */
  id?: number
  /** 等级名称 */
  name: string
  /** 成长点数 */
  growthPoint: number
  /** 是否为默认等级：0->不是；1->是 */
  defaultStatus: number
  /** 免运费标准 */
  freeFreightPoint: number
  /** 每次评价获取的成长值 */
  commentGrowthPoint: number
  /** 是否有免邮特权 */
  priviledgeFreeFreight: number
  /** 是否有签到特权 */
  priviledgeSignIn: number
  /** 是否有评论获奖励特权 */
  priviledgeComment: number
  /** 是否有专享活动特权 */
  priviledgePromotion: number
  /** 是否有会员价格特权 */
  priviledgeMemberPrice: number
  /** 是否有生日特权 */
  priviledgeBirthday: number
  /** 备注 */
  note: string
}
