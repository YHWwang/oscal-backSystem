import request from '@/utils/request'

// 查询底部轮播图列表
export function listImg(query) {
  return request({
    url: '/system/img/list',
    method: 'get',
    params: query
  })
}

// 查询底部轮播图详细
export function getImg(id) {
  return request({
    url: '/system/img/' + id,
    method: 'get'
  })
}

// 新增底部轮播图
export function addImg(data) {
  return request({
    url: '/system/img',
    method: 'post',
    data: data
  })
}

// 修改底部轮播图
export function updateImg(data) {
  return request({
    url: '/system/img',
    method: 'put',
    data: data
  })
}

// 删除底部轮播图
export function delImg(id) {
  return request({
    url: '/system/img/' + id,
    method: 'delete'
  })
}

// 导出底部轮播图
export function exportImg(query) {
  return request({
    url: '/system/img/export',
    method: 'get',
    params: query
  })
}