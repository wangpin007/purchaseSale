<template>
  <!-- 基于美的平台返回数据 -->
  <div v-if="!item.hidden" class="menu-wrapper">
    <!-- 只有单个 -->
    <template v-if="hasOneShowingChild(item.subNodes,item) && (!onlyOneChild.subNodes||onlyOneChild.noShowingChildren)">
      <app-link v-if="onlyOneChild" :to="resolvePath(onlyOneChild.fdFrontLink)">
        <el-menu-item :index="onlyOneChild.fdKey" :class="{'submenu-title-noDropdown':!isNest}">
          <i v-if="item.fdFrontIcon" :class="[iconfamily, item.fdFrontIcon]" />
          <span v-if="item.fdName" slot="title">{{ item.fdName }}</span>
        </el-menu-item>
      </app-link>
    </template>
    <!-- 多个 -->
    <el-submenu v-else ref="subMenu" :index="item.fdKey" popper-append-to-body>
      <template slot="title">
        <i v-if="item.fdFrontIcon" :class="[iconfamily, item.fdFrontIcon]" />
        <span v-if="item.fdName" slot="title">{{ item.fdName }}</span>
      </template>
      <sidebar-item-midea
        v-for="child in item.subNodes"
        :key="child.fdKey"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.fdFrontLink)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItemMidea',
  components: { AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data () {
    this.onlyOneChild = null
    return {
      iconfamily: 'iconfont'
    }
  },
  created () {
    // console.log(this.item)
  },
  methods: {
    hasOneShowingChild (children = [], parent) {
      // 显示的子节点
      const showingChildren = children.filter(item => {
        if (item.hidden) { // 节点隐藏
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath (routePath) {
      // 外链、邮箱、电话
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>

