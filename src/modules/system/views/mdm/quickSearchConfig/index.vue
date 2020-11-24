<template>
  <el-container direction="vertical">
    <el-main>
      <nav-tabs
        :tabs-list="tabs"
        :cur-tab="activeTab"
      />
    </el-main>
  </el-container>
</template>
<script>
import NavTabs from 'lib@/components/NavTabs'
import quickSearchConfigList from './quickSearchConfigList'
export default {
  name: 'quickSearchConfig',
  components: {
    NavTabs
  },
  data () {
    return {
      activeTab: 'quickSearchConfigList', // 当前激活标签  与name相同
      tabs: [{
        title: this.$t('basisData.quickSearchConfigList'),
        name: 'quickSearchConfigList',
        component: quickSearchConfigList,
        closable: false
      }],
      params: {

      }
    }
  }
}
</script>
