/** 专题实体 */
export type CmsSubject = {
  /** ID */
  id?: number
  /** 分类ID */
  categoryId?: number
  /** 标题 */
  title?: string
  /** 专题主图 */
  pic?: string
  /** 关联产品数量 */
  productCount?: number
  /** 推荐状态 */
  recommendStatus?: number
  /** 创建时间 */
  createTime?: string
  /** 收藏数 */
  collectCount?: number
  /** 阅读数 */
  readCount?: number
  /** 评论数 */
  commentCount?: number
  /** 画册图片用逗号分割 */
  albumPics?: string
  /** 描述 */
  description?: string
  /** 显示状态：0->不显示；1->显示 */
  showStatus?: number
  /** 转发数 */
  forwardCount?: number
  /** 专题分类名称 */
  categoryName?: string
  /** 内容 */
  content?: string
}
