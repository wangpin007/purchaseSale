<template>
  <el-tooltip
    :disabled="!isDiff"
    :content="`变更前: ${beforeContent}`"
    placement="top"
    effect="light"
  >
    <slot />
  </el-tooltip>
</template>

<script>
export default {
  name: 'CShowTableCell',
  props: {
    isDiff: {
      type: Boolean,
      default: false
    },
    beforeContent: {
      type: [String, Number],
      default: ''
    }
  }
}
</script>
