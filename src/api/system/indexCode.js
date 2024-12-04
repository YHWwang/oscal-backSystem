import request from '@/utils/request'

// 查询配置通用列表
export function listOscalConfig(query) {
  return request({
    url: '/system/oscalConfig/list',
    method: 'get',
    params: query
  })
}

// 查询配置通用详细
export function getOscalConfig(id) {
  return request({
    url: '/system/oscalConfig/' + id,
    method: 'get'
  })
}

// 新增配置通用
export function addOscalConfig(data) {
  return request({
    url: '/system/oscalConfig',
    method: 'post',
    data: data
  })
}

// 修改配置通用
export function updateOscalConfig(data) {
  return request({
    url: '/system/oscalConfig',
    method: 'put',
    data: data
  })
}

// 删除配置通用
export function delOscalConfig(id) {
  return request({
    url: '/system/oscalConfig/' + id,
    method: 'delete'
  })
}

// 导出配置通用
export function exportOscalConfig(query) {
  return request({
    url: '/system/oscalConfig/export',
    method: 'get',
    params: query
  })
}