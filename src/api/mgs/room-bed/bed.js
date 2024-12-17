import request from '@/utils/request'

// 获取床位列表
export function fetchList(params) {
  return request({
    url: '/mgs/mgsBed/list',
    method: 'get',
    params: params
  })
}

// 创建床位
export function createBed(data) {
  return request({
    url: '/mgs/mgsBed/create',
    method: 'post',
    data
  })
}

// 更新床位
export function updateBed(data) {
  return request({
    url: `/mgs/mgsBed/update`,
    method: 'post',
    data
  })
}

// 删除床位
export function deleteBed(bedNumber) {
  return request({
    url: `/mgs/mgsBed/delete/${bedNumber}`,
    method: 'post'
  })
}

// 更新床位状态
// export function updateStatus(id, data) {
//   return request({
//     url: `/mgs/mgsBed/status/${id}`,
//     method: 'put',
//     data
//   })
// }

