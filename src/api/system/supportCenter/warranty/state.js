import request from '@/utils/request'


export function getCountry(query) {
  return request({
    url: 'system/warranty/country/list',
    method: 'get',
    params: query
  })
}

export function getLists(query) {
  return request({
    url: 'system/state/list',
    method: 'get',
    params: query
  })
}

// 新增
export function add(data) {
  return request({
    url: 'system/state',
    method: 'post',
    data: data
  })
}

// 修改
export function update(data) {
  return request({
    url: 'system/state',
    method: 'put',
    data: data
  })
}

// 删除
export function del(id) {
  return request({
    url: 'system/state/' + id,
    method: 'delete'
  })
}


