import request from '@/utils/request'

//添加附件
export function addDoc(data) {
  return request({
    headers:{'Content-Type':'multipart/form-data'},
    url: '/customerBomFile/add',
    method: 'post',
    data
  })
}

//删除附件
export function deleteDoc(id) {
  return request({
    url: '/customerBomFile/delete',
    method: 'post',
    params: { 'id':id}
  })
}

//获取客户BOM附件关联列表
export function getDocList(bsFileId, bsCusBomId) {
  return request({    
    url: '/customerBomFile/getDocList',
    method: 'get',
    params: {'bsFileId':bsFileId, 'bsCusBomId':bsCusBomId}
  })
}

//根据待办事项关联ID获取关联附件列表
export function getDocListOnTodo(bsReferId) {
  return request({    
    url: '/customerBomFile/getDocListOnTodo',
    method: 'get',
    params: {'bsReferId':bsReferId }
  })
}







