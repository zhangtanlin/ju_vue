
// 清除对象里面的空属性
export const removeEmpty = (obj) => {
  for (var key in obj) {
    if (
      obj[key] === '' ||
      obj[key] === 'null' ||
      obj[key] === null ||
      obj[key] === undefined
    ) {
      delete obj[key]
    }
  }
  return obj || {}
}

// 文件地址，去掉后缀
export const removeSuffix = (str) => {
  let getSuffix = str.split('.').pop().toLowerCase();
  let remove = str.replace(`.${getSuffix}`, '')
  return remove;
}

// 获取两个数的百分比
export const percentage = (total, index) => {
  return (Math.round(index / total * 10000)/100.00) ?? 0
}