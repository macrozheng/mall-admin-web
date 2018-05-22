import request from '@/utils/request'
export function fetchList(parentId,params) {
  return request({
    url:'/productCategory/list/'+parentId,
    method:'get',
    params:params
  })
}
