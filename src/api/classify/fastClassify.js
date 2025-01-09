import request from '@/utils/request'

// 获取分类列表
export function fetchList(params) {
  return request({
    url: '/classify/fastClassify/list',
    method: 'get',
    params
  })
} 