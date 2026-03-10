import type { CommonPage } from '@/types/common'
import type {
  CouponHistoryQueryParam,
  CouponQueryParam,
  SmsCoupon,
  SmsCouponExt,
} from '@/types/coupon'
import http from '@/utils/http'

/**
 * 根据优惠券名称和类型分页获取优惠券列表
 */
export function getCouponListAPI(params: CouponQueryParam) {
  return http<CommonPage<SmsCoupon>>({
    url: '/coupon/list',
    method: 'get',
    params: params,
  })
}

/**
 * 添加优惠券
 */
export function couponCreateAPI(data: SmsCouponExt) {
  return http({
    url: '/coupon/create',
    method: 'post',
    data: data,
  })
}

/**
 * 获取单个优惠券的详细信息
 */
export function getCouponByIdAPI(id: number) {
  return http<SmsCouponExt>({
    url: '/coupon/' + id,
    method: 'get',
  })
}

/**
 * 根据ID修改优惠券
 */
export function couponUpdateByIdAPI(id: number, data: SmsCouponExt) {
  return http({
    url: '/coupon/update/' + id,
    method: 'post',
    data: data,
  })
}

/**
 * 根据ID删除优惠券
 */
export function couponDeleteByIdAPI(id: number) {
  return http({
    url: '/coupon/delete/' + id,
    method: 'post',
  })
}

/**
 * 根据优惠券id，使用状态，订单编号分页获取领取记录
 */
export function getCouponHistoryListAPI(params: CouponHistoryQueryParam) {
  return http({
    url: '/couponHistory/list',
    method: 'get',
    params: params,
  })
}
