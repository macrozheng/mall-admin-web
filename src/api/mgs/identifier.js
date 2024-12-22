import request from '@/utils/request'

// 获取标识列表
export function fetchList(params) {
  return request({
    url: '/mgs/identifier/list',
    method: 'get',
    params: params
  })
}

// 创建标识
export function createIdentifier(data) {
  return request({
    url: '/mgs/identifier/create',
    method: 'post',
    data
  })
}

// 更新标识
export function updateIdentifier(id, data) {
  return request({
    url: `/mgs/identifier/update/${id}`,
    method: 'post',
    data
  })
}

// 删除标识
export function deleteIdentifier(id) {
  return request({
    url: `/mgs/identifier/delete/${id}`,
    method: 'post'
  })
}

// 更新标识状态
export function updateStatus(id, data) {
  return request({
    url: `/mgs/identifier/status/${id}`,
    method: 'post',
    data
  })
} 