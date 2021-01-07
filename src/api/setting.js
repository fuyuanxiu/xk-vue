import request from '@/utils/request'

/*获取列表*/
export function getList(data) {
  return request({
    url: '/setting/getlist',
    method: 'get',
    params: data
  })
}

//编辑
export function editSetting(data) {
  return request({
    url: '/setting/edit',
    method: 'post',
    params: data
  })
}

/*编辑*/
export function updateSetting(checkRate,limitRate,number) {
  return request({
    url: '/setting/updateSetting',
    method: 'post',
    params: { 'bomCheck':checkRate,'bomLimit':limitRate,'bomNumber':number}
  })
}

//手动同步K3库存均价信息
export function updateStockPriceData(year,month) {
  return request({
    url: '/setting/updateStockPriceData',
    method: 'post',
    params: { 'year':year,'month':month}
  })
}

//手动同步K3采购订单价信息
export function updateOrderBillData() {
  return request({
    url: '/setting/updateOrderBillData',
    method: 'post',
    params: {}
  })
}

//手动同步K3采购发票价信息
export function updateInvoiceBillData() {
  return request({
    url: '/setting/updateInvoiceBillData',
    method: 'post',
    params: {}
  })
}

//手动同步K3产品成本价信息
export function updateCostData() {
  return request({
    url: '/prdChart/updateCostData',
    method: 'post',
    params: {}
  })
}

//手动同步K3产品销售订单价信息
export function updateOrderData() {
  return request({
    url: '/prdChart/updateOrderData',
    method: 'post',
    params: {}
  })
}

//手动同步K3产品销售发票价信息
export function updateInvoiceData() {
  return request({
    url: '/prdChart/updateInvoiceData',
    method: 'post',
    params: {}
  })
}














