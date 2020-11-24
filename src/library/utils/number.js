import Big from 'big.js'

/**
 * 数字分隔格式化处理
 * @param {Number|String} source 需要进行处理的数字
 * @param {Number} [length=3] 需要分隔的位数, 默认 3 位
 * @returns {String}
 */
export const comma = (source, length = 3) => {
  if (typeof source === 'undefined' || source === null) {
    return 0
  }

  source = String(source).split('.')
  source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{' + length + '})+$)', 'ig'), '$1,')
  return source.join('.')
}

/**
 * 百分比转数字
 * @param {Number|String} percent 百分比值
 * @param {Number} floatNumber 保留小数位
 * @returns {Number}
 */
export const percentToNumber = (percent, floatNumber = 2) => {
  if (typeof percent === 'string' && percent.indexOf('%') > -1) {
    percent = Number(percent.replace('%', ''))
  }
  percent = new Big(percent)

  return percent.div(100).toFixed(floatNumber).valueOf()
}

/**
 * 数字转百分比
 * @param {Number|String} number 数字
 * @param {Number} floatNumber 保留小数位
 * @returns {Number}
 */
export const numberToPercent = (number, floatNumber = 2) => {
  if (number === 'undefined' || number === null) return

  let result = 0
  number = new Big(number || 0)
  result = number.times(100).toFixed(floatNumber).valueOf()
  return `${result}%`
}
