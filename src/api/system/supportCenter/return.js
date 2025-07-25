import request from '@/utils/request'

// info查询
export function getLists(query) {

  return request({
    url: '/system/refund/container/list' ,
    method: 'get',
    params: query
  })
}

// 新增
export function add(data) {
  return request({
    url: '/system/refund/container',
    method: 'post',
    data: data
  })
}

// 修改
export function update(data) {
  return request({
    url: '/system/refund/container',
    method: 'put',
    data: data
  })
}

// 删除
export function del(id) {
  return request({
    url: '/system/refund/container/' + id,
    method: 'delete'
  })
}


