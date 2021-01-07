import request from '@/utils/request'

//新增操作权限
export function addPerm(data) {
  return request({
    url: '/sysPermission/add',
    method: 'post',
    params: data
  })
}

//编辑操作权限
export function editPerm(data) {
  return request({
    url: '/sysPermission/edit',
    method: 'post',
    params: data
  })
}

//删除操作权限
export function deletePerm(id) {
  return request({
    url: '/sysPermission/delete',
    method: 'post',
    params: { 'id':id }
  })
}

//获取操作权限
export function getPermList(keyword,rows,page) {
  return request({
    url: '/sysPermission/getlist',
    method: 'get',
    params: { 'keyword':keyword,'page':page,'rows':rows}
  })
}

//获取权限设置信息
export function getPermByRouter(roleId,routerId) {
  return request({
    url: '/sysPermission/getPermByRouter',
    method: 'post',
    params: { 'roleId':roleId,'routerId':routerId }
  })
}

//权限设置
export function setPermit(data){
  return request({
    url: '/sysPermission/setPerm',
    method: 'post',
    params: data
  })
}

//获取权限设置信息
export function getPermByRouterCode(routerCode) {
  return request({
    url: '/sysPermission/getPermByRouterCode',
    method: 'get',
    params: { 'routerCode':routerCode }
  })
}