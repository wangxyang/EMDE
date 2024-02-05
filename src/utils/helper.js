/**
 * Flatten结构 优化state
 * @param {*} arr 
 * @returns 
 */
export const flattenArr = (arr) => {
    return arr.reduce((map, item) => {
      map[item.id] = item
      return map
    }, {})
  }
  
/**
 * object对象转数组
 * @param {*} obj 
 * @returns 
 */
export const objToArr = (obj) => {
  return Object.keys(obj).map(key => obj[key])
}

  /**
   * 获取父节点属性
   * @param {*} node 
   * @param {*} parentClassName 
   * @returns 
   */
export const getParentNode = (node, parentClassName) => {
  let current = node
  while(current !== null ) {
    if(current.classList.contains(parentClassName)){
      return current
    }
    current = current.parentNode
  }
  return false
}