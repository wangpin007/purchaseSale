const navTabs = {
  state: {
    tabTodo: {
      name: null, // 组件名
      methods: null, // 方法名
      params: null // 参数
    }
  },
  mutations: {
    SET_NAV_TABS_TODO: (state, data) => {
      state.tabTodo = data
    }
  },
  actions: {}
}

export default navTabs
