import request from '@/utils/request'

//新增
export function addCate(bsName, bsCode, bsStatus) {
  return request({
    url: '/categorySetting/add',
    method: 'post',
    params: { 'bsName':bsName,'bsCode':bsCode,'bsStatus':bsStatus }
  })
}

//编辑
export function editCate(id, bsName, bsCode, bsStatus) {
  return request({
    url: '/categorySetting/edit',
    method: 'post',
    params: { 'id':id,'bsName':bsName,'bsCode':bsCode,'bsStatus':bsStatus }
  })
}

//删除
export function delCate(id) {
  return request({
    url: '/categorySetting/delete',
    method: 'post',
    params: { 'id':id }
  })
}


//获取列表
export function getCateList(data) {
  return request({
    url: '/categorySetting/getlist',
    method: 'get',
    params: data
  })
}

//修改筛选状态
export function updateStatus(idsArray,bsStatus) {
  return request({    
    url: '/categorySetting/updateStatus',
    method: 'post',
    params: { 'idsArray':idsArray,'bsStatus':bsStatus}
  })
}










