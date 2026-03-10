/** 商品分类信息 */
export type PmsProductCategory = {
  /** ID */
  id?: number
  /** 上级分类的编号：0表示一级分类 */
  parentId: number
  /** 分类名称 */
  name: string
  /** 分类级别：0->1级；1->2级 */
  level?: number
  /** 商品数量 */
  productCount?: number
  /** 商品单位 */
  productUnit?: string
  /** 是否显示在导航栏：0->不显示；1->显示 */
  navStatus: number
  /** 显示状态：0->不显示；1->显示 */
  showStatus: number
  /** 排序 */
  sort?: number
  /** 图标 */
  icon?: string
  /** 关键字 */
  keywords?: string
  /** 描述 */
  description?: string
  /** 筛选属性ID列表，后续添加的 */
  productAttributeIdList?: number[]
}

/** 商品分类信息扩展 */
export type PmsProductCategoryExt = PmsProductCategory & {
  /** 子级分类 */
  children?: PmsProductCategory[]
}
