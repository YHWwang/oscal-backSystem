import request from '@/utils/request'

// 查询TDK列表
export function listTdk() {
  return request({
    url: '/system/tdk/list',
    method: 'get',
  })
}
// 修改TDK列表
export function updateTdk(data) {
    return request({
      url: '/system/tdk',
      method: 'put',
      data: data
    })
  }
  // 删除TDK列表
export function delTdk(id) {
    return request({
      url: '/system/tdk/'+id,
      method: 'delete',
    })
  }
  // 新增TDK列表
export function addTdk(data) {
    return request({
      url: '/system/tdk',
      method: 'post',
      data: data
    })
  }
  // 查询TDK分类
export function categoryListTdk() {
    return request({
      url: '/system/tdk/getTdkCategory',
      method: 'get',
    })
  }
