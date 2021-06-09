import request from '@/utils/request'

// 查询faq售后列表
export function listDetail(query) {
  return request({
    url: '/system/detail/list',
    method: 'get',
    params: query
  })
}


// 查询商品类别
export function getCategoryAndFaqList() {
  return request({
    url: '/system/category/getCategoryAndFaqList',
    method: 'get',
  })
}

// 查询faq售后详细
export function getDetail(id) {
  return request({
    url: '/system/detail/' + id,
    method: 'get'
  })
}

// 新增faq售后
export function addDetail(data) {
  return request({
    url: '/system/detail',
    method: 'post',
    data: data
  })
}

// 修改faq售后
export function updateDetail(data) {
  return request({
    url: '/system/detail',
    method: 'put',
    data: data
  })
}

// 删除faq售后
export function delDetail(id) {
  return request({
    url: '/system/detail/' + id,
    method: 'delete'
  })
}

// 导出faq售后
export function exportDetail(query) {
  return request({
    url: '/system/detail/export',
    method: 'get',
    params: query
  })
}