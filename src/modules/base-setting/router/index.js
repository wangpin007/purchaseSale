
export default {
  path: '/baseSetting',
  name: 'baseSetting',
  component: () => import('@/layout'),
  redirect: {
    name: 'page1'
  },
  children: [
    {
      path: 'page1',
      component: () => import('mod@/base-setting/views/page1'),
      name: 'souIntroduced',
      meta: {
        title: 'page1',
        requiresAuth: true
      }
    },
    {
      path: 'page2',
      component: () => import('mod@/base-setting/views/page2'),
      name: 'inside',
      meta: {
        title: 'page2',
        requiresAuth: true
      }
    }
  ]
}
