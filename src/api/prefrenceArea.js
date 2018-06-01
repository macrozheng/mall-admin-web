import request from '@/utils/request'
export function fetchList() {
  return request({
    url:'/prefrenceArea/listAll',
    method:'get',
  })
}
