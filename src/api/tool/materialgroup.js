import request from '@/utils/request'

export function getPage(query) {
  return request({
    url: '/system/picGroup/list',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/system/picGroup/',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/system/picGroup/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/system/picGroup/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/system/picGroup/',
    method: 'put',
    data: obj
  })
}
