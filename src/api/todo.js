import request from '@/utils/request'


/*获取待办列表*/
export function getlist(bsStatus,page,rows) {
  return request({
    url: '/todoInfo/getlist',
    method: 'get',
    params: {'bsStatus':bsStatus,'page':page,"rows":rows}
  })
}

/*关闭待办*/
export function closeTodo(data) {
  return request({
    url: '/todoInfo/close',
    method: 'post',
    params: data
  })
}












