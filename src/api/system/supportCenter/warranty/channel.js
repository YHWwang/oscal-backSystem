import request from '@/utils/request'

// info查询
export function getLists(query) {
  return request({
    url: 'system/warranty/category',
    method: 'get',
    // params: data
  })
}

// 新增
export function add(data) {
  return request({
    url: 'system/warranty/category',
    method: 'post',
    data: data
  })
}

// 修改
export function update(data) {
  return request({
    url: 'system/warranty/category',
    method: 'put',
    data: data
  })
}

// 删除
export function del(id) {
  return request({
    url: 'system/warranty/category/' + id,
    method: 'delete'
  })
}


