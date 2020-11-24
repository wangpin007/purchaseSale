<template>
  <nav-tabs
    ref="tabs"
    :tabs-list="tabs"
    :cur-tab="activeTab"
  />
</template>
<script>
import NavTabs from 'lib@/components/NavTabs'
import List from './List'
export default {
  name: 'PrList',
  components: {
    NavTabs
  },
  data () {
    return {
      activeTab: 'praListSingle', // 当前激活标签  与name相同
      tabs: [{
        title: '列表一览',
        name: 'praListSingle',
        component: List,
        closable: false
      }],
      params: {

      }
    }
  }
}
</script>
