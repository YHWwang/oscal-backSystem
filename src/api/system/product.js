import request from '@/utils/request'

// 查询系列
export function getSeries(id) {
  return request({
    url: '/system/category/getSeries/'+id,
    method: 'get',
  })
}

// 查询商品列表
export function listProduct(query) {
  return request({
    url: '/system/product/list',
    method: 'get',
    params: query
  })
}

// 商品父类别
export function getCategoryList() {
  return request({
    url: '/system/category/getCategoryList',
    method: 'get',
  })
}

// 查询商品详细
export function getProduct(id) {
  return request({
    url: '/system/product/' + id,
    method: 'get'
  })
}

// 新增商品
export function addProduct(data) {
  return request({
    url: '/system/product',
    method: 'post',
    data: data
  })
}

// 修改商品
export function updateProduct(data) {
  return request({
    url: '/system/product',
    method: 'put',
    data: data
  })
}

// 删除商品
export function delProduct(id) {
  return request({
    url: '/system/product/' + id,
    method: 'delete'
  })
}

// 导出商品
export function exportProduct(query) {
  return request({
    url: '/system/product/export',
    method: 'get',
    params: query
  })
}