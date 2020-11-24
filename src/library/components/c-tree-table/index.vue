<template>
  <el-table
    ref="cTreeTable"
    v-loading="loading"
    class="c-tree-table"
    :data="treeData"
    :row-class-name="handleRowClassName"
    :cell-class-name="cellClassName"
    :row-key="handleRowKey"
    border
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot name="prefix" />
    <el-table-column
      width="120"
      :show-overflow-tooltip="true"
      :fixed="fixedOrderNumber"
      :label="showOrderNumber ? '序号' : ''"
    >
      <template slot-scope="scope">
        <div :style="{ paddingLeft: `${scope.row._store._level * indent}px` }">
          <span
            v-if="scope.row._store._hasChild"
            class="icon-wrap"
            @click="handleExpandClick(scope.row)"
          >
            <i
              :class="scope.row._store._expanded ? 'el-icon-minus' : 'el-icon-plus'"
            />
          </span>
          <span
            v-if="showOrderNumber"
            class="order-number"
          >{{ getOrderNumber(scope.row) }}</span>
        </div>
      </template>
    </el-table-column>
    <slot />
  </el-table>
</template>

<script>
import _cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'CTreeTable',
  model: {
    prop: 'data',
    event: 'change'
  },
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    },
    // 默认属性配置
    defaultProp: {
      type: Object,
      default: () => {
        return {
          id: 'id',
          children: 'children'
        }
      }
    },
    // 是否展开所有树节点
    expandAll: {
      type: Boolean,
      default: false
    },
    // 是否显示序号
    showOrderNumber: {
      type: Boolean,
      default: true
    },
    fixedOrderNumber: {
      type: Boolean,
      default: false
    },
    // 序号分割符
    orderNumberSplit: {
      type: String,
      default: '.'
    },
    // 层级缩进
    indent: {
      type: Number,
      default: 16
    },
    // 最大层级
    maxLevel: {
      type: Number
    },
    // 是否设置层级, 开启后会影响数据源的层级属性
    isSetLevel: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    rowClassName: {
      type: [String, Function],
      default: ''
    },
    cellClassName: {
      type: [String, Function],
      default: ''
    },
    filterMethod: {
      type: Function
    }
  },
  data () {
    return {
      treeData: [],
      map: {}
    }
  },
  watch: {
    data: {
      immediate: true,
      deep: true,
      handler (value) {
        const transformData = this.dataTransform(value)

        if (this.filterMethod) {
          this.treeData = this.filterMethod(transformData)
        } else {
          this.treeData = transformData
        }
      }
    }
  },
  methods: {
    refresh () {
      const transformData = this.dataTransform(this.data)

      if (this.filterMethod) {
        this.treeData = this.filterMethod(transformData)
      } else {
        this.treeData = transformData
      }
    },
    // 数据适配
    dataTransform (data, parentId) {
      let newData = []

      if (Array.isArray(data)) {
        data.forEach((dataItem, index) => {
          const treeDataItem = Object.assign({}, dataItem)
          const uid = treeDataItem.uid || treeDataItem[this.defaultProp.id]
          const parent = this.map[parentId]

          treeDataItem._store = {}
          treeDataItem._store._uid = uid
          treeDataItem._store._source = dataItem
          treeDataItem._store._parent = parent
          treeDataItem._store._index = index
          treeDataItem._store._level = parent && parent._store ? parent._store._level + 1 : 0
          treeDataItem._store._hasChild = false
          treeDataItem._store._expanded = this.map[uid] ? this.map[uid]._store._expanded : this.expandAll
          treeDataItem._store._deleted = false

          this.map[uid] = treeDataItem
          newData.push(treeDataItem)

          if (this.isSetLevel) {
            dataItem.level = treeDataItem._store._level
          }

          if (treeDataItem[this.defaultProp.children] && treeDataItem[this.defaultProp.children].length > 0) {
            treeDataItem._store._hasChild = true
            const children = this.dataTransform(treeDataItem[this.defaultProp.children], uid)
            delete treeDataItem[this.defaultProp.children]
            newData = newData.concat(children)
          }
        })
      }

      return newData
    },
    handleRowKey (row) {
      return row._store._uid
    },
    handleRowClassName ({ row, rowIndex }) {
      let className = typeof this.rowClassName === 'function' ? this.rowClassName({ row, rowIndex }) : this.rowClassName
      const { _parent, _deleted } = row._store
      const show = _parent ? _parent._store._expanded && _parent._store._show : true

      row._store._show = show
      className += show ? '' : ' row-hide'

      if (_deleted) {
        className += ' row-deleted'
      }

      return className
    },
    handleExpandClick (row) {
      if (row._store._hasChild) {
        row._store._expanded = !row._store._expanded
      }
    },
    getOrderNumber (row) {
      const { _store } = row
      const { _parent, _level, _index } = _store
      let orderNumber = ''

      switch (_level) {
        case 0:
          orderNumber = `${_index + 1}`
          break
        default:
          orderNumber = this.getChildOrderNumber(_parent, _index)
          break
      }
      row._store._orderNumber = orderNumber
      if (this.isSetLevel) {
        row._store._source.num = orderNumber
      }
      return row._store._orderNumber
    },
    getChildOrderNumber (parent, index) {
      return `${parent._store._orderNumber}${this.orderNumberSplit}${index + 1}`
    },
    // 插入子节点
    insertChild (insertData, row) {
      if (row) {
        const { _source, _expanded } = row._store
        insertData = _cloneDeep(insertData)
        if (!_source[this.defaultProp.children]) {
          _source[this.defaultProp.children] = []
        }
        _source[this.defaultProp.children].push(insertData)

        if (!_expanded) {
          row._store._expanded = true
        }
        this.$emit('change', _cloneDeep(this.data))
      }
    },
    // 插入兄弟节点在之前
    insertBefore (insertData, row) {
      if (row) {
        const { _index, _parent } = row._store
        insertData = _cloneDeep(insertData)
        if (_parent) {
          if (!_parent._store._source[this.defaultProp.children]) {
            _parent._store._source[this.defaultProp.children] = []
          }
          _parent._store._source[this.defaultProp.children].splice(_index, 0, insertData)
        } else {
          this.data.splice(_index, 0, insertData)
        }
        this.$emit('change', _cloneDeep(this.data))
      }
    },
    // 插入兄弟节点在之后
    insertAfter (insertData, row) {
      if (row) {
        const { _index, _parent } = row._store
        insertData = _cloneDeep(insertData)
        if (_parent) {
          if (!_parent._store._source[this.defaultProp.children]) {
            _parent._store._source[this.defaultProp.children] = []
          }
          _parent._store._source[this.defaultProp.children].splice(_index + 1, 0, insertData)
        } else {
          this.data.splice(_index + 1, 0, insertData)
        }
        this.$emit('change', _cloneDeep(this.data))
      }
    },
    // 删除行
    delete (row) {
      if (row) {
        const { _index, _parent } = row._store
        let deleteData
        if (_parent) {
          deleteData = _parent._store._source[this.defaultProp.children][_index]
          _parent._store._source[this.defaultProp.children].splice(_index, 1)
        } else {
          deleteData = this.data[_index]
          this.data.splice(_index, 1)
        }

        this.$emit('delete', deleteData)
        this.$emit('change', _cloneDeep(this.data))
      }
    },
    // 展开树节点
    toggleNodeExpansion (row, expanded) {
      if (row) {
        if (typeof expanded === 'undefined') {
          expanded = !row._store._expanded
        }
        this.$set(row._store, '_expanded', expanded)
      }
    },
    // 删除行标记
    toggleRowDeletion (row, deleted) {
      if (row) {
        if (typeof deleted === 'undefined') {
          deleted = !row._store._deleted
        }
        this.$set(row._store, '_deleted', deleted)
      }
    },
    // 展开表格行
    toggleRowExpansion (row, expanded) {
      if (this.$refs.cTreeTable) {
        this.$refs.cTreeTable.toggleRowExpansion(row, expanded)
      }
    },
    doLayout () {
      this.$refs.cTreeTable.doLayout()
    }
  }
}
</script>

<style lang="scss">
.c-tree-table {
  .row-hide {
    display: none;
  }

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

  .el-table__row {
    position: relative;

    &.row-deleted > td {
      text-decoration: line-through;
      background-color: #EEEEEE;
    }
  }
}

/* TODO: 提取至全局样式表 */
.el-table th {
  background-color: #F3F6FA;
  font-weight: bold;
}
</style>
