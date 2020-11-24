/*
* File Created: 2020-08-04
* Author: wangPin
*/
<template>
  <el-card v-if="type === 'card'" :shadow="shadow" :body-style="cardBodyStyle" class="magicalTable" ref="magicalTable">
    <template #header>
      <slot name="header"></slot>
    </template>
    <m-query v-if="needQuery_computed"
             class="mQuery"
             :formData="form.formData"
             :needRightPart="formSettings.needRightPart"
             :needCollapseBtn="formSettings.needCollapseBtn"
             :needRestBtn="formSettings.needRestBtn"
             :needSubmitBtn="formSettings.needSubmitBtn"
             :labelWidth="formSettings.labelWidth"
             :isCollapse="formSettings.isCollapse"
             :collapseHeight="formSettings.collapseHeight"
             :loading="loading"
             :labelPosition="formSettings.labelPosition"
             :rightPartStyle="formSettings.rightPartStyle"
             :leftPartStyle="formSettings.leftPartStyle"
             :formItemStyle="formSettings.formItemStyle"
             :submitBtnText="formSettings.submitBtnText"
             :clearDisabledValue="formSettings.clearDisabledValue"
             @onSubmit="onSubmit"
             @resetData="resetData"
             @onCollapse="onCollapse"
             ref="mQuery">
      <template #formItem="{formItem}">
        <slot name="formItem" :formItem="formItem"></slot>
      </template>
      <template #formRight>
        <slot name="formRight"></slot>
      </template>
      <template #formCol>
        <slot name="formCol"></slot>
      </template>
    </m-query>
    <el-divider v-if="needLine_computed" class="mLine"></el-divider>
    <div v-if="needButtons_computed" class="mButtons">
      <slot name="buttons"></slot>
    </div>
    <div v-if="needTable_computed" class="mTableWrap">
      <m-table v-if="needTable_computed" class="mTable" ref="mTable"
               :data="table.tableData"
               :columns="table.columns"
               :height="tableSettings.height"
               :max-height="tableSettings.maxHeight"
               :loading="loading"
               :stripe="tableSettings.stripe"
               :border="tableSettings.border"
               :size="tableSettings.size"
               :fit="tableSettings.fit"
               :show-header="tableSettings.showHeader"
               :highlight-current-row="tableSettings.highlightCurrentRow"
               :span-method="tableSettings.spanMethod"
               :row-key="tableSettings.rowKey"
               :expandRowKeys="tableSettings.expandRowKeys"
               :load="tableSettings.load"
               :default-expand-all="tableSettings.defaultExpandAll"
               :tree-props="tableSettings.treeProps"
               :show-summary="tableSettings.showSummary"
               :summary-method="tableSettings.summaryMethod"
               :tooltip="tableSettings.tooltip"
               :cellClassName="tableSettings.cellClassName"
               @select="select"
               @selectAll="selectAll"
               @selectionChange="selectionChange"
               @cellMouseEnter="cellMouseEnter"
               @cellMouseLeave="cellMouseLeave"
               @cellClick="cellClick"
               @cellDblclick="cellDblclick"
               @rowClick="rowClick"
               @rowContextmenu="rowContextmenu"
               @rowDblclick="rowDblclick"
               @headerClick="headerClick"
               @headerContextmenu="headerContextmenu"
               @sortChange="sortChange"
               @filterChange="filterChange"
               @currentChange="currentChange"
               @headerDragend="headerDragend"
               @expandChange="expandChange">
        <template #tableBody="{ row, $index, column, store, _self, col}">
          <slot name="tableBody"
                :row="row"
                :$index="$index"
                :column="column"
                :store="store"
                :_self="_self"
                :col="col">
          </slot>
        </template>
        <template #tableHeader="{column, $index, store, _self, col}">
          <slot name="tableHeader"
                :column="column"
                :$index="$index"
                :store="store"
                :_self="_self"
                :col="col">
          </slot>
        </template>
      </m-table>
    </div>
    <div v-if="needPagination_computed" class="mPagination">
      <el-row type="flex">
        <el-col>
          <m-pagination
            ref="cPagination"
            :total="paginationSettings.total"
            :pageNum="paginationSettings.pageNum"
            :pageSize="paginationSettings.pageSize"
            :pageSizes="paginationSettings.pageSizes"
            :layout="paginationSettings.layout"
            :needUpdate="paginationSettings.needUpdate"
            @current-change="pageNumChange"
            @size-change="pageSizeChange"
          ></m-pagination>
        </el-col>
        <el-col v-if="needCustomTable" :span="2" class="setting-button">
          <custom-table :tableConfigChange="tableConfigChange"/>
        </el-col>
      </el-row>
    </div>
  </el-card>
  <el-container v-else-if="type === 'container'" class="magicalTable container" ref="magicalTable">
    <el-header style="height: auto; padding: 10px 0 0 0">
      <m-query v-if="needQuery_computed"
               class="mQuery"
               :formData="form.formData"
               :needRightPart="formSettings.needRightPart"
               :needCollapseBtn="formSettings.needCollapseBtn"
               :needRestBtn="formSettings.needRestBtn"
               :needSubmitBtn="formSettings.needSubmitBtn"
               :labelWidth="formSettings.labelWidth"
               :isCollapse="formSettings.isCollapse"
               :collapseHeight="formSettings.collapseHeight"
               :loading="loading"
               :labelPosition="formSettings.labelPosition"
               :rightPartStyle="formSettings.rightPartStyle"
               :leftPartStyle="formSettings.leftPartStyle"
               :formItemStyle="formSettings.formItemStyle"
               :submitBtnText="formSettings.submitBtnText"
               :clearDisabledValue="formSettings.clearDisabledValue"
               @onSubmit="onSubmit"
               @resetData="resetData"
               @onCollapse="onCollapse"
               ref="mQuery">
        <template #formItem="{formItem}">
          <slot name="formItem" :formItem="formItem"></slot>
        </template>
        <template #formRight>
          <slot name="formRight"></slot>
        </template>
        <template #formCol>
          <slot name="formCol"></slot>
        </template>
      </m-query>
      <el-divider v-if="needLine_computed" class="mLine"></el-divider>
      <div v-if="needButtons_computed" class="mButtons">
        <slot name="buttons"></slot>
      </div>
    </el-header>
    <el-main class="mTableWrap flex">
      <m-table v-if="needTable_computed" ref="mTable"
               :data="table.tableData"
               :columns="table.columns"
               :height="tableSettings.height"
               :max-height="tableSettings.maxHeight"
               :loading="loading"
               :stripe="tableSettings.stripe"
               :border="tableSettings.border"
               :size="tableSettings.size"
               :fit="tableSettings.fit"
               :show-header="tableSettings.showHeader"
               :highlight-current-row="tableSettings.highlightCurrentRow"
               :span-method="tableSettings.spanMethod"
               :row-key="tableSettings.rowKey"
               :expandRowKeys="tableSettings.expandRowKeys"
               :load="tableSettings.load"
               :default-expand-all="tableSettings.defaultExpandAll"
               :tree-props="tableSettings.treeProps"
               :show-summary="tableSettings.showSummary"
               :summary-method="tableSettings.summaryMethod"
               :tooltip="tableSettings.tooltip"
               :cellClassName="tableSettings.cellClassName"
               @select="select"
               @selectAll="selectAll"
               @selectionChange="selectionChange"
               @cellMouseEnter="cellMouseEnter"
               @cellMouseLeave="cellMouseLeave"
               @cellClick="cellClick"
               @cellDblclick="cellDblclick"
               @rowClick="rowClick"
               @rowContextmenu="rowContextmenu"
               @rowDblclick="rowDblclick"
               @headerClick="headerClick"
               @headerContextmenu="headerContextmenu"
               @sortChange="sortChange"
               @filterChange="filterChange"
               @currentChange="currentChange"
               @headerDragend="headerDragend"
               @expandChange="expandChange">
        <template #tableBody="{ row, $index, column, store, _self, col}">
          <slot name="tableBody"
                :row="row"
                :$index="$index"
                :column="column"
                :store="store"
                :_self="_self"
                :col="col">
          </slot>
        </template>
        <template #tableHeader="{column, $index, store, _self, col}">
          <slot name="tableHeader"
                :column="column"
                :$index="$index"
                :store="store"
                :_self="_self"
                :col="col">
          </slot>
        </template>
      </m-table>
    </el-main>
    <el-footer v-if="needPagination_computed" style="height: auto; padding: 0 0 10px 0">
      <div class="mPagination">
        <el-row type="flex">
          <el-col>
            <m-pagination
              ref="cPagination"
              :total="paginationSettings.total"
              :pageNum="paginationSettings.pageNum"
              :pageSize="paginationSettings.pageSize"
              :pageSizes="paginationSettings.pageSizes"
              :layout="paginationSettings.layout"
              :needUpdate="paginationSettings.needUpdate"
              @current-change="pageNumChange"
              @size-change="pageSizeChange"
            ></m-pagination>
          </el-col>
          <el-col v-if="needCustomTable" :span="2" class="setting-button">
            <custom-table :tableConfigChange="tableConfigChange"/>
          </el-col>
        </el-row>
      </div>
    </el-footer>
  </el-container>
  <el-dialog v-else-if="type === 'dialog'"
             class="mDialog"
             :visible="show"
             v-el-drag-dialog
             :title="title"
             :width="width"
             :fullscreen="fullscreen"
             :top="top"
             :modal="modal"
             :modal-append-to-body="modalAppendToBody"
             :append-to-body="appendToBody"
             :lock-scroll="lockScroll"
             :custom-class="customClass"
             :close-on-click-modal="closeOnClickModal"
             :close-on-press-escape="closeOnPressEscape"
             :show-close="showClose"
             :before-close="beforeClose"
             :center="center"
             :destroy-on-close="destroyOnClose"
             @close="close"
             @open="open">
    <el-card :shadow="shadow" :body-style="cardBodyStyle" class="magicalTable" ref="magicalTable">
      <template #header>
        <slot name="header"></slot>
      </template>
      <m-query v-if="needQuery_computed"
               class="mQuery"
               :formData="form.formData"
               :needRightPart="formSettings.needRightPart"
               :needCollapseBtn="formSettings.needCollapseBtn"
               :needRestBtn="formSettings.needRestBtn"
               :needSubmitBtn="formSettings.needSubmitBtn"
               :labelWidth="formSettings.labelWidth"
               :isCollapse="formSettings.isCollapse"
               :collapseHeight="formSettings.collapseHeight"
               :loading="loading"
               :labelPosition="formSettings.labelPosition"
               :rightPartStyle="formSettings.rightPartStyle"
               :leftPartStyle="formSettings.leftPartStyle"
               :formItemStyle="formSettings.formItemStyle"
               :submitBtnText="formSettings.submitBtnText"
               :clearDisabledValue="formSettings.clearDisabledValue"
               @onSubmit="onSubmit"
               @resetData="resetData"
               @onCollapse="onCollapse"
               ref="mQuery">
        <template #formItem="{formItem}">
          <slot name="formItem" :formItem="formItem"></slot>
        </template>
        <template #formRight>
          <slot name="formRight"></slot>
        </template>
        <template #formCol>
          <slot name="formCol"></slot>
        </template>
      </m-query>
      <el-divider v-if="needLine_computed" class="mLine"></el-divider>
      <div v-if="needButtons_computed" class="mButtons">
        <slot name="buttons"></slot>
      </div>
      <div v-if="needTable_computed" class="mTableWrap">
        <m-table v-if="needTable_computed" class="mTable" ref="mTable"
                 :data="table.tableData"
                 :columns="table.columns"
                 :height="tableSettings.height"
                 :max-height="tableSettings.maxHeight"
                 :loading="loading"
                 :stripe="tableSettings.stripe"
                 :border="tableSettings.border"
                 :size="tableSettings.size"
                 :fit="tableSettings.fit"
                 :show-header="tableSettings.showHeader"
                 :highlight-current-row="tableSettings.highlightCurrentRow"
                 :span-method="tableSettings.spanMethod"
                 :row-key="tableSettings.rowKey"
                 :expandRowKeys="tableSettings.expandRowKeys"
                 :load="tableSettings.load"
                 :default-expand-all="tableSettings.defaultExpandAll"
                 :tree-props="tableSettings.treeProps"
                 :show-summary="tableSettings.showSummary"
                 :summary-method="tableSettings.summaryMethod"
                 :tooltip="tableSettings.tooltip"
                 :cellClassName="tableSettings.cellClassName"
                 @select="select"
                 @selectAll="selectAll"
                 @selectionChange="selectionChange"
                 @cellMouseEnter="cellMouseEnter"
                 @cellMouseLeave="cellMouseLeave"
                 @cellClick="cellClick"
                 @cellDblclick="cellDblclick"
                 @rowClick="rowClick"
                 @rowContextmenu="rowContextmenu"
                 @rowDblclick="rowDblclick"
                 @headerClick="headerClick"
                 @headerContextmenu="headerContextmenu"
                 @sortChange="sortChange"
                 @filterChange="filterChange"
                 @currentChange="currentChange"
                 @headerDragend="headerDragend"
                 @expandChange="expandChange">
          <template #tableBody="{ row, $index, column, store, _self, col}">
            <slot name="tableBody"
                  :row="row"
                  :$index="$index"
                  :column="column"
                  :store="store"
                  :_self="_self"
                  :col="col">
            </slot>
          </template>
          <template #tableHeader="{column, $index, store, _self, col}">
            <slot name="tableHeader"
                  :column="column"
                  :$index="$index"
                  :store="store"
                  :_self="_self"
                  :col="col">
            </slot>
          </template>
        </m-table>
      </div>
      <div v-if="needPagination_computed" class="mPagination">
        <el-row type="flex">
          <el-col>
            <m-pagination
              ref="cPagination"
              :total="paginationSettings.total"
              :pageNum="paginationSettings.pageNum"
              :pageSize="paginationSettings.pageSize"
              :pageSizes="paginationSettings.pageSizes"
              :layout="paginationSettings.layout"
              :needUpdate="paginationSettings.needUpdate"
              @current-change="pageNumChange"
              @size-change="pageSizeChange"
            ></m-pagination>
          </el-col>
          <el-col v-if="needCustomTable" :span="2" class="setting-button">
            <custom-table :tableConfigChange="tableConfigChange"/>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <template #title>
      <slot name="title"></slot>
    </template>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </el-dialog>
</template>

<script>
  import mQuery from '../query/index';
  import mTable from '../table/index';
  import mPagination from "lib@/components/c-pagination";
  import customTable from "lib@/components/custom-table";
  import ElDialog from "element-ui/packages/dialog/src/component";

  export default {
    name: 'magicalTable',
    components: {
      ElDialog,
      mQuery,
      mTable,
      mPagination,
      customTable
    },
    props: {
      /**
       * 布局方式有三种card、container、dialog
       * 默认container
       **/
      type: {
        type: String,
        default: 'container'
      },
      /**
       * m-query组件参数
       * formData：表单元素数组
       * settings：表单配置参数 默认值在 formSettings 里面设置
       **/
      form: {
        type: Object,
        default() {
          return {
            settings: {},
            formData: [],
          }
        }
      },
      /**
       * m-table组件参数
       * tableData：表格数据
       * columns: 表格配置参数
       * settings：表格配置参数 默认值在 tableSettings 里面设置
       * */
      table: {
        type: Object,
        default() {
          return {
            settings: {},
            tableData: [],
            columns: []
          }
        }
      },
      // 分页配置参数
      pagination: {
        type: Object,
        default() {
          return {}
        }
      },
      // card组件 阴影属性 默认never
      shadow: {
        type: String,
        default: 'never'
      },
      // card组件 bodyStyle属性 默认值在cardBodyStyle里面设置
      bodyStyle: {
        type: Object
      },
      // 是否需要查询部分 默认true
      needQuery: {
        type: Boolean,
        default: true
      },
      /**
       * 是否需要分割线
       * 默认在needLine_computed里面设置
       **/
      needLine: {},
      /**
       * 是否需要分割线
       * 默认在needButtons_computed里面设置
       **/
      needButtons: {},
      // 是否需要表格
      needTable: {
        type: Boolean,
        default: true
      },
      // 是否需要分页参数
      needPagination: {
        type: Boolean,
        default: true
      },
      // 是否需要自定义列头
      needCustomTable: {
        type: Boolean,
        default: false
      },
      // 查询按钮，表格loading属性
      loading: {
        type: Boolean,
        default: false
      },
      /**
       * 以下为 el-dialog属性，参考官文档参数
       **/
      show: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: ''
      },
      width: {
        type: String,
        default: '80%'
      },
      fullscreen: {
        type: Boolean,
        default: false
      },
      top: {
        type: String,
        default: '15vh'
      },
      modal: {
        type: Boolean,
        default: true
      },
      modalAppendToBody: {
        type: Boolean,
        default: false
      },
      appendToBody: {
        type: Boolean,
        default: false
      },
      lockScroll: {
        type: Boolean,
        default: true
      },
      customClass: {
        type: String,
        default: ''
      },
      closeOnClickModal: {
        type: Boolean,
        default: true
      },
      closeOnPressEscape: {
        type: Boolean,
        default: true
      },
      showClose: {
        type: Boolean,
        default: true
      },
      beforeClose: {
        type: Function
      },
      center: {
        type: Boolean,
        default: false
      },
      destroyOnClose: {
        type: Boolean,
        default: false
      }
    },
    provide() {
      return {context: this};
    },
    data() {
      return {
        // m-query组件配置参数的默认值
        defaultFormSettings: {
          needRightPart: true, // 是否需要右边部分
          needCollapseBtn: true,// 是否需要【展开】按钮
          needCollapseBtn_dialog: false,// dialog布局时，默认不要【展开】按钮
          needRestBtn: true,// 是否需要【重置】按钮
          needSubmitBtn: true,// 是否需要【提交】按钮
          labelWidth: '120px',// el-form组件的label-width属性
          labelPosition: 'right',// el-form组件的label-position属性
          isCollapse: true,// 默认折叠
          collapseHeight: '42px',// 折叠后的默认高度
          rightPartStyle: {},// 右边部分样式
          leftPartStyle: {},// 左边部分样式
          submitBtnText: '查询',//  查询按钮文字
          formItemStyle: {},// formItem样式
          clearDisabledValue: false,// disabled为true时不清空
        },
        // m-table组件配置参数的默认值
        defaultTableSettings: {
          height: null,// table高度
          height_container: '100%',// container布局时，高度默认100%
          tooltip: true, // 是否需要tooltip文字提示，全表格配置
          /***
           * 以下为el-table组件属性，参考官方文档
           */
          maxHeight: null,
          stripe: true,
          border: true,
          size: 'mini',
          fit: true,
          showHeader: true,
          highlightCurrentRow: true,
          spanMethod: () => {
          },
          rowKey: () => {
          },
          expandRowKeys: [],
          load: () => {
          },
          treeProps: {},
          showSummary: false,
          defaultExpandAll: false,
          summaryMethod: () => {
          },
          cellClassName: ({row, column}) => {
            // 列的属性required设为true, 则为列里面渲染的input添加必填样式，false取消样式
            // 如果renderLabel为text组件，则为添加样式
            let col = this.table.columns.find(item => item.prop === column.property);
            let isRenderLabel = col.renderLabel && typeof col.renderLabel === 'function' && col.renderLabel().component === 'text';
            let flag = typeof col.required === 'function' ? col.required() : col.required;
            if(flag === undefined ? isRenderLabel : flag) {
              if(row[column.property]){
                return 'borderGreen'
              }else {
                return 'borderRed'
              }
            }
          }
        },
        // 分页配置参数的默认值
        defaultPaginationSettings: {
          total: 0,
          pageNum: 1,
          pageSize: 15,
          pageSizes: [10, 15, 30, 60, 100],
          layout: 'prev, pager, next, sizes',
          needUpdate: false
        },
        // 自定义表头需要的列
        defaultTableHeader: this.table.columns,
        // 分割线默认值
        defaultNeedLine: true,
        // 中间按钮组默认值
        defaultNeedButtons: true,
        // dialog布局时，默认不需要分割线
        defaultNeedLine_dialog: false,
        // dialog布局时，默认不需要按钮组
        defaultNeedButtons_dialog: false,
        // dialog布局时，visible属性，默认false
        visible: false,
        /**
         *  card布局时，bodyStyle默认值 {padding: '10px 0'}
         *  dialog布局时，bodyStyle默认值 {padding: 0}
         */
        cardBodyStyle: this.bodyStyle === undefined ? (this.type === 'dialog' ? {padding: 0} : {padding: '10px 0'}) : this.bodyStyle
      };
    },
    computed: {
      formSettings() {
        // 根据布局模式设置不同的默认值
        let defaultNeedCollapseBtn;
        if (this.type === 'dialog') {
          defaultNeedCollapseBtn = this.defaultFormSettings.needCollapseBtn_dialog;
        } else {
          defaultNeedCollapseBtn = this.defaultFormSettings.needCollapseBtn;
        }
        if (this.form.settings === undefined) {
          return {
            needRightPart: this.defaultFormSettings.needRightPart,
            needCollapseBtn: defaultNeedCollapseBtn,
            needRestBtn: this.defaultFormSettings.needRestBtn,
            needSubmitBtn: this.defaultFormSettings.needSubmitBtn,
            labelWidth: this.defaultFormSettings.labelWidth,
            isCollapse: this.defaultFormSettings.isCollapse,
            btnLoading: this.defaultFormSettings.btnLoading,
            labelPosition: this.defaultFormSettings.labelPosition,
            collapseHeight: this.defaultFormSettings.collapseHeight,
            rightPartStyle: this.defaultFormSettings.rightPartStyle,
            leftPartStyle: this.defaultFormSettings.leftPartStyle,
            submitBtnText: this.defaultFormSettings.submitBtnText,
            formItemStyle: this.defaultFormSettings.formItemStyle,
            clearDisabledValue: this.defaultFormSettings.clearDisabledValue
          }
        } else {
          let needRightPart = this.form.settings.needRightPart === undefined ? this.defaultFormSettings.needRightPart : this.form.settings.needRightPart;
          let needCollapseBtn = this.form.settings.needCollapseBtn === undefined ? defaultNeedCollapseBtn : this.form.settings.needCollapseBtn;
          let needRestBtn = this.form.settings.needRestBtn === undefined ? this.defaultFormSettings.needRestBtn : this.form.settings.needRestBtn;
          let needSubmitBtn = this.form.settings.needSubmitBtn === undefined ? this.defaultFormSettings.needSubmitBtn : this.form.settings.needSubmitBtn;
          let labelWidth = this.form.settings.labelWidth === undefined ? this.defaultFormSettings.labelWidth : this.form.settings.labelWidth;
          let isCollapse = this.form.settings.isCollapse === undefined ? this.defaultFormSettings.isCollapse : this.form.settings.isCollapse;
          let labelPosition = this.form.settings.labelPosition === undefined ? this.defaultFormSettings.labelPosition : this.form.settings.labelPosition;
          let collapseHeight = this.form.settings.collapseHeight === undefined ? this.defaultFormSettings.collapseHeight : this.form.settings.collapseHeight;
          let rightPartStyle = this.form.settings.rightPartStyle === undefined ? this.defaultFormSettings.rightPartStyle : this.form.settings.rightPartStyle;
          let leftPartStyle = this.form.settings.leftPartStyle === undefined ? this.defaultFormSettings.leftPartStyle : this.form.settings.leftPartStyle;
          let submitBtnText = this.form.settings.submitBtnText === undefined ? this.defaultFormSettings.submitBtnText : this.form.settings.submitBtnText;
          let formItemStyle = this.form.settings.formItemStyle === undefined ? this.defaultFormSettings.formItemStyle : this.form.settings.formItemStyle;
          let clearDisabledValue = this.form.settings.clearDisabledValue === undefined ? this.defaultFormSettings.clearDisabledValue : this.form.settings.clearDisabledValue;
          return {
            needRightPart,
            needCollapseBtn,
            needRestBtn,
            labelWidth,
            isCollapse,
            labelPosition,
            collapseHeight,
            rightPartStyle,
            submitBtnText,
            leftPartStyle,
            needSubmitBtn,
            formItemStyle,
            clearDisabledValue
          }
        }
      },
      tableSettings() {
        // 根据布局模式设置不同的默认值
        let defaultHeight;
        if (this.type === 'container') {
          defaultHeight = this.defaultTableSettings.height_container;
        } else {
          defaultHeight = this.defaultTableSettings.height;
        }
        if (this.table.settings === undefined) {
          return {
            height: defaultHeight,
            maxHeight: this.defaultTableSettings.maxHeight,
            stripe: this.defaultTableSettings.stripe,
            border: this.defaultTableSettings.border,
            size: this.defaultTableSettings.size,
            fit: this.defaultTableSettings.fit,
            showHeader: this.defaultTableSettings.showHeader,
            highlightCurrentRow: this.defaultTableSettings.highlightCurrentRow,
            spanMethod: this.defaultTableSettings.spanMethod,
            rowKey: this.defaultTableSettings.rowKey,
            expandRowKeys: this.defaultTableSettings.expandRowKeys,
            load: this.defaultTableSettings.load,
            treeProps: this.defaultTableSettings.treeProps,
            showSummary: this.defaultTableSettings.showSummary,
            defaultExpandAll: this.defaultTableSettings.defaultExpandAll,
            summaryMethod: this.defaultTableSettings.summaryMethod,
            tooltip: this.defaultTableSettings.tooltip,
            cellClassName: this.defaultTableSettings.cellClassName
          }
        } else {
          let height = this.table.settings.height === undefined ? defaultHeight : this.table.settings.height;
          let maxHeight = this.table.settings.maxHeight === undefined ? this.defaultTableSettings.maxHeight : this.table.settings.maxHeight;
          let stripe = this.table.settings.stripe === undefined ? this.defaultTableSettings.stripe : this.table.settings.stripe;
          let border = this.table.settings.border === undefined ? this.defaultTableSettings.border : this.table.settings.border;
          let size = this.table.settings.size === undefined ? this.defaultTableSettings.size : this.table.settings.size;
          let fit = this.table.settings.fit === undefined ? this.defaultTableSettings.fit : this.table.settings.fit;
          let showHeader = this.table.settings.showHeader === undefined ? this.defaultTableSettings.showHeader : this.table.settings.showHeader;
          let highlightCurrentRow = this.table.settings.highlightCurrentRow === undefined ? this.defaultTableSettings.highlightCurrentRow : this.table.settings.highlightCurrentRow;
          let spanMethod = this.table.settings.spanMethod === undefined ? this.defaultTableSettings.spanMethod : this.table.settings.spanMethod;
          let rowKey = this.table.settings.rowKey === undefined ? this.defaultTableSettings.rowKey : this.table.settings.rowKey;
          let expandRowKeys = this.table.settings.expandRowKeys === undefined ? this.defaultTableSettings.expandRowKeys : this.table.settings.expandRowKeys;
          let load = this.table.settings.load === undefined ? this.defaultTableSettings.load : this.table.settings.load;
          let treeProps = this.table.settings.treeProps === undefined ? this.defaultTableSettings.treeProps : this.table.settings.treeProps;
          let showSummary = this.table.settings.showSummary === undefined ? this.defaultTableSettings.showSummary : this.table.settings.showSummary;
          let defaultExpandAll = this.table.settings.defaultExpandAll === undefined ? this.defaultTableSettings.defaultExpandAll : this.table.settings.defaultExpandAll;
          let summaryMethod = this.table.settings.summaryMethod === undefined ? this.defaultTableSettings.summaryMethod : this.table.settings.summaryMethod;
          let tooltip = this.table.settings.tooltip === undefined ? this.defaultTableSettings.tooltip : this.table.settings.tooltip;
          let cellClassName = this.table.settings.cellClassName === undefined ? this.defaultTableSettings.cellClassName : this.table.settings.cellClassName;
          return {
            height,
            maxHeight,
            stripe,
            border,
            size,
            fit,
            showHeader,
            highlightCurrentRow,
            spanMethod,
            rowKey,
            expandRowKeys,
            load,
            treeProps,
            showSummary,
            defaultExpandAll,
            summaryMethod,
            tooltip,
            cellClassName
          }
        }
      },
      paginationSettings() {
        if (this.pagination === undefined) {
          return {
            total: this.defaultPaginationSettings.total,
            pageNum: this.defaultPaginationSettings.pageNum,
            pageSize: this.defaultPaginationSettings.pageSize,
            pageSizes: this.defaultPaginationSettings.pageSizes,
            layout: this.defaultPaginationSettings.layout,
            needUpdate: this.defaultPaginationSettings.needUpdate,
          }
        } else {
          let total = this.pagination.total === undefined ? this.defaultPaginationSettings.total : this.pagination.total;
          let pageNum = this.pagination.pageNum === undefined ? this.defaultPaginationSettings.pageNum : this.pagination.pageNum;
          let pageSize = this.pagination.pageSize === undefined ? this.defaultPaginationSettings.pageSize : this.pagination.pageSize;
          let pageSizes = this.pagination.pageSizes === undefined ? this.defaultPaginationSettings.pageSizes : this.pagination.pageSizes;
          let layout = this.pagination.layout === undefined ? this.defaultPaginationSettings.layout : this.pagination.layout;
          let needUpdate = this.pagination.needUpdate === undefined ? this.defaultPaginationSettings.needUpdate : this.pagination.needUpdate;
          return {
            total,
            pageNum,
            pageSize,
            pageSizes,
            layout,
            needUpdate
          }
        }
      },
      needLine_computed() {
        // 根据布局模式设置不同的默认值
        if (this.type === 'dialog') {
          return this.needLine === undefined ? this.defaultNeedLine_dialog : this.needLine;
        } else {
          return this.needLine === undefined ? this.defaultNeedLine : this.needLine;
        }
      },
      needButtons_computed() {
        // 不同布局模式设置不同默认值
        if (this.type === 'dialog') {
          return this.needButtons === undefined ? this.defaultNeedButtons_dialog : this.needButtons;
        } else {
          return this.needButtons === undefined ? this.defaultNeedButtons : this.needButtons;
        }
      },
      needQuery_computed() {
        // 当不传form时，设置needQuery值为false
        return this.form.formData.length === 0 ? false : this.needQuery;
      },
      needTable_computed() {
        // 当不传table时，设置needTable值为false
        return this.table.columns.length === 0 ? false : this.needTable;
      },
      needPagination_computed() {
        // 当不传pagination时，设置needPagination值为false
        return Object.keys(this.pagination).length === 0 ? false : this.needPagination;
      }
    },
    methods: {
      /***
       * @param condition
       * 查询条件
       */
      onSubmit(condition) {
        this.$emit('onSubmit', condition);
      },
      /***
       * 重置点击的回调
       */
      resetData() {
        this.$emit('resetData');
      },
      /***
       * @param isCollapse
       * 展开折叠
       */
      onCollapse(isCollapse) {
        this.$emit('onCollapse', isCollapse)
      },
      /***
       *以下为el-table组件事件，参考官方文档
       */
      select(selection, row) {
        this.$emit('select', selection, row);
      },
      selectAll(selection) {
        this.$emit('selectAll', selection);
      },
      selectionChange(selection) {
        this.$emit('selectionChange', selection);
      },
      cellMouseEnter(row, column, cell, event) {
        this.$emit('cellMouseEnter', row, column, cell, event);
      },
      cellMouseLeave(row, column, cell, event) {
        this.$emit('cellMouseLeave', row, column, cell, event);
      },
      cellClick(row, column, cell, event) {
        this.$emit('cellClick', row, column, cell, event);
      },
      cellDblclick(row, column, cell, event) {
        this.$emit('cellDblclick', row, column, cell, event);
      },
      rowClick(row, column, event) {
        this.$emit('rowClick', row, column, event);
      },
      rowContextmenu(row, column, event) {
        this.$emit('rowContextmenu', row, column, event);
      },
      rowDblclick(row, column, event) {
        this.$emit('rowDblclick', row, column, event);
      },
      headerClick(column, event) {
        this.$emit('headerClick', column, event);
      },
      headerContextmenu(column, event) {
        this.$emit('headerContextmenu', column, event);
      },
      sortChange({column, prop, order}) {
        this.$emit('sortChange', column, prop, order);
      },
      filterChange(filters) {
        this.$emit('filterChange', filters);
      },
      currentChange(currentRow, oldCurrentRow) {
        this.$emit('currentChange', currentRow, oldCurrentRow);
      },
      headerDragend(newWidth, oldWidth, column, event) {
        this.$emit('headerDragend', newWidth, oldWidth, column, event);
      },
      expandChange(row, expandedRows) {
        this.$emit('expandChange', row, expandedRows);
      },
      /***
       * @param config
       * 自定义表格方法
       */
      tableConfigChange(config) {
        // this.$emit('tableConfigChange', config);
        if (!config || !config.length) {
          this.table.columns = this.table.columns.filter(i => !!i);
        } else {
          this.table.columns = (config || [])
            .filter(i => i.show)
            .map(i => {
              return this.table.columns.find(j => j.prop === i.prop);
            })
            .filter(i => !!i);
        }
        this.$nextTick(() => {
          console.log(this.$refs['mTable'].$refs['table']);
          this.$refs['mTable'].$refs['table'].doLayout(); // 暂时解决表格错位的问题
        });
      },
      /**
       * @param currentNum
       * 分页
       */
      pageNumChange(currentNum) {
        this.$emit('pageNumChange', currentNum)
      },
      /**
       * @param currentNum
       * 分页
       */
      pageSizeChange(currentSize) {
        this.$emit('pageSizeChange', currentSize)
      },
      /**
       * 分页 dialog关闭
       */
      close() {
        this.$emit('update:show', false);
        this.$emit('close');
      },
      /**
       * 分页 dialog打开
       */
      open() {
        this.$emit('open');
      },
      // 获取table组件
      getTable() {
        return this.$refs['mTable'].$refs['table'];
      },
      // 获取form组件
      getForm() {
        return this.$refs['mQuery'].$refs['form'];
      },
      // 获取表单里面的全部快查组件数组
      getQuickSearchs() {
        return this.$refs['mQuery'].getQuickSearchs();
      },
      // 通过quickSearch组件的name属性获取表单里面的快查组件
      getQuickSearchByName(name) {
        return this.this.$refs['mQuery'].getQuickSearchByName(name);
      },
      // 通过quickSearch组件的name属性清除指定快查组件的showInput
      clearInputByName(name) {
        this.$refs['mQuery'].clearInputByName(name);
      },
      // 通过quickSearch组件的name属性设置指定快查组件的默认值
      setInputByName(name, value) {
        this.$refs['mQuery'].setInputByName(name, value);
      },
      // form设置默认值
      setFormDefaultValue(values) {
        if(this.$refs['mQuery']) this.$refs['mQuery'].setFormDefaultValue(values);
      },
      // 获取表单数据
      getFormData(){
        return this.$refs['mQuery'].defaultFormData;
      },
      // 获取表查询条件
      getCondition(){
        return this.$refs['mQuery'].getCondition();
      },
      // 校验表单
      validateForm() {
        return this.$refs['mQuery'].validateForm();
      },
      // 重置校验
      resetFields() {
        if(this.$refs['mQuery']) this.$refs['mQuery'].resetFields();
      },
      // 清空表单，重置校验
      resetForm(){
        if(this.$refs['mQuery']) this.$refs['mQuery'].handleReset();
      },
      /***
       * 设置选中
       * @param _checked
       * 标识选中状态的字段，默认‘_checked’
       */
      setSelection(_checked){
        this.$refs['mTable'].setSelection(_checked);
      },
      // 获取选中行数据
      getSelection(){
        return this.$refs['mTable'].getSelection();
      },
      /***
       * 清除选中
       */
      clearSelection() {
        this.$refs['mTable'].clearSelection();
      },
      /***
       * 切换选中
       * @param row
       * 行数据
       * @param flag
       * 状态
       */
      toggleRowSelection(row, selected) {
        this.$refs['mTable'].toggleRowSelection(row, selected);
      },
      /***
       * 切换选中状态
       */
      toggleAllSelection(){
        this.$refs['mTable'].toggleAllSelection();
      },
      /***
       * 设置单选选中
       * @param row
       * 当前行
       */
      setCurrentRow(row){
        this.$refs['mTable'].setCurrentRow(row);
      },
      // table重新布局
      doLayout() {
        this.$refs['mTable'].doLayout();
      },
      // 切换某一行的展开状态
      toggleRowExpansion(row, expanded) {
        this.$refs['mTable'].toggleRowExpansion(row, expanded);
      }
    }
  };
</script>

<style lang="scss" scoped>
  $lineColor: #e6e9ec;
  .magicalTable {
    & /deep/ .borderGreen .el-input__inner {
      border-color: green;
    }
    & /deep/ .borderRed .el-input__inner {
      border-color: red;
    }
    &.container {
      height: 100%;
    }
    &.calc85 {
      height: calc(100vh - 85px)
    }
    &.calc50 {
      height: calc(100vh - 50px)
    }
    border: none;
    .mQuery {
      padding: 0 10px
    }
    .mButtons, .mTableWrap {
      margin: 0 10px 10px 10px;
      &.flex {
        display: flex;
        flex-flow: column;
      }
    }
    .mLine {
      margin: 0 0 10px 0;
    }
    .mPagination {
      margin: 0 10px;
      & /deep/ .c-pagination {
        margin: 0;
      }
    }
  }

  .magicalTable /deep/ .el-card__header {
    padding: 0;
  }

  .mDialog {
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 2000!important;
    &/deep/~.v-modal{
      z-index: 1999!important;
    }
    & /deep/ .el-dialog__header {
      border-bottom: 1px solid $lineColor;
      .el-dialog__title {
        font-size: 14px;
        font-weight: bold;
      }
    }
    & /deep/ .el-dialog__footer {
      border-top: 1px solid $lineColor;
    }
    & /deep/ .el-dialog__body {
      .mQuery {
        padding: 0px
      }
      .mButtons, .mTableWrap {
        margin: 0 0 10px;
        &.flex {
          display: flex;
          flex-flow: column;
        }
      }
      .mLine {
        margin: 0 0 10px 0;
      }
      .mPagination {
        margin: 0;
        & /deep/ .c-pagination {
          margin: 0;
        }
      }
    }
  }
</style>
