import request from '@/utils/request'

// 查询联系我们列表
export function listUs(query) {
  return request({
    url: '/system/us/list',
    method: 'get',
    params: query
  })
}

// 查询联系我们详细
export function getUs(id) {
  return request({
    url: '/system/us/' + id,
    method: 'get'
  })
}

// 新增联系我们
export function addUs(data) {
  return request({
    url: '/system/us',
    method: 'post',
    data: data
  })
}

// 修改联系我们
export function updateUs(data) {
  return request({
    url: '/system/us',
    method: 'put',
    data: data
  })
}

// 删除联系我们
export function delUs(id) {
  return request({
    url: '/system/us/' + id,
    method: 'delete'
  })
}

// 导出联系我们
export function exportUs(query) {
  return request({
    url: '/system/us/export',
    method: 'get',
    params: query
  })
}