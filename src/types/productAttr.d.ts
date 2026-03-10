/** 商品分类对应属性信息 */
export type ProductAttrInfo = {
  /** 商品属性ID */
  attributeId: number
  /** 商品属性分类ID */
  attributeCategoryId: number
}

/** 商品属性实体 */
export type PmsProductAttribute = {
  /** ID */
  id?: number
  /** 商品属性分类ID */
  productAttributeCategoryId?: number
  /** 属性名称 */
  name: string
  /** 属性选择类型：0->唯一；1->单选；2->多选 */
  selectType?: number
  /** 属性录入方式：0->手工录入；1->从列表中选取 */
  inputType?: number
  /** 可选值列表，以逗号隔开 */
  inputList?: string
  /** 排序字段：最高的可以单独上传图片 */
  sort?: number
  /** 分类筛选样式：0->普通；1->颜色 */
  filterType?: number
  /** 检索类型；0->不需要进行检索；1->关键字检索；2->范围检索 */
  searchType?: number
  /** 相同属性产品是否关联；0->不关联；1->关联 */
  relatedStatus?: number
  /** 是否支持手动新增；0->不支持；1->支持 */
  handAddStatus?: number
  /** 属性的类型；0->规格；1->参数 */
  type?: number
}

/** 商品属性分类实体 */
export type PmsProductAttributeCategory = {
  /** 属性ID */
  id?: number
  /** 属性名称 */
  name: string
  /** 属性数量 */
  attributeCount?: number
  /** 参数数量 */
  paramCount?: number
}

/** 商品属性分类实体扩展 */
export type PmsProductAttributeCategoryExt = PmsProductAttributeCategory & {
  /** 商品属性分类列表 */
  productAttributeList?: PmsProductAttribute[]
}

/** 商品属性值 */
export type PmsProductAttributeValue = {
  /** ID */
  id?: number
  /** 商品ID */
  productId?: number
  /** 商品属性ID */
  productAttributeId?: number
  /** 手动添加规格或参数的值，参数单值，规格有多个时以逗号隔开 */
  value?: string
}

/** 商品规格信息 */
export interface ProductAttrVo extends Pick<
  PmsProductAttribute,
  'id' | 'name' | 'handAddStatus' | 'inputList'
> {
  /** 选中的值 */
  values?: string[]
  /** 可选项 */
  options?: string[]
}

/** 商品参数信息 */
export interface ProductParamVo extends Pick<
  PmsProductAttribute,
  'id' | 'name' | 'inputType' | 'inputList'
> {
  /** 参数值 */
  value?: string
}

/** 商品属性图片 */
export type ProductAttrPicVo = {
  /** 名称 */
  name?: string
  /** 图片地址 */
  pic?: string
}
