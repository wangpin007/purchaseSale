<template>
  <el-row
    class="row-layout"
    :gutter="gutter"
  >
    <el-col
      v-if="$slots.default"
      :span="spanNum"
    >
      <slot />
    </el-col>
    <el-col
      v-if="$slots.left && column === 3"
      :span="spanNum"
    >
      <slot name="left" />
    </el-col>
    <el-col
      v-if="$slots.center && column === 3"
      :span="spanNum"
      :offset="offsetNum"
    >
      <slot name="center" />
    </el-col>
    <el-col
      v-if="$slots.right && column === 3"
      :span="spanNum"
      :offset="offsetNum"
    >
      <slot name="right" />
    </el-col>
    <el-col
      v-if="$slots.span && column === 3"
      :span="spanNum * 2"
    >
      <slot name="span" />
    </el-col>
    <el-col
      v-if="$slots.long && column === 3"
      :span="spanNum * 2 + offsetNum"
      :offset="offsetNum"
    >
      <slot name="long" />
    </el-col>
    <el-col
      v-if="$slots.left && column === 2"
      :span="spanNum"
    >
      <slot name="left" />
    </el-col>
    <el-col
      v-if="$slots.right && column === 2"
      :span="spanNum"
      :offset="offsetNum"
    >
      <slot name="right" />
    </el-col>
    <el-col
      v-if="$slots.one && column === 1"
      :span="spanNum"
      :offset="offsetNum"
    >
      <slot name="one" />
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    column: {
      type: Number,
      default: 1
    },
    gutter: {
      type: Number,
      default: 0
    },
    span: {
      type: Number,
      default: 24
    },
    offsetNum: {
      type: Number,
      default: 0
    }
  },
  computed: {
    spanNum () {
      let offsetNum = this.column === 3 ? this.offsetNum * 2 : this.offsetNum
      return parseInt((this.span - offsetNum) / this.column, 10)
    }
  }
}
</script>

<style lang="scss">
</style>
