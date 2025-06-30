import request from '@/utils/request'
import qs from "qs";

// info查询
export function getLists(query) {
  let data= qs.stringify(query, { indices: false })
  return request({
    url: '/system/contact/us/list?'+data,
    method: 'get',
    // params: query
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
    url: 'sale/refund/getModelList/'+data,
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


