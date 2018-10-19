import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/returnApply/list',
    method:'get',
    params:params
  })
}
