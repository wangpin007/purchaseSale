module.exports = {
  title: '美云智数进销存',
  /**
   * @type {boolean} true | false
   * @description 是否在右侧显示设置按钮
   */
  showSettings: true,

  /**
   * @type {boolean} true | false
   * @description 是否需要标签视图
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description 是否固定头部
   */
  fixedHeader: false,

  /**
   * @type {boolean} true | false
   * @description 是否显示左边菜单上面的logo
   */
  sidebarLogo: true,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description 显示错误信息组件
   * 默认在生产环境使用
   * 如果开发环境使用可这样配置  ['production', 'development']
   */
  errorLog: 'production'
}
