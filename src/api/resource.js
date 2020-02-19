import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/resource/list',
    method: 'get',
    params: params
  })
}

export function createResource(data) {
  return request({
    url: '/resource/create',
    method: 'post',
    data: data
  })
}

export function updateResource(id, data) {
  return request({
    url: '/resource/update/' + id,
    method: 'post',
    data: data
  })
}

export function deleteResource(id) {
  return request({
    url: '/resource/delete/' + id,
    method: 'post'
  })
}

export function fetchAllResourceList() {
  return request({
    url: '/resource/listAll',
    method: 'get'
  })
}
