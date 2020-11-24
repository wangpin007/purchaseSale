<template>
  <content-loader :height="40">
    <!-- 1 -->
    <rect
      x="10"
      y="5"
      rx="1"
      ry="1"
      width="380"
      height="5"
    />
    <!-- 2 -->
    <rect
      x="10"
      y="15"
      rx="1"
      ry="1"
      width="100"
      height="5"
    />
    <rect
      x="120"
      y="15"
      rx="1"
      ry="1"
      width="270"
      height="5"
    />
    <!-- 3 -->
    <rect
      x="10"
      y="25"
      rx="1"
      ry="1"
      width="180"
      height="5"
    />
    <rect
      x="200"
      y="25"
      rx="1"
      ry="1"
      width="190"
      height="5"
    />
    <!-- 4 -->
    <rect
      x="10"
      y="35"
      rx="1"
      ry="1"
      width="40"
      height="5"
    />
    <rect
      x="60"
      y="35"
      rx="1"
      ry="1"
      width="180"
      height="5"
    />
    <rect
      x="250"
      y="35"
      rx="1"
      ry="1"
      width="140"
      height="5"
    />
  </content-loader>
</template>

<script>
import { ContentLoader } from 'vue-content-loader'

export default {
  name: 'CCollapsePanelSkeleton',
  components: {
    ContentLoader
  }
}
</script>
