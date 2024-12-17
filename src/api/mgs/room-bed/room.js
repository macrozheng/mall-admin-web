import request from '@/utils/request'
export function createRoom(data) {
  return request({
    url: '/mgs/mgsRooms/create',
    method: 'post',
    data: data
  })
}

// export function updateRoom(id, data) {
//   return request({
//     url: '/mgs/mgsRooms/update/' + id,
//     method: 'post',
//     data: data
//   })
// }
export function updateRoom(data) {
  return request({
    url: '/mgs/mgsRooms/update',
    method: 'post',
    data: data
  })
}

export function deleteRoom(id) {
  return request({
    url: '/mgs/mgsRooms/delete/' + id,
    method: 'post'
  })
}

export function updateStatus(id, params) {
  return request({
    url: '/mgs/mgsRooms/updateStatus/' + id,
    method: 'post',
    params: params
  })
}

export function fetchList(params) {
  return request({
    url: '/mgs/mgsRooms/list',
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


