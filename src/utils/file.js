import axios from 'axios'
import { getToken } from '@/utils/auth'

/**
 * 获取文件后缀
 * @param {String} filename 文件名
 * @returns {String}
 */
export function getFileExt (filename) {
  let ext = ''

  if (typeof filename === 'string') {
    const filenameSplit = filename.split('.')
    ext = filenameSplit[filenameSplit.length - 1]
  }

  return ext
}

/**
 * 文件大小转换
 * @param {Number} byte 文件字节数
 * @param {String} unit 转换单位
 */
export function getFileByteFormat (byte, unit) {
  const conversion = {
    'K': 1024,
    'M': 1024 * 1024,
    'G': 1024 * 1024 * 1024,
    'T': 1024 * 1024 * 1024 * 1024
  }
  const unitList = ['K', 'M', 'G', 'T']
  let result = 0

  if (typeof byte !== 'number') {
    throw new Error('byte must be a number type.')
  }

  if (unit && unitList.indexOf(unit) === -1) {
    throw new Error('unit must be a string value of [\'K\', \'M\', \'G\', \'T\'].')
  }

  if (typeof unit === 'undefined') {
    let currentUnit
    for (let i = 0, len = unitList.length; i < len; i++) {
      currentUnit = unitList[i]
      result = byte / conversion[currentUnit]
      if (result < 1024) {
        break
      }
    }
    return `${result.toFixed(2)} ${currentUnit}`
  } else {
    result = byte / conversion[unit]
    return `${result.toFixed(2)} ${unit}`
  }
}

/**
 * 浏览器下载文件流
 * @param {String} content 文件流
 * @param {String} filename 文件名
 */
export function downloadFileStream (content, filename = Date.now()) {
  const blob = new Blob([content])
  const $link = document.createElement('a')

  if ('download' in $link) { // 非IE下载
    $link.download = filename
    $link.style.display = 'none'
    $link.href = URL.createObjectURL(blob)
    document.body.appendChild($link)
    $link.click()
    URL.revokeObjectURL($link.href) // 释放URL 对象
    document.body.removeChild($link)
  } else { // IE10+下载
    navigator.msSaveBlob(blob, filename)
  }
}
/**
 * 直接点击下载的文件
 */
export function downloadExtFileLink (downloadLink) {
  const url = downloadLink
  const $link = document.createElement('a')
  $link.style.display = 'none'
  $link.href = url
  document.body.appendChild($link)
  $link.click()
  window.URL.revokeObjectURL($link.href)
  document.body.removeChild($link)
}

/**
 * 浏览器下载文件链接
 * @param {String} downloadLink 文件下载链接
 * @param {String} filename 文件名
 */
export function downloadFileLink (downloadLink, filename = Date.now(),data ={}, callback = () => {}) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: downloadLink,
      headers: {
        // Authorization: 'Bearer ' + getToken()
        Authorization:  getToken()
      },
      data: data,
      responseType: 'blob'
    }).then((response) => {
      const { data, headers } = response
      const blob = new Blob([data]) // 创建一个类文件对象：Blob对象表示一个不可变的、原始数据的类文件对象
      const url = window.URL.createObjectURL(blob) // URL.createObjectURL(object)表示生成一个File对象或Blob对象
      let dom = document.createElement('a') // 设置一个隐藏的a标签，href为输出流，设置download
      dom.style.display = 'none'
      dom.href = url
      dom.setAttribute('download', filename) // 指示浏览器下载url,而不是导航到它；因此将提示用户将其保存为本地文件
      document.body.appendChild(dom)
      dom.click()
    }).catch((error) => {
      reject(error)
    })
  })
}
export function downloadFileLinkByGet (downloadLink, filename = Date.now(),data ={}, callback = () => {}) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: downloadLink,
      headers: {
        // Authorization: 'Bearer ' + getToken()
        Authorization:  getToken()
      },
      params: data,
      responseType: 'blob'
    }).then((response) => {
      const { data, headers } = response
      const blob = new Blob([data]) // 创建一个类文件对象：Blob对象表示一个不可变的、原始数据的类文件对象
      const url = window.URL.createObjectURL(blob) // URL.createObjectURL(object)表示生成一个File对象或Blob对象
      let dom = document.createElement('a') // 设置一个隐藏的a标签，href为输出流，设置download
      dom.style.display = 'none'
      dom.href = url
      dom.setAttribute('download', filename) // 指示浏览器下载url,而不是导航到它；因此将提示用户将其保存为本地文件
      document.body.appendChild(dom)
      dom.click()
    }).catch((error) => {
      reject(error)
    })
  })
}
