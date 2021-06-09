import request from '@/utils/request'

// 查询商品分类列表
export function listCategory() {
  return request({
    url: '/system/category/list',
    method: 'get',
  })
}

// 商品父类别
export function getCategoryList() {
  return request({
    url: '/system/category/getCategoryList',
    method: 'get',
  })
}

// 查询商品分类详细
export function getCategory(id) {
  return request({
    url: '/system/category/' + id,
    method: 'get'
  })
}

// 新增商品分类
export function addCategory(data) {
  return request({
    url: '/system/category',
    method: 'post',
    data: data
  })
}

// 修改商品分类
export function updateCategory(data) {
  return request({
    url: '/system/category',
    method: 'put',
    data: data
  })
}

// 删除商品分类
export function delCategory(id) {
  return request({
    url: '/system/category/' + id,
    method: 'delete'
  })
}

// 导出商品分类
export function exportCategory(query) {
  return request({
    url: '/system/category/export',
    method: 'get',
    params: query
  })
}