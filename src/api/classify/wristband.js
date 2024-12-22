import request from '@/utils/request'

// 获取标识列表
export function fetchList(params) {
  return request({
    url: '/classify/classifyWristband/list',
    method: 'get',
    params: params
  })
}

// 创建标识
export function createWristband(data) {
  return request({
    url: '/classify/classifyWristband/create',
    method: 'post',
    data
  })
}

// 更新标识
export function updateWristband(data) {
  return request({
    url: `/classify/classifyWristband/update`,
    method: 'post',
    data
  })
}

// 删除标识
export function deleteWristband(id) {
  return request({
    url: `/classify/classifyWristband/delete/${id}`,
    method: 'post'
  })
}

// 更新标识状态
export function updateStatus(id, data) {
  return request({
    url: `/classify/classifyWristband/status/${id}`,
    method: 'post',
    data
  })
} 