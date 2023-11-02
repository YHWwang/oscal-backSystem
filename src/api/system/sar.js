import request from '@/utils/request'

// 查询SAR列表
export function listSar(query) {
  return request({
    url: '/system/sar/list',
    method: 'get',
    params: query
  })
}

// 查询SAR详细
export function getSar(id) {
  return request({
    url: '/system/sar/' + id,
    method: 'get'
  })
}

// 新增SAR
export function addSar(data) {
  return request({
    url: '/system/sar',
    method: 'post',
    timeout: 60 * 60 * 1000,
    data: data
  })
}

// 修改SAR
export function updateSar(data) {
  return request({
    url: '/system/sar',
    method: 'put',
    data: data
  })
}

// 删除SAR
export function delSar(id) {
  return request({
    url: '/system/sar/' + id,
    method: 'delete'
  })
}

// 导出SAR
export function exportSar(query) {
  return request({
    url: '/system/sar/export',
    method: 'get',
    params: query
  })
}