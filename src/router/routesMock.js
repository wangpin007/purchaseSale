// 左边菜单路由配置模拟接口返回数据配置
// fdId -- id设置唯一值
// fdKey -- 对应route下面的name值
// fdFrontLink  -- 对应route 下面的路由路径
// fdLangType -- 多语言类型
// fdFrontIcon  -- 对应的是icon 的class 阿里图标的 class值
// fdName -- 对应配置route的mate.title值
export default [
  // 用户列表
  /*{
    'fdId': '1116239393678790656',
    'fdKey': 'userManage',
    'fdFrontLink': null,
    'fdLangType': 'zh-CN',
    'fdFrontIcon': 'icongerenzhongxin',
    'fdName': '用户管理',
    'subNodes': [
      {
        'fdId': '1116239520441815040',
        'fdKey': 'userList',
        'fdFrontLink': '/userManage/userList',
        'fdLangType': 'zh-CN',
        'fdFrontIcon': null,
        'fdName': '用户列表',
        'subNodes': []
      },
      {
        'fdId': '1116239520441815041',
        'fdKey': 'listDemo',
        'fdFrontLink': '/userManage/list',
        'fdLangType': 'zh-CN',
        'fdFrontIcon': null,
        'fdName': '列表demo',
        'subNodes': []
      },{
        'fdId': '1116239520441815041',
        'fdKey': 'quicklist',
        'fdFrontLink': '/userManage/quicklist',
        'fdLangType': 'zh-CN',
        'fdFrontIcon': null,
        'fdName': '快速查询配置',
        'subNodes': []
      }
    ]
  },*/
  {
    'fdId': '1129231030553337856',
    'fdKey': 'ItemManager',
    'fdFrontLink': null,
    'fdLangType': 'zh-CN',
    'fdFrontIcon': 'icontrade',
    'fdName': '基础数据',
    'subNodes': [{
      'fdId': '1149245321670967297',
      'fdKey': 'dictionaryTab',
      'fdFrontLink': '/system/dictionaryTab',
      'fdLangType': 'zh-CN',
      'fdFrontIcon': null,
      'fdName': '字典',
      'subNodes': []
    },
      {
        'fdId': '1149245321670967300',
        'fdKey': 'factory',
        'fdFrontLink': '/system/factory',
        'fdLangType': 'zh-CN',
        'fdFrontIcon': null,
        'fdName': '工厂',
        'subNodes': []
      },
      {
        'fdId': '1202053239168286720',
        'fdKey': 'warehouse',
        'fdFrontLink': '/system/warehouse',
        'fdLangType': 'zh-CN',
        'fdFrontIcon': null,
        'fdName': '仓库',
        'subNodes': []
      },
      {
        'fdId': '1149245321670967296',
        'fdKey': 'material',
        'fdFrontLink': '/system/material',
        'fdLangType': 'zh-CN',
        'fdFrontIcon': null,
        'fdName': '物料',
        'subNodes': []
      }, {
        'fdId': '1149245321670967298',
        'fdKey': 'customer',
        'fdFrontLink': '/system/customer',
        'fdLangType': 'zh-CN',
        'fdFrontIcon': null,
        'fdName': '客户',
        'subNodes': []
      }, {
        'fdId': '1149245321670967299',
        'fdKey': 'customerMaterial',
        'fdFrontLink': '/system/customerMaterial',
        'fdLangType': 'zh-CN',
        'fdFrontIcon': null,
        'fdName': '客户物料对应关系',
        'subNodes': []
      }, {
        'fdId': '1149245321670967301',
        'fdKey': 'quickSearchConfig',
        'fdFrontLink': '/system/quickSearchConfig',
        'fdLangType': 'zh-CN',
        'fdFrontIcon': null,
        'fdName': '快速查询配置',
        'subNodes': []
      },
    ]
  },
  {
    'fdId': '1129231030553337857',
    'fdKey': 'stockInOut',
    'fdFrontLink': null,
    'fdLangType': 'zh-CN',
    'fdFrontIcon': 'icontrade',
    'fdName': '出入库单',
    'subNodes': [{
      'fdId': '1202053239168286730',
      'fdKey': 'instock',
      'fdFrontLink': '/stock/warehousing',
      'fdLangType': 'zh-CN',
      'fdFrontIcon': null,
      'fdName': '入库单管理',
      'subNodes': []
    }, {
      'fdId': '1202053239168286731',
      'fdKey': 'outstock',
      'fdFrontLink': '/stock/exwarehousing',
      'fdLangType': 'zh-CN',
      'fdFrontIcon': null,
      'fdName': '出库单管理',
      'subNodes': []
    },]
  },
  {
    'fdId': '1129231030553337867',
    'fdKey': 'stockManager',
    'fdFrontLink': null,
    'fdLangType': 'zh-CN',
    'fdFrontIcon': 'icontrade',
    'fdName': '库存管理',
    'subNodes': [{
      'fdId': '1202053239168281119',
      'fdKey': 'stockDifference',
      'fdFrontLink': '/stockManage/stockDifference',
      'fdLangType': 'zh-CN',
      'fdFrontIcon': null,
      'fdName': '库存盘点',
      'subNodes': []
    },
      {
        'fdId': '1202053239168286740',
        'fdKey': 'allocation',
        'fdFrontLink': '/stockManage/allocation',
        'fdLangType': 'zh-CN',
        'fdFrontIcon': null,
        'fdName': '库存调拨',
        'subNodes': []
      }, {
        'fdId': '1202053239168286739',
        'fdKey': 'transaction',
        'fdFrontLink': '/stockManage/transaction',
        'fdLangType': 'zh-CN',
        'fdFrontIcon': null,
        'fdName': '库存事务处理',
        'subNodes': []
      }, {
        'fdId': '1202053239168286741',
        'fdKey': 'onhandInventory',
        'fdFrontLink': '/stockManage/onhandInventory',
        'fdLangType': 'zh-CN',
        'fdFrontIcon': null,
        'fdName': '库存现有量查询',
        'subNodes': []
      }, {
        'fdId': '1202053239168286742',
        'fdKey': 'inOutInventory',
        'fdFrontLink': '/stockManage/warehouseDetail',
        'fdLangType': 'zh-CN',
        'fdFrontIcon': null,
        'fdName': '出入库明细查询',
        'subNodes': []
      }, {
        'fdId': '1202053239168286743',
        'fdKey': 'historyInventory',
        'fdFrontLink': '/stockManage/historyInventory',
        'fdLangType': 'zh-CN',
        'fdFrontIcon': null,
        'fdName': '历史库存查询',
        'subNodes': []
      }, {
        'fdId': '1202053239168286437',
        'fdKey': 'stockAgeReport',
        'fdFrontLink': '/stockManage/stockAgeReport',
        'fdLangType': 'zh-CN',
        'fdFrontIcon': null,
        'fdName': '库龄分析报表',
        'subNodes': []
      },
    ]
  },
  {
    'fdId': '1129231030553337857',
    'fdKey': 'productionManage',
    'fdFrontLink': null,
    'fdLangType': 'zh-CN',
    'fdFrontIcon': 'icontrade',
    'fdName': '生产管理',
    'subNodes': [
      {
        'fdId': '1202053239168286730',
        'fdKey': 'workOrderManage',
        'fdFrontLink': '/productionManage/workOrderManage',
        'fdLangType': 'zh-CN',
        'fdFrontIcon': null,
        'fdName': '工单管理',
        'subNodes': []
      },
      {
        'fdId': '1202053239168286731',
        'fdKey': 'containerOffline',
        'fdFrontLink': '/productionManage/containerOffline',
        'fdLangType': 'zh-CN',
        'fdFrontIcon': null,
        'fdName': '容器下线完工',
        'subNodes': []
      },
    ]
  }
]