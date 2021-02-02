import request from '@/utils/request'

//获取折扣方案类别
export function getFee(data) {
  return request({
    url: '/fee/getlist',
    method: 'get',
    params:data
  })
}

//新增类别
export function addFee(data) {
  return request({
    url: '/fee/add',
    method: 'post',
    params:data
  })
}

//编辑类别
export function editFee(data) {
  return request({
    url: '/fee/edit',
    method: 'post',
    params:data
  })
}

//删除类别
export function delFee(id) {
  return request({
    url: '/fee/delete',
    method: 'post',
    params: { 'id':id }
  })
}

//审核
export function review(id) {
  return request({
    url: '/fee/check',
    method: 'post',
    params: { 'id':id }
  })
}

//反审核
export function reverseReview(id){
  return request({
    url: '/fee/reverse',
    method: 'post',
    params:{ 'id':id}
  })
}





