import request from '@/utils/request'

// 查询商品分类列表
export function listKind(query) {
  return request({
    url: '/system/kind/list',
    method: 'get',
    params: query
  })
}

// 查询商品分类详细
export function getKind(id) {
  return request({
    url: '/system/kind/' + id,
    method: 'get'
  })
}

// 新增商品分类
export function addKind(data) {
  return request({
    url: '/system/kind',
    method: 'post',
    data: data
  })
}

// 修改商品分类
export function updateKind(data) {
  return request({
    url: '/system/kind',
    method: 'put',
    data: data
  })
}

// 删除商品分类
export function delKind(id) {
  return request({
    url: '/system/kind/' + id,
    method: 'delete'
  })
}

// 导出商品分类
export function exportKind(query) {
  return request({
    url: '/system/kind/export',
    method: 'get',
    params: query
  })
}