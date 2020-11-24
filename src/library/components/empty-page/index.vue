/*
 * File: index.vue
 * File Created: 2018-10-22 5:16:22 pm
 * Author: wangji (ji1.wang@meicloud.com)
 * Copyright: 2017 - 2018 Copyright (c), 深圳美云智数科技有限公司
 * -----
 * Last Modified: 2019-04-22 1:46:45 pm
 * Modified By: shizb1 (zhibiao.shi@meicloud.com)
 */

<template>
  <div class="empty-page-container">
    <div class="empty-page-content">
      <div class="empty-page-image" />
      <div class="empty-page-text">
        {{ promptText }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmptyPage',
  props: {
    promptText: {
      type: String,
      default: '敬请期待，正在玩命开发中~'
    }
  }
}
</script>

<style lang="scss">
.empty-page-container {
  position: relative;
  height: 100%;
  overflow: hidden;
}

.empty-page-content {
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}

.empty-page-image {
  margin: 0 auto;
  width: 300px;
  height: 150px;
  background: url(./assets/empty.png) center center no-repeat;
  background-size: contain;
}

.empty-page-text {
  margin-top: 20px;
  font-size: 18px;
  line-height: 1.5;
  color: #dbddea;
  text-align: center;
}
</style>
