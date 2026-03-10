/** 品牌信息 */
export type PmsBrand = {
  /** ID */
  id?: number
  /** 品牌名称 */
  name: string
  /** 首字母 */
  firstLetter: string
  /** 排序 */
  sort: number
  /** 是否为品牌制造商：0->不是；1->是 */
  factoryStatus: number
  /** 显示状态 */
  showStatus: number
  /** 产品数量 */
  productCount?: number
  /** 产品评论数量 */
  productCommentCount?: number
  /** 品牌logo */
  logo: string
  /** 专区大图 */
  bigPic: string
  /** 品牌故事 */
  brandStory: string
}
