export default {
  path: "/system",
  name: "system",
  component: () => import("@/layout"),
  redirect: {
    name: "page1"
  },
  children: [
    {
      path: "dictionaryTab",
      component: () => import("mod@/system/views/mdm/dictionaryTab"),
      name: "dictionary",
      meta: {
        title: "字典",
        requiresAuth: true
      }
    },
    {
      path: "profile",
      component: () => import("mod@/system/views/mdm/profile"),
      name: "profile",
      meta: {
        title: "个人中心",
        requiresAuth: true
      }
    },
    {
      path: "factory",
      component: () => import("mod@/system/views/mdm/factory"),
      name: "factory",
      meta: {
        title: "工厂",
        requiresAuth: true
      }
    },
    {
      path: "workshop",
      component: () => import("mod@/system/views/mdm/workshop"),
      name: "workshop",
      meta: {
        title: "车间",
        requiresAuth: true
      }
    },
    {
      path: "productionLine",
      component: () => import("mod@/system/views/mdm/productionLine"),
      name: "productionLine",
      meta: {
        title: "产线",
        requiresAuth: true
      }
    },
    {
      path: "warehouse",
      component: () => import("mod@/system/views/mdm/warehouse"),
      name: "warehouse",
      meta: {
        title: "仓库",
        requiresAuth: true
      }
    },
    {
      path: "userPermission",
      component: () => import("mod@/system/views/mdm/userPermission"),
      name: "userPermission",
      meta: {
        title: "子用户管理",
        requiresAuth: true
      }
    },
    {
      path: "material",
      component: () => import("mod@/system/views/mdm/material"),
      name: "material",
      meta: {
        title: "物料",
        requiresAuth: true
      }
    },
    {
      path: "customer",
      component: () => import("mod@/system/views/mdm/customer"),
      name: "customer",
      meta: {
        title: "客户",
        requiresAuth: true
      }
    },
    {
      path: "customerMaterial",
      component: () => import("mod@/system/views/mdm/customerMaterial"),
      name: "customerMaterial",
      meta: {
        title: "客户物料对应关系",
        requiresAuth: true
      }
    },
    {
      path: "quickSearchConfig",
      component: () => import("mod@/system/views/mdm/quickSearchConfig"),
      name: "quickSearchConfig",
      meta: {
        title: "快速查询配置",
        requiresAuth: true
      }
    },
    {
      path: "container",
      component: () => import("mod@/system/views/mdm/container"),
      name: "container",
      meta: {
        title: "容器",
        requiresAuth: true
      }
    },
    {
      path: "containerType",
      component: () => import("mod@/system/views/mdm/containerType"),
      name: "containerType",
      meta: {
        title: "容器类型",
        requiresAuth: true
      }
    },
    {
      path: "conTypeAndMateRelation",
      component: () => import("mod@/system/views/mdm/conTypeAndMateRelation"),
      name: "conTypeAndMateRelation",
      meta: {
        title: "容器类型与物料关系",
        requiresAuth: true
      }
    },
    {
      path: "boxTypeAndMateRelation",
      component: () => import("mod@/system/views/mdm/boxTypeAndMateRelation"),
      name: "boxTypeAndMateRelation",
      meta: {
        title: "箱型与物料关系",
        requiresAuth: true
      }
    }
  ]
};