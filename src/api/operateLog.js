import request from '@/utils/request'
//获取日志列表
export function getlist(data) {
    return request({
      url: '/sysLog/getlist',
      method: 'get',
      params: data
    })
  }