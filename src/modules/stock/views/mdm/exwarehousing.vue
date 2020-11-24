<template>
  <el-container direction="vertical" >
    <el-main>
      <nav-tabs :tabsList="tabs" :curTab="activeTab"></nav-tabs>
    </el-main>
  </el-container>
</template>
<script>
  import NavTabs from 'lib@/components/NavTabs'
  import exwarehousingList from './exwarehousingList'
  export default {
    name: 'warehousing',
    components: {
      NavTabs
    },
    data () {
      return {
        activeTab: 'exwarehousingList', // 当前激活标签  与name相同
        tabs: [{
          title: '出库单列表',
          name: 'exwarehousingList',
          component: exwarehousingList,
          closable: false
        }],
        params: {

        }
      }
    }
  }
</script>
