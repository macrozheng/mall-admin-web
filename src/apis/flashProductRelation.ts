import type { CommonPage } from '@/types/common'
import type { FlashProductQueryParam, SmsFlashPromotionProductRelation } from '@/types/flash'
import http from '@/utils/http'

/**
 * 分页查询不同场次关联及商品信息
 */
export function getFlashProductRelationListAPI(params: FlashProductQueryParam) {
  return http<CommonPage<SmsFlashPromotionProductRelation>>({
    url: '/flashProductRelation/list',
    method: 'get',
    params: params,
  })
}
/**
 * 批量选择商品添加关联
 */
export function flashProductRelationCreateAPI(data: SmsFlashPromotionProductRelation[]) {
  return http({
    url: '/flashProductRelation/create',
    method: 'post',
    data: data,
  })
}
/**
 * 根据ID修改关联信息
 */
export function flashProductRelationDeleteByIdAPI(id: number) {
  return http({
    url: '/flashProductRelation/delete/' + id,
    method: 'post',
  })
}
/**
 * 根据ID修改关联信息
 */
export function flashProductRelationUpdateByIdAPI(
  id: number,
  data: SmsFlashPromotionProductRelation,
) {
  return http({
    url: '/flashProductRelation/update/' + id,
    method: 'post',
    data: data,
  })
}
