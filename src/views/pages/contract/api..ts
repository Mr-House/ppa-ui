import request from '../../../utils/request'

export function page(query: any) {
  return request({
    url: '/api/man/v1/contracts',
    method: 'GET',
    params: query,
  })
}

export function saveContract(data: any) {
  return request({
    url: '/api/man/v1/contracts',
    method: 'POST',
    data,
  })
}

export function updateContract(data: any) {
  return request({
    url: '/api/man/v1/contracts',
    method: 'PATCH',
    data,
  })
}

export function getContract(id: string) {
  return request({
    url: `/api/man/v1/contracts/${id}`,
    method: 'GET',
  })
}

export function deleteContract(id: string) {
  return request({
    url: `/api/man/v1/contracts/${id}`,
    method: 'delete',
  })
}
