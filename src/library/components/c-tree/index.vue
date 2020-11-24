<template>
  <el-tree
    :data="data"
    :props="defaultProps"
    show-checkbox
    draggable
    default-expand-all
    @node-click="handleNodeClick"
  >
    <span slot-scope="{ node, data }">
      <img
        v-if="data.icon"
        class="tree-icon"
        :src="data.icon"
      >
      <img
        v-else
        class="tree-icon"
        src="./img/home.png"
      >
      <span style="padding-left: 4px;">{{ node.label }}</span>
    </span>
  </el-tree>
</template>

<script>

export default {
  name: 'CTree',
  props: {
    // tree数据
    treeData: {
      type: Array,
      default () {
        return []
      }
    },
    // 配置tree数据节点属性值、子节点属性值
    defaultProps: {
      type: Object,
      default: {
      }
    }
    // loading: {
    //   type: Boolean,
    //   default: false
    // },
    // height: {
    //   type: Number,
    //   default: 560
    // },
    // rowClassName: {
    //   type: Function
    // },
    // cellClassName: {
    //   type: Function
    // }
  },
  data () {
    return {
    }
  },
  computed: {
    data () {
      return this.treeData
    }
  },
  methods: {
    handleNodeClick (data) {
      console.log(data)
    }
  }
}
</script>

<style lang="scss">
.tree-icon {
  vertical-align:middle;
  width: 16px;
  height: 16px;
}
</style>
