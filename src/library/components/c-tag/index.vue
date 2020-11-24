<template>
  <div
    class="c-tag"
    :class="[
      colorType,
      customColorClass,
      {
        'ellipsis': ellipsis
      }
    ]"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'CTag',
  props: {
    colorType: {
      type: String,
      default: 'grey'
    },
    customColorClass: {
      type: String
    },
    ellipsis: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">
$blue: #409eff;
$green: #67C23A;
$orange: #E6A23C;
$red: #F56C6C;
$grey: #909399;

$borderLighten: #FFFFFF;

.c-tag {
  display: inline-block;
  min-width: 50px;
  padding: 0 8px;
  font-size: 12px;
  box-sizing: border-box;
  border-width: 1px;
  border-style: solid;
  white-space: nowrap;
  background-color: #FFFFFF;
  text-align: center;

  &.ellipsis {
    width: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
  }

  &.blue {
    color: $blue;
    border-color: softlight($blue, $borderLighten);
  }

  &.green {
    color: $green;
    border-color: softlight($green, $borderLighten);
  }

  &.orange {
    color: $orange;
    border-color: softlight($orange, $borderLighten);
  }

  &.red {
    color: $red;
    border-color: softlight($red, $borderLighten);
  }

  &.grey {
    color: $grey;
    border-color: softlight($grey, $borderLighten);
  }
}
</style>
