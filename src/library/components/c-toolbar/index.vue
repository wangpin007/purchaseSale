<template>
  <div
    class="c-toolbar"
    :class="{ collapsed: sideBarCollapsed }"
  >
    <slot />
    <div
      v-if="$slots.center"
      class="center"
    >
      <slot name="center" />
    </div>
    <div
      v-if="$slots.right"
      class="right"
    >
      <slot name="right" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'CToobar',
  computed: {
    ...mapState({
      sideBarCollapsed: state => state.app.sideBarCollapsed
    })
  }
}
</script>

<style lang="scss">
.c-toolbar {
  position: fixed;
  width: 100%;
  // min-height: 50px;
  padding: 16px 24px;
  // line-height: 40px;
  padding-left: $sideBarWidth + 16;
  left: 0;
  bottom: 0;
  transition: padding-left .28s;
  box-sizing: border-box;
  background-color: #FFFFFF;
  box-shadow: 0 -1px 2px 0 rgba(182, 182, 182, .5);
  overflow: hidden;
  z-index: 999;

  &.collapsed {
    padding-left: $collapseWidth + 16;
  }

  .right {
    float: right;
    display: flex;
    align-items: center;
  }

  .center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
