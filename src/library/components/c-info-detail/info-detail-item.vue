<template>
  <div class="info-detail-item">
    <div
      class="info-detail-item-label"
      :style="labelStyle"
    >
      <label>{{ label }}</label>
    </div>
    <div class="info-detail-item-content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CInfoDetailItem',
  props: {
    label: {
      type: String
    },
    labelWidth: {
      type: String
    }
  },
  computed: {
    labelStyle () {
      let style = {}
      let labelWidth = this.labelWidth || this.$parent.labelWidth

      if (labelWidth) {
        style.width = labelWidth
      }
      return style
    }
  }
}
</script>

<style lang="scss" scoped>
.info-detail-item {
  display: flex;
  box-sizing: border-box;
  border-left: 1px solid #E8E8E8;
  border-bottom: 1px solid #E8E8E8;

  &-label {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    background-color: #FAFAFA;
    border-right: 1px solid #E8E8E8;
  }

  &-content {
    flex: 1 1 auto;
    padding: 10px 20px 10px 10px;
  }
}
</style>
