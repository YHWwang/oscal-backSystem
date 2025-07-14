import request from '@/utils/request'

// 查询blog顶部广告列表
export function listBlogTopImg(query) {
  return request({
    url: '/system/blogTopImg/list',
    method: 'get',
    params: query
  })
}

// 查询blog顶部广告详细
export function getBlogTopImg(id) {
  return request({
    url: '/system/blogTopImg/' + id,
    method: 'get'
  })
}

// 新增blog顶部广告
export function addBlogTopImg(data) {
  return request({
    url: '/system/blogTopImg',
    method: 'post',
    data: data
  })
}

// 修改blog顶部广告
export function updateBlogTopImg(data) {
  return request({
    url: '/system/blogTopImg',
    method: 'put',
    data: data
  })
}

// 删除blog顶部广告
export function delBlogTopImg(id) {
  return request({
    url: '/system/blogTopImg/' + id,
    method: 'delete'
  })
}

// 导出blog顶部广告
export function exportBlogTopImg(query) {
  return request({
    url: '/system/blogTopImg/export',
    method: 'get',
    params: query
  })
}