import request from '@/utils/request'
// 查询多语言
export function getLang(query) {
  return request({
    url: '/system/lang/getInfo',
    method: 'get',
    params: query
  })
}
// 保存多语言
export function saveLang(data) {
  return request({
    url: '/system/lang/saveOrUpdate',
    method: 'post',
    data: data
  })
}
// 查询产品分类
export function getOption(query) {
  return request({
    url: '/system/support/product/option',
    method: 'get',
    params: query
  })
}
// 查询分类
export function getCategory(query) {
  return request({
    url: '/system/support/category/option',
    method: 'get',
    params: query
  })
}
// 查询
export function getLists(query) {
  return request({
    url: '/system/support/faq/list',
    method: 'get',
    params: query
  })
}

// 详细
export function detail(id) {
  return request({
    url: '/system/support/faq/' + id,
    method: 'get'
  })
}
// 新增
export function add(data) {
  return request({
    url: '/system/support/faq',
    method: 'post',
    data: data
  })
}

// 修改
export function update(data) {
  return request({
    url: '/system/support/faq',
    method: 'put',
    data: data
  })
}

// 删除
export function del(id) {
  return request({
    url: '/system/support/faq/' + id,
    method: 'delete'
  })
}


