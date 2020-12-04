import { request } from './request'
export function EditLogo () {
  return request({
    url: '/logo',
  })
}