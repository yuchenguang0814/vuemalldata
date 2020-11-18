import { request } from './request'
export function getGoods (data) {
  return request({
    url: '/goods',
    params: data
  })
}

export function getGoodsCate () {
  return request({
    url: '/goodsCate'
  })
}
