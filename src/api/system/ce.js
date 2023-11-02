import request from '@/utils/request'

// 查询CE证书列表
export function listCe(query) {
  return request({
    url: '/system/ce/list',
    method: 'get',
    params: query
  })
}

// 查询CE证书详细
export function getCe(id) {
  return request({
    url: '/system/ce/' + id,
    method: 'get'
  })
}

// 新增CE证书
export function addCe(data) {
  return request({
    url: '/system/ce',
    method: 'post',
    data: data
  })
}

// 修改CE证书
export function updateCe(data) {
  return request({
    url: '/system/ce',
    method: 'put',
    data: data
  })
}

// 删除CE证书
export function delCe(id) {
  return request({
    url: '/system/ce/' + id,
    method: 'delete'
  })
}

// 导出CE证书
export function exportCe(query) {
  return request({
    url: '/system/ce/export',
    method: 'get',
    params: query
  })
}