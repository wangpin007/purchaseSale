<template>
  <el-container direction="vertical" >
    <el-main>
      <nav-tabs :tabsList="tabs" :curTab="activeTab"></nav-tabs>
    </el-main>
  </el-container>
</template>
<script>
  import NavTabs from 'lib@/components/NavTabs'
  import workOrderManage from './workOrderManage'
  export default {
    name: 'workOrderManage',
    components: {
      NavTabs
    },
    data () {
      return {
        activeTab: 'workOrderManage', // 当前激活标签  与name相同
        tabs: [{
          title: '工单管理',
          name: 'workOrderManage',
          component: workOrderManage,
          closable: false
        }],
        params: {

        }
      }
    }
  }
</script>