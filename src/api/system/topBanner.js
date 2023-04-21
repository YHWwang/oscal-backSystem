import request from '@/utils/request'

// 查询topBanner列表
export function listTopBanner(query) {
  return request({
    url: '/system/topBanner/list',
    method: 'get',
    params: query
  })
}

// 查询topBanner详细
export function getTopBanner(id) {
  return request({
    url: '/system/topBanner/' + id,
    method: 'get'
  })
}

// 新增topBanner
export function addTopBanner(data) {
  return request({
    url: '/system/topBanner',
    method: 'post',
    data: data
  })
}

// 修改topBanner
export function updateTopBanner(data) {
  return request({
    url: '/system/topBanner',
    method: 'put',
    data: data
  })
}

// 删除topBanner
export function delTopBanner(id) {
  return request({
    url: '/system/topBanner/' + id,
    method: 'delete'
  })
}

// 导出topBanner
export function exportTopBanner(query) {
  return request({
    url: '/system/topBanner/export',
    method: 'get',
    params: query
  })
}