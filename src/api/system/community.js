import request from '@/utils/request'

// 查询社区列表
export function listCommunity(query) {
  return request({
    url: '/system/community/list',
    method: 'get',
    params: query
  })
}

// 查询社区详细
export function getCommunity(id) {
  return request({
    url: '/system/community/' + id,
    method: 'get'
  })
}

// 新增社区
export function addCommunity(data) {
  return request({
    url: '/system/community',
    method: 'post',
    data: data
  })
}

// 修改社区
export function updateCommunity(data) {
  return request({
    url: '/system/community',
    method: 'put',
    data: data  
  })
}

// 删除社区
export function delCommunity(id) {
  return request({
    url: '/system/community/' + id,
    method: 'delete'
  })
}

// 导出社区
export function exportCommunity(query) {
  return request({
    url: '/system/community/export',
    method: 'get',
    params: query
  })
}