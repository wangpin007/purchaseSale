import http from '@/utils/http'
// 角色相关

// 获取用户菜单
export function getRoutes() {
  return http({
    url: '/routes',
    method: 'get'
  })
}
// 获取角色
export function getRoles() {
  return http({
    url: '/roles',
    method: 'get'
  })
}
// 添加角色
export function addRole(data) {
  return http({
    url: '/role',
    method: 'post',
    data
  })
}
// 更新角色
export function updateRole(id, data) {
  return http({
    url: `/role/${id}`,
    method: 'put',
    data
  })
}

// 删除角色
export function deleteRole(id) {
  return http({
    url: `/role/${id}`,
    method: 'delete'
  })
}
