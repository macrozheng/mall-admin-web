import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/students/list',
    method: 'get',
    params: params
  })
}