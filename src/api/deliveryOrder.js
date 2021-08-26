import request from '@/utils/request'

// 判断是否为供应商
export function getSupplierStatus(data) {
  return request({
    url: '/delivery/getSuppByCurrUser',
    method: 'get',
    params: data
  })
}

// 回复交付日期
export function replyDate(date, id) {
  return request({
    url: '/delivery/modifyDate',
    method: 'post',
    params: { 'date': date, 'id': id }
  })
}
