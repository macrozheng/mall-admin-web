import request from '@/utils/request'
export function createInvoice(data) {
  return request({
    url: '/invoice/create',
    method: 'post',
    data: data
  })
}

export function updateInvoice(id, data) {
  return request({
    url: '/invoice/update/' + id,
    method: 'post',
    data: data
  })
}

export function updateInvoicesStatus(data) {
  return request({
    url: '/invoice/updateInvoicesStatus',
    method: 'post',
    data: data
  })
}

export function deleteInvoice(id) {
  return request({
    url: '/invoice/delete/' + id,
    method: 'post'
  })
}

export function updateStatus(id, params) {
  return request({
    url: '/invoice/updateStatus/' + id,
    method: 'post',
    params: params
  })
}

export function fetchList(params) {
  return request({
    url: '/invoice/list',
    method: 'get',
    params: params
  })
}

export function fetchListAll() {
  return request({
    url: '/invoice/listAll',
    method: 'get'
  })
}

export function getSum() {
  return request({
    url: '/invoice/sum',
    method: 'get'
  })
}

export function getStatusList() {
  return request({
    url: '/invoice/status',
    method: 'get'
  })
}

