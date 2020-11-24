<template>
  <el-table
    ref="cTable"
    v-virtual-box="{ data: displayData, store: virtualStore }"
    v-loading="loading"
    class="c-table"
    :data="chunkData"
    :height="height"
    :row-key="handleRowKey"
    :row-class-name="rowClassName"
    :cell-class-name="cellClassName"
    :border="true"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot name="prefix" />
    <el-table-column
      label="序号"
      width="120"
      show-overflow-tooltip
      fixed
    >
      <template v-slot="scope">
        <div :style="{ paddingLeft: `${scope.row._store.level * 16}px` }">
          <span
            v-if="scope.row._store.hasChild"
            class="icon-wrap"
            @click="handleExpandClick(scope.row)"
          >
            <i :class="scope.row._store.expanded ? 'el-icon-minus' : 'el-icon-plus'" />
          </span>
          <span class="order-number">{{ scope.row._store.orderNum }}</span>
        </div>
      </template>
    </el-table-column>
    <slot />
  </el-table>
</template>

<script>
import { generateUid } from 'lib@/utils/generator'
import { on, off } from 'lib@/utils/dom'

// 插入 virtual 容器
function appendVirtualWrapper (bodyWrapper, virtualStore) {
  const tableBodyWrapper = bodyWrapper.children[0]
  const virtualWrapper = document.createElement('div')

  virtualWrapper.setAttribute('class', 'virtual-wrapper')

  bodyWrapper.appendChild(virtualWrapper)
  virtualWrapper.appendChild(tableBodyWrapper)

  if (!virtualStore.virtualWrappers) {
    virtualStore.virtualWrappers = []
  }
  if (!virtualStore.tableBodyWrappers) {
    virtualStore.tableBodyWrappers = []
  }

  virtualStore.virtualWrappers.push(virtualWrapper)
  virtualStore.tableBodyWrappers.push(tableBodyWrapper)
}

// 设置 virtual 容器高度
function setVirtualWrapperHeight (virtualStore, height) {
  const { virtualWrappers } = virtualStore
  virtualWrappers.forEach((wrapper) => {
    wrapper.style.height = `${height}px`
  })
}

// 同步表格内容移动
function syncTableBodyWrapperTranslate (virtualStore, height) {
  const { tableBodyWrappers } = virtualStore
  tableBodyWrappers.forEach((item) => {
    item.style.transform = `translateY(${height}px)`
  })
}

// 更新虚拟列表内容
function updateVirtualContent (virtualStore, scrollTop, vnode) {
  const { reserveTop, unitHeight, showCount, maxDataLength, maxScrollTop } = virtualStore

  // 实际滚动高度
  const topHeight = scrollTop - unitHeight * reserveTop
  // 计算开始索引
  const startIndex = Math.floor(topHeight / unitHeight)
  // 计算结束索引
  const endIndex = startIndex + showCount

  // 防止快速滚动多次设置 startIndex, endIndex 导致数据刷新
  if (startIndex === virtualStore.startIndex && endIndex === virtualStore.endIndex) {
    return
  }

  if (showCount > maxDataLength) {
    virtualStore.startIndex = 0
    virtualStore.endIndex = maxDataLength
    return false
  }

  if (endIndex < maxDataLength) {
    // 设置虚拟列表开始索引
    virtualStore.startIndex = startIndex < 0 ? 0 : startIndex
    virtualStore.endIndex = endIndex
    syncTableBodyWrapperTranslate(virtualStore, topHeight < 0 ? 0 : topHeight)
  } else {
    // 滚动到底部时, 以最大长度计算开始索引与结束索引
    // maxScrollTop: 解决快速滚动到底部时反复计算索引值导致行闪烁问题
    virtualStore.startIndex = maxDataLength - showCount
    virtualStore.endIndex = maxDataLength
    syncTableBodyWrapperTranslate(virtualStore, maxScrollTop)
  }
}

export default {
  name: 'CTable',
  directives: {
    virtualBox: {
      inserted (el, binding, vnode) {
        let scrollTemp = 0
        let isRequestAnimationFrame = false
        const { store = {} } = binding.value
        const elBodyWrapper = el.querySelector('.el-table__body-wrapper')
        appendVirtualWrapper(elBodyWrapper, store)

        vnode.context.$nextTick(() => {
          const elFixedBodyWrappers = el.querySelectorAll('.el-table__fixed-body-wrapper')
          elFixedBodyWrappers.forEach((wrapper) => {
            appendVirtualWrapper(wrapper, store)
          })
        })

        const handleScroll = function () {
          const { scrollTop } = elBodyWrapper
          if (isRequestAnimationFrame) return

          // 是否垂直方向滚动
          if (scrollTemp === scrollTop) {
            return
          } else {
            scrollTemp = scrollTop
            store.scrollTop = scrollTop
          }

          isRequestAnimationFrame = true
          window.requestAnimationFrame(() => {
            isRequestAnimationFrame = false
            updateVirtualContent(store, scrollTop, vnode)
          })
        }

        off(elBodyWrapper, 'scroll', handleScroll)
        on(elBodyWrapper, 'scroll', handleScroll)
      },
      componentUpdated (el, binding, vnode, oldVnode) {
        const { data, store } = binding.value
        const {
          startIndex,
          endIndex,
          unitHeight,
          reserveTop,
          reserveBottom
        } = store
        const bodyHeight = vnode.componentInstance.layout.bodyHeight

        // 数据总长度不变, 退出
        if (store.maxDataLength && data.length === store.maxDataLength) {
          return
        }

        // 数据总长度
        const maxDataLength = data.length
        const virtualWrapperHeight = maxDataLength * unitHeight
        // 显示数量
        const showCount = Math.ceil(bodyHeight / unitHeight) + reserveTop + reserveBottom
        store.showCount = showCount
        store.maxDataLength = maxDataLength
        store.maxScrollTop = virtualWrapperHeight - bodyHeight - (reserveBottom + reserveTop) * unitHeight

        // 设置虚拟列表容器高度
        setVirtualWrapperHeight(store, virtualWrapperHeight)

        if (startIndex === 0 && showCount > endIndex && bodyHeight) {
          store.endIndex = showCount
        }
      }
    }
  },
  props: {
    treeProp: {
      type: Object,
      default () {
        return {
          children: 'children'
        }
      }
    },
    rowKey: {
      type: [String, Number],
      default: 'id'
    },
    loading: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number,
      default: 560
    },
    rowClassName: {
      type: Function
    },
    cellClassName: {
      type: Function
    }
  },
  data () {
    return {
      tableData: [],
      treeMapper: {},
      virtualStore: {
        reserveTop: 3,
        reserveBottom: 3,
        startIndex: 0,
        endIndex: 0,
        unitHeight: 41,
        scrollTop: 0
      }
    }
  },
  computed: {
    displayData () {
      return this.tableData.filter((item) => item._store.display)
    },
    chunkData () {
      const { startIndex, endIndex } = this.virtualStore
      return this.displayData.slice(startIndex, endIndex)
    }
  },
  activated () {
    const scrollTop = this.virtualStore.scrollTop
    this.$nextTick(() => {
      const el = this.$refs.cTable.$el
      const elBodyWrapper = el.querySelector('.el-table__body-wrapper')
      setTimeout(() => {
        elBodyWrapper.scrollTop = scrollTop
      })
    })
  },
  methods: {
    loadTreeData (treeData) {
      const { children } = this.treeProp
      this.tableData = []
      this.treeMapper = {}

      const traverse = (data, parentItem) => {
        if (Array.isArray(data)) {
          data.forEach((dataItem, index) => {
            const treeItem = Object.assign({}, dataItem)
            const _uid = treeItem[this.rowKey] || generateUid()
            const _store = {}

            this.treeMapper[_uid] = dataItem

            _store.uid = _uid
            _store.hasChild = dataItem[children] && dataItem[children].length > 0

            if (parentItem) {
              _store.parentId = parentItem._store.uid
              _store.parentList = [_store.parentId].concat(parentItem._store.parentList || [])
              // treeItem.parent = parentItem
              _store.orderNum = `${parentItem._store.orderNum}.${index + 1}`
              _store.level = parentItem._store.level + 1
              _store.display = parentItem._store.expanded
            } else {
              _store.orderNum = `${index + 1}`
              _store.level = 0
              _store.display = true
            }

            if (_store.hasChild) {
              _store.expanded = true
            }

            treeItem._store = _store
            this.tableData.push(treeItem)

            if (treeItem._store.hasChild) {
              traverse(dataItem[children], treeItem)
            }
          })
        }
      }

      traverse(treeData)
    },
    // 刷新数据
    refreshTreeData () {
      this.tableData = this.tableData.map((item) => {
        const { uid } = item._store
        if (this.treeMapper[uid]) {
          return Object.assign({}, item, this.treeMapper[uid])
        } else {
          return Object.assign({}, item)
        }
      })
    },
    // 树展开按钮点击
    handleExpandClick (row) {
      const { expanded } = row._store
      this.$set(row._store, 'expanded', !expanded)
      this.expandTreeNode(row, !expanded)
    },
    // 展开树节点
    expandTreeNode (row, expanded) {
      const { uid } = row._store
      this.tableData.forEach((item) => {
        // const { parentList } = item._store
        // if (parentList && parentList.indexOf(uid) > -1) {
        //   this.$set(item._store, 'display', expanded)
        // }
        if (uid === item._store.parentId) {
          this.$set(item._store, 'display', expanded)
        }
      })
    },
    // row key
    handleRowKey (row) {
      return row._store.uid
    }
  }
}
</script>

<style lang="scss">
.c-table {
  .icon-wrap {
    display: inline-block;
    background-color: #FFFFFF;
    border: 1px solid #CCCFD4;
    line-height: 1;
  }

  .order-number {
    display: inline-block;
    margin-left: 8px;
  }

  .el-table__row.hover-row > td {
    background-color: transparent;
  }
}
</style>
