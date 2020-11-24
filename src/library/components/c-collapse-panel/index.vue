<template>
  <div class="c-collapse-panel">
    <!-- 面板头部 -->
    <div
      class="panel-header"
      :class="{
        'pannel-header-underline': showBorder,
        'pannel-header-can-collapse': canCollapse,
      }"
      @click="handleIconClick"
    >
      <div class="header-left">
        <span class="panel-title">{{ title }}</span>
        <i
          v-if="canCollapse"
          class="collapse-icon el-icon-arrow-up"
          :class="{ 'collapse-icon-expanded' : !expandedStatus }"
        />
        <span
          v-if="$slots.left"
          class="left-wrapper"
        >
          <slot name="left" />
        </span>
      </div>
      <div
        v-if="$slots.right"
        class="header-right"
        @click.stop
      >
        <slot name="right" />
      </div>
    </div>
    <!-- 折叠区域 -->
    <el-collapse-transition>
      <div
        v-show="expandedStatus"
        class="pannel-content"
      >
        <slot
          v-if="expandedStatus && loading"
          name="skeleton"
        >
          <skeleton />
        </slot>
        <slot v-else />
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import Skeleton from './skeleton'

export default {
  name: 'CCollapsePanel',
  components: {
    Skeleton
  },
  props: {
    // 默认展开状态
    expanded: {
      type: Boolean,
      default: true
    },
    // 是否可折叠，默认可折叠
    canCollapse: {
      type: Boolean,
      default: true
    },
    // 是否展示下划线，默认展示
    showBorder: {
      type: Boolean,
      default: true
    },
    // 面板标题
    title: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      expandedStatus: true // 展开状态
    }
  },
  watch: {
    expanded: {
      handler (val) {
        this.expandedStatus = val
      },
      immediate: true
    }
  },
  methods: {
    handleIconClick () {
      if (this.canCollapse) {
        this.expandedStatus = !this.expandedStatus
      }
    }
  }
}
</script>

<style lang="scss">
.c-collapse-panel {
  margin-bottom: 16px;

  .panel-header {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    height: 34px;
    line-height: 18px;
    font-size: 12px;
    color: #3F4243;
    user-select: none;

    &.pannel-header-underline {
      border-bottom: 1px solid #f6f6ff;
    }

    &.pannel-header-can-collapse {
      cursor: pointer;
      background: #f6f6ff;
      padding: 0 8px;
    }

    .header-left {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;

      .panel-title {
        font-size: 12px;
        font-weight: bold;
      }

      .collapse-icon {
        display: flex;
        align-items: center;
        margin-left: 8px;
        transition: all .3s;

        &.collapse-icon-expanded {
          transform: rotate(180deg);
        }
      }

      .left-wrapper {
        padding: 0 16px;
      }
    }
  }

  .pannel-content {
    padding: 8px;
    box-sizing: border-box;
  }
}
</style>
