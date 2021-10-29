import { axiosPost } from '../utils/axios'

/**
 * 获取菜单
 * @param {*} params
 */
export const apiMenu = () => {
  return axiosPost('/admin/resource/menu')
}
