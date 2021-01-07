import request from '@/utils/request'

//新增模板文件
export function addTemp(data) {
  return request({
    url: '/templates/add',
    method: 'post',
    params: data
  })
}

//编辑模板文件
export function editTemp(data) {
  return request({
    url: '/templates/edit',
    method: 'post',
    params: data
  })
}

//删除模板文件
export function deleteTemp(id) {
  return request({
    url: '/templates/delete',
    method: 'post',
    params: { 'id':id }
  })
}

//获取模板文件
export function getTempList(rows,page) {
  return request({
    url: '/templates/getlist',
    method: 'get',
    params: { 'page':page,'rows':rows}
  })
}











