import request from '@/utils/request'

/*新增物料*/
export function addMaterielInfo(data) {
  return request({
    url: '/materielInfo/add',   
    method: 'post',
      data 
  })
}

/*删除物料*/
export function delMaterielInfo(id) {
  return request({
    url: '/materielInfo/delete',
    method: 'post',
    params: { 'id':id}
  })
}

export function getUserInfo(token) {
  return request({
    url: '/sysUser/getUserInfo',
    method: 'post',
    params: { token }
  })
}

/*获取物料列表*/
export function getMaterielList(mateK3Code,mateName,rows,page,rowsK3,pageK3) {
  return request({
    url: '/materielInfo/getlistAll',
    method: 'get',
    params: { 'mateK3Code':mateK3Code, 'mateName':mateName,'page':page,'rows':rows,'pageK3':pageK3,'rowsK3':rowsK3}
  })
}

/*编辑物料*/
export function editMateriel(data) {
  return request({
    url: '/materielInfo/edit',
    method: 'post',
    data
  })
}

/*手动同步K3物料数据*/
export function updateMateData(data) {
  return request({
    url: '/materielInfo/updateMateData',
    method: 'post',
    data
  })
}

/*获取物料库存信息*/
export function getStockList(mateK3Code) {
  return request({
    url: '/materielStockK3/getlist',
    method: 'get',
    params: { 'mateK3Code':mateK3Code }
  })
}

/*获取物料列表*/
export function searchMateInfo(mateK3Code,mateCusName,mateCusCode,model1,model2,model3,model4,model5,model6,model7,rows,page) {
  return request({
    url: '/materielInfo/getlist_2',
    method: 'get',
    params: { 'mateK3Code':mateK3Code, 'mateCusName':mateCusName,'model1':model1,'model2':model2,'model3':model3,'model4':model4,'model5':model5,'model6':model6,'model7':model7,'page':page,'rows':rows}
  })
}

/*获取物料列表*/
export function getListSrm(keyword,mateK3Code,mateName,isQuality,rows,page) {
  return request({
    url: '/materielInfo/getlist',
    method: 'get',
    params: { 'keyword':keyword,'mateK3Code':mateK3Code,'mateName':mateName,'isQuality':isQuality,'page':page,'rows':rows}
  })
}













