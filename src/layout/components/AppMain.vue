<template>
  <section class="app-main">
    <transition
      name="fade-transform"
      mode="out-in"
    >
      <keep-alive :include="cachedViews">
        <router-view
          :key="key"
          class="app-main-container"
        />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews () {
      return this.$store.state.tagsView.cachedViews
    },
    key () {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  background-color: #edf0f2;
  font-size: 12px;
  display: flex;
  flex-flow: column;
  overflow: auto;
  min-height: calc(100vh - 40px);
  height: calc(100vh - 40px);
}
.app-main-container {
  margin: 10px 10px 0;
  background-color: #fff;
  flex: 1;
}
</style>

