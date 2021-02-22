import request from '@/utils/request'
/*获取项目分类信息*/
export function getProjectlist(data) {
    return request({
      url: '/project/getlist',
      method: 'get',
      params: data
    })
  }

  /*新增项目分类信息*/
export function addCategoryKey(data) {
    return request({
      url: '/project/add',
      method: 'post',
      params:data
    })
  }

 /*修改项目分类信息*/
export function edit(data){
    return request({
      url:'/project/edit',
      method:'post',
      params:data
    })
  }

   /*删除项目分类信息*/
  export function delKeyword(id) {
    return request({
      url: '/project/delete',
      method: 'post',
      params: { 'id':id}
    })
  }