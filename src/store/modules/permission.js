import { getInfo, getResuorceBySysAuth } from '@/api/user'
// import { moduleRoutes } from '@/router/routes'
// import { routesMock } from '@/router/routesMock'

// const allRoutes = [...moduleRoutes]

const state = {
  userInfo: {},
  routes: [],
  addRoutes: []
}

const mutations = {
  // 设置路由
  SET_ROUTES: (state, routes) => {
    // state.addRoutes = routes
    // state.routes = allRoutes.concat(routes)
  },
  // 设置用户信息
  SET_USER_INFO: (state, res) => {
    debugger
    state.userInfo = res
  }
}

const actions = {
  // 生成路由
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      // commit('SET_ROUTES', routesMock)
      // resolve(routesMock)
    })
  },
  /**
   * --初始化系统信息--
   * 获取用户信息
   * 获取菜单信息
   */
  initSystem({ commit }) {
    return Promise.all([getInfo(), getResuorceBySysAuth()]).then(res => {
      if (res[0].success && res[1]) {
        commit('SET_USER_INFO', res[0].data)
        commit('SET_ROUTES', res[1])
      }
      return res[0].success && res[1].success
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
