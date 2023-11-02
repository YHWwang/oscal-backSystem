import request from '@/utils/request'

export function getPage(query) {
  return request({
    url: 'system/pic/list',
    method: 'get',
    params: query
  })
}
export function uploadImg(data) {
  return request({
    url: 'system/pic/add',
    method: 'post',
    data: data
  })
}
export function addObj(obj) {
  return request({
    url: 'system/pic',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: 'system/pic/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: 'system/pic/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: 'system/pic',
    method: 'put',
    data: obj
  })
}
