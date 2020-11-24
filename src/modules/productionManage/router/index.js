
export default {
  path: '/product',
  name: 'product',
  component: () => import('@/layout'),
  children: [
    {
      path: 'workOrderManage',
      component: () => import('mod@/productionManage/views/mdm/workOrderManage'),
      name: 'workOrderManage',
      meta: {
        title: '工单管理',
        requiresAuth: true
      }
    },
    {
      path: 'containerOffline',
      component: () => import('mod@/productionManage/views/mdm/containerOffline'),
      name: 'containerOffline',
      meta: {
        title: '容器下线完工',
        requiresAuth: true
      }
    },
    {
      path: 'mateOffline',
      component: () => import('mod@/productionManage/views/mdm/mateOffline'),
      name: 'mateOffline',
      meta: {
        title: '物料下线完工',
        requiresAuth: true
      }
    },
    {
      path: 'mateLabelPrint',
      component: () => import('mod@/productionManage/views/mdm/mateLabelPrint'),
      name: 'mateLabelPrint',
      meta: {
        title: '物料标签打印',
        requiresAuth: true
      }
    },
    {
      path: 'inspectWarehouse',
      component: () => import('mod@/productionManage/views/mdm/inspectWarehouse'),
      name: 'inspectWarehouse',
      meta: {
        title: '检验入库',
        requiresAuth: true
      }
    }
  ]
}
