<template>
  <el-container class="flex-container the_instock_wrapper" direction="vertical">
    <el-main>
      <form-wrapper :formArray="preArr" @getFormData="getQuerydata" />

      <main-header>
        <template slot="left">
        <div style="padding: 0 11px;float: left;">
          <m-import
            ref="import"
            :title="iModal.title"
            :extraData="iModal.extraData"
            :upLoadUrl="iModal.upLoadUrl"
            :upLoadResultUrl="iModal.upLoadResultUrl"
            @downloadTemplate="downloadTemplate"
            @handleSuccess="uploadSuccess"
            :showSuccessDeal="true"
          ></m-import>
      </div>
          <el-button type="primary" size="mini" @click="editTab('add')">{{$t('common.add')}}</el-button>
          <el-button size="mini" @click="exportOne">{{$t('common.export')}}</el-button>
          <el-button size="mini" @click="batchCancel">{{$t('common.cancel')}}</el-button>
        </template>
      </main-header>
      <table-view
        :ref="gridId"
        :table-data="tableData"
        :table-header="tableHeader"
        :current-change="handleCurrentChange"
        :checkbox="true"
        :openCustomTable="true"
        :checkChange="getCheckedData"
        :page-size="pageSize"
        :preQueryData="queryParam"
        url="/pss/member/exwarehousing/list"
        url-for-count="/isales-main/mstQuicksearchConfig/queryCount"
      />
    </el-main>
  </el-container>
</template>
<script>
import MImport from "lib@/components/import";
import { tabTodoWatch, tabTodoMixin } from "@/utils/mixins";
import TableView from "lib@/components/Table/TableView";
import MainHeader from "lib@/components/Table/MainHeader";
import FormWrapper from "lib@/components/Table/FormWrapper";
import { parseTime, transformData } from "@/utils";
import { downloadFileLink } from "@/utils/file";
import exwarehousingAdd from "./exwarehousingAdd";

export default {
  name: "exwarehousingList",
  components: {
    TableView,
    MainHeader,
    FormWrapper,MImport
  },
  mixins: [tabTodoWatch, tabTodoMixin],
  provide() {
    return { context: this };
  },
  data() {
    return {
      iModal: {
        title: "导入",
        extraData:{},
        upLoadUrl: "/pss/member/exwarehousing/import",
        upLoadResultUrl: "/pss/member/exwarehousing/import/result",
      },
      pageSize: 15,
      gridId: "list",
      selectList: [],
      currentRow: null,
      showFilterBar: 1,
      tableHeader: [],
      tableData: [],
      tableName: "exwarehousingListItem",
      preArr: [
        {
          label: "出库类型",
          prop: "exwarehousingType",
          type: "select",
          options: []
        },
        { label: "出库单号", prop: "exwarehousingNum" },
        { label: "生产订单", prop: "prodOrder" },
        { label: "成本中心", prop: "costCenter", type: "select", options: [] },
        { label: "销售订单", prop: "saleOrderNum" },
        { label: "销售订单行", prop: "saleLineId" },
        {
          label: "物料编码",
          prop: "itemCode",
          type: "quickSearch",
          showKey: "itemCode",
          name: "item_display",
          propExt: "itemName"
        },
        { label: "物料名称", prop: "itemName", disabled: true },
        { label: "批次号", prop: "batchCode" },
        {
          label: "仓库",
          prop: "warehouseCode",
          type: "quicksearch",
          showKey: "warehouseCode",
          name: "warehouse_display",
          propExt: "warehouseId"
        },
        { label: "创建人", prop: "createdBy" },
        { label: "备注", prop: "comments" },
        { label: "状态", prop: "status" },
        { label: "创建日期", prop: "createDateFrom", type: "date" },
        { label: "至", prop: "createDateTo", type: "date" },
        {
          label: "过滤取消单据",
          prop: "filterCancelledOrders",
          type: 'checkbox',
          default: 'Y',
          trueLabel: 'Y',
          falseLabel: 'N'
        },

      ],
      queryParam: {},
      itemList: [],
      costList: [],
      batchList: [],
      warehouseList: [],
      billTypeList: [],
      unitList: [],
      // 弹框专用数据
      editIndex: 1,
      tableData2: [],
      isSelectd: false,
      isReadOnly: false,
      form: {
        exwarehousingNum: "",
        exwarehousingType: "",
        exWarehousingLines: []
      }
    };
  },
  created() {
    let _this = this;
    this.tableHeader = [
      {
        prop: "exwarehousingType",
        label: "出库类型",
        width: 120,
        sortable: true,
        formattor(val) {
          return _this.$getLabelByValue(_this.billTypeList, val);
        }
      },
      { prop: "exwarehousingNum", label: "出库单号", width: 120, sortable: true },
      { prop: "lineSeq", label: "出库单行号", width: 120, align: "right", sortable: true },
      { prop: "itemCode", label: "物料编码", width: 120, sortable: true },
      { prop: "itemName", label: "物料名称", width: 200, sortable: true },
      {
        prop: "batchCode",
        label: "批次号",
        sortable: true,
        width: 100,
        formattor(val) {
          return _this.$getLabelByValue(_this.batchList, val);
        }
      },
      { prop: "quantity", label: "数量", width: 100, align: "right", sortable: true },
      {
        prop: "itemUnit",
        label: "单位",
        sortable: true,
        width: 85,
        formattor(val) {
          return _this.$getLabelByValue(_this.unitList, val);
        }
      },
      { prop: "prodOrder", label: "生产订单", width: 120, sortable: true },
      {
        prop: "costCenter",
        label: "成本中心",
        sortable: true,
        width: 120,
        formattor(val) {
          return _this.$getLabelByValue(_this.costList, val);
        }
      },
      { prop: "saleOrderNum", label: "销售订单", width: 120, sortable: true },
      { prop: "saleLineId", label: "销售订单行", width: 120, sortable: true },
      { prop: "customerCode", label: "客户编码", width: 120, sortable: true },
      { prop: "customerName", label: "客户名称", width: 150, sortable: true },
      { prop: "cusOrg", label: "客户库存组织", width: 150, sortable: true },
      { prop: "warehouseCode", label: "仓库", width: 120, sortable: true },
      { prop: "actualQuantity", label: "实际数量", width: 100, align: "right", sortable: true },
      {
        prop: "creationDate",
        label: "创建时间",
        sortable: true,
        width: 150,
        formattor(val) {
          return val ? parseTime(val) : "";
        }
      },
      { prop: "createdBy", label: "创建人", width: 100, sortable: true },
      { prop: "status", label: "状态", width: 100, sortable: true },
      { prop: "comments", label: "备注", width: 150, sortable: true },
      {
        prop: "operation",
        label: "操作",
        editType: "none",
        fixed: "right",
        width: 60,
        showType: "button",
        btnStyle: "text",
        callback: function(row) {
          this.editTab("edit", row);
        }.bind(this),
        formattor(val) {
          return "修改";
        },
        show: function(row) {
          if (row.status === "完成") {
            return false;
          } else {
            return true;
          }
        }
      }
    ];
    this.defaultTableHeader = this.tableHeader;
    this.getBatch();
    this.getStatus();
    this.getCostList();
    this.getItemList();
    this.getBillType();
    this.getWarehouseList();
    this.getUnitList();
    this.$nextTick(() => {
      this.getQuerydata({filterCancelledOrders: 'Y'})
    });
  },
  methods: {
    getStatus() {
      // 获取状态
      this.$http({
        url: "/pss/member/dict/item/byDictCode?dictCode=" + "PSS_ORDER_STATUS",
        method: "GET",
        data: {}
      })
        .then(data => {
          if (data && data.success) {
            this.$set(this.preArr, 12, {
              prop: "status",
              label: "状态",
              type: "select",
              options: transformData(data.data, [
                "dictItemCode",
                "dictItemName"
              ])
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getItemList() {
      this.$http({
        url: "/pss/member/items/base",
        method: "GET",
        data: {}
      })
        .then(data => {
          if (data && data.success) {
            this.itemList = data.data;
            /* this.$set(this.preArr,6,{
              label:'物料编码',prop:'itemCode',type:'select',
              options: transformData(data.data,['itemCode','itemCode'])
            }) */
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getBatch() {
      // 获取批次
      this.$http({
        url: "/pss/member/dict/item/byDictCode?dictCode=" + "PSS_ENABLE_BATCH",
        method: "GET",
        data: {}
      })
        .then(data => {
          if (data && data.success) {
            this.batchList = data.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getBillType() {
      // 获取出库单类型
      this.$http({
        url: "/pss/member/dict/item/byDictCode?dictCode=" + "PSS_EXWAREHOUSING_TYPE",
        method: "GET",
        data: {}
      })
        .then(data => {
          if (data && data.success) {
            this.billTypeList = data.data;
            this.$set(this.preArr, 0, {
              label: "出库类型",
              prop: "exwarehousingType",
              type: "select",
              options: transformData(data.data, [
                "dictItemCode",
                "dictItemName"
              ])
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getUnitList() {
      // 获取单位
      this.$http({
        url: "/pss/member/dict/item/byDictCode?dictCode=" + "PSS_UNIT",
        method: "GET",
        data: {}
      })
        .then(data => {
          if (data && data.success) {
            this.unitList = data.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getCostList() {
      // 获取成本中心下拉值
      this.$http({
        url: "/pss/member/dict/item/byDictCode?dictCode=" + "PSS_COST_CENTER",
        method: "GET",
        data: {}
      })
        .then(data => {
          if (data && data.success) {
            this.costList = data.data;
            this.$set(this.preArr, 3, {
              label: "成本中心",
              prop: "costCenter",
              type: "select",
              options: transformData(data.data, [
                "dictItemCode",
                "dictItemName"
              ])
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getWarehouseList() {
      this.$http({
        url: "/pss/member/warehouse/base",
        method: "GET",
        data: {}
      })
        .then(data => {
          if (data && data.success) {
            this.warehouseList = data.data;
            /* this.$set(this.preArr,9,{
              label:'仓库',prop:'warehouseId',type:'select',
              options: transformData(data.data,['warehouseId','warehouseCode'])
            }) */
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getQuerydata(v) {
      this.queryParam = v;
      this.$nextTick(() => {
        this.$refs[this.gridId].query();
      });
    },
    // 编辑tab
    editTab(type, row) {
      let tab = {};
      if (type == "add") {
        // 新增
        tab = {
          component: exwarehousingAdd,
          params: { flag: "add" },
          title: "出库单新增",
          name: "exwarehousingAdd"
        };
      } else {
        // 修改
        tab = {
          component: exwarehousingAdd,
          params: {
            flag: "edit",
            row: row
          },
          title: row.exwarehousingNum,
          name: "exwarehousingAdd" + row.exwarehousingNum
        };
      }
      this.$emit("tab-add", tab);
    },
    uploadSuccess(val){
      this.getQuerydata({filterCancelledOrders: 'Y'})
    },
    downloadTemplate() {    // 下载模板
      downloadFileLink('/pss/member/exwarehousing/template' , parseTime(new Date()) +'_导出.xls' ).catch(() => {
        this.$message.error('下载失败')
      })
    },
    exportOne() {
      downloadFileLink(
        "/pss/member/exwarehousing/export",
        "出库单报表.xls",
        this.queryParam || {}
      ).catch(() => {
        this.$message.error("下载失败");
      });
    },
    batchCancel() {
      if (this.selectList.length === 0) {
        this.$message.error("请选择数据！");
        return;
      }
      for (let i of this.selectList) {
        if (i.status !== "拟定") {
          this.$message.error("只有拟定状态的可以取消！");
          return;
        }
      }
      let warehousingHeaderIds = this.selectList.map(
        v => v.exwarehousingHeaderId
      );
      this.$http({
        url: "/pss/member/exwarehousing/cancel",
        method: "POST",
        data: { exwarehousingHeaderIds: warehousingHeaderIds }
      })
        .then(data => {
          if (data && data.success) {
            this.$message.success("保存成功");
            this.getQuerydata({filterCancelledOrders: 'Y'})
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    getCheckedData(val) {
      this.selectList = val.slice(0);
    }
  }
};
</script>
<style scoped lang="scss">
.the_instock_wrapper {
  .el-dialog__header {
    border-bottom: 1px solid #eee !important;
  }
}
.the_instock_wrapper /deep/ .el-table .sort-caret.ascending{
  border-bottom-color: #ffffff;
}
.the_instock_wrapper /deep/ .el-table .sort-caret.descending{
  border-top-color: #ffffff;
}
.the_instock_wrapper /deep/ .el-table .ascending .sort-caret.ascending{
  border-bottom-color: #1890ff;
}
.the_instock_wrapper /deep/ .el-table .descending .sort-caret.descending{
  border-top-color: #1890ff;
}
</style>
