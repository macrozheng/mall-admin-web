import request from '@/utils/request'

// 获取组室列表(不分页)
export function fetchList() {
  return request({
    url: '/mgs/mgsDepartments/noPageList',
    method: 'get'
  })
}
// 根据组室ID获取组室中病房情况及其可用的病床
export function bedCountOfRoomList(params) {
  return request({
    url: '/mgs/mgsDepartments/bedCountOfRoomList',
    method: 'get',
    params: params
  })
}





