import http from '@/utils/http'
import routesMock from '@/router/routesMock'
// 用户相关
// 用户登录
export function login(params) {
  return http({
    url: '/pss/login',
    method: 'post',
    params: params
  })
}
// 获取用户信息
export function getInfo(params) {
  return http({
    url: '/pss/member/info/getByToken',
    method: 'post',
    params: {}
  })
}
// 用户退出
export function logout(params) {
  return http({
    url: '/pss/member/logout',
    method: 'post',
    params: params
  })
}

// 获取用户菜单
export function getResuorceBySysAuth(params) {
  // return routesMock
  return http({
    url: "/pss/member/info/getMenuByUserName",
    method: "post",
    params: params
  });
}

// 交换token
export function exchangeToken(params) {
  return http({
    url: '/pss/exchangeToken',
    method: 'post',
    data: params
  })
}
