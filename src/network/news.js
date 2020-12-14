import { request } from './request'
export function getNews (data) {
  return request({
    url: '/news',
    params: data
  })
}
export function AddNew (data) {
  return request({
    method: 'post',
    url: '/news',
    data: data
  })
}
export function getNewById (data) {
  return request({
    url: '/new',
    params: data
  })
}
export function editNew (data) {
  return request({
    method: 'post',
    url: '/new',
    data: data
  })
}
