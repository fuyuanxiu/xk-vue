import request from '@/utils/request'
/*获取K3采购订单信息*/
export function getOrderList(data) {
    return request({
      url: '/k3order/getlist',
      method: 'get',
      params: data
    })
  }

  export function sendOrder(idArrays) {
    return request({
      url: '/k3order/send',
      method: 'post',
      params: {'idArrays' : idArrays}
    })
  }

  export function cancelSend(idArrays) {
    return request({
      url: '/k3order/cancel',
      method: 'post',
      params: {'idArrays' : idArrays}
    })
  }