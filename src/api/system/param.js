import request from '@/utils/request'

// 查询参数列表
export function listParam(query) {
  return request({
    url: '/system/param/list',
    method: 'get',
    params: query
  })
}

// 查询参数详细
export function getParam(id) {
  return request({
    url: '/system/param/' + id,
    method: 'get'
  })
}

// 新增参数
export function addParam(data) {
  return request({
    url: '/system/param',
    method: 'post',
    data: data
  })
}

// 修改参数
export function updateParam(data) {
  return request({
    url: '/system/param',
    method: 'put',
    data: data
  })
}

// 删除参数
export function delParam(id) {
  return request({
    url: '/system/param/' + id,
    method: 'delete'
  })
}

// 导出参数
export function exportParam(query) {
  return request({
    url: '/system/param/export',
    method: 'get',
    params: query
  })
}