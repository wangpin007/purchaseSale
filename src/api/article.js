import http from '@/utils/http'

export function fetchList(query) {
  return http({
    url: '/article/list',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return http({
    url: '/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return http({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return http({
    url: '/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return http({
    url: '/article/update',
    method: 'post',
    data
  })
}
