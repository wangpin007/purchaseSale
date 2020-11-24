/* istanbul ignore next */
export const on = (function () {
  if (document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})()

/* istanbul ignore next */
export const off = (function () {
  if (document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
})()

// 获取元素高度, 包括 margin
export const outerHeight = (element) => {
  if (element) {
    const offsetHeight = element.offsetHeight
    const marginTopHeight = getStylePropertyValue(element, 'margin-top')
    const marginBottomHeight = getStylePropertyValue(element, 'margin-bottom')
    return Math.ceil(offsetHeight + marginTopHeight + marginBottomHeight)
  }
}

// 获取元素样式属性值
export const getStylePropertyValue = (element, property) => {
  if (typeof property !== 'string') {
    console.error('property must be string type.')
  }

  if (element) {
    let split = property.split('-')
    split = split.map((item, index) => {
      if (index > 0) {
        return item.replace(item[0], item[0].toUpperCase())
      }
      return item
    })
    const upperProperty = split.join('')

    return element.style[upperProperty] || parseFloat(window.getComputedStyle(element).getPropertyValue(property), 10)
  }
}
