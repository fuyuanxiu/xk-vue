import request from '@/utils/request'

//获取工序流类别
export function getCategory(data) {
  return request({
    url: '/processFlowCategory/getlist',
    method: 'get',
    params:data
  })
}

//新增工序流类别
export function addCategory(data) {
  return request({
    url: '/processFlowCategory/add',
    method: 'post',
    params:data
  })
}

//编辑工序流类别
export function editCategory(data) {
  return request({
    url: '/processFlowCategory/edit',
    method: 'post',
    params:data
  })
}

//删除工序流类别
export function delCategory(id) {
  return request({
    url: '/processFlowCategory/delete',
    method: 'post',
    params: { 'id':id }
  })
}

//获取工序流
export function getFlow(data) {
  return request({
    url: '/processFlow/getlist',
    method: 'get',
    params: data
  })
}

//新增工序流
export function addFlow(data) {
  return request({
    url: '/processFlow/add',
    method: 'post',
    params: data
  })
}

//编辑工序流
export function editFlow(data) {
  return request({
    url: '/processFlow/edit',
    method: 'post',
    params: data
  })
}

//删除工序流
export function delFlow(id) {
  return request({
    url: '/processFlow/delete',
    method: 'post',
    params: { 'id':id }
  })
}

//禁用或解禁工序流
export function banFlow(id, bsIsBan) {
  return request({
    url: '/processFlow/doBan',
    method: 'post',
    params: { 'id':id, 'bsIsBan':bsIsBan }
  })
}

//设置工序流程
export function setFlows(flowId, processIds) {
  return request({
    url: '/processFlow/setFlows',
    method: 'post',
    params: { 'flowId':flowId, 'processIds':processIds }
  })
}

//根据工序流ID获取工序流程
export function getProcessFlow(flowId) {
  return request({
    url: '/processFlow/getFlows',
    method: 'get',
    params: { 'flowId':flowId }
  })
}

//审核
export function review(id){
  return request({
    url: '/processFlow/check',
    method: 'post',
    params:{ 'id':id}
  })
}

export function reverseReview(id){
  return request({
    url: '/processFlow/reverse',
    method: 'post',
    params:{ 'id':id}
  })
}










