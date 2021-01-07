import request from '@/utils/request'

//删除客户BOM新料询价信息
export function delEnquiry(id) {
  return request({
    url: '/enquiryBom/delete',
    method: 'post',
    params: { 'id':id }
  })
}

//获取客户BOM新料询价信息
export function getlist(data) {
  return request({
    url: '/enquiryBom/getlist',
    method: 'get',
    params: data 
  })
}

//生成客户BOM新料询价
export function doCreateEnquiry(data) {
  return request({
    url: '/enquiryBom/doCreateEnquiry',
    method: 'get',
    params: data 
  })
}

//获取客户BOM新料询价详情
export function getDetailInfo(data) {
  return request({
    url: '/enquiryBom/getDetailInfo',
    method: 'get',
    params: data 
  })
}

//设置询价供应商
export function setSupp(eqBomId, detailIds, suppIds) {
  return request({
    url: '/enquiryBom/setSupplier',
    method: 'post',
    params: { 'eqBomId':eqBomId, 'detailIds':detailIds, 'suppIds':suppIds }
  })
}

//删除客户BOM新料询价详情
export function delDetail(id) {
  return request({
    url: '/enquiryBom/deleteDetail',
    method: 'post',
    params: { 'id':id }
  })
}

//获取采购部人员信息
export function getUserList(data) {
  return request({
    url: '/enquiryBom/getUserList',
    method: 'get',
    params: data 
  })
}













