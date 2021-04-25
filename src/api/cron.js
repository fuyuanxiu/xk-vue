import request from '@/utils/request'


export function modifyTime(date) {
  return request({
    url: '/cron/modify',
    method: 'post',
    params: {date : date}
  })
}