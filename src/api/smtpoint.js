import request from '@/utils/request'


/*获取SMT点数*/
export function getTree() {
  return request({
    url: '/smtPoints/getTreeList',
    method: 'get',
    
  })
}

/*获取SMT点数信息*/
export function getlist(data) {
  return request({
    url: '/smtPoints/getlist',
    method: 'get',
    params: data
  })
}

/*修改SMT点数*/
export function updateStmPoints(data) {
  return request({
    url: '/smtPoints/updatePoints',
    method: 'post',
    params: data
  })
}












