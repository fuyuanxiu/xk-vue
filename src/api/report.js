import request from '@/utils/request'

export function getEqReport(data) {
  return request({
    url: '/report/getEqReport',
    method: 'post',
    params:data
  })
}

export function getQtReport(data) {
  return request({
    url: '/report/getQtReport',
    method: 'post',
    params:data
  })
}

export function getQtReportByBom(data) {
  return request({
    url: '/report/getQtReportByBom',
    method: 'post',
    params:data
  })
}










