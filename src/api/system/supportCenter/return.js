import request from '@/utils/request'
import qs from "qs";

// info查询
export function getLists(query) {

  let data= qs.stringify(query, { indices: false })
  return request({
    url: '/system/refund/container?'+data ,
    method: 'get',
    // params: data
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


