import { request } from './request'
export function getGoods (data) {
  return request({
    url: '/goods',
    params: data
  })
}
export function getGood (data) {
  return request({
    url: '/good',
    params: data
  })
}
export function addgoods (data) {
  return request({
    method: 'post',
    url: '/goods',
    data: data
  })
}

export function getGoodsCate () {
  return request({
    url: '/goodsCate'
  })
}
