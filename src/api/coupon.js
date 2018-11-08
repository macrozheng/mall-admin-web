import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/coupon/list',
    method:'get',
    params:params
  })
}

export function createCoupon(data) {
  return request({
    url:'/coupon/create',
    method:'post',
    data:data
  })
}
