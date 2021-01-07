import request from '@/utils/request'


/*获取树形菜单*/
export function getTree() {
  return request({
    url: '/sysRouter/getTreeList',
    method: 'get',
    
  })
}
/*新增*/
export function add(data) {
  return request({
    url: '/sysRouter/add',
    method: 'post',
      data 
  })
}

export function del1(data){
  return request({
    url: '/sysRouter/delete',
    method: 'post',
      data 
  })
}
export function del(id) {
  return request({
    url: '/sysRouter/delete',
    method: 'post',
    params: { 'id':id}
  })
}














