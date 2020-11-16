import { request } from './request'
export function PostLogin (data) {
  return request({
    method: 'post',
    url: '/login',
    data: data
  })
}
