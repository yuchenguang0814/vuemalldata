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
