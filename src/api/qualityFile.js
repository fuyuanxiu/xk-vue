import request from '@/utils/request'

export function addFile(data) {
  return request({
    headers:{'Content-Type':'multipart/form-data'},
    url: '/qualityFile/add',
    method: 'post',
    data
  })
}

export function editFile(data) {
  return request({
    headers:{'Content-Type':'multipart/form-data'},
    url: '/qualityFile/edit',
    method: 'post',
    data
  })
}

//删除
export function delFile(id) {
  return request({
    url: '/qualityFile/delete',
    method: 'post',
    params: { 'id':id}
  })
}


//获取质量文件列表
export function getFileList(keyword,bsStatus,mateId,rows,page) {
  return request({
    url: '/qualityFile/getlist',
    method: 'get',
    params: { 'keyword':keyword,'bsStatus':bsStatus,'mateId':mateId,'page':page,'rows':rows}
  })
}

//审核
export function doApproval(data) {
  return request({
    url: '/qualityFile/doApproval',
    method: 'post',
    params: data
  })
}

//驳回
export function doBack(data) {
  return request({
    url: '/qualityFile/doBack',
    method: 'post',
    params: data
  })
}










