import request from '@/utils/request'
import qs from "qs";

// info查询
export function getLists(query) {

 let data= qs.stringify(query, { indices: false })
  return request({
    url: 'system/question?'+data ,
    method: 'get',
    // params: data
  })
}
// html查询
export function getHtmlLists(query) {
  return request({
    url: 'system/warranty/container',
    method: 'get',
    params: query
  })
}
// 新增
export function add(data) {
  return request({
    url: 'system/warranty/container',
    method: 'post',
    data: data
  })
}

// 修改
export function update(data) {
  return request({
    url: 'system/warranty/container',
    method: 'put',
    data: data
  })
}

// 删除
export function del(id) {
  return request({
    url: 'system/warranty/container/' + id,
    method: 'delete'
  })
}


