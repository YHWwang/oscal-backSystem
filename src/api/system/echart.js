import request from '@/utils/request'

// 访问量统计
export function getData(begin,end) {
  return request({
    url: '/system/log/getData',
    method: 'post',
    data: {
      "beginTime":begin,
      "endTime":end
    }
  })
}
