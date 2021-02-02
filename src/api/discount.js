import request from '@/utils/request'

//获取折扣方案类别
export function getCategory(data) {
  return request({
    url: '/discountCategory/getlist',
    method: 'get',
    params:data
  })
}

//新增类别
export function addCategory(data) {
  return request({
    url: '/discountCategory/add',
    method: 'post',
    params:data
  })
}

//编辑类别
export function editCategory(data) {
  return request({
    url: '/discountCategory/edit',
    method: 'post',
    params:data
  })
}

//删除类别
export function delCategory(id) {
  return request({
    url: '/discountCategory/delete',
    method: 'post',
    params: { 'id':id }
  })
}

//获取折扣方案
export function getDiscount(data) {
  return request({
    url: '/discount/getlist',
    method: 'get',
    params:data
  })
}

//新增折扣方案
export function addDiscount(data) {
  return request({
    url: '/discount/add',
    method: 'post',
    params:data
  })
}

//编辑折扣方案
export function editDiscount(data) {
  return request({
    url: '/discount/edit',
    method: 'post',
    params:data
  })
}

//删除折扣方案
export function delDiscount(id) {
  return request({
    url: '/discount/delete',
    method: 'post',
    params: { 'id':id }
  })
}

//禁用或解禁折扣方案
export function banDiscount(id, bsIsBan) {
  return request({
    url: '/discount/doBan',
    method: 'post',
    params: { 'id':id, 'bsIsBan':bsIsBan }
  })
}

export function checkInfo(id) {
  return request({
    url: '/discount/check',
    method: 'post',
    params: { 'id':id}
  })
}

export function reverseInfo(id) {
  return request({
    url: '/discount/reverse',
    method: 'post',
    params: { 'id':id}
  })
}





