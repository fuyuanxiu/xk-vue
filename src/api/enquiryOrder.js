import request from '@/utils/request'

//获取询价成本清单列表
export function getlist(data) {
  return request({
    url: '/enquiryOrder/getlist',
    method: 'get',
    params: data 
  })
}

//审核通过
export function doApproval(data) {
  return request({
    url: '/enquiryOrder/doApproval',
    method: 'post',
    params: data
  })
}

//作废
export function doInvalid(data) {
  return request({
    url: '/enquiryOrder/doInvalid',
    method: 'post',
    params: data
  })
}

//获取询价成本清单详情
export function getDetailList(data) {
  return request({
    url: '/enquiryOrderDetail/getlist',
    method: 'get',
    params: data 
  })
}

//获取已询价的清单详情列表
export function getDetailList_2(data) {
  return request({
    url: '/enquiryOrderDetail/getlist_2',
    method: 'get',
    params: data 
  })
}

//获取关联报价信息
export function getQuoteMateList(data) {
  return request({
    url: '/enquiryOrderDetail/getQuoteMateList',
    method: 'get',
    params: data 
  })
}

//采纳报价
export function doAccept(data) {
  return request({
    url: '/enquiryOrderDetail/doAccept',
    method: 'post',
    params: data
  })
}

//发送消息通知供应商
export function sendSuppMsg(data) {
  return request({
    url: '/enquiryOrderDetail/sendSuppMsg',
    method: 'post',
    params: data
  })
}












