import request from '../../../utils/request'

export function page(query: any) {
  return request({
    url: '/api/man/v1/goods',
    method: 'GET',
    params: query,
  })
}

export function saveGoods(data: any) {
  return request({
    url: '/api/man/v1/goods',
    method: 'POST',
    data,
  })
}

export function updateGoods(data: any) {
  return request({
    url: '/api/man/v1/goods',
    method: 'PATCH',
    data,
  })
}

export function getGoods(id: string) {
  return request({
    url: `/api/man/v1/goods/${id}`,
    method: 'GET',
  })
}

export function deleteGoods(id: string) {
  return request({
    url: `/api/man/v1/goods/${id}`,
    method: 'delete',
  })
}

export function getAllGoods() {
  return request({
    url: '/api/man/v1/goods/combobox',
    method: 'get',
  })
}
