<template>
  <el-container direction="vertical" >
    <el-main>
      <nav-tabs :tabsList="tabs" :curTab="activeTab"></nav-tabs>
    </el-main>
  </el-container>
</template>
<script>
  import NavTabs from 'lib@/components/NavTabs'
  import warehousingList from './warehousingList'
  export default {
    name: 'warehousing',
    components: {
      NavTabs
    },
    data () {
      return {
        activeTab: 'warehousingList', // 当前激活标签  与name相同
        tabs: [{
          title: '入库单列表',
          name: 'warehousingList',
          component: warehousingList,
          closable: false
        }],
        params: {

        }
      }
    }
  }
</script>
