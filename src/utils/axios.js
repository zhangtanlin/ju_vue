import { getStorage, clearStorage } from '@/utils/storage'
import axios from 'axios'

/**
 * 返回值处理
 * @param {*} response 返回值
 * @function [clearStorage] - storageStorage清除指定值
 * @returns 
 */
 const callback = (response) => {
  if (response && response.status !== 200) {
    clearStorage('token')
    clearStorage('user-info')
    window.location.href = '/'
    return
  }
  return response.data
}

/**
 * get 请求
 * @param url    地址
 * @param params 参数
 * @function [getStorage] - storage获取指定值
 * @returns {Promise}
 * @link https://www.jianshu.com/p/5fd0ef1c4028
 */
export const axiosGet = async (
  url,
  params = {}, 
  headers = {
    'Content-Type': 'application/json',
    "Authorization": getStorage('token') || ''
  }
) => {
  try {
    const response = await axios.get(url, 
      { params },
      { headers: { ...headers, "Authorization": getStorage('token') } }
    )
    return callback(response)
  } catch (error) {
    console.log('请求失败')
  }
}

/**
 * post 请求
 * @param url  地址
 * @param data 参数
 * @returns {Promise}
 * @link https://www.jianshu.com/p/5fd0ef1c4028
 */
 export const axiosPost = async(
  url,
  data = {}, 
  headers = {
    'Content-Type': 'application/json',
    
  }
) => {
  try {
    const response = await axios.post(url,
      data,
      { headers: { ...headers, "Authorization": getStorage('token') } }
    )
    return callback(response)
  } catch (error) {
    console.log('请求失败')
  }
}
