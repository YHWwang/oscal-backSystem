import request from '@/utils/request'

// info查询
export function getLists(query) {
  return request({
    url: '/system/email/list',
    method: 'get',
    params: query
  })
}
// html查询
export function getHtmlLists(query) {
  return request({
    url: 'system/contact/container/list',
    method: 'get',
    params: query
  })
}
// 查询机型ID
export function getModels(data) {
  return request({
    url: 'system/email/refund/getModelList/'+data,
    method: 'get',
  })
}
// 新增
export function add(data) {
  return request({
    url: '/system/contact/container',
    method: 'post',
    data: data
  })
}

// 修改
export function update(data) {
  return request({
    url: '/system/contact/container',
    method: 'put',
    data: data
  })
}

// 删除
export function del(id) {
  return request({
    url: '/system/contact/container/' + id,
    method: 'delete'
  })
}


