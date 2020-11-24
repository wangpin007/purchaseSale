import Cookies from 'js-cookie'
import { setTreeList, getUrlKey } from "@/utils"
import {
  logout as api_logout,
  exchangeToken as api_exchangeToken,
  getInfo,
  getResuorceBySysAuth
} from '@/api/user'
import router from '@/router'
import store from "@/store"
import menufilter from "@/utils/menufilter"
import config from '@/config/user.env'

const TokenKey = 'KeyToken' + process.env.VUE_APP_ENV;
const UserId = 'UserId';

// 取token值
export function getToken () {
  return Cookies.get(TokenKey)
}
// 取Id值
export function getUserId () {
  return Cookies.get(UserId)
}

// 设置token值
export function setToken (token) {
  return Cookies.set(TokenKey, token)
}
// 设置ID值
export function setUserId (Id) {
  return Cookies.set(UserId, Id)
}

// 删除
export function removeToken () {
  return Cookies.remove(TokenKey)
}
export function removeUserID () {
  return Cookies.remove(UserId)
}

// 退出登录
export function logout() {
  return new Promise(resolve => {
    api_logout().then((res) => {
      if(res.success){
        // afterLogout();
        clearStorage();
        // 点击退出登录后必须跳转到idm系统的退出登录地址才能触发清除ticket实现真正退出
        // 否则通过这接口 http://idaassit.meicloud.com/p3/ssoValidate还能获取到ticket，导致idm系统没有退出，我们系统已经退出
        goIdmSystem();
        resolve();
      }
    });
  });
}
// 退出登录后清除cookie, storage, 跳转登录
export function afterLogout(){
  let pageRouter =  getUrlKey('pageRouter');
  let pageParams = getUrlKey('pageParams');
  // let ticket = getUrlKey('ticket');
  clearStorage();
  router.push({
    path: '/login',
    query: {pageRouter, pageParams}
  });
}

// 调整idm系统
export function goIdmSystem() {
  /**
   *  dev拼接出来路径loginUrl
   *  http://idaassit.meicloud.com/login?service=http://10.17.149.191:8003/portal/
   *
   *  dev拼接出来路径logOutUrl
   *  http://idaassit.meicloud.com/logout?service=http://idaassit.meicloud.com/login?service=http://localhost:8080/
   */
  let loginUrl = config.singlePointLogin + window.location.origin + window.location.pathname;
  let LoginOutUrl = config.logoutUrl + loginUrl;
  window.location.href = LoginOutUrl;
}

// 交换token
export function exchangeToken(params) {
  return new Promise((resolve, reject) => {
    api_exchangeToken(params).then((res) => {
      if(res.success){
        setToken(res.data);
        resolve();
      } else {
        reject(res);
      }
    });
  });
}
/**
 * --初始化系统信息--
 * 获取用户信息
 * 获取菜单信息
 */
export function initSystem () {
  return new Promise(resolve => {
    Promise.all([getInfo(), getResuorceBySysAuth()]).then(res => {
      if (res[0].success && res[1]) {
        let userInfo = JSON.stringify(res[0].data);
        let slideMenu  = setTreeList(JSON.parse(res[1].data));
        sessionStorage.setItem('userInfo', userInfo);
        sessionStorage.setItem("slideMenu", JSON.stringify(slideMenu));
        resolve();
      }
    })
  });
}

export function init(){
  return new Promise(resolve => {
    const hasToken = getToken();
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    const slideMenu = JSON.parse(sessionStorage.getItem("slideMenu"));
    if (hasToken && userInfo) {
      let routers = menufilter(slideMenu);
      router.addRoutes(routers);
      store.commit("user/SET_ROUTERS", routers);
      store.commit("user/SET_SLIDE_MENU", slideMenu);
      store.commit("user/SET_USER_INFO", userInfo);
    }
    resolve()
  });
}

/**
 * 清除localstorage,sessionStorage,cookie
 */
export function clearStorage() {
  localStorage.clear();
  sessionStorage.clear();
  clearCookie()
}
/**
 * 清除所有cookie
 */
export function clearCookie () {
  var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
  if (keys) {
    for (var i = keys.length; i--;) {
      Cookies.remove(keys[i], {
        expires: new Date(0).toUTCString()
      });
      Cookies.remove(keys[i], {
        expires: new Date(0).toUTCString(),
        domain: getDomain()
      });
    }
  }
}
export const getDomain = (host = document.domain) => {
  let hostExts = ['.com', '.cn', '.net', '.cc', '.sh', '.org'];
  let ext = [];
  let reExt;
  let exist = false;
  for (var i = 0; i < hostExts.length; i++) {
    if (host.indexOf(hostExts[i]) !== -1) {
      ext[ext.length] = hostExts[i];
      reExt = new RegExp('\\' + hostExts[i]);
      host = host.replace(reExt, '{' + (ext.length - 1) + '}');
      exist = true;
    } else {
      break;
    }
  }
  if (!exist) {
    return host;
  }
  var hostarray = host.split('.');
  host = hostarray[hostarray.length - 1];
  for (let i = 0; i < ext.length; i++) {
    reExt = new RegExp('\\{' + i + '\\}');
    host = host.replace(reExt, ext[i]);
  }
  return host;
};
