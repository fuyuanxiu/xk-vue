import request from '@/utils/request'

export function uplaodFile(data) {
  return request({
    headers:{'Content-Type':'multipart/form-data'},
    url: '/customerBom/importBom',
    method: 'post',
    data
  })
}

export function viewFile(fsFileId) {
  return request({
    headers:{'Content-Type':'multipart/form-data'},
    url: '/file/view',
    method: 'get',
    params: { 'fsFileId':fsFileId}
  })
}

export function getFile(fsFileId) {
  
  return request({
    headers:{'Content-Type':'multipart/form-data'},
    url: '/file/get',
    method: 'get',
    params: { 'fsFileId':fsFileId}
  })
}


//匹配K3物料信息
  export function getK3Bom(data) {
  return request({    
    url: '/customerBom/getK3Bom',
    method: 'get',
    params: data
  })
}

//匹配K3物料信息
export function getBomMatch(cusBomId,mateCategory,topNum,matchNum,settingValue) {
  return request({    
    url: '/customerBom/getBomMatch',
    method: 'get',
    params: {'cusBomId':cusBomId,'mateCategory':mateCategory,'topNum':topNum,'matchNum':matchNum,'settingValue':settingValue }
  })
}

/*获取询价列表*/
export function getBomList( keyWord,rows,page) {
  return request({
    url: '/customerBom/getBomList',
    method: 'get',
    params: { 'keyWord':keyWord,'page':page,'rows':rows}
  })
}
/*删除*/
export function delBom(id) {
  return request({
    url: '/customerBom/delete',
    method: 'post',
    params: { 'fileId':id}
  })
}
/*根据fileId获取参数设置内容以及excel数据*/
export function getBomData( fileId) {
  return request({
    url: '/customerBom/getBomData',
    method: 'get',
    params: { 'fileId':fileId}
  })
}

//获取价格曲线
export function getPriceChart(mateK3Code,startDate,endDate,flag) {
  return request({    
    url: '/costChart/getPriceChart',
    method: 'get',
    params: {'mateK3Code':mateK3Code,'startDate':startDate,'endDate':endDate,'flag':flag}
  })
}

//修改备注
export function modifyRemark(id,remark) {
  return request({    
    url: '/customerBom/addRemark',
    method: 'post',
    params: {'id':id,'remark':remark}
  })
}


//fyx-选中/取消匹配的物料
export function doCheckMateriel(id,checkStatus) {
  return request({    
    url: '/customerBom/doCheckMateriel',
    method: 'post',
    params: {'id':id,'checkStatus':checkStatus}
  })
}

//发送待办
export function doSendTodo(data) {
  return request({    
    url: '/customerBom/doSendTodo',
    method: 'get',
    params: data
  })
}

/*复制客户BOM*/
export function copyBom(fileId) {
  return request({
    url: '/customerBom/copyBom',
    method: 'post',
    params: { 'fileId':fileId}
  })
}

//获取产品价格曲线
export function getPrdChart(data) {
  return request({    
    url: '/prdChart/getPrice',
    method: 'get',
    params: data
  })
}


/*审核*/
export function updateCheck(id) {
  return request({
    url: '/customerBom/check',
    method: 'post',
    params: {'id':id}
  })
}

/*获取审核状态*/
export function getReviewStatus(id) {
  return request({
    url: '/customerBom/getStatus',
    method: 'get',
    params: {'id':id}
  })
}

/*反审核*/
export function reverseCheck(id) {
  return request({
    url: '/customerBom/reverse',
    method: 'post',
    params: {'id':id}
  })
}







