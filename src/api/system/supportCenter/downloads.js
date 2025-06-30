import request from '@/utils/request'
// 查询分类
export function getOption(query) {
  return request({
    url: '/system/supportProduct/option',
    method: 'get',
    params: query
  })
}
// 查询
export function getLists(query) {
  return request({
    url: '/system/downloads/list',
    method: 'get',
    params: query
  })
}

// 详细
export function detail(id) {
  return request({
    url: '/system/downloads/' + id,
    method: 'get'
  })
}
// 新增
export function add(data) {
  return request({
    url: '/system/downloads',
    method: 'post',
    data: data
  })
}

// 修改
export function update(data) {
  return request({
    url: '/system/downloads',
    method: 'put',
    data: data
  })
}

// 删除
export function del(id) {
  return request({
    url: '/system/downloads/' + id,
    method: 'delete'
  })
}


