<template>
  <el-container direction="vertical" >
    <el-main>
      <nav-tabs :tabsList="tabs" :curTab="activeTab"></nav-tabs>
    </el-main>
  </el-container>
</template>
<script>
import NavTabs from 'lib@/components/NavTabs'
import dictionary from './dictionary'
export default {
  name: 'dictionaryTab',
  components: {
    NavTabs
  },
  data () {
    return {
      activeTab: 'dictionarySingle', // 当前激活标签  与name相同
      tabs: [{
        title: '字典列表',
        name: 'dictionarySingle',
        component: dictionary,
        closable: false
      }],
      params: {

      }
    }
  }
}
</script>
