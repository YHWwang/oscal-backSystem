import request from '@/utils/request'
// 查询产品
export function getOption(query) {
  return request({
    url: '/system/support/product/option',
    method: 'get',
    params: query
  })
}
// 查询
export function getLists(query) {
  return request({
    url: '/system/video/list',
    method: 'get',
    params: query
  })
}

// 详细
export function detail(id) {
  return request({
    url: '/system/video/' + id,
    method: 'get'
  })
}
// 新增
export function add(data) {
  return request({
    url: '/system/video',
    method: 'post',
    data: data
  })
}

// 修改
export function update(data) {
  return request({
    url: '/system/video',
    method: 'put',
    data: data
  })
}

// 删除
export function del(id) {
  return request({
    url: '/system/video/' + id,
    method: 'delete'
  })
}


