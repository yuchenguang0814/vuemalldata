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
export function removeNew (id) {
  return request({
    url: '/removenew',
    params: id
  })
}
export function getVideos (data) {
  return request({
    url: '/videos',
    params: data
  })
}
export function AddVid (data) {
  return request({
    method: 'post',
    url: '/videos',
    data: data
  })
}
export function getVideoById (data) {
  return request({
    url: '/video',
    params: data
  })
}
export function removeVid (id) {
  return request({
    url: '/removevid',
    params: id
  })
}
