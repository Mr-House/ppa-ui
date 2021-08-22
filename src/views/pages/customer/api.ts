import request from '../../../utils/request'

export function page(query: any) {
  return request({
    url: '/api/man/v1/customers',
    method: 'GET',
    params: query,
  })
}

export function saveCustomer(data: any) {
  return request({
    url: '/api/man/v1/customers',
    method: 'POST',
    data,
  })
}

export function updateCustomer(data: any) {
  return request({
    url: '/api/man/v1/customers',
    method: 'PATCH',
    data,
  })
}

export function getCustomer(id: string) {
  return request({
    url: `/api/man/v1/customers/${id}`,
    method: 'GET',
  })
}

export function deleteCustomer(id: string) {
  return request({
    url: `/api/man/v1/customers/${id}`,
    method: 'delete',
  })
}

export function getAllCustomer() {
  return request({
    url: '/api/man/v1/customers/combobox',
    method: 'get',
  })
}
