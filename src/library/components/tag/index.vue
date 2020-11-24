/*
 * File: el-tag 组件封装
 * File Created: 2018-06-19 9:26:02 am
 * Author: chenjk7 (junkai.chen@meicloud.com)
 * Copyright: Copyright (c) 2016 深圳美云智数科技有限公司
 * -----
 * Last Modified: 2019-07-18 3:45:08 pm
 * Modified By: shizb1 (zhibiao.shi@meicloud.com)
 */

<template>
  <el-tag
    :type="type"
    :closable="closable"
    :disable-transitions="disableTransitions"
    :hit="hit"
    :color="color"
    :size="size"
    @close="handleClose"
  >
    <slot />
  </el-tag>
</template>

<script>
export default {
  name: 'Tag',
  props: {
    value: {
      type: [String, Number]
    },
    type: {
      type: String
    },
    closable: {
      type: Boolean,
      default: false
    },
    disableTransitions: {
      type: Boolean,
      default: false
    },
    hit: {
      type: Boolean,
      default: false
    },
    color: {
      type: String
    },
    size: {
      type: String
    },
    index: {
      type: Number,
      default: null
    }
  },
  methods: {
    handleClose () {
      this.$emit('close', {
        value: this.value,
        index: this.index
      })
    }
  }
}
</script>
