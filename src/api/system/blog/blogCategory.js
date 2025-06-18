import request from '@/utils/request'

// 查询博客分类列表
export function listBlogCategory(query) {
  return request({
    url: '/system/blogCategory/list',
    method: 'get',
    params: query
  })
}

// 查询博客分类详细
export function getBlogCategory(id) {
  return request({
    url: '/system/blogCategory/' + id,
    method: 'get'
  })
}

// 新增博客分类
export function addBlogCategory(data) {
  return request({
    url: '/system/blogCategory',
    method: 'post',
    data: data
  })
}

// 修改博客分类
export function updateBlogCategory(data) {
  return request({
    url: '/system/blogCategory',
    method: 'put',
    data: data
  })
}

// 删除博客分类
export function delBlogCategory(id) {
  return request({
    url: '/system/blogCategory/' + id,
    method: 'delete'
  })
}
