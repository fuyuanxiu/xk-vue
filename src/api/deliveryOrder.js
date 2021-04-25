import request from '@/utils/request'

//判断是否为供应商
export function getSupplierStatus(data) {
    return request({    
      url: '/delivery/getSuppByCurrUser',
      method: 'get',
      params: data
    })
  }
  