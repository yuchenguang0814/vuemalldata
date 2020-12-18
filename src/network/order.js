import { request } from './request'
export function getOrder (data) {
  return request({
    url: '/orders',
    params: data
  })
}
export function removeOrder (id) {
  return request({
    url: '/removeorder',
    params: id
  })
}
export function getOrderById (id) {
  return request({
    url: '/order',
    params: id
  })
}
export function editOrder (data) {
  return request({
    method: 'post',
    url: '/order',
    data: data
  })
}
