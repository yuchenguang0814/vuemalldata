import { request } from './request'
export function GetPageMultidata () {
  return request({
    url: '/page'
  })
}
export function GetPageMultidataById (data) {
  return request({
    url: '/getpage',
    params: data
  })
}
export function GetPageChildMultidataById (data) {
  return request({
    url: '/getpagechild',
    params: data
  })
}
export function GetBanner () {
  return request({
    url: '/banner'
  })
}
export function AddBanner (data) {
  return request({
    method: 'post',
    url: '/banner',
    data: data
  })
}
export function removeBanner (id) {
  return request({
    url: '/removebanner',
    params: id
  })
}
export function editPageInfo (data) {
  return request({
    method: 'post',
    url: '/page',
    data: data
  })
}
export function editPageChildInfo (data) {
  return request({
    method: 'post',
    url: '/pagechild',
    data: data
  })
}
