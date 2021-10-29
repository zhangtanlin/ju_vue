import { axiosPost } from "../utils/axios"

/**
 * 登陆
 * @param {object} [data]          - 登陆参数
 * @param {string} [data.account]  - 账号
 * @param {string} [data.password] - 密码
 */
export const apiLogin = (data) => {
  return axiosPost('/admin/user/login', data)
}

// 登出
export const apiLogout = () => {
  return axiosPost('/admin/user/logout')
}

/**
 * 获取用户列表
 * @param {*} data
 */
export const apiUserList = (data) => {
  return axiosPost('/admin/user/list', data)
}

/**
 * 新增用户
 * @param {*} data
 */
export const apiUserAdd = (data) => {
  return axiosPost('/admin/user/add', data)
}

/**
 * 根据id查询
 * @param {*} data 
 * @returns 
 */
export const apiUserById = (data) => {
  return axiosPost('/admin/user/id', data)
}

/**
 * 编辑用户
 * @param {object} [data]    - 更新用户接口参数
 * @param {object} [data.id] - *用户id
 */
export const apiUserEdit = (data) => {
  return axiosPost('/admin/user/edit', data)
}

/**
 * 删除用户
 * @param {object} [data]    - 删除用户接口参数
 * @param {object} [data.id] - *用户id
 */
export const apiUserDelete = (data) => {
  return axiosPost('/admin/user/delete', data)
}
