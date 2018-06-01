import request from '@/utils/request'
export function fetchList() {
  return request({
    url:'/subject/listAll',
    method:'get',
  })
}
