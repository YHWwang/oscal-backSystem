import request from '@/utils/request'
import qs from "qs";

// info查询
export function getLists(query) {


  return request({
    url: 'system/warranty/country',
    method: 'get',
    params: query
  })
}

// 新增
export function add(data) {
  return request({
    url: 'system/warranty/country',
    method: 'post',
    data: data
  })
}

// 修改
export function update(data) {
  return request({
    url: 'system/warranty/country',
    method: 'put',
    data: data
  })
}

// 删除
export function del(id) {
  return request({
    url: 'system/warranty/country/' + id,
    method: 'delete'
  })
}


