import request from '@/utils/request'

//上传文件
export function uplaodFile(data) {
  return request({
    headers:{'Content-Type':'multipart/form-data'},
    url: '/file/upload',
    method: 'post',
    data
  })
}

//下载文件
export function getFile(fsFileId) {
  return request({
    headers:{'Content-Type':'multipart/form-data'},
    url: '/file/get',
    method: 'get',
    params: { 'fsFileId':fsFileId}
  })
}












