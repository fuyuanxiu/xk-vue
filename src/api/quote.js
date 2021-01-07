import request from '@/utils/request'

/*新增报价模块*/
export function addQuote(data) {
  return request({
    url: '/quote/doQuote',
    method: 'post',
      data 
  })
}


/*编辑*/
export function editQuote(data) {
  return request({
    url: '/quote/edit',
    method: 'post',
    data
  })
}

/*获取报价列表*/
export function getQuoteList(qtStatus,keyword,startDate,endDate,rows,page) {
  return request({
    url: '/quote/getlist',
    method: 'get',
    params: {'qtStatus':qtStatus,'keyword':keyword,'startDate':startDate,'endDate':endDate,'page':page,'rows':rows}
  })
}

/*获取报价详情信息*/
export function getQuoteInfo(id) {
  return request({
    url: '/quote/getQuoteInfo',
    method: 'get',
    params: {'id':id}
  })
}

/*根据询价单ID获取所有报价信息*/
export function getAllQuoteList(data) {
  return request({
    url: '/quote/getAllQuoteList',
    method: 'get',
    params: data
  })
}

/*采纳报价*/
export function doAccept(data) {
  return request({
    url: '/quote/doAccept',
    method: 'post',
    params: data
  })
}

/*新增不同数量报价*/
export function addMateByNum(data) {
  return request({
    url: '/quoteMateriel/addByNum',
    method: 'post',
    params: data
  })
}

/*编辑报价*/
export function editMate(data) {
  return request({
    url: '/quoteMateriel/edit',
    method: 'post',
    params: data
  })
}

//导入报价
export function addQuoteExcel(data) {
  return request({
    headers:{'Content-Type':'multipart/form-data'},
    url: '/quoteMateriel/addQuoteExcel',
    method: 'post',
    data
  })
}











