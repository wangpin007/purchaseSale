<template>
  <el-container
    direction="vertical"
    style="min-height: 0;"
    class="the_TableView"
  >
    <el-main style="flex-grow: 1;display: flex;flex-direction: column">
      <el-table
        ref="tableGrid"
        v-loading="loading"
        :stripe="stripe"
        border
        :fit="fitTable"
        highlight-current-row
        size="mini"
        :data="tableData"
        :element-loading-text="$t('common.loading')"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.3)"
        :default-expand-all="expandAll"
        lazy
        :tree-props="treeProps"
        style="flex-grow: 1"
        height="100%"
        :header-cell-class-name="headerCellClassName"
        :row-class-name="rowClass"
        :row-key="rowKey"
        :load="load"
        :cell-class-name="cellClass"
        :cell-style="cellStyle"
        @current-change="currentChange"
        @row-dblclick="rowDblclick"
        @selection-change="checkChange"
        @cell-click="cellclick"
        @row-click="rowClick"
        @select="selectRow"
      >
        <el-table-column
          v-if="checkbox"
          type="selection"
          :selectable="setSelectable"
        />
        <el-table-column
          v-if="rowIndex"
          type="index"
          align="center"
          :fixed="rowIndexFixed"
        />
        <template v-for="(col, key) in innerHeader">
          <el-table-column
            v-if="!col.hidden"
            :key="key"
            :prop="col.prop"
            :label="typeof col.label === 'function' ? col.label() : col.label"
            :fixed="col.fixed ? col.fixed : false"
            :min-width="col.minWidth"
            :width="col.width"
            :align="col.align ? col.align : 'left'"
            :header-align="col.headerAlign ? col.headerAlign : 'center'"
            :show-overflow-tooltip="true"
            :sortable="col.sortable"
          >
            <template slot-scope="scope">
              <template v-if="col.showType === 'button'">
                <el-button
                  v-if="col.show ? col.show(scope.row) : true"
                  :type="col.btnStyle ? col.btnStyle : 'primary'"
                  :icon="col.icon"
                  :loading="col.loading"
                  @click.stop.prevent="callback(col, scope.row)"
                  v-html="formatter(scope, col)"
                  :code="col.code"
                />
              </template>
              <template v-else-if="col.showType === 'switch'">
                <el-switch
                  v-model="scope.row[col.prop]"
                  :inactive-value="col.switchValues.inactive"
                  :active-value="col.switchValues.active"
                  @change="callback(col, scope.row)"
                />
              </template>
              <template v-else-if="col.showType === 'buttons'">
                <el-button-group>
                  <template v-for="button in col.buttons">
                    <el-button
                      style="margin:0 3px;"
                      :code="button.code"
                      v-if="button.show ? button.show(scope.row) : true"
                      :key="button.text"
                      :disabled="button.disabled"
                      :type="button.btnStyle ? button.btnStyle : 'text'"
                      @click="callback(button, scope.row)"
                      v-html="formatter(scope, button)"
                    />
                  </template>
                </el-button-group>
              </template>
              <span v-else v-html="formatter(scope, col)" />
            </template>
          </el-table-column>
        </template>
      </el-table>
    </el-main>

    <el-footer v-if="pageEnabled" class="page-bar">
      <el-row type="flex">
        <el-col>
          <c-pagination
            ref="queryPagination"
            style="margin: 0"
            class="c-query-table-pagination"
            :total="queryTotal"
            :page-num="viewIndex"
            :page-size="viewSize"
            @current-change="changeCurrentIndex"
            @size-change="changeCurrentSize"
          />
        </el-col>
        <el-col v-if="openCustomTable" :span="2" class="setting-button">
          <custom-table :tableConfigChange="tableConfigChange" />
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
</template>
<script>
import CustomTable from "lib@/components/custom-table";
import FilterColumn from "./FilterHeaderColumn";
import HeaderSort from "./HeaderSort";
import CPagination from "lib@/components/c-pagination";
import { isNull } from "@/utils";

export default {
  name: "TableView",
  components: { FilterColumn, HeaderSort,CustomTable, CPagination },
  props: {
    stripe: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    openCustomTable: {
      type: Boolean,
      default: false
    },
    autoQuery: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    requestMethod: {
      // HTTP请求方式---默认是post,
      type: String,
      default: function() {
        return "post";
      }
    },
    url: {
      // 查询数据url
      type: String,
      default: function() {
        return "";
      }
    },
    source: {
      type: Function,
      default: null
    },
    urlForCount: {
      // 查询总行数url
      type: String,
      default: function() {
        return "";
      }
    },
    fitTable: {
      // 列自适应
      type: Boolean,
      default: function() {
        return true;
      }
    },
    pageEnabled: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    pageIndex: {
      // 当前页码,从1开始
      type: Number,
      default: function() {
        return 1;
      }
    },
    pageSize: {
      // 一页数量
      type: Number,
      default: function() {
        return 10;
      }
    },
    pageStep: {
      // 页数递增步数
      type: Array,
      default: function() {
        return [];
      }
    },
    preQueryData: {
      // 前置查询条件
      type: Object,
      default: function() {
        return {};
      }
    },
    postQueryData: {
      // 后置查询条件
      type: Object,
      default: function() {
        return {};
      }
    },
    rowDblclick: {
      // 行双击事件
      type: Function,
      default: (row, event, column) => {
        console.log("default: " + row + "---" + event + "---" + column);
      }
    },
    cellclick: {
      // 单元格事件
      type: Function,
      default: (row, column, cell, event) => {
        // console.log('default: ' + row + '---' + column + '---' + cell)
      }
    },
    currentChange: {
      // 选中行改变事件
      type: Function,
      default: val => {}
    },
    tableHeader: {
      // 表头数据
      type: Array,
      default: function() {
        return [];
      }
    },
    showFilterBar: {
      // 是否显示过滤行
      type: Boolean,
      default: false
    },
    checkbox: {
      type: Boolean,
      default: false
    },
    autoHeight: {
      type: Object,
      default: function() {
        return null;
      }
    },
    checkChange: {
      type: Function,
      default: function() {
        return null;
      }
    },
    // CheckBox 是否可以勾选
    setSelectable: {
      type: Function,
      default: function() {
        return true;
      }
    },
    // 返回row的class方法
    rowClass: {
      type: Function,
      default: function() {
        return true;
      }
    },
    // 表头样式
    headerCellClassName: {
      type: [Function, String],
      default: null
    },
    treeProps: {
      type: Object,
      default: function() {
        return {};
      }
    },
    // 行数据的 Key，值须唯一
    rowKey: {
      type: String,
      default: null
    },
    // 加载子节点数据的函数
    load: {
      type: Function,
      default: function() {
        return null;
      }
    },
    // 单元格的 className 的回调方法
    cellClass: {
      type: Function,
      default: function() {
        return null;
      }
    },
    // 单元格的 style 的回调方法
    cellStyle: {
      type: Function,
      default: function() {
        return null;
      }
    },
    // 返回数据处理
    formatSearchData: {
      type: Function
    },
    expandAll: {
      type: Boolean,
      default: false
    },
    rowIndex: {
      type: Boolean,
      default: true
    },
    rowIndexFixed: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: false,
      queryData: {}, // 查询条件存储
      tableData: [], // 表格数据
      sortData: {},
      dataCount: 0,
      queryTotal: 0,
      viewSize: this.pageSize,
      viewStep: this.pageStep,
      viewIndex: this.pageIndex,
      innerHeader: [],
      currentRow: null,
      showFilter: this.showFilterBar,
      currentPageSize: 15
    };
  },
  watch: {
    tableHeader: {
      immediate: true,
      handler: function(n, o) {
        if (JSON.stringify(n) !== JSON.stringify(o)) {
          this.innerHeader = n;
        }
      },
      deep: true
    },
    showFilterBar: function(data) {
      this.showFilter = data;
    }
  },
  beforeCreate() {},
  created() {
    if (this.autoQuery) {
      this.query();
    }
  },
  beforeUpdate() {
    this.queryData = Object.assign({}, this.queryData);
  },
  updated() {
    // console.log(this.innerHeader);
    // this.innerHeader = this.tableHeader
  },
  methods: {
    tableConfigChange(config) {
      if (!config || !config.length) {
        this.innerHeader = this.tableHeader.filter(i => !!i);
      } else {
        this.innerHeader = (config || [])
          .filter(i => i.show)
          .map(i => {
            return this.tableHeader.find(j => j.prop === i.prop);
          })
          .filter(i => !!i);
      }
      this.$nextTick(() => {
        this.$refs.tableGrid.doLayout(); // 暂时解决表格错位的问题
      });
    },

    callback(col, row) {
      if (col.callback) {
        col.callback(row);
      }
    },
    getParam() {
      let param = Object.assign(
        {},
        this.preQueryData,
        this.queryData,
        this.postQueryData
      );
      let _this = this;

      if (this.pageEnabled) {
        param.__page = this.viewIndex;
        param.__pagesize = this.viewSize;
      }

      return param;
    },

    query() {
      this.viewIndex = 1; // 非分页触发查询，页码跳回首页
      this.queryTotal = 0; // 更新总条数为未知
      let queryParam = this.getParam();
      this.find(queryParam);
    },
    find(param) {
      let _this = this;
      _this.loading = true;
      let params = Object.assign({}, this.preQueryData, param);
      let paramsExt = Object.assign(
        { pageNo: params.__page, pageSize: params.__pagesize },
        this.preQueryData
      );
      if (this.source) {
        this.source(paramsExt)
          .then(data => {
            if (data && data.data) {
              if (data.data.list == null || data.data.list.length === 0) {
                _this.dataCount = 0;
                _this.tableData = [];
              } else {
                _this.tableData = data.data.list;
                _this.dataCount = data.data.total;
                _this.queryTotal = data.data.total;
              }
              _this.loading = false;
              _this.$emit("afterQuery", data.data.list); // afterQuery 事件
              _this.$nextTick(() => {
                _this.$refs.tableGrid.doLayout(); // 暂时解决表格错位的问题
              });
            }
          })
          .catch(err => {
            console.log(err);
            _this.loading = false;
            _this.$emit("afterQuery", err); // afterQuery 事件
          });
        this.$nextTick(() => {
          this.$refs.tableGrid.doLayout(); // 暂时解决表格错位的问题
        });
        return;
      }
      if (this.requestMethod === "post") {
        this.$http({
          url: this.url,
          method: "post",
          data: paramsExt
        })
          .then(data => {
            if (data && data.data) {
              if (data.data.list == null || data.data.list.length === 0) {
                _this.dataCount = 0;
                _this.tableData = [];
              } else {
                _this.tableData = data.data.list;
                _this.dataCount = data.data.total;
                _this.queryTotal = data.data.total;
              }
              _this.loading = false;
              _this.$emit("afterQuery", data.data.list); // afterQuery 事件
              _this.$nextTick(() => {
                _this.$refs.tableGrid.doLayout(); // 暂时解决表格错位的问题
              });
            }
          })
          .catch(err => {
            console.log(err);
            _this.loading = false;
            _this.$emit("afterQuery", err); // afterQuery 事件
          });
      } else if (this.requestMethod === "get") {
        this.$http({
          url: this.url,
          method: "get",
          params: paramsExt
        })
          .then(data => {
            if (data && data.data) {
              if (data.data.list == null || data.data.list.length === 0) {
                _this.dataCount = 0;
                _this.tableData = [];
              } else {
                _this.tableData = data.data.list;
                _this.dataCount = data.data.total;
                _this.queryTotal = data.data.total;
              }
              _this.loading = false;
              _this.$emit("afterQuery", data.data.list); // afterQuery 事件
              _this.$nextTick(() => {
                _this.$refs.tableGrid.doLayout(); // 暂时解决表格错位的问题
              });
            }
          })
          .catch(err => {
            console.log(err);
            _this.loading = false;
            _this.$emit("afterQuery", err); // afterQuery 事件
          });
      }
      this.$nextTick(() => {
        this.$refs.tableGrid.doLayout(); // 暂时解决表格错位的问题
      });
    },

    // 改变 currentNum
    changeCurrentIndex(currentNum) {
      let queryParam = this.getParam();
      queryParam.__pagesize = this.currentPageSize;
      queryParam.__page = currentNum;

      let _this = this;
      _this.loading = true;
      let paramsExt = Object.assign(
        { pageNo: queryParam.__page, pageSize: queryParam.__pagesize },
        this.preQueryData
      );
      if (this.source) {
        this.source(paramsExt)
          .then(data => {
            if (data && data.data) {
              if (data.data.list == null || data.data.list.length === 0) {
                _this.dataCount = 0;
                _this.tableData = [];
              } else {
                _this.tableData = data.data.list;
                _this.dataCount = data.data.total;
                _this.queryTotal = data.data.total;
              }
              _this.loading = false;
              _this.$emit("afterQuery", data.data.list); // afterQuery 事件
              _this.$nextTick(() => {
                _this.$refs.tableGrid.doLayout(); // 暂时解决表格错位的问题
              });
            }
          })
          .catch(err => {
            console.log(err);
            _this.loading = false;
            _this.$emit("afterQuery", err); // afterQuery 事件
          });
        this.$nextTick(() => {
          this.$refs.tableGrid.doLayout(); // 暂时解决表格错位的问题
        });
        return;
      }
      if (this.requestMethod === "post") {
        this.$http({
          url: this.url,
          method: "post",
          data: paramsExt
        })
          .then(data => {
            if (data && data.data) {
              if (data.data.list == null || data.data.list.length === 0) {
                _this.dataCount = 0;
              } else {
                _this.tableData = data.data.list;
                _this.dataCount = data.data.total;
                _this.queryTotal = data.data.total;
              }
              _this.loading = false;
              _this.$emit("afterQuery", data.data.list); // afterQuery 事件
            }
          })
          .catch(err => {
            console.log(err);
            _this.loading = false;
            _this.$emit("afterQuery", err); // afterQuery 事件
          });
      } else if (this.requestMethod === "get") {
        this.$http({
          url: this.url,
          method: "get",
          params: paramsExt
        })
          .then(data => {
            if (data && data.data) {
              if (data.data.list == null || data.data.list.length === 0) {
                _this.dataCount = 0;
              } else {
                _this.tableData = data.data.list;
                _this.dataCount = data.data.total;
                _this.queryTotal = data.data.total;
              }
              _this.loading = false;
              _this.$emit("afterQuery", data.data.list); // afterQuery 事件
            }
          })
          .catch(err => {
            console.log(err);
            _this.loading = false;
            _this.$emit("afterQuery", err); // afterQuery 事件
          });
      }
      this.$nextTick(() => {
        this.$refs.tableGrid.doLayout(); // 暂时解决表格错位的问题
      });
    },
    // 改变 currentSize
    changeCurrentSize(currentSize) {
      let queryParam = this.getParam();
      this.currentPageSize = currentSize;
      queryParam.__pagesize = currentSize;
      queryParam.__page = 1;

      let _this = this;
      _this.loading = true;
      let paramsExt = Object.assign(
        { pageNo: queryParam.__page, pageSize: queryParam.__pagesize },
        this.preQueryData
      );
      if (this.source) {
        this.source(paramsExt)
          .then(data => {
            if (data && data.data) {
              if (data.data.list == null || data.data.list.length === 0) {
                _this.dataCount = 0;
                _this.tableData = [];
              } else {
                _this.tableData = data.data.list;
                _this.dataCount = data.data.total;
                _this.queryTotal = data.data.total;
              }
              _this.loading = false;
              _this.$emit("afterQuery", data.data.list); // afterQuery 事件
              _this.$nextTick(() => {
                _this.$refs.tableGrid.doLayout(); // 暂时解决表格错位的问题
              });
            }
          })
          .catch(err => {
            console.log(err);
            _this.loading = false;
            _this.$emit("afterQuery", err); // afterQuery 事件
          });
        this.$nextTick(() => {
          this.$refs.tableGrid.doLayout(); // 暂时解决表格错位的问题
        });
        return;
      }
      if (this.requestMethod === "post") {
        this.$http({
          url: this.url,
          method: "post",
          data: paramsExt
        })
          .then(data => {
            if (data && data.data) {
              if (data.data.list == null || data.data.list.length === 0) {
                _this.dataCount = 0;
              } else {
                _this.tableData = data.data.list;
                _this.dataCount = data.data.total;
                _this.queryTotal = data.data.total;
              }
              _this.loading = false;
              _this.$emit("afterQuery", data.data.list); // afterQuery 事件
            }
          })
          .catch(err => {
            console.log(err);
            _this.loading = false;
            _this.$emit("afterQuery", err); // afterQuery 事件
          });
      } else if (this.requestMethod === "get") {
        this.$http({
          url: this.url,
          method: "get",
          params: paramsExt
        })
          .then(data => {
            if (data && data.data) {
              if (data.data.list == null || data.data.list.length === 0) {
                _this.dataCount = 0;
              } else {
                _this.tableData = data.data.list;
                _this.dataCount = data.data.total;
                _this.queryTotal = data.data.total;
              }
              _this.loading = false;
              _this.$emit("afterQuery", data.data.list); // afterQuery 事件
            }
          })
          .catch(err => {
            console.log(err);
            _this.loading = false;
            _this.$emit("afterQuery", err); // afterQuery 事件
          });
      }
      this.$nextTick(() => {
        this.$refs.tableGrid.doLayout(); // 暂时解决表格错位的问题
      });
    },
    formatter(scope, col) {
      let icon = "";
      let text = "";
      if (col.hasOwnProperty("formattor")) {
        text = col.formattor(
          col.prop ? this.getPropData(scope.row, col) : col.label,
          scope.row
        );
      } else {
        text = col.prop ? this.getPropData(scope.row, col) : "";
      }

      if (col.icon) {
        icon = '<i class="' + col.icon + '"></i>';
      }
      if (!isNull(text)) {
        return icon + "<span>" + text + "</span>";
      } else {
        return icon;
      }
    },
    // 获取属性对应的值
    getPropData(data, col) {
      let props = (col.mapProp || col.prop).split(".");
      let propData = data || {};

      for (let item of props) {
        if (typeof data === "object") {
          propData = propData[item];
        } else {
          return propData;
        }
      }
      return propData;
    },

    setCurrentRow(row) {
      this.$refs.tableGrid.setCurrentRow(row);
    },

    rowClick(row, column, event) {
      if (!this.checkbox) return; // 非多选不执行以下操作

      // 排除禁止选择
      let el = event.currentTarget.querySelector("input");
      if (el.hasAttribute("disabled")) return;

      this.$refs.tableGrid.toggleRowSelection(row);
    },
    selectRow(selection, row) {
      this.setCurrentRow(row);
    }
  }
};
</script>
<style scoped lang="scss">
.the_TableView {
  padding-left: 10px;
  padding-right: 10px;
  .setting-button {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .el-table th {
    padding: 0px;
    text-align: center;
  }

  .el-table th div {
    line-height: 16px;
    display: flex;
  }

  .el-table th > .cell {
    padding: 0px;
  }

  .el-table td > .cell {
    white-space: pre;
  }

  .el-table--mini td {
    padding: 3px 0;
  }

  .el-input-number .el-input {
    padding: 0px;
  }

  .el-select > .el-input {
    padding: 0px;
  }

  .el-table__body-wrapper {
    z-index: 999 !important;
  }
}
</style>
