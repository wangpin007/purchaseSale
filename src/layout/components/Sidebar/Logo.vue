<template>
  <div
    class="sidebar-logo-container"
    :class="{'collapse':collapse}"
  >
    <transition name="sidebarLogoFade">
      <router-link
        v-if="collapse"
        key="collapse"
        class="sidebar-logo-link"
        to="/"
      >
        <h1 class="sidebar-title collapse-title">
          <div class="zh">{{ title }}</div>
        </h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/" >
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 class="sidebar-title">
          <div class="zh">{{ title }}</div>
          <div class="en">{{ titleEn }}</div>
        </h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
import logoSrc from '@/assets/logo/meiyun-w.png'
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      title: '进销存云',
      logo: logoSrc, //'iconfont icon-jinxiaocun sidebar-logo'// logoSrc
      titleEn: 'P-S-I Cloud'
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%25;
  height: 60px;
  line-height: 60px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;
  border-bottom: 1px solid rgba(255,255,255,0.3);
  & .sidebar-logo-link {
    height: 100%25;
    width: 100%25;
    & .sidebar-logo {
      vertical-align: middle;
      margin-right: 12px;
      color: #fff;
    }
    & .sidebar-title {
      display: inline-block;
      padding-left: 9px;
      color: #fff;
      font-weight: normal;
      vertical-align: middle;
      font-family: 'Microsoft YaHei';
      position: relative;
      &::before{
        position: absolute;
        width: 1px;
        height: 14px;
        background: rgba(255,255,255,0.3);
        left: -2px;
        top: 7px;
        content: " ";
      }
      .zh{
        margin-top: 3px;
        font-size: 12px;
        line-height: 14px;
        text-align: left;
      }
      .en{
        margin-top: 1px;
        font-size: 12px;
        line-height: 12px;
        // transform: scale(0.7);
        -webkit-transform: scale(0.7);
        transform:scale(0.7);
        transform-origin: 0 0;
        -webkit-transform-origin: 0 0;
        -ms-transform-origin: 0 0;
        -moz-transform-origin: 0 0;
        -o-transform-origin: 0 0;
      }
    }
    & .collapse-title {
      padding-left: 0px;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
    & .sidebar-title{
      &::before{
        display: none;
      }
      .zh{
        padding-left: 0;
      }
    }
  }
}
</style>
