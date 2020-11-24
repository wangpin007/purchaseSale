import './index.scss'
import CPagination from 'lib@/components/c-pagination'
import CException from 'lib@/components/c-exception'
import QueryForm from './query-form'

import Emitter from 'lib@/mixins/emitter'

import _throttle from 'lodash/throttle'
import _isFunction from 'lodash/isFunction'

import { transformQueryValueType } from './utils'
import { outerHeight, getStylePropertyValue } from 'lib@/utils/dom'
import emptyFormat from 'lib@/utils/empty-format'

let _columnKey = 1

const elTableColumnDefaultType = ['index', 'expand', 'selection']

export default {
  name: 'CQueryTable',
  componentName: 'CQueryTable',
  mixins: [Emitter],
  provide () {
    return {
      cQueryTable: this
    }
  },
  components: {
    CPagination,
    CException,
    QueryForm
  },
  props: {
    // 查询表单对象
    queryForm: {
      type: Array,
      default () {
        return []
      }
    },
    // 表格列对象
    columns: {
      type: Array,
      default () {
        return []
      }
    },
    // 查询是否走路由对象
    queryRouter: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default () {
        return []
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    stripe: {
      type: Boolean,
      default: true
    },
    // 是否展示查询表单组件
    showQueryForm: {
      type: Boolean,
      default: true
    },
    // 是否展示分页组件
    showPagination: {
      type: Boolean,
      default: true
    },
    // 空值时显示的文本
    showEmptyText: {
      type: Boolean,
      default: true
    },
    total: {
      type: [Number, String],
      default: 0
    },
    pageNum: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 20
    },
    rowKey: {
      type: [Function, String],
      default: 'id'
    },
    defaultQuery: {
      type: Object
    },
    fullHeight: {
      type: Boolean,
      default: true
    },
    // 是否显示查询按钮
    showQueryBtn: {
      type: Boolean,
      default: true
    },
    // 是否显示重置按钮
    showResetBtn: {
      type: Boolean,
      default: true
    },
    // 是否初始进行查询
    immediateQuery: {
      type: Boolean,
      default: true
    },
    // 是否可以 resize 宽度
    resizable: {
      type: Boolean,
      default: true
    },
    // 默认 tooltip
    defaultShowOverflowTooltip: {
      type: Boolean,
      default: true
    },
    // 容器 HTMLElement
    container: null
  },
  data () {
    return {
      // 表格高度
      tableHeight: null,
      //  表格宽度
      tableWidth: null,
      // 当前页码
      currentPageNum: 0,
      // 当前每页数
      currentPageSize: 0,
      // 查询表单 model
      queryFormModel: {},
      // 查询对象, 包括分页
      queryParams: {},
      // 查询表单 field name 对应值的类型映射关系, 用于查询字符串转表单值
      valueTypeMapper: {},
      cloneColumns: [],
      // 初始查询计时器
      immediateCount: 0,
      expanded: false
    }
  },
  watch: {
    columns: {
      immediate: true,
      deep: true,
      handler () {
        this.cloneColumns = this.columns
      }
    }
  },
  mounted () {
    this.initQueryParams()
    this.calculateTableHeight()
  },
  updated () {
    if (this.fullHeight) {
      this.$nextTick(function () {
        // 如果无数据，表存在，表body存在
        if (this.data.length === 0 && this.$refs.table && this.$refs.table.$refs.fixedBodyWrapper && this.$refs.table.$refs.fixedHeaderWrapper) {
        // 获取表格的body
          var fixedHeight = this.$refs.table.$refs.fixedBodyWrapper.clientHeight + this.$refs.table.$refs.fixedHeaderWrapper.clientHeight
          // 左边的固定fixed
          if (this.$refs.table.$refs.fixedWrapper) {
            this.$refs.table.$refs.fixedWrapper.style.height = fixedHeight - 3 + 'px'
          }
          // 右边的固定fixed
          if (this.$refs.table.$refs.rightFixedWrapper) {
            this.$refs.table.$refs.rightFixedWrapper.style.height = fixedHeight - 3 + 'px'
          }
        }
      })
    }
  },
  activated () {
    if (this.fullHeight) {
      this.calculateTableWidth()
      this.calculateTableHeight()
      window.addEventListener('resize', this.handleResize, false)
    }
  },
  destroy () {
    if (this.fullHeight) {
      window.removeEventListener('resize', this.handleResize, false)
    }
  },
  deactivated () {
    // 组件切换时，隐藏tooltip
    var tooltip = document.querySelectorAll('div[role="tooltip"]')
    if (tooltip.length > 0) {
      tooltip.forEach(item => {
        item.style.display = 'none'
      })
    }
    if (this.fullHeight) {
      window.removeEventListener('resize', this.handleResize, false)
    }
  },
  methods: {
    // 初始化查询对象
    initQueryParams () {
      let queryFormModel = {}
      let query = {}

      if (this.queryRouter) {
        query = Object.assign({}, this.$route.query)
      } else if (this.defaultQuery) {
        query = Object.assign({}, this.defaultQuery)
      }

      this.queryForm.forEach((queryFormItem) => {
        const valueType = queryFormItem.valueType || 'string'
        if (queryFormItem.name) {
          if (Array.isArray(queryFormItem.name)) {
            queryFormItem.name.forEach((nameItem) => {
              queryFormModel[nameItem] = query[nameItem]
              this.valueTypeMapper[nameItem] = valueType
            })
          } else {
            queryFormModel[queryFormItem.name] = query[queryFormItem.name]
            this.valueTypeMapper[queryFormItem.name] = valueType
          }
        }
      })
      this.currentPageNum = query.pageNum ? Number(query.pageNum) : this.pageNum
      this.currentPageSize = query.pageSize ? Number(query.pageSize) : this.pageSize
      this.queryFormModel = queryFormModel
      this.assignModelAndPage()
    },
    // 合并 formModel, pageNum, pageSize
    assignModelAndPage () {
      this.queryParams = Object.assign({}, this.queryFormModel, {
        pageNum: this.currentPageNum,
        pageSize: this.currentPageSize
      })
    },
    // 更新表单对象
    updateFormModel (name, value) {
      if (name) {
        this.$set(this.queryFormModel, name, value)
      }
    },
    // 更新查询对象
    updateQueryParams (name, value) {
      if (name) {
        this.updateFormModel(name, value)
        this.assignModelAndPage()
      }
    },
    // 更新路由查询对象
    updateRouteQuery () {
      if (this.queryRouter) {
        const query = Object.assign({}, this.$route.query, this.queryParams)
        this.$router.replace({ query })
      }
    },
    // 清除折叠的表单查询值
    clearCollapseQueryParams () {
      if (!this.expanded) {
        const collapseQueryForm = this.queryForm.filter((formItem) => !formItem.defaultExpand)
        this.clearQueryFormModel(collapseQueryForm)
      }
    },
    query () {
      this.updateRouteQuery()
      this.$emit('query-change', transformQueryValueType(this.queryParams, this.valueTypeMapper))
    },
    handleResize: _throttle(function () {
      this.calculateTableWidth()
      this.calculateTableHeight()
    }, 200),
    // 查询按钮点击
    handleQueryBtnClick () {
      this.resetPageNum()
      this.clearCollapseQueryParams()
      this.assignModelAndPage()
      this.query()
      this.$emit('query-click')
    },
    // 重置按钮点击
    handleReset () {
      this.resetPageNum()
      this.clearQueryFormModel()
      this.assignModelAndPage()
      this.broadcast('CQueryFormItem', 'resetValue')
      this.query()
      this.$emit('reset-click')
    },
    // 折叠按钮
    handleExpand (expanded) {
      this.expanded = expanded
      this.calculateTableHeight(this.getWrapperHeight())
    },
    // 清除查询对象的表单值
    clearQueryFormModel (queryForm = this.queryForm) {
      queryForm.forEach((queryFormItem) => {
        if (queryFormItem.name) {
          if (Array.isArray(queryFormItem.name)) {
            queryFormItem.name.forEach((nameItem) => {
              delete this.queryFormModel[nameItem]
              delete this.$route.query[nameItem]
            })
          } else {
            delete this.queryFormModel[queryFormItem.name]
            delete this.$route.query[queryFormItem.name]
          }
        }
      })
    },
    // 计算表格高度
    calculateTableHeight (wrapperH) {
      if (this.fullHeight) {
        this.$nextTick(() => {
          if (typeof wrapperH === 'undefined') {
            wrapperH = this.getWrapperHeight()
          }
          const tableContent = this.$refs.tableContent
          const tableContentMargin = getStylePropertyValue(tableContent, 'margin-top') + getStylePropertyValue(tableContent, 'margin-bottom')
          const queryFormH = this.$refs.queryForm ? outerHeight(this.$refs.queryForm.$el) : 0
          const queryBarH = this.$refs.queryBar ? outerHeight(this.$refs.queryBar) : 0
          const tableTopBarH = this.$refs.tableTopBar ? outerHeight(this.$refs.tableTopBar) : 0
          const queryPagination = this.$refs.queryPagination ? outerHeight(this.$refs.queryPagination.$el) : 0

          const tableHeight = wrapperH - queryFormH - queryBarH - tableTopBarH - queryPagination - tableContentMargin
          this.tableHeight = tableHeight
        })
      }
    },
    // 计算表格宽度
    calculateTableWidth () {
      this.$nextTick(() => {
        const tableContent = this.$refs.tableContent
        if (tableContent) {
          this.tableWidth = tableContent.offsetWidth
        }
      })
    },
    // 获取容器高度
    getWrapperHeight () {
      const wrapper = this.container || this.$refs.wrapper
      if (wrapper) {
        const wrapperPadding = getStylePropertyValue(wrapper, 'padding-top') + getStylePropertyValue(wrapper, 'padding-bottom')
        return wrapper.offsetHeight - wrapperPadding
      }
      return 0
    },
    // 当前页码变化事件
    handleCurrentChange (current) {
      this.currentPageNum = current
      this.syncPaginationQuery()
    },
    // 当前每页条目数变化事件
    handleSizeChange (size) {
      this.currentPageSize = size
    },
    // 同步分页数据到路由查询对象
    syncPaginationQuery () {
      this.queryParams.pageNum = this.currentPageNum
      this.queryParams.pageSize = this.currentPageSize

      if (!this.immediateQuery && this.immediateCount === 0) {
        this.immediateCount++
        return false
      } else {
        this.query()
      }
    },
    // 重置当前页到第一页
    resetPageNum () {
      this.currentPageNum = 1
      this.queryParams.pageNum = 1
    },
    // el-table methods
    clearSelection () {
      this.$refs.table.clearSelection()
    },
    toggleRowSelection (row, selected) {
      this.$refs.table.toggleRowSelection(row, selected)
    },
    toggleAllSelection () {
      this.$refs.table.toggleAllSelection()
    },
    toggleRowExpansion (row, expanded) {
      this.$refs.table.toggleRowExpansion(row, expanded)
    },
    setCurrentRow (row) {
      this.$refs.table.setCurrentRow(row)
    },
    clearSort () {
      this.$refs.table.clearSort()
    },
    clearFilter (columnKey) {
      this.$refs.table.clearFilter(columnKey)
    },
    doLayout () {
      this.$refs.table.doLayout()
    },
    sort (prop, order) {
      this.$refs.table.sort(prop, order)
    },
    getShowOverflowTooltip (column) {
      const { showOverflowTooltip } = column
      return typeof showOverflowTooltip === 'undefined' ? this.defaultShowOverflowTooltip : showOverflowTooltip
    },
    // 填充空值的文本
    renderDefaultColumn (h, { row, column }) {
      return emptyFormat(row[column.property])
    },
    renderEmpty (h) {
      let style = 'width: 100%'
      if (this.tableWidth) {
        style = `width: ${this.tableWidth}px`
      }

      return (
        <CException
          style={ style }
          type="noContent"
          subTitle="暂无数据"
          align="vertical"
        />
      )
    }
  },
  render (h) {
    let queryFormCom = ''
    let paginationCom = ''
    let barCom = ''
    let topBarCom = ''

    // 表格列
    const tableColumns = this.cloneColumns.map((tableColumn) => {
      tableColumn.showOverflowTooltip = this.getShowOverflowTooltip(tableColumn)
      tableColumn.resizable = this.resizable

      if (_isFunction(tableColumn.render)) {
        return (
          <ElTableColumn
            key={ _columnKey++ }
            { ...{ props: tableColumn } }
            { ...{ scopedSlots: { default: (scope) => tableColumn.render(h, scope) } } }
          />
        )
      } else if (this.showEmptyText && elTableColumnDefaultType.indexOf(tableColumn.type) === -1) {
        return (
          <ElTableColumn
            key={ _columnKey++ }
            { ...{ props: tableColumn } }
            { ...{ scopedSlots: { default: (scope) => this.renderDefaultColumn(h, scope) } } }
          />
        )
      } else {
        return (
          <ElTableColumn
            key={ _columnKey++ }
            { ...{ props: tableColumn } }
          />
        )
      }
    })

    // 查询表单
    if (this.showQueryForm) {
      queryFormCom = (
        <QueryForm
          ref="queryForm"
          form={ this.queryForm }
          formModel={ this.queryFormModel }
          showQueryBtn={ this.showQueryBtn }
          showResetBtn={ this.showResetBtn }
          onQuery={ this.handleQueryBtnClick }
          onReset={ this.handleReset }
          onExpand={ this.handleExpand }
        />
      )
    }

    // 分页器
    if (this.showPagination) {
      paginationCom = (
        <CPagination
          ref="queryPagination"
          class="c-query-table-pagination"
          total={ this.total }
          pageNum={ this.currentPageNum }
          pageSize={ this.currentPageSize }
          on-current-change={ this.handleCurrentChange }
          on-size-change={ this.handleSizeChange }
        />
      )
    }

    // 工具栏容器
    if (this.$slots.left || this.$slots.right) {
      barCom = (
        <div ref="queryBar" class="c-query-table-bar">
          <div class="left">{ this.$slots.left }</div>
          <div class="right">{ this.$slots.right }</div>
        </div>
      )
    }

    if (this.$slots.topBar) {
      topBarCom = (
        <div ref="tableTopBar" class="c-query-table-top-bar">
          { this.$slots.topBar }
        </div>
      )
    }

    let wrapperCls = 'c-query-table'
    if (this.fullHeight) {
      wrapperCls += ' full-height'
    }

    return (
      <div ref="wrapper" class={ wrapperCls }>
        { queryFormCom }
        { barCom }
        <div ref="tableContent" class="c-query-table-content">
          { topBarCom }
          <ElTable
            ref="table"
            headerRowClassName="c-query-table-header"
            stripe={ this.stripe }
            height={ this.tableHeight }
            data={ this.data }
            vLoading={ this.loading }
            rowKey={ this.rowKey }
            border={ this.resizable }
            { ...{ on: this.$listeners } }
            { ...{ props: this.$attrs } }
            { ...{ scopedSlots: { empty: () => this.renderEmpty(h) } }}
          >
            { tableColumns }
          </ElTable>
        </div>
        { paginationCom }
      </div>
    )
  }
}
