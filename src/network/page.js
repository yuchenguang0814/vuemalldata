import { request } from './request'
export function GetPageMultidata () {
  return request({
    url: '/page'
  })
}
