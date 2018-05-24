import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/product/list',
    method:'get',
    params:params
  })
}
