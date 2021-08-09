import request from '@/utils/request'

// 查询帖子列表
export function listInvitation(query) {
  return request({
    url: '/system/invitation/list',
    method: 'get',
    params: query
  })
}

// 查询帖子详细
export function getInvitation(id) {
  return request({
    url: '/system/invitation/' + id,
    method: 'get'
  })
}

// 新增帖子
export function addInvitation(data) {
  return request({
    url: '/system/invitation',
    method: 'post',
    data: data
  })
}

// 获取帖子类别
export function getTreeselectData() {
  return request({
    url: '/system/kind/getKindselect',
    method: 'get'
  })
}

// 修改帖子
export function updateInvitation(data) {
  return request({
    url: '/system/invitation',
    method: 'put',
    data: data
  })
}

// 删除帖子
export function delInvitation(id) {
  return request({
    url: '/system/invitation/' + id,
    method: 'delete'
  })
}

// 导出帖子
export function exportInvitation(query) {
  return request({
    url: '/system/invitation/export',
    method: 'get',
    params: query
  })
}