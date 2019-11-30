/**
 * 数据类型判断
 * @param {Array<any>} datas
 */
exports.isArray = (...datas) =>
  datas.every(data => Object.prototype.toString.call(data) === '[object Array]')
exports.isObject = (...datas) =>
  datas.every(
    data => Object.prototype.toString.call(data) === '[object Object]'
  )
exports.isRefType = (...datas) =>
  datas.every(data => isArray(data) || isObject(data))
exports.isNullPointer = (...datas) =>
  datas.every(
    data =>
      ~['[object Undefined]', '[object Null]'].indexOf(
        Object.prototype.toString.call(data)
      )
  )

/**
 * obj for loop
 * @param {Array | Object} obj
 * @param {Function} fn
 */
exports.forEach = function(obj, fn) {
  if (isNullPointer(obj)) return

  if (typeof obj !== 'object') obj = [obj]

  if (isArray(obj)) return obj.forEach(fn)

  Object.keys(obj).forEach(k => void fn.call(null, obj[k], k, obj))
}

/**
 * 合并对象
 * @param  {...any} args
 */
exports.merge = (...args) =>
  args.reduce(
    (result, obj) => (
      forEach(
        obj,
        (val, key) =>
          (result[key] = isObject(result[key], val)
            ? merge(result[key], val)
            : val)
      ),
      result
    ),
    {}
  )
