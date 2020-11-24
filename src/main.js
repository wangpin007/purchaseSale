import Vue from 'vue'
import Cookies from 'js-cookie'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import Element from 'element-ui'
import './styles/element-variables.scss'
import '@/styles/index.scss' // global css
import App from '@/views/app'
import store from './store'
import router from './router'
import i18n from './lang'
import dayjs from 'lib@/plugins/dayjs'
// icon 全局注册 svg-icon 组件
import './icons'
// iconfont 引入阿里字体图标
import '@/assets/iconfont/iconfont.css'
import './utils/error-log' // error log
import http from '@/utils/http'
Vue.prototype.$http = http // http
import { getLabelByValue } from '@/utils'
Vue.prototype.$getLabelByValue = getLabelByValue // 根据lov的value值获取显示值
import loadingInstance from '@/utils/loading'
Vue.prototype.$pageLoading = loadingInstance;// 加载动画loading

import * as filters from './filters'
import drag from '@/directive/el-drag-dialog/drag'

import { getToken, init } from '@/utils/auth'
Vue.directive('el-drag-dialog', drag);

Vue.use(Element, {
    size: Cookies.get('size') || 'small', // medium / small / miniset element-ui default size
    i18n: (key, value) => i18n.t(key, value)
})

// 注册指令
// 日期库
Vue.use(dayjs)

// json
import VueJsonp from 'vue-jsonp'
Vue.use(VueJsonp)

// register global utility filters
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
});

Vue.config.productionTip = false;

init().then(() => {
 new Vue({
    el: "#app",
    router,
    store,
    i18n,
    render: h => h(App)
  });
});

