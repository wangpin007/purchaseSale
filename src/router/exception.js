export default {
  path: '/exception',
  name: 'exception',
  component: () => import('@/layout'),
  children: [
    {
      path: '401',
      name: 'Exception401',
      component: () => import('@/views/error-page/401'),
      meta: {
        title: '401',
        noCache: true
      }
    },
    {
      path: '402',
      name: 'Exception402',
      component: () => import('@/views/error-page/402'),
      meta: {
        title: '402',
        noCache: true
      }
    },
    {
      path: '404',
      name: 'Exception404',
      component: () => import('@/views/error-page/404'),
      meta: {
        title: '404',
        noCache: true
      }
    },
    {
      path: '500',
      name: 'Exception500',
      component: () => import('@/views/error-page/500'),
      meta: {
        title: '500',
        noCache: true
      }
    }
  ]
}
