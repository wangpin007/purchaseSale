## 目的

 本文档主要用于描述美的SRM云的技术选型、大致功能、开发规范，为前端开发人员和测试人员提供文档依据

## 目标

 实现SRM的系统功能实现
 1、基础数据配置
 2、权限管理
 3、菜单管理
 4、组织管理
 5、SRM其他相关的功能
 6、路由配置注意事项 （路由在权限云平台那边配置）
   fdKey 对应route下面的name值
   fdFrontLink  对应route 下面的路由路径
   fdFrontIcon  对应的是icon 的class 阿里图标的 class值
   fdName  对应配置route的mate.title值

## 技术选型

- vue(v2.6.10) + vue-element + axios + vue-router + vuex 技术栈

## 开发环境和生产环境部署

### Getting started

```bash
# clone the project
git clone git@git.meicloud.com:xiezuoyun/cdc_quality.git

# enter the project directory
cd cdc_quality

# install dependency
npm install

# develop
npm run dev
```

This will automatically open http://localhost:8080

### Build

```bash
# build for test environment
npm run build:sit

# build for uat environment
npm run build:uat

# build for production environment
npm run build:prod
```

## Advanced

```bash
#  预览发布环境效果
npm run preview

# 预览发布环境效果+静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查和自动修复
npm run lint -- --fix
```

## 用户登录方案

### 单点登录

### 单独系统用户登录
