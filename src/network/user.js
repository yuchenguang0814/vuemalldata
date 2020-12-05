import { request } from './request'
export function EditUser (data) {
  return request({
    method: 'post',
    url: '/user',
    data: data
  })
}
