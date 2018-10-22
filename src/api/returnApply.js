import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/returnApply/list',
    method:'get',
    params:params
  })
}

export function deleteApply(params) {
  return request({
    url:'/returnApply/delete',
    method:'post',
    params:params
  })
}
