import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/code/list',
    method:'get',
    params:params
  })
}

export function deleteCode(params) {
  return request({
    url:'/code/delete',
    method:'post',
    params:params
  })
}

export function updateStatus(params) {
  return request({
    url:'/code/update/status',
    method:'post',
    params:params
  })
}

export function addCode(data) {
  return request({
    url:'/code/create',
    method:'post',
    data:data
  })
}

export function getCodeDetail(id) {
  return request({
    url:'/code/'+id,
    method:'get'
  })
}

export function updateCode(id,data) {
  return request({
    url:'/code/update/'+id,
    method:'post',
    data:data
  })
}

export function fetchCodeGroup( params) {
  return request({
    url: '/codeGroup/list',
    method: 'get',
    params: params
  })
}

