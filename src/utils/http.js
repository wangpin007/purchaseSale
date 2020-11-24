import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, removeToken, afterLogout } from '@/utils/auth'
import config from '@/config/user.env'
import loadingInstance from '@/utils/loading'

let loadInstance;  // 页面加载效果
const hideLoading = function () {
  loadInstance && loadInstance.close()
  loadInstance = null
}
// create an axios instance
const http = axios.create({
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 35000, // request timeout
  ContentType: 'application/json'
})

// axios.defaults.timeout = 35000 // 请求超时时间
// axios.defaults.headers.withCredentials = true
// axios.defaults.headers.ContentType = 'application/json'

// request interceptor
http.interceptors.request.use(
  config => {
    // 显示页面加载效果
    if (config.loading === true && !loadInstance) {
      loadInstance = loadingInstance.open()
    }
    const token = getToken();
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
http.interceptors.response.use(
  response => {
    hideLoading();
    const res = response.data
    // if the custom code is not 000, it is judged as an error.
    if (res.retCode !== '000') {
      // 未续费
      if (res.retCode === '004') {
        // to re-login
        store.commit('user/SET_TOKEN', '')
        removeToken()
        store.commit('user/SET_USERINFO', {})
        sessionStorage.setItem('userInfo', '')
        MessageBox.confirm(response.data.retMsg, '提示', { // 提示跳转登录
          confirmButtonText: '前往续费',
          cancelButtonText: '跳过',
          type: 'warning'
        }).then(() => {
          window.location.href = config.renew
        }).catch(() => {
          next({ path: '/' })
        })
      }
      // 未登陆
      else if (res.retCode === '002') {
        afterLogout();
        // to re-login
        // store.commit('user/SET_TOKEN', '')
        // removeToken()
        // store.commit('user/SET_USERINFO', {})
        // sessionStorage.setItem('userInfo', '')
        // MessageBox.confirm(response.data.retMsg, '提示', { // 提示跳转登录
        //   confirmButtonText: '前往登录',
        //   cancelButtonText: '跳过',
        //   type: 'warning'
        // }).then(() => {
        //   let url = window.location.origin+window.location.pathname
        //   let LoginUrl = config.singlePointLogin + encodeURI(url) // window.location.href
        //   sessionStorage.setItem('Url',url)
        //   window.location.href = LoginUrl
        // }).catch(() => {
        //   // next({ path: '/' })
        //   let url = window.location.origin + window.location.pathname;
        //   let LoginUrl = baseConfig.singlePointLogin + encodeURI(url); // window.location.href
        //   sessionStorage.setItem("Url", url);
        //   window.location.href = LoginUrl;
        // })
      }
      // 未认证
      else if (res.retCode === '003') {
        MessageBox.confirm(response.data.retMsg, '提示', { // 提示跳转登录
            confirmButtonText: '前往认证',
            cancelButtonText: '跳过',
            type: 'warning'
        }).then(() => {
          let authUrl = config.authInfoUrl
          window.location.href = authUrl
        }).catch(() => {
            let url = config.singlePointLogin + window.location.origin+window.location.pathname
            sessionStorage.setItem('Url',window.location.origin+window.location.pathname)
            let LoginOutUrl = config.logoutUrl + encodeURI(url)
            window.location.href = LoginOutUrl
            // router.push({
            //     path: '/'
            // })
        })
      }else{
        Message({
          message: res.retMsg || 'Error',
          type: 'error'
        })
      }
      return Promise.reject(new Error(res.retMsg || 'Error'))
    } else { // success
      return res
    }
  },
  error => {
    hideLoading()
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
export default http
