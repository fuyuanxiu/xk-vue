import request from '@/utils/request'

//获取
export function getReport(data) {
  return request({
    url: '/marketReport/getlist',
    method: 'get',
    params:data
  })
}

//新增
export function addReport(data) {
  return request({
    url: '/marketReport/add',
    method: 'post',
    params:data
  })
}

//编辑
export function editReport(data) {
  return request({
    url: '/marketReport/edit',
    method: 'post',
    params:data
  })
}

//删除
export function delReport(id) {
  return request({
    url: '/marketReport/delete',
    method: 'post',
    params: { 'id':id }
  })
}

//详情
export function getDetail(bomCode) {
  return request({
    url: '/marketReport/getDetail',
    method: 'post',
    params: { 'bomCode':bomCode }
  })
}

//新增详情
export function addDetail(data) {
  return request({
    url: '/marketReport/addDetail',
    method: 'post',
    params:data
  })
}

//编辑详情
export function editDetail(data) {
  return request({
    url: '/marketReport/editDetail',
    method: 'post',
    params:data
  })
}

//删除详情
export function delDetail(id) {
  return request({
    url: '/marketReport/deleteDetail',
    method: 'post',
    params: { 'id':id }
  })
}

//获取详情列表
export function getDetailList(data) {
  return request({
    url: '/marketReport/getDetailList',
    method: 'get',
    params:data
  })
}

//获取BOM报价详情报表
export function getQtReport(data) {
  return request({
    url: '/marketReport/getQtReport',
    method: 'post',
    params:data
  })
}

//根据计费ID获取报价详情信息
export function getDetailListByfee(data) {
  return request({
    url: '/marketReport/getDetailListByfee',
    method: 'get',
    params:data
  })
}















