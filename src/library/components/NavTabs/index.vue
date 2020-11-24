<!--
 * @Author: tim
 * @LastEditors: tim
 * @Description: 页签
 * @Date: 2019-03-20 15:17:58
 * @LastEditTime: 2019-06-17 11:51:00
 -->

<template>
  <el-tabs
    v-model="activeTab"
    class="tabs-nav"
    type="card"
    @tab-click="tabClick"
    @tab-remove="tabRemove"
  >
    <el-tab-pane
      v-for="item in tabs"
      :key="item.name"
      :label="item.title"
      :name="item.name"
      :closable="item.closable === false ? false:true"
      :lazy="true"
    >
      <keep-alive :include="tabs">
        <component
          :is="item.component"
          :active-tab="activeTab"
          :params="item.params"
          @tab-show="tabShow"
          @tab-add="tabAdd"
          @tab-remove="tabRemove"
        />
      </keep-alive>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  name: 'NavTabs',
  props: {
    // 属性传值时用法：cur-tab 或 curTab
    curTab: {
      type: String,
      default: 'list'
    },
    tabsList: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      activeTab: '',
      tabs: []
    }
  },
  computed: {},
  // watch: {
  //   tabs: function(n, o) {
  //     debugger
  //   }
  // },
  created () {
    this.activeTab = this.curTab
    this.tabs = this.tabsList
  },
  methods: {
    // 添加标签
    tabAdd ({ title, name, component, closable = true, params = {} }) {
      let tabs = this.tabs
      // eslint-disable-next-line no-unused-vars
      let activeTab = this.activeTab

      name = name || [new Date().getTime(), Math.random()].join('-')

      const findTabs = tabs.find(v => {
        return v.name === name
      })
      // debugger
      if (findTabs) {
        this.activeTab = name
      } else {
        tabs.push({
          title,
          name,
          component,
          params,
          closable
        })
        this.activeTab = name

        // this.$emit("tab-add", { activeTab: activeTab, tabs: tabs });
      }
    },
    // 点击标签
    tabClick (tab) {
      this.$emit('tab-click', tab)
    },
    // 移除标签
    tabRemove (name) {
      let tabs = this.tabs
      let activeTab = this.activeTab

      if (activeTab === name) {
        tabs.forEach((tab, index) => {
          if (tab.name === name) {
            let nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeTab = nextTab.name
            }
          }
        })
      }

      this.activeTab = activeTab
      this.tabs = tabs.filter(tab => tab.name !== name)

      this.$emit('tab-remove', { name, activeTab, tabs })
    },
    // 切换当前 tab 页
    tabShow (name) {
      const findTabs = this.tabs.find(v => {
        return v.name === name
      })

      if (findTabs) {
        this.activeTab = name
      } else {
        console.log('cant not find the tab name:' + name)
      }
    }
  }
}
</script>

<style scoped>
/*.tabs-nav .el-tabs__content{*/
/*  padding-top:10px;*/
/*  flex: 1;*/
/*}*/

</style>
