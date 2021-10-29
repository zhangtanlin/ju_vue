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
  return axiosPost('/admin/role', data)
}