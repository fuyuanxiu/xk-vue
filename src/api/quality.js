import request from '@/utils/request'

export function importBom(data) {
  return request({
    headers:{'Content-Type':'multipart/form-data'},
    url: '/qualityBom/importBom',
    method: 'post',
    data
  })
}

/*获取品质BOM列表*/
export function getBomList( keyword,rows,page) {
  return request({
    url: '/qualityBom/getBomList',
    method: 'get',
    params: { 'keyword':keyword,'page':page,'rows':rows}
  })
}

/*删除*/
export function delBom(id) {
  return request({
    url: '/qualityBom/delete',
    method: 'post',
    params: { 'fileId':id}
  })
}

/*根据fileId获取参数设置内容以及excel数据*/
export function getBomData(fileId) {
  return request({
    url: '/qualityBom/getBomData',
    method: 'get',
    params: { 'fileId':fileId}
  })
}

//匹配K3物料信息
export function getK3Bom(data) {
  return request({    
    url: '/qualityBom/getK3Bom',
    method: 'get',
    params: data
  })
}

//获取匹配K3物料详情信息
export function getBomMatch(bomId) {
  return request({    
    url: '/qualityBom/getBomMatch',
    method: 'get',
    params: {'bomId':bomId }
  })
}

//选中/取消匹配的物料
export function doCheckMateriel(id,checkStatus) {
  return request({    
    url: '/qualityBom/doCheckMateriel',
    method: 'post',
    params: {'id':id,'checkStatus':checkStatus}
  })
}

//添加新物料到匹配数据
export function addMate(data) {
  return request({    
    url: '/qualityBom/addMate',
    method: 'post',
    params: data
  })
}









