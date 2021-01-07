import request from '@/utils/request'

//根据物料编号获取物料信息
export function getMateList(data) {
  return request({    
    url: '/costMate/getMateList',
    method: 'get',
    params: data
  })
}

//添加新物料到匹配数据
export function addMate(data) {
  return request({    
    url: '/costMate/addMate',
    method: 'post',
    params: data
  })
}

export function uplaodFile(data) {
  return request({
    headers:{'Content-Type':'multipart/form-data'},
    url: '/costMate/getK3Mate',
    method: 'post',
    data
  })
}





