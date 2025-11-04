import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/channel/list',
    method:'get',
    params:params
  })
}

export function getChannel(id) {
  return request({
    url:'/channel/'+id,
    method:'get'
  })
}

export function createChannel(data) {
  return request({
    url:'/channel',
    method:'post',
    data:data
  })
}

export function updateChannel(id, data) {
  return request({
    url:'/channel/'+ id,
    method:'put',
    data:data
  })
}

export function deleteChannel(id) {
  return request({
    url:'/channel/'+id,
    method:'delete',
  })
}
