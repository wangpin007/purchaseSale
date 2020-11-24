export default {
    path: '/stockManage',
    name: 'stockManage',
    component: () =>
        import ('@/layout'),
    redirect: {
        name: 'page1'
    },
    children: [{
            path: 'stockDifference',
            component: () =>
                import ('mod@/stockManage/views/mdm/stockDifference'),
            name: 'stockDifference',
            meta: {
                title: '库存盘点',
                requiresAuth: true
            }
        }, {
            path: 'allocation',
            component: () =>
                import ('mod@/stockManage/views/mdm/allocation'),
            name: 'allocation',
            meta: {
                title: '库存调拨',
                requiresAuth: true
            }
        },
        {
            path: 'onhandInventory',
            component: () =>
                import ('mod@/stockManage/views/mdm/onhandInventory'),
            name: 'onhandInventory',
            meta: {
                title: '库存现有量查询',
                requiresAuth: true
            }
        }, {
            path: 'warehouseDetail',
            component: () =>
                import ('mod@/stockManage/views/mdm/warehouseDetail'),
            name: 'inOutInventory',
            meta: {
                title: '出入库明细查询',
                requiresAuth: true
            }
        }, {
            path: 'historyInventory',
            component: () =>
                import ('mod@/stockManage/views/mdm/historyInventory'),
            name: 'historyInventory',
            meta: {
                title: '历史库存查询',
                requiresAuth: true
            }
        }, {
            path: 'transaction',
            component: () =>
                import ('mod@/stockManage/views/mdm/transaction'),
            name: 'transaction',
            meta: {
                title: '库存事务处理',
                requiresAuth: true
            }
        }, {
            path: 'stockAgeReport',
            component: () =>
                import ('mod@/stockManage/views/mdm/stockAgeReport'),
            name: 'stockAgeReport',
            meta: {
                title: '库龄分析报表',
                requiresAuth: true
            }
        },
    ]
}