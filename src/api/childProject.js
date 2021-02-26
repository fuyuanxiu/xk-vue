import request from '@/utils/request'
export function getlist(data) {
    return request({
      url: '/child/getlist',
      method: 'get',
      params:data
    })
  }
  /*新增子项目*/

export function add(data){
  return request({
    url:'/child/add',
    method:'post',
    params:data
  })
}

export function editChild(data){
  return request({
    url:'/child/edit',
    method:'post',
    params:data
  })
}

export function del(id) {
  return request({
    url: '/child/delete',
    method: 'post',
    params: { 'id':id}
  })
}