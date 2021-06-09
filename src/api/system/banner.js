import request from '@/utils/request'

// 查询中间部分的banner图列表
export function listBanner(query) {
  return request({
    url: '/system/banner/list',
    method: 'get',
    params: query
  })
}

// 查询中间部分的banner图详细
export function getBanner(id) {
  return request({
    url: '/system/banner/' + id,
    method: 'get'
  })
}

// 新增中间部分的banner图
export function addBanner(data) {
  return request({
    url: '/system/banner',
    method: 'post',
    data: data
  })
}

// 修改中间部分的banner图
export function updateBanner(data) {
  return request({
    url: '/system/banner',
    method: 'put',
    contentType: "application/json",
    data: data
  })
}

// 删除中间部分的banner图
export function delBanner(id) {
  return request({
    url: '/system/banner/' + id,
    method: 'delete'
  })
}

// 导出中间部分的banner图
export function exportBanner(query) {
  return request({
    url: '/system/banner/export',
    method: 'get',
    params: query
  })
}