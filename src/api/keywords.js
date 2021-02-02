import request from '@/utils/request'

/*物料类别*/
/*获取匹配关键字类别*/
export function getkeylist(data) {
  return request({
    url: '/keywordsCategory/getlist',
    method: 'get',
    params:data
  })
}

/*新增匹配关键字类别*/
export function addKeywords(data) {
  return request({
    url: '/keywordsCategory/add',
    method: 'post',
    params:data
  })
}

/*删除类别*/
export function delKeyword(id) {
  return request({
    url: '/keywordsCategory/delete',
    method: 'post',
    params: { 'id':id}
  })
}

export function editKeyword(data){
  return request({
    url:'/keywordsCategory/edit',
    method:'post',
    params:data
  })
}

/*匹配关键字模块*/

export function add(data){
  return request({
    url:'/keywords/add',
    method:'post',
    params:data
  })
}

export function del(id) {
  return request({
    url: '/keywords/delete',
    method: 'post',
    params: { 'id':id}
  })
}

export function edit(data){
  return request({
    url:'/keywords/edit',
    method:'post',
    params:data
  })
}

export function getlist(data) {
  return request({
    url: '/keywords/getlist',
    method: 'get',
    params:data
  })
}

export function updateCheck(id){
  return request({
    url: '/keywords/check',
    method: 'post',
    params:{ 'id':id}
  })
}

export function reverseCheck(id){
  return request({
    url: '/keywords/reverse',
    method: 'post',
    params:{ 'id':id}
  })
}








