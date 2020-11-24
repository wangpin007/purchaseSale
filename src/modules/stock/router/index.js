
export default {
  path: '/stock',
  name: 'stock',
  component: () => import('@/layout'),
  redirect: {
    name: 'page1'
  },
  children: [
    {
      path: 'warehousing',
      component: () => import('mod@/stock/views/mdm/warehousing'),
      name: 'warehousing',
      meta: {
        title: '入库单管理',
        requiresAuth: true
      }
    },{
      path: 'warehousingAdd',
      component: () => import('mod@/stock/views/mdm/warehousingAdd'),
      name: 'warehousingAdd',
      meta: {
        title: '入库单新增',
        requiresAuth: true
      }
    },
    {
      path: 'exwarehousing',
      component: () => import('mod@/stock/views/mdm/exwarehousing'),
      name: 'exwarehousing',
      meta: {
        title: '出库单管理',
        requiresAuth: true
      }
    },{
      path: 'exwarehousingAdd',
      component: () => import('mod@/stock/views/mdm/exwarehousingAdd'),
      name: 'exwarehousingAdd',
      meta: {
        title: '出库单新增',
        requiresAuth: true
      }
    },
    {
      path: 'salesWarehouse',
      component: () => import('mod@/stock/views/mdm/salesWarehouse'),
      name: 'salesWarehouse',
      meta: {
        title: '销售出库',
        requiresAuth: true
      }
    },
    {
      path: 'oemOutboundList',
      component: () => import('mod@/stock/views/mdm/oemOutboundList'),
      name: 'oemOutboundList',
      meta: {
        title: 'OEM成品出库',
        requiresAuth: true
      }
    }
  ]
}
