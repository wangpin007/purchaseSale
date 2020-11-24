const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  language: state => state.app.language,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  userInfo: state => state.user.userInfo,
  username: state => state.user.username,
  userId: state => state.user.id,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  slideMenu: state => state.user.slideMenu
}
export default getters
