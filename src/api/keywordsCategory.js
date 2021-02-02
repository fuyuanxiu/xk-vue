import request from '@/utils/request'

/*获取类别匹配关键字分类信息*/
export function getCategorylist(data) {
  return request({
    url: '/keywordsCategory2/getlist',
    method: 'get',
    params:data
  })
}

/*新增类别匹配关键字分类信息*/
export function addCategoryKey(data) {
  return request({
    url: '/keywordsCategory2/add',
    method: 'post',
    params:data
  })
}

/*删除类别*/
export function delCategoryKey(id) {
  return request({
    url: '/keywordsCategory2/delete',
    method: 'post',
    params: { 'id':id}
  })
}

export function editCategoryKey(data){
  return request({
    url:'/keywordsCategory2/edit',
    method:'post',
    params:data
  })
}

/*类别匹配关键字模块*/

export function addKeywords2(data){
  return request({
    url:'/keywords2/add',
    method:'post',
    params:data
  })
}

export function delKeywords2(id) {
  return request({
    url: '/keywords2/delete',
    method: 'post',
    params: { 'id':id}
  })
}

export function editKeywords2(data){
  return request({
    url:'/keywords2/edit',
    method:'post',
    params:data
  })
}

export function getlistKeywords2(data) {
  return request({
    url: '/keywords2/getlist',
    method: 'get',
    params:data
  })
}

export function modifyCheck(id) {
  return request({
    url: '/keywords2/check',
    method: 'post',
    params:{'id' :id}
  })
}

export function reverseCheck(id) {
  return request({
    url: '/keywords2/reverse',
    method: 'post',
    params:{'id' :id}
  })
}









