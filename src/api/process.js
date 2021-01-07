import request from '@/utils/request'

//获取工段
export function getCategory(data) {
  return request({
    url: '/processCategory/getlist',
    method: 'get',
    params:data
  })
}

//新增工段
export function addCategory(data) {
  return request({
    url: '/processCategory/add',
    method: 'post',
    params:data
  })
}

//编辑工段
export function editCategory(data) {
  return request({
    url: '/processCategory/edit',
    method: 'post',
    params:data
  })
}

//删除工段
export function delCategory(id) {
  return request({
    url: '/processCategory/delete',
    method: 'post',
    params: { 'id':id }
  })
}

//获取工序
export function getProcess(data) {
  return request({
    url: '/processInfo/getlist',
    method: 'get',
    params:data
  })
}

//新增工序
export function addProcess(data) {
  return request({
    url: '/processInfo/add',
    method: 'post',
    params:data
  })
}

//编辑工序
export function editProcess(data) {
  return request({
    url: '/processInfo/edit',
    method: 'post',
    params:data
  })
}

//删除工序
export function delProcess(id) {
  return request({
    url: '/processInfo/delete',
    method: 'post',
    params: { 'id':id }
  })
}

//禁用或解禁工序
export function banProcess(id, bsIsBan) {
  return request({
    url: '/processInfo/doBan',
    method: 'post',
    params: { 'id':id, 'bsIsBan':bsIsBan }
  })
}

//获取所有工序信息
export function getProcessAll(data) {
  return request({
    url: '/processInfo/getListAll',
    method: 'get',
    params:data
  })
}







