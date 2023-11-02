import request from '@/utils/request'

// 查询network列表
export function listNetwork(query) {
  return request({
    url: '/system/network/list',
    method: 'get',
    params: query
  })
}

// 查询network详细
export function getNetwork(id) {
  return request({
    url: '/system/network/' + id,
    method: 'get'
  })
}

// 新增network
export function addNetwork(data) {
  return request({
    url: '/system/network',
    method: 'post',
    data: data
  })
}

// 修改network
export function updateNetwork(data) {
  return request({
    url: '/system/network',
    method: 'put',
    data: data
  })
}

// 删除network
export function delNetwork(id) {
  return request({
    url: '/system/network/' + id,
    method: 'delete'
  })
}

// 导出network
export function exportNetwork(query) {
  return request({
    url: '/system/network/export',
    method: 'get',
    params: query
  })
}