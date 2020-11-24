
export default {
  path: '/userManage',
  name: 'userManage',
  component: () => import('@/layout'),
  redirect: {
    name: 'userList'
  },
  children: [
    {
      path: 'userList',
      component: () => import('mod@/userManage/views/userList'),
      name: 'userList',
      meta: {
        title: '用户列表',
        requiresAuth: true
      }
    }, {
      path: 'list',
      component: () => import('mod@/userManage/views/demoList/ListTab'),
      name: 'listDemo',
      meta: {
        title: '列表demo',
        requiresAuth: true
      }
    }, {
      path: 'quicklist',
      component: () => import('mod@/userManage/views/demoList/QuickListTab'),
      name: 'quicklist',
      meta: {
        title: '快速查询配置',
        requiresAuth: true
      }
    }
  ]
}
