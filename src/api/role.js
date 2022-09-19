import { axiosPost } from "../utils/axios"

/**
 * 获取角色列表【可以有分页条件，没有分页条件就查询全部】
 * @param {object} [data]             - 分页查询条件
 * @param {number} [data.id]          - id
 * @param {string} [data.name]        - 名称
 * @param {string} [data.type]        - 类型【{1:表示超级管理员，2:操作员，3:审计员, 4:其他}枚举是从1开始】
 * @param {number} [data.currentPage] - 页码
 * @param {number} [data.pageSize]    - 每页显示的条数
 */
 export const apiRoleList = (data) => {
  return axiosPost('/admin/role/list', data)
}

// 添加
export const apiUserAdd = (data) => {
  return axiosPost('/admin/role/add', data)
}

// 编辑
export const apiUserEdit = (data) => {
  return axiosPost('/admin/role/edit', data)
}

// 删除
export const apiUserDelete = (data) => {
  return axiosPost('/admin/role/delete', data)
}
