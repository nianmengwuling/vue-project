/* 引入axis二次封装 */
import request from '@/utils/request'

/* 对外暴露接口 */
export function login(data) {
  return request({
    url: '/admin/acl/index/login',
    method: 'post',
    data
  })
}

/* 对外暴露用户信息 */
export function getInfo(token) {
  return request({
    url: '/admin/acl/index/info',
    method: 'get',
    params: { token }
  })
}

/* 对外暴露退出登陆 */
export function logout() {
  return request({
    url: '/admin/acl/index/logout',
    method: 'post'
  })
}
