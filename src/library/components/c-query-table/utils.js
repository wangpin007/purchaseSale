// 转换查询参数值类型
export function transformQueryValueType (target, typeMapper) {
  let result = Object.assign({}, target)

  for (let key in result) {
    const value = result[key]
    const valueType = typeMapper[key]

    result[key] = transformValueType(value, valueType)
  }

  return result
}

export function transformValueType (value, type) {
  let newValue = value

  if (value) {
    switch (type) {
      case 'number':
        newValue = Number(value)
        break
      case 'boolean':
        newValue = value === 'true'
        break
      case 'null':
        newValue = value === 'null'
        break
      default:
        break
    }
  }

  return newValue
}
