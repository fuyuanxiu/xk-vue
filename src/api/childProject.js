import request from '@/utils/request'
export function getlist(data) {
    return request({
      url: '/child/getlist',
      method: 'get',
      params:data
    })
  }