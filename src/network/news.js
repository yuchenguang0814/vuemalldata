import { request } from './request'
export function getNews (data) {
  return request({
    url: '/news',
    params: data
  })
}
