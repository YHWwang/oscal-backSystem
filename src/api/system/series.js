import request from '@/utils/request'

// 查询产品系列列表
export function listSeries(query) {
  return request({
    url: '/system/series/list',
    method: 'get',
    params: query
  })
}

// 查询产品系列详细
export function getSeries(id) {
  return request({
    url: '/system/series/' + id,
    method: 'get'
  })
}

// 新增产品系列
export function addSeries(data) {
  return request({
    url: '/system/series',
    method: 'post',
    data: data
  })
}

// 修改产品系列
export function updateSeries(data) {
  return request({
    url: '/system/series',
    method: 'put',
    data: data
  })
}

// 删除产品系列
export function delSeries(id) {
  return request({
    url: '/system/series/' + id,
    method: 'delete'
  })
}

// 导出产品系列
export function exportSeries(query) {
  return request({
    url: '/system/series/export',
    method: 'get',
    params: query
  })
}