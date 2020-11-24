import Vue from 'vue'
import { getResuorceBySysAuth } from '@/api/common'

const filterSubNodes = (subNodes, currentMenu, authName) => {
  let isAuthority = false
  if (!currentMenu) {
    subNodes.forEach(sub => {
      if (sub.fdKey === authName) {
        isAuthority = true
      } else if (sub.subNodes.length > 0 && !isAuthority) {
        isAuthority = filterSubNodes(sub.subNodes, currentMenu, authName)
      }
    })
  } else {
    subNodes.forEach(sub => {
      if (sub.fdKey === currentMenu) {
        sub.subNodes.forEach(resource => {
          if (resource.fdKey === authName) {
            isAuthority = true
          }
        })
      } else if (sub.subNodes.length > 0 && !isAuthority) {
        isAuthority = filterSubNodes(sub.subNodes, currentMenu, authName)
      }
    })
  }
  return isAuthority
}

/**
 * 用户鉴权 指令
 *  [*]不需要鉴权
 */
Vue.directive('display', {
  bind (el, binding) {
    getResuorceBySysAuth().then(res => {
      const menus = res.data
      const authName = binding.value.btnFdKey
      const currentMenu = binding.value.menuFdKey
      const styleDisplay = el.style.display
      menus.forEach(menu => {
        let { href } = window.location
        if (href.indexOf('.html') < 0) {
          href = `${href.split('#')[0]}index.html#${href.split('#')[1]}`
        }
        if (href.indexOf(menu.fdFrontLink) > 0) {
          if (filterSubNodes(menu.subNodes, currentMenu, authName)) {
            el.style.display = styleDisplay
          } else {
            el.style.display = 'none'
          }
        }
      })
    })
  }
})
