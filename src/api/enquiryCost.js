import request from '@/utils/request'

/*询价报价列表*/
export function getlist(data) {
  return request({
    url: '/enquiryCost/getlist',
    method: 'get',
    params: data 
  })
}

/*编辑询价报价列表*/
export function edit(data) {
  return request({
    url: '/enquiryCost/edit',
    method: 'post',
    params: data
  })
}

/*询价报价详情列表*/
export function getDetailList(data) {
  return request({
    url: '/enquiryCost/getDetailList',
    method: 'get',
    params: data
  })
}

/*修改询价详情*/
export function updateDetail(data) {
  return request({
    url: '/enquiryCost/updateDetail',
    method: 'post',
    params: data
  })
}

/*删除询价详情*/
export function delEnquiryDetail(id) {
  return request({
    url: '/enquiryCost/deleteDetail',
    method: 'post',
    params: { 'id':id}
  })
}

/*导入询价单*/
export function uplaodEnqFile(data) {
  return request({
    headers:{'Content-Type':'multipart/form-data'},
    url: 'enquiryCost/addDetailExcel',
    method: 'post',
    data
  })
}















