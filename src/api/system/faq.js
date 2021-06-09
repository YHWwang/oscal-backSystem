import request from '@/utils/request'

// 查询faq分类列表
export function listFaq(query) {
  return request({
    url: '/system/faq/list',
    method: 'get',
    params: query
  })
}

// 查询faq分类详细
export function getFaq(id) {
  return request({
    url: '/system/faq/' + id,
    method: 'get'
  })
}

// 新增faq分类
export function addFaq(data) {
  return request({
    url: '/system/faq',
    method: 'post',
    data: data
  })
}

// 修改faq分类
export function updateFaq(data) {
  return request({
    url: '/system/faq',
    method: 'put',
    data: data
  })
}

// 删除faq分类
export function delFaq(id) {
  return request({
    url: '/system/faq/' + id,
    method: 'delete'
  })
}

// 导出faq分类
export function exportFaq(query) {
  return request({
    url: '/system/faq/export',
    method: 'get',
    params: query
  })
}