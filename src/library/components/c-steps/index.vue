/*
 * File: index.vue
 * File Created: 2019-04-24 10:45:45 am
 * Author: shizb1 (zhibiao.shi@meicloud.com)
 * Copyright: 2017 - 2019 Copyright (c), 深圳美云智数科技有限公司
 * -----
 * Last Modified: 2019-07-09 10:25:03 am
 * Modified By: chenjk7 (junkai.chen@meicloud.com)
 */
<template>
  <el-steps
    class="c-steps"
    :direction="direction"
    :space="space"
    :active="active"
    :process-status="processStatus"
    :finish-status="finishStatus"
    :align-center="alignCenter"
  >
    <el-step
      v-for="(item, index) in stepList"
      :key="index"
      :title="item.title"
      :description="item.description"
      :icon="item.icon"
    >
      <!-- 自定义图标 -->
      <i
        v-if="item.slot && item.slot.icon"
        slot="icon"
        :class="item.slot.icon"
      />
    </el-step>
  </el-steps>
</template>

<script>
export default {
  name: 'CSteps',
  props: {
    stepList: {
      type: Array,
      default: () => []
    },
    // 方向 vertical / horizontal
    direction: {
      type: String,
      default: 'horizontal'
    },
    // 间距
    space: {
      type: [Number, String],
      default: 128
    },
    // 当前激活步骤
    active: {
      type: Number,
      default: 0
    },
    // 当前步骤的状态 wait / process / finish / error / success
    processStatus: {
      type: String,
      default: 'process'
    },
    // 结束步骤的状态 wait / process / finish / error / success
    finishStatus: {
      type: String,
      default: 'success'
    },
    // 文字居中对齐
    alignCenter: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss">
// $primary-color: #409EFF;
.c-steps {
  display: flex;
  justify-content: center;
  min-width: 320px;

  .el-step__head {
    // normal状态
    .el-step__icon {
      &.is-text {
        border: 1px solid #A8ACB1;
        font-size: 12px;
        font-weight: normal;
        color: #A8ACB1;
        background: #FFFFFF;
      }
    }

    &.is-process {
      .el-step__icon {
        &.is-text {
          border: 1px solid $primary-color;
          color: #FFFFFF;
          background: $primary-color;
        }
      }
    }

    &.is-success {
      .el-step__icon {
        &.is-text {
          border: 1px solid $primary-color;
          background: #FFFFFF;
          color: $primary-color;
        }
      }

      .el-step__line-inner {
        border-color: $primary-color;
      }
    }

    .el-step__line {
      height: 1px;
      background: $primary-color;
    }
  }

  .el-step__main {
    .el-step__title {
      font-size: 12px;
      font-weight: normal;
      color: #63686A;

      &.is-success {
        color: $primary-color;
      }

      &.is-process {
        color: $primary-color;
      }
    }
  }
}
</style>
