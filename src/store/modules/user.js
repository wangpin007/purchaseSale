import { getToken } from '@/utils/auth'
const state = {
  token: getToken() || '',
  username: '',
  userInfo: {},
  userId: '',
  avatar: '',
  nickeyName: '',
  routers: [],
  slideMenu: []
};

const mutations = {
  // 设置token
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  // 设置用户名
  SET_NAME: (state, username) => {
    state.username = username;
  },
  // 设置用户信息
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo;
  },
  // 设置用户ID
  SET_USERID: (state, userId) => {
    state.userId = userId;
  },
  // 设置用户头像
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  // 设置路由
  SET_ROUTERS: (state, routers) => {
    state.routers = routers;
  },
  // 设置菜单
  SET_SLIDE_MENU: (state, slideMenu) => {
    state.slideMenu = slideMenu;
  }
};

const actions = {

};

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
