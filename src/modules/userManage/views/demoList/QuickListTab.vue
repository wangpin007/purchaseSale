<template>
  <el-container direction="vertical" >
    <el-main>
      <nav-tabs :tabsList="tabs" :curTab="activeTab"></nav-tabs>
    </el-main>
  </el-container>
</template>
<script>
import NavTabs from 'lib@/components/NavTabs'
import QuickConfigList from './QuickConfigList'
export default {
  name: 'QuickListTab',
  components: {
    NavTabs
  },
  data () {
    return {
      activeTab: 'quickListSingle', // 当前激活标签  与name相同
      tabs: [{
        title: '快速查询列表',
        name: 'quickListSingle',
        component: QuickConfigList,
        closable: false
      }],
      params: {

      }
    }
  }
}
</script>
