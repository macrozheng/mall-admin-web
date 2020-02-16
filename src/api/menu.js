import request from '@/utils/request'

export function fetchList(parentId, params) {
  return request({
    url: '/menu/list/' + parentId,
    method: 'get',
    params: params
  })
}

export function deleteMenu(id) {
  return request({
    url: '/menu/delete/' + id,
    method: 'post'
  })
}

export function createMenu(data) {
  return request({
    url: '/menu/create',
    method: 'post',
    data: data
  })
}

export function updateMenu(id, data) {
  return request({
    url: '/menu/update/' + id,
    method: 'post',
    data: data
  })
}

export function getMenu(id) {
  return request({
    url: '/menu/' + id,
    method: 'get',
  })
}

export function updateHidden(id, params) {
  return request({
    url: '/menu/updateHidden/' + id,
    method: 'post',
    params: params
  })
}

export function fetchTreeList() {
  return request({
    url: '/menu/treeList',
    method: 'get'
  })
}

