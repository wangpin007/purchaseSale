<template>
  <div class="info-detail">
    <h3 v-if="title">
      {{ title }}
    </h3>
    <div
      v-if="$slots.header"
      class="info-detail-header"
    >
      <slot name="header" />
    </div>
    <div class="info-detail-wrapper">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CInfoDetail',
  props: {
    title: {
      type: String
    },
    labelWidth: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
.info-detail {
  padding: 10px 0;

  h3 {
    margin-bottom: 10px;
  }

  .info-detail-header {
    padding: 5px 0;
  }

  .info-detail-wrapper {
    border-top: 1px solid #E8E8E8;
    border-right: 1px solid #E8E8E8;
  }
}
</style>
