import type { PageParam } from './common'

/**
 * 首页专题推荐
 */
export type SmsHomeRecommendSubject = {
  /** ID */
  id?: number
  /** 专题ID */
  subjectId: number
  /** 专题名称 */
  subjectName: string
  /** 推荐状态：0->未推荐；1->推荐中 */
  recommendStatus?: number
  /** 排序 */
  sort?: number
}

/** 首页专题列表查询参数 */
export type HomeSubjectQueryParam = PageParam & {
  /** 品牌名称 */
  subjectName?: string
  /** 推荐状态：0->未推荐；1->推荐中 */
  recommendStatus?: number
}
