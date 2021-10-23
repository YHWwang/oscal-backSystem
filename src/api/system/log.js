import request from '@/utils/request'

// 查询系统访问记录列表
export function listLog(query) {
  return request({
    url: '/system/log/list',
    method: 'get',
    params: query
  })
}

// 查询系统访问记录详细
export function getLog(infoId) {
  return request({
    url: '/system/log/' + infoId,
    method: 'get'
  })
}

// 新增系统访问记录
export function addLog(data) {
  return request({
    url: '/system/log',
    method: 'post',
    data: data
  })
}

// 修改系统访问记录
export function updateLog(data) {
  return request({
    url: '/system/log',
    method: 'put',
    data: data
  })
}

// 删除系统访问记录
export function delLog(infoId) {
  return request({
    url: '/system/log/' + infoId,
    method: 'delete'
  })
}

// 导出系统访问记录
export function exportLog(query) {
  return request({
    url: '/system/log/export',
    method: 'get',
    params: query
  })
}