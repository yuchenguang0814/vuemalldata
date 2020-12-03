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
