import request from '@/utils/request'
import qs from "qs";
// 查询
export function getLists(query) {
  let data= qs.stringify(query, { indices: false })
  return request({
    url: '/system/sub/email?'+data,
    method: 'get',
  })
}



