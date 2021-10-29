/**
 * 把value添加到storageStorage指定key内
 * @param {string} [key]   - storageStorage的key
 * @param {string} [value] - storageStorage的值
 */
export const setStorage = (key, value) => {
  window.sessionStorage.setItem(key, value)
}
/**
 * 获取storageStorage指定key的值
 * @param {string} [key] - storageStorage的key
 */
export const getStorage = (key) => {
  return window.sessionStorage.getItem(key) || ''
}
/**
 * 删除storageStorage里面指定的key
 * @param {string} [key] - storageStorage的key
 */
export const clearStorage = (key) => {
  window.sessionStorage.clear(key)
}
