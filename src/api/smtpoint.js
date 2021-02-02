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

/*审核*/
export function updateStmCheck() {
  return request({
    url: '/smtCheck/check',
    method: 'post',
  })
}

/*获取审核状态*/
export function getReviewStatus() {
  return request({
    url: '/smtCheck/getStatus',
    method: 'get',
  })
}

/*反审核*/
export function reverseStmCheck() {
  return request({
    url: '/smtCheck/reverse',
    method: 'post',
  })
}









