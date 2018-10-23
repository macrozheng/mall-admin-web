import request from '@/utils/request'
export function fetchList() {
  return request({
    url:'/companyAddress/list',
    method:'get'
  })
}
