import request from '@/utils/request'

// 查询
export function getLists(query) {
  return request({
    url: '/system/recom/list',
    method: 'get',
    params: query
  })
}

// 新增
export function add(data) {
  return request({
    url: '/system/recom',
    method: 'post',
    data: data
  })
}

// 修改
export function update(data) {
  return request({
    url: '/system/recom',
    method: 'put',
    data: data
  })
}

// 删除
export function del(id) {
  return request({
    url: '/system/recom/' + id,
    method: 'delete'
  })
}


