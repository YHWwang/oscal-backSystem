import request from '@/utils/request'
// 查询
export function getLists(query) {
  return request({
    url: '/system/sub/email/list',
    method: 'get',
    params:query
  })
}



