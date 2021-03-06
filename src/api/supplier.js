import request from '@/utils/request'

/*新增用户*/
export function addSupplierInfo(data) {
  return request({
    url: '/supplierInfo/add',
    method: 'post',
      data 
  })
}

/*编辑供应商*/
export function editSupplier(data) {
  return request({
    url: '/supplierInfo/edite',
    method: 'post',
    data
  })
}

/*删除供应商*/
export function delSupplierInfo(id) {
  return request({
    url: '/supplierInfo/delete',
    method: 'post',
    params: { 'id':id}
  })
}

/*获取用户*/
export function getUserInfo(token) {
  return request({
    url: '/sysUser/getUserInfo',
    method: 'post',
    params: { token }
  })
}

/*获取供应商列表*/
export function getSupplierList(data) {
  return request({
    url: '/supplierInfo/getlist',
    method: 'get',
    params:data
  })
}

/*获取待审核供应商列表*/
export function getlistWithTobe(data) {
  return request({
    url: '/supplierInfo/getlistWithTobe',
    method: 'get',
    params:data
  })
}

/*获取SRM和K3供应商列表*/
export function getSupplierListAll(data) {
  return request({
    url: '/supplierInfo/getlistAll',
    method: 'get',
    params: data
  })
}

/*发送邮件*/
export function sendMail() {
  return request({
    url: '/email/send',
    method: 'post'
  })
}

/*上传文件*/
export function uplaodFile(data) {
  return request({
    headers:{'Content-Type':'multipart/form-data'},
    url: '/file/upload',
    method: 'post',
    data
  })
}

/*预览文件*/
export function viewFile(fsFileId) {
  return request({
    headers:{'Content-Type':'multipart/form-data'},
    url: '/file/view',
    method: 'get',
    params: { 'fsFileId':fsFileId}
  })
}

/*获取文件*/
export function getFile(fsFileId) {
  return request({
    headers:{'Content-Type':'multipart/form-data'},
    url: '/file/get',
    method: 'get',
    params: { 'fsFileId':fsFileId}
  })
}

/*删除文件*/
export function deleteFile(fsFileId) {
  return request({
    headers:{'Content-Type':'multipart/form-data'},
    url: '/file/delete',
    method: 'post',
    params: { 'fsFileId':fsFileId}
  })
}

//更新供应商状态操作
export function updateStatus(idsArray,suppGrade) {
  return request({    
    url: '/supplierInfo/updateStatus',
    method: 'post',
    params: { 'idsArray':idsArray,'suppGrade':suppGrade}
  })
}

//获取价格曲线
export function getPriceChart(data) {
  return request({    
    url: '/priceChart/getPriceChart',
    method: 'get',
    params: data
  })
}

//srm供应商匹配K3
export function doMatchK3() {
  return request({    
    url: '/supplierInfo/doMatchK3',
    method: 'get'
  })
}

//根据登录用户名获取供应商
export function getSupplierByLoginName(loginName) {
  return request({    
    url: '/supplierInfo/getSupplierByLoginName',
    method: 'get',
    params: { 'loginName':loginName}
  })
}

//根据当前登录用户获取供应商
export function getSupplierByCurrUser(data) {
  return request({    
    url: '/supplierInfo/getSupplierByCurrUser',
    method: 'get',
    params: data
  })
}
























