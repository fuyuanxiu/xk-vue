import request from '@/utils/request'
/* 获取K3采购订单信息*/
export function getOrderList(data) {
  return request({
    url: '/k3order/getlist',
    method: 'get',
    params: data
  })
}
/* 推送K3采购订单给指定供应商*/
export function sendOrder(idArrays) {
  return request({
    url: '/k3order/send',
    method: 'post',
    params: { 'idArrays': idArrays }
  })
}
/* 取消推送*/
export function cancelSend(idArrays) {
  return request({
    url: '/k3order/cancel',
    method: 'post',
    params: { 'idArrays': idArrays }
  })
}

/* 手动同步K3采购订单信息*/
export function manual(data) {
  return request({
    url: '/k3order/manual',
    method: 'get',
    params: data
  })
}
