import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/codeGroup/list',
    method:'get',
    params:params
  })
}

export function deleteCodeGroup(params) {
  return request({
    url:'/codeGroup/delete',
    method:'post',
    params:params
  })
}

export function updateStatus(params) {
  return request({
    url:'/codeGroup/update/status',
    method:'post',
    params:params
  })
}

export function updateIsOften(params) {
  return request({
    url:'/codeGroup/update/isoften',
    method:'post',
    params:params
  })
}

export function addCodeGroup(data) {
  return request({
    url:'/codeGroup/create',
    method:'post',
    data:data
  })
}

export function getCodeGroupDetail(id) {
  return request({
    url:'/codeGroup/'+id,
    method:'get'
  })
}

export function updateCodeGroup(id,data) {
  return request({
    url:'/codeGroup/update/'+id,
    method:'post',
    data:data
  })
}

