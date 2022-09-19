import { axiosPost } from '../utils/axios'

/**
 * 上传之前的验证
 * @param {object} [data]     - 参数
 * @param {string} [data.md5] - md5值
 */
 export const apiUploadVideoBefore = (data) => {
  return axiosPost('/admin/upload/video_before', data)
}

/**
 * 上传
 * @param {object} [data]     - 参数
 * @param {string} [data.md5] - md5值
 */
 export const apiUploadVideo = (data) => {
  return axiosPost('/admin/upload/video',
    data,
    {
      "Content-Type": "multipart/form-data" 
    }
  )
}
