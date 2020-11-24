<template>
  <el-container direction="vertical">
    <el-main style="flex-grow: 1;display: flex;flex-direction: column">
      <el-table
        ref="table"
        v-loading="loading"
        stripe
        border
        :fit="fitTable"
        highlight-current-row
        size="mini"
        :data="tableData"
        :element-loading-text="$t('common.loading')"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.3)"
        height="100%"
        class="edit-table"
        style="flex-grow: 1"
        @current-change="currentChange"
        @selection-change="checkChange"
      >
        <el-table-column
          v-if="checkbox"
          type="selection"
        />
        <el-table-column
          v-if="showIndex"
          type="index"
          align="center"
          fixed
        />
        <template v-for="(col, key) in innerHeader">
          <el-table-column
            v-if="!col.hidden"
            :key="key"
            :prop="col.prop"
            :label="col.label"
            :fixed="col.fixed ? col.fixed : false"
            :min-width="col.minWidth"
            :width="col.width"
            :align="col.align?col.align:'center'"
            :show-overflow-tooltip="true"
          >
            <template
              slot="header"
              slot-scope="scope"
            >
              <template v-if="showFilterBar">
                <el-row style="display:block;">
                  <span style="text-align:center">{{ col.label }}</span>
                  <el-checkbox
                    v-if="col.checkAllIsDisPlay"
                    v-model="col.checkAll"
                    :indeterminate="col.isIndeterminate"
                    @change="handleCheckAllChange(col)"
                  />
                  <header-sort
                    v-if="col.sortable"
                    :column-name="col.prop"
                    :sort-data="col.sortData"
                    :sort-field="sortField"
                    :sort-type="sortType"
                    :change-sort="sortChange"
                  />
                </el-row>
                <filter-column
                  :col="col"
                  :query-data="queryData"
                  :on-query="query"
                />
              </template>
              <template v-else>
                <span>
                  <span>{{ col.label }}</span>
                  <el-popover
                    v-show="col.filter"
                    placement="bottom"
                    width="200"
                    trigger="click"
                  >
                    <filter-column
                      :col="col"
                      :query-data="queryData"
                      :on-query="query"
                    />
                    <i
                      slot="reference"
                      class="el-icon-search"
                    />
                  </el-popover>
                  <header-sort
                    v-if="col.sortable"
                    :column-name="col.prop"
                    :sort-data="col.sortData"
                    :sort-field="sortField"
                    :sort-type="sortType"
                    :change-sort="sortChange"
                  />
                </span>
              </template>
            </template>
            <template slot-scope="scope">
              <template v-if="scope.row['___editting'] && (col.editType === 'update' || (col.editType === 'add' && scope.row.___add))">
                <span
                  v-if="col.type === 'select' && col.formattor"
                  style="padding-left:7px;z-index:9999;position:relative"
                  @click="triggerSelect(scope.row.____index, col.prop)"
                  v-html="col.formattor(scope.row[col.prop])"
                />
                <el-select
                  v-if="col.type === 'select' || (col.getType && col.getType(scope.row)=== 'select')"
                  v-model="scope.row[col.prop]"
                  :style="'left:' + scope.row[col.prop + 'width'] + 'px;width:98%'"
                  size="mini"
                  placeholder=""
                  @change="dropChange(scope.$index, scope.row, col)"
                >
                  <template v-if="col.hasOwnProperty('formattor')">
                    <template v-if="col.hasOwnProperty('optionKey')">
                      <el-option
                        v-for="o in col.options[col.optionKey]"
                        :key="o.value"
                        :disabled="'N'===o.enable || (col.show ? col.hide(scope.row, o) : false)"
                        :value="o.value"
                      >
                        <span v-html="col.formattor(o.value)" />
                      </el-option>
                    </template>
                    <template v-else>
                      <el-option
                        v-for="o in col.options[col.prop]"
                        :key="o.value"
                        :disabled="'N'===o.enable || (col.hide ? col.hide(scope.row, o) : false)"
                        :value="o.value"
                      >
                        <span v-html="col.formattor(o.value)" />
                      </el-option>
                    </template>
                  </template>
                  <template v-else>
                    <template v-if="col.hasOwnProperty('optionKey')">
                      <el-option
                        v-for="o in col.options[col.optionKey]"
                        :key="o.value"
                        :disabled="'N'=== o.enable || (col.hide ? col.hide(scope.row, o) : false)"
                        :value="o.value"
                        :label="o.label"
                      >
                        {{ o.label }}
                      </el-option>
                    </template>
                    <template v-else>
                      <el-option
                        v-for="o in col.options[col.prop]"
                        :key="o.value"
                        :disabled="'N'=== o.enable || (col.hide ? col.hide(scope.row, o) : false)"
                        :value="o.value"
                        :label="o.label"
                      >
                        {{ o.label }}
                      </el-option>
                    </template>
                  </template>
                </el-select>
                <el-checkbox
                  v-else-if="col.type === 'checkbox' || (col.getType && col.getType(scope.row)=== 'checkbox')"
                  v-model="scope.row[col.prop]"
                  :true-label="col.Y?col.Y:'Y'"
                  :false-label="col.N?col.N:'N'"
                  @change="scope.row['___editted'] = true; handleCheckedChange(col);"
                />
                <el-time-picker
                  v-else-if="col.type === 'time' || (col.getType && col.getType(scope.row)=== 'time')"
                  v-model="scope.row[col.prop]"
                  placeholder=""
                  :value-format="col.valueFormat"
                  :format="col.format"
                  @change="scope.row['___editted'] = true;callback(col, scope.row)"
                />
                <el-date-picker
                  v-else-if="col.type === 'date' || (col.getType && col.getType(scope.row)== 'date')"
                  v-model="scope.row[col.prop]"
                  type="date"
                  placeholder=""
                  :value-format="col.valueFormat"
                  :format="col.format"
                  @change="scope.row['___editted'] = true;callback(col, scope.row)"
                />
                <el-date-picker
                  v-else-if="col.type === 'datetime' || (col.getType && col.getType(scope.row)== 'datetime')"
                  v-model="scope.row[col.prop]"
                  type="datetime"
                  placeholder=""
                  :value-format="col.valueFormat"
                  :format="col.format"
                  @change="scope.row['___editted'] = true;callback(col, scope.row)"
                />
                <el-switch
                  v-else-if="col.type === 'switch' || (col.getType && col.getType(scope.row)=== 'switch')"
                  v-model="scope.row[col.prop]"
                  :inactive-value="col.switchValues.inactive"
                  :active-value="col.switchValues.active"
                  @change="scope.row['___editted'] = true;callback(col, scope.row)"
                />
                <el-input-number
                  v-else-if="col.type === 'number' || (col.getType && col.getType(scope.row)=== 'number')"
                  v-model="scope.row[col.prop]"
                  style="width:100%"
                  :precision="col.precision"
                  :step="col.step"
                  :max="col.max"
                  :min="col.min"
                  step-strictly
                  size="mini"
                  controls-position="right"
                  @change="scope.row['___editted'] = true;callback(col, scope.row)"
                />
                <span v-else-if="col.type === 'dialog' || (col.getType && col.getType(scope.row)==='dialog')">
                  <a
                    v-if="col.showType === 'href'"
                    @click="callback(col, scope.row)"
                    v-html="formatter(scope,col)"
                  />
                  <el-button
                    v-if="col.showType === 'button'"
                    type="primary"
                    @click="callback(col, scope.row)"
                    v-html="formatter(scope,col)"
                  />
                  <span
                    v-else
                    @click="callback(col, scope.row)"
                    v-html="formatter(scope,col)"
                  />
                </span>
                <el-input
                  v-else-if="col.type === 'textarea' || (col.getType && col.getType(scope.row)=== 'textarea')"
                  v-model="scope.row[col.prop]"
                  type="textarea"
                  placeholder=""
                  :autosize="true"
                  @change="scope.row['___editted'] = true;callback(col, scope.row)"
                />
                <el-input
                  v-else
                  v-model="scope.row[col.prop]"
                  style="width:98%"
                  @change="scope.row['___editted'] = true;callback(col, scope.row)"
                />
              </template>
              <template v-else-if="col.showType === 'href'">
                <a
                  @click="callback(col, scope.row)"
                  v-html="formatter(scope,col)"
                />
              </template>
              <template v-else-if="col.showType === 'button'">
                <el-button
                  type="primary"
                  @click="callback(col, scope.row)"
                  v-html="formatter(scope,col)"
                />
              </template>
              <span
                v-else
                v-html="formatter(scope,col)"
              />
            </template>
          </el-table-column>
        </template>
      </el-table>
      <!-- <el-dialog :visible.sync="showMultiDialog" style="text-align:left">
      <multi ref="multi" :options="multiOptions" :values="multiValues" :setValues="setValues"/>
    </el-dialog>-->
      <span
        ref="privateSpan"
        style="position:absolute;top:10000000000px"
      />
    </el-main>
  </el-container>
</template>
<script>
import FilterColumn from './FilterHeaderColumn'

export default {
  name: 'TableEdit',
  components: { FilterColumn },
  props: {
    showIndex: {
      type: Boolean,
      default: function () {
        return true
      }
    },
    autoQuery: {
      type: Boolean,
      default: function () {
        return true
      }
    },
    url: { // 查询数据url
      type: String,
      default: function () {
        return ''
      }
    },
    deleteUrl: {
      type: String,
      default: function () {
        return null
      }
    },
    insertUrl: {
      type: String,
      default: function () {
        return null
      }
    },
    updateUrl: {
      type: String,
      default: function () {
        return null
      }
    },
    saveUrl: {
      type: String,
      default: function () {
        return null
      }
    },
    fitTable: { // 列自适应
      type: Boolean,
      default: function () {
        return true
      }
    },
    preQueryData: { // 前置查询条件
      type: Object,
      default: function () {
        return {}
      }
    },
    postQueryData: { // 后置查询条件
      type: Object,
      default: function () {
        return {}
      }
    },
    rowDblclick: { // 行双击事件
      type: Function,
      default: (row, event, column) => { console.log('default: ' + row + '---' + event + '---' + column) }
    },
    tableHeader: { // 表头数据
      type: Array,
      default: function () {
        return []
      }
    },
    showFilterBar: { // 是否显示过滤行
      type: Boolean,
      default: false
    },
    checkbox: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default: function () {
        return null
      }
    },
    multiMethod: {
      type: Function,
      default: function () {
        return null
      }
    },
    delKey: {
      type: String,
      default: function () {
        return null
      }
    },
    autoHeight: {
      type: Object,
      default: function () {
        return null
      }
    },
    multiCommit: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    initData: {
      type: Function,
      default: null
    },
  },
  data () {
    return {
      loading: false,
      queryData: {}, // 查询条件存储
      tableData: [], // 表格数据
      innerHeader: {},
      innerData: [],
      findTop: false,
      current: null,
      doNotReresh: false,
      showMultiDialog: false,
      // multiOptions:[],
      multiValues: [],
      currentProp: null,
      privateHtml: '',
      selected: [],
      deletes: [],
      headerMap: {}
    }
  },
  watch: {
    innerData: {
      immediate: true,
      handler (e) {
        this.$forceUpdate()
      }
    }
  },
  created () {
    if (this.autoQuery) {
      this.query()
    }
  },
  updated () {
    if (this.findTop) {
      let component = this.findTag(this, 'table-body')
      component.$el.parentElement.scrollTop = 0

      this.findTop = false
    }
  },
  beforeUpdate () {
    for (let h of this.tableHeader) {
      h['editType'] = undefined === h.editType ? 'update' : h.editType
      if (h.type === 'date' || h.type === 'datetime' || h.type === 'time') {
        if (undefined === h.format) {
          if (h.type === 'date') { h['format'] = 'yyyy-MM-dd' } else {
            h['format'] = 'yyyy-MM-dd HH:mm:ss'
          }

          if (undefined === h.format) {
            if (h.type === 'date') { h['valueFormat'] = 'yyyy-MM-dd' } else {
              h['valueFormat'] = 'yyyy-MM-dd HH:mm:ss'
            }
          }
          if (undefined === h.format) {
            if (h.type === 'time') { h['valueFormat'] = 'HH:mm' }
          }
        }
      }
    }

    this.innerHeader = this.tableHeader

    if (undefined === this.optionMap) {
      this['headerMap'] = {}
      this.tableHeader.forEach(col => {
        let key = col.prop
        if (col.hasOwnProperty('optionKey')) {
          key = col.optionKey
        }

        if (col.options && undefined !== col.options[key]) {
          col['optionMap'] = {}
          col.options[key].forEach(option => {
            col['optionMap'][option.value] = !col.showLabel && option.label ? option.label : option.value
          })
        }

        this['headerMap'][col.prop] = col
      })
    }
  },
  methods: {
    callback (col, row) {
      if (col.callback) {
        col.callback(row)
      }
    },
    triggerSelect (index, prop) {
      document.getElementById(prop + index).click()
    },
    setValues (values) {
      if (this.current[this.currentProp].sort().toString() === values.sort().toString()) { return }

      this.multiValues = values
      this.current[this.currentProp] = values
      this.current.___editted = true
    },
    currentChange (row, old) {
      if (row == null) {
        this.$refs.table.setCurrentRow(old)
        if (!this.multiCommit) { old.___editting = false }
        this.current = null
        return
      }

      if (old != null) {
        if (!this.multiCommit) { old.___editting = false }

        if (old.___editted && !this.multiCommit) {
          this.$refs.table.setCurrentRow(old)
          return this.$message.error(this.$t('common.editBeforeSave'))
        }
      }

      row['___editting'] = true
      let innerData = []
      for (let d of this.innerData) {
        innerData.push(d)
      }

      /*for (let h of this.tableHeader) {
        if (h.type === 'select') {
          if (h.formattor) {
            let a = this.$refs['privateSpan']
            a.innerHTML = h.formattor(h.options[0].value)
            let width = a.offsetWidth + 10
            row[h.prop + 'width'] = -width
          } else {
            row[h.prop + 'Label'] = h.key ? h.optionMap[row[h.key]] : h.optionMap[row[h.prop]]
          }
        }
      }*/
      innerData[row.____index] = row
      this.innerData = innerData

      /*for (let prop in row) {
        if (row[prop + 'Label'] !== undefined) {
          row[prop + 'Label'] = this.headerMap[prop].optionMap[row[prop]].label
        }
      }*/

      this.current = row
    },
    deleteFromView (confirmType = 'NONE') {
      if (this.selected == null || this.selected.length === 0) {
        return this.$message.error(this.$t('common.cannotDelete'))
      }

      if (confirmType === 'CONFIRM') {
        this.$confirm(this.$t('common.deleteViews'), {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          this.func()
        }).catch(() => {

        })
      } else {
        this.func()
      }
    },
    func () {
      let indexes = []// 直接删除的数据(新增但未保存的数据可以直接删除)
      for (let row of this.selected) {
        indexes.push(this.tableData.indexOf(row))
        if (!row.___add) {
          this.deletes.push(row)
        }
      }
      // 先对indexes倒序排列再直接删除
      indexes.sort(function (a, b) { return -(a - b) })
      for (let index of indexes) {
        this.tableData.splice(index, 1)
      }

      let s = this.deletes
    },
    query () {
      if (this.current != null) {
        if ((this.current.___editted || this.current.___add)) {
          return this.$message.error(this.$t('common.editBeforeSave'))
        }

      }

    },
    formatter (scope, col) {
      if (col.hasOwnProperty('formattor')) {
        if (col.type === 'datetime') {
          return col.formattor(scope.row[col.prop], col.format)
        }
        return col.formattor(scope.row[col.prop])
      } else if (col.type === 'select') {
        return this.label(col, scope.row)
      } else if (col.type === 'dialog') {
        let map = {}
        let key = col.prop
        if (col.hasOwnProperty('optionKey')) {
          key = col.optionKey
        }

        for (let o of col.options[key]) {
          map[o.value] = o.label
        }

        let ret = []
        if (scope.row[col.prop]) {
          for (let data of scope.row[col.prop]) {
            ret.push(map[data])
          }
        }
        return ret.join(',')
      } else {
        return scope.row[col.prop]
      }
    },
    dropChange (index, row, col) {
      row['___editted'] = true
      if (col.key) {
        row[col.key] = row[col.prop]
      }

      /*if (col.formattor) { row[col.prop + 'Label'] = '' } else {
        row[col.prop + 'Label'] = col.optionMap[row[col.prop]]
      }*/

      if (col.callback) {
        col.callback(row)
      }
    },
    label (col, row) {
      if (undefined === row || row == null) {
        return ''
      }

      /*if (col.optionMap) {
        row[col.prop + 'Label'] = col.optionMap[row[col.prop]]

        return row[col.prop + 'Label']
      }*/

      return ''
    },
    add (obj) {
      if (this.current != null && !this.multiCommit) {
        if ((this.current.___editted || this.current.___add)) {
          return this.$message.error(this.$t('common.editBeforeSave'))
        }
        this.current.___editting = false
      }
      let row = this.makeNewRow()
      if (obj) { row = Object.assign(row, obj) }
      this.tableData.splice(0, 0, row)
      this.$refs.table.setCurrentRow(this.tableData[0])
    },
    makeNewRow () {
      let tmp = {}
      this.tableHeader.forEach(o => {
        let key = o.prop
        if (o.key) {
          key = o.key
        }

        tmp[key] = undefined === o.default ? '' : o.default
      })

      tmp['___add'] = true
      tmp['___editting'] = true

      return tmp
    },
    findTag (component, tag) {
      if (component.$options._componentTag === tag) {
        return component
      }

      let ret = null
      if (component.$children.length > 0) {
        for (let count = 0; count < component.$children.length; count++) {
          ret = this.findTag(component.$children[count], tag)

          if (ret != null) {
            return ret
          }
        }
      }

      return null
    },
    multiDialog (row, prop) {
      if (this.multiMethod) {
        this.multiMethod(row, prop)
      }
      //   this.multiOptions = this.options[prop]
      this.multiValues = row[prop]

      // if(this.$refs.multi)
      // this.$refs.multi.setMap()
      // this.showMultiDialog = true
      this.currentProp = prop
    },
    check () {
      let ret = true
      if (this.multiCommit) {
        this.innerData.forEach(o => {
          if (o.___add || o.___editted) {
            this.innerHeader.forEach(h => {
              if (h.notNull) {
                if (h.type !== 'multi' && o[h.prop] === '') { ret = false } else if (h.type === 'multi' && o[h.prop].length === 0) {
                  ret = false
                }
              }
            })
          }
        })
      } else {
        this.innerHeader.forEach(o => {
          if (o.notNull) {
            if (o.type !== 'multi' && this.current[o.prop] === '') { ret = false } else if (o.type === 'multi' && this.current[o.prop].length === 0) {
              ret = false
            }
          }
        })
      }

      return ret
    },
    getLeft (prop) {
      return 'left:' + this['left' + prop] + 'px'
    },
    checkChange (selection) {
      this.selected = selection
    },
    setData (data) {
      if (data != null) {
        let index = 0
        for (let d of data) {
          d['____index'] = index++
          d['___editting'] = !!d['___editting']

          // for(let prop in d){
          //   if(this.headerMap[prop].options){
          //     d[prop + 'Label'] = ''
          //   }

          // }
        }

        if (this.initData) {
          this.tableData = this.initData(data)
          this.innerData = this.initData(data)
        } else {
          this.tableData = data
          this.innerData = data
        }

        this.currentProp = null
        this.current = null
        this.selected = []
        this.deletes = []
      }
    },
    getEditted () {
      let updates = []
      let adds = []
      let deletes = this.deletes
      this.tableData.forEach(o => {
        if (o.___add) {
          adds.push(o)
        } else if (o.___editted) {
          updates.push(o)
        }
      })

      return { updates, adds, deletes }
    },
    handleCheckAllChange (val) {
      this.tableData.forEach(o => {
        if (typeof (o[val.prop]) === 'boolean') {
          o[val.prop] = val.checkAll
        } else if (typeof (o[val.prop]) === 'string') {
          o[val.prop] = val.checkAll === true ? 'Y' : 'N'
        }
      })
      val.isIndeterminate = false
    },
    handleCheckedChange (val) {
      val.isIndeterminate = false
      this.tableData.forEach(o => {
        if (o[val.prop] !== 'Y' && o[val.prop] !== 'Yes' &&
          o[val.prop] !== true && o[val.prop] !== 'true') {
          val.isIndeterminate = true
        }
      })

      if (!val.isIndeterminate) {
        val.checkAll = true
      }
    }
  }
}
</script>
<style scoped>
.el-table th {
  padding: 0px;
  /* background: blue; */
  text-align: center;
}
.el-table th div {
  line-height: 16px;
}
.el-table th > .cell {
  padding: 0px;
}
.el-table  td > .cell{
	white-space: pre;
}
.el-table--mini td{
	padding: 3px 0;
}

.el-input-number .el-input {
  padding: 0px;
}

.el-select > .el-input {
  padding: 0px;
}

.el-table th div {
  display: flex;
}

.___span{
  position: relative;
}
</style>
