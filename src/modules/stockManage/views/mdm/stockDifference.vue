<template>
  <el-container class="flex-container-notab the_stockDifference_wrapper" direction="vertical">
    <el-main>
      <form-wrapper :formArray="preArr" @getFormData="getQuerydata" :initActive='true' />

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
        :checkChange="getCheckedData"
        :page-size="pageSize"
        :preQueryData="queryParam"
        url="/pss/member/difference/list"
        url-for-count="/isales-main/mstQuicksearchConfig/queryCount"
      />
      <!--      弹框区域-->
      <el-dialog
        title="盘点单管理"
        :visible.sync="dialogFormVisible"
        v-el-drag-dialog
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="1200px"
      >
        <div class="flex-container-notab" style="height: 380px">
          <el-row class="the_first_row">
            <el-col :span="6">
              <span>盘点单号</span>
              <el-input v-model="form.differenceNum" disabled />
            </el-col>
            <el-col :span="6">
              <span>盘点开始日期</span>
              <el-date-picker v-model="form.differenceDateFrom" :disabled="isReadOnly" />
            </el-col>
            <el-col :span="6">
              <span>盘点结束日期</span>
              <el-date-picker v-model="form.differenceDateTo" :disabled="isReadOnly" />
            </el-col>
            <el-col :span="6">
              <span style="padding-right: 11px;float:left;line-height: 32px;">工厂</span>
              <div style="display: inline-block">
                  <QuickSearch
                      :showInput="form.factoryCode"
                      show-key="factoryCode"
                      :scope-data="form"
                      name="factory_display"
                      @close-quicksearch="getFacObj"
                    />
              </div>
              
            </el-col>
          </el-row>
          <p style="margin:0;">
              <el-button
                type="primary"
                size="mini"
                @click="addOne"
                :disabled="isReadOnly"
              >新增</el-button>
          </p>
          <!--弹框-入库单录入-->
          <el-table :data="tableData2" style="width: 100%" border height="112px">
            <el-table-column type="index" width="50" />
            <el-table-column align="center" prop="warehouseId" label="仓库" width="150">
              <!-- <template slot-scope="scope">
                <el-select
                  v-model="scope.row.warehouseId"
                  :disabled="isReadOnly"
                  @change="getWarehouseBatch(scope)"
                >
                  <el-option
                    v-for="item in warehouseList"
                    :key="item.warehouseId"
                    :label="item.warehouseCode"
                    :value="item.warehouseId"
                  />
                </el-select>
              </template> -->
              <template slot-scope="scope">
                <QuickSearch :preQueryData="{'t.FACTORY_ID': form.factoryId}"
                  :disabled="isReadOnly"
                  :showInput="scope.row.warehouseCode"
                  show-key="warehouseCode"
                  :scope-data="scope.row"
                  name="warehouse_display"
                  @close-quicksearch="getWarehouseObj"
                />
              </template>
            </el-table-column>
            <el-table-column align="center" prop="itemId" label="物料编码" width="150">
              <template slot-scope="scope">
                <!-- <el-select v-model="scope.row.itemId" @change="getoneItem(scope)" :disabled="isReadOnly">
                  <el-option
                    v-for="item in itemList"
                    :key="item.itemId"
                    :label="item.itemCode"
                    :value="item.itemId"/>
                </el-select>-->
                <QuickSearch
                  :disabled="isReadOnly"
                  :showInput="scope.row.itemCode"
                  show-key="itemCode"
                  :scope-data="scope.row"
                  name="item_display"
                  @close-quicksearch="getItemObj"
                />
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="itemName"
              label="物料名称"
              min-width="150"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              align="center"
              prop="specification"
              label="规格型号"
              width="100"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              align="center"
              prop="unit"
              label="单位"
              width="80"
              :show-overflow-tooltip="true"
            />
            <el-table-column align="center" prop="batchCode" label="批次号" width="100">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.batchCode"
                  :disabled="isReadOnly"
                  @change="getCurrentAmount(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="currentAmount"
              label="现有库存量"
              width="100"
              :show-overflow-tooltip="true"
            />
            <el-table-column align="center" prop="substanceAmount" label="实物库存量" width="100">
              <template slot-scope="scope">
                <el-input v-model="scope.row.substanceAmount" type="number" />
              </template>
            </el-table-column>
            <el-table-column align="center" prop="comments" label="备注" width="150">
              <template slot-scope="scope">
                <el-input v-model="scope.row.comments" :disabled="isReadOnly" />
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="60">
              <template slot-scope="scope">
                <el-button type="text" @click="handleDelClick(scope.$index,scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <main-header>
            <template slot="left">
              <p></p>
            </template>
            <template slot="right">
              <el-button size="mini" @click="dialogFormVisible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="closeDialog">确定</el-button>
            </template>
          </main-header>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>
<script>
import MImport from "lib@/components/import";
import QuickSearch from "lib@/components/QuickSearch";
import TableView from "lib@/components/Table/TableView";
import MainHeader from "lib@/components/Table/MainHeader";
import TableEdit from "lib@/components/Table/TableEdit";
import FormWrapper from "lib@/components/Table/FormWrapper";
import { parseTime, transformData } from "@/utils";
import { downloadFileLink } from "@/utils/file";

export default {
  name: "stockDifference",
  components: {
    TableView,
    MainHeader,
    TableEdit,
    FormWrapper,
    QuickSearch, MImport
  },
  data() {
    return {
      iModal: {
          title: "导入",
          extraData:{},
          upLoadUrl: "/pss/member/difference/import",
          upLoadResultUrl: "/pss/member/difference/import/result",
        },
      name: "",
      description: "",
      gridData: [],
      pageSize: 15,
      gridId: "list",
      selectList: [],
      currentRow: null,
      showFilterBar: 1,
      tableHeader: [],
      tableData: [],
      tableData2: [],
      preArr: [
        { label: "盘点单号", prop: "differenceNum" },
        {
          label: "仓库",
          prop: "warehouseCode",
          type: "quicksearch",
          showKey: "warehouseCode",
          name: "warehouse_display",
          propExt: "warehouseId"
        },
        {
          label: "物料编码",
          prop: "itemCode",
          type: "quicksearch",
          showKey: "itemCode",
          name: "item_display",
          propExt: "itemId"
        },
        { label: "状态", prop: "status" },
        { label: "盘点周期", prop: "differenceDate", type: "daterange" },
        {
          label: "过滤取消单据",
          prop: "filterCancelledOrders",
          type: 'checkbox',
          default: 'Y',
          trueLabel: 'Y',
          falseLabel: 'N'
        }
      ],
      dialogFormVisible: false,
      queryParam: {},
      itemList: [],
      costList: [],
      batchList: [],
      warehouseList: [],
      billTypeList: [],
      // 弹框专用数据
      editIndex: 1,
      isReadOnly: false,
      form: {
        differenceNum: "",
        differenceDateFrom: "",
        differenceDateTo: "",
        differenceLines: [],
        factoryId:"",
        factoryCode:"",
      }
    };
  },
  created() {
    let _this = this;
    this.tableHeader = [
      { prop: "differenceNum", label: "盘点单号", width: 120, sortable: true },
      { prop: "lineSeq", label: "盘点单行号", width: 120, sortable: true, align: "right" },
      { prop: "warehouseCode", label: "仓库", width: 100, sortable: true },
      { prop: "itemCode", label: "物料编码", width: 150, sortable: true },
      { prop: "itemName", label: "物料名称", width: 200, sortable: true },
      { prop: "specification", label: "规格型号", width: 100, sortable: true },
      { prop: "unit", label: "单位", width: 85, sortable: true },
      { prop: "batchCode", label: "批次号", width: 100, sortable: true },
      {
        prop: "currentAmount",
        label: "现有库存量",
        width: 125,
        align: "right",
        sortable: true,
        formattor(val) {
          return val ||'无库存';
        }
      },
      {
        prop: "substanceAmount",
        label: "实物库存量",
        width: 125,
        sortable: true,
        align: "right"
      },
      {
        prop: "actualQuantity",
        label: "实际数量",
        width: 100,
        sortable: true,
        align: "right"
      },
      {
        prop: "diffQuantity",
        label: "盘盈盘亏数量",
        sortable: true,
        width: 130,
        align: "right"
      },
      {
        prop: "differenceDateFrom",
        label: "盘点开始日期",
        sortable: true,
        width: 130,
        formattor(val) {
          return val ? parseTime(val, "{y}-{m}-{d}") : "";
        }
      },
      {
        prop: "differenceDateTo",
        label: "盘点结束日期",
        sortable: true,
        width: 130,
        formattor(val) {
          return val ? parseTime(val, "{y}-{m}-{d}") : "";
        }
      },
      {
        prop: "creationDate",
        label: "创建时间",
        sortable: true,
        width: 140,
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
          this.currentRow = row;
          this.editTab();
        }.bind(this),
        formattor(val) {
          return "编辑";
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
    this.getBatch();
    this.getStatus();
    this.getItemList();
    this.getWarehouseList();
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
            this.$set(this.preArr, 3, {
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
            /* this.$set(this.preArr,2,{
              label:'物料编码',prop:'itemId',type:'select',
              options: transformData(data.data,['itemId','itemCode'])
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
    getWarehouseList() {
      this.$http({
        url: "/pss/member/warehouse/base",
        method: "GET",
        data: {}
      })
        .then(data => {
          if (data && data.success) {
            this.warehouseList = data.data;
            /* this.$set(this.preArr,1,{
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
      this.queryParam = v || {};
      if (v && v.differenceDate) {
        this.queryParam.differenceDateFrom = v.differenceDate[0];
        this.queryParam.differenceDateTo = v.differenceDate[1];
      } else {
        delete this.queryParam.differenceDateFrom;
        delete this.queryParam.differenceDateTo;
      }
      delete this.queryParam.differenceDate;
      this.$nextTick(() => {
        this.$refs[this.gridId].query();
      });
    },
    // 行删除---
    handleDelClick(index, row) {
      if (row.differenceLinesId) {
        this.$confirm("确认删除吗？", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$http({
              url: "/pss/member/difference/line",
              method: "DELETE",
              params: {
                differenceHeaderId: row.differenceHeaderId,
                differenceLinesId: row.differenceLinesId
              }
            })
              .then(data => {
                if (data && data.success) {
                  this.$message.success("删除成功");
                  this.dialogFormVisible = false;
                  this.getQuerydata({filterCancelledOrders: 'Y'})
                }
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(() => {});
      } else {
        this.tableData2.splice(index, 1);
      }
    },
    // 编辑tab
    editTab(type) {
      if (type == "add") {
        // 新增
        for (let i in this.form) {
          this.form[i] = "";
        }
        this.isReadOnly = false;
        this.tableData2 = [];
        this.form.differenceNum =
          "PD" +
          parseTime(new Date(), "{y}{m}{d}") +
          String(Math.random()).slice(2, 6);
      } else {
        // 修改
        this.isReadOnly = true;
        if (
          this.itemList.length > 0 &&
          this.itemList.filter(v => v.itemCode == this.currentRow.itemCode)
        ) {
          this.currentRow.itemId = this.itemList.filter(
            v => v.itemCode == this.currentRow.itemCode
          )[0].itemId;
        }
        if (
          this.warehouseList.length > 0 &&
          this.warehouseList.filter(
            v => v.warehouseCode == this.currentRow.warehouseCode
          )
        ) {
          this.currentRow.warehouseId = this.warehouseList.filter(
            v => v.warehouseCode == this.currentRow.warehouseCode
          )[0].warehouseId;
        }
        this.form.differenceDateFrom = this.currentRow.differenceDateFrom;
        this.form.differenceDateTo = this.currentRow.differenceDateTo;
        this.form.differenceNum = this.currentRow.differenceNum;
        this.tableData2 = [this.currentRow];
      }
      this.dialogFormVisible = true;
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
      let differenceHeaderIds = this.selectList.map(v => v.differenceHeaderId);
      this.$http({
        url: "/pss/member/difference/cancel",
        method: "POST",
        data: { differenceHeaderIds: differenceHeaderIds }
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
    uploadSuccess(val){
      this.getQuerydata({filterCancelledOrders: 'Y'})
      },
      downloadTemplate() {    // 下载模板
        downloadFileLink('/pss/member/difference/template' , parseTime(new Date()) +'_导出.xls' ).catch(() => {
          this.$message.error('下载失败')
        })
      },
    exportOne() {
      downloadFileLink(
        "/pss/member/difference/export",
        "盘点单报表.xls",
        this.queryParam || {}
      ).catch(() => {
        this.$message.error("下载失败");
      });
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    getCheckedData(val) {
      this.selectList = val.slice(0);
    },
    getWarehouseObj(val, scope) {
      scope.warehouseId = val ? val.warehouseId : "";
      scope.warehouseCode = val ? val.warehouseCode : "";
      // scope.requireBatchCode = val && val.batchCode == "YES" ? true :false;
      // if (!val) {
      //   scope.batchCode = '';
      //   scope.quantity = '';
      // }
      if (val.batchCode == "YES") {
        this.$message.info(
          `该仓库${val.warehouseCode}已启用批次，请填写批次号！`
        );
        scope.requireBatchCode = true;
      } else {
        scope.requireBatchCode = false;
      }
    },
    addOne() {
      if (!this.form.factoryCode) {
        this.$message.info("请先选择工厂");
        return;
      }
      // if (this.tableData.length >= 10) return;
      this.tableData2.push({
        lineSeq: this.editIndex++,
        status: "NEW_ORDER",
        itemId: "",
        itemName: "",
        unit: "",
        currentAmount: null,
        warehouseId: "",
        batchCode: "",
        quantity: "",
        comments: ""
      });
    },
    delOne() {
      //
    },
    getItemObj(val, scope) {
      scope.itemId = val ? val.itemId : "";
      scope.itemCode = val ? val.itemCode : "";
      scope.itemName = val ? val.itemName : "";
      scope.unit = val ? val.itemUnit : "";
      scope.specification = val ? val.specification : "";
    },
    getoneItem(scope) {
      if (
        scope.row.itemId &&
        this.itemList.length &&
        this.itemList.filter(v => v.itemId == scope.row.itemId)
      ) {
        scope.row.itemName = this.itemList.filter(
          v => v.itemId == scope.row.itemId
        )[0].itemName;
        scope.row.unit = this.itemList.filter(
          v => v.itemId == scope.row.itemId
        )[0].itemUnit;
        scope.row.specification = this.itemList.filter(
          v => v.itemId == scope.row.itemId
        )[0].specification;
      }
    },
    getWarehouseBatch(scope) {
      let targetRow = this.warehouseList.filter(
        v => v.warehouseId == scope.row.warehouseId
      )[0];
      if (targetRow.batchCode == "YES") {
        this.$message.info(
          `该仓库${targetRow.warehouseCode}已启用批次，请填写批次号！`
        );
        scope.row.warehouseCode = targetRow.warehouseCode;
        scope.row.requireBatchCode = true;
      } else {
        scope.row.requireBatchCode = false;
      }
    },
    getCurrentAmount(row) {
      this.$http({
        url: "/pss/member/inventory/quantity",
        method: "GET",
        params: {
          itemId: row.itemId,
          warehouseId: row.warehouseId,
          batchCode: row.batchCode
        }
      })
        .then(data => {
          if (data && data.success) {
            row.currentAmount = data.data.quantity || '无库存';
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getFacObj(val, scope) {
        scope.factoryId = val ? val.factoryId : "";
        scope.factoryCode = val ? val.factoryCode : "";
      },
    closeDialog() {
      if (this.tableData2.length < 1) return;
      this.form.differenceLines = this.tableData2;
      let url = "",
        methodType = "",
        params = {};
      if (this.isReadOnly) {
        // 修改模式-
        url = "/pss/member/difference/modify";
        methodType = "POST";
        params = {
          differenceHeaderId: this.tableData2[0].differenceHeaderId,
          differenceLines: [
            {
              version: this.tableData2[0].version,
              substanceAmount: this.tableData2[0].substanceAmount,
              differenceLinesId: this.tableData2[0].differenceLinesId
            }
          ]
        };
      } else {
        for (let i of this.tableData2) {
          if (i.requireBatchCode && !i.batchCode) {
            this.$message.info(
              `该仓库${i.warehouseCode}已启用批次，请填写批次号！`
            );
            return;
          }
        }
        this.form.differenceDateFrom = this.form.differenceDateFrom
          ? parseTime(this.form.differenceDateFrom, "{y}-{m}-{d}")
          : "";
        this.form.differenceDateTo = this.form.differenceDateTo
          ? parseTime(this.form.differenceDateTo, "{y}-{m}-{d}")
          : "";
        url = "/pss/member/difference";
        methodType = "PUT";
        params = this.form;
      }
      this.$http({
        url: url,
        method: methodType,
        data: params,
        loading: true
      })
        .then(data => {
          if (data && data.success) {
            this.dialogFormVisible = false;
            this.$message({
              message: "保存成功",
              type: "success"
            });
            this.$refs[this.gridId].query();
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style scoped lang="scss">
.the_stockDifference_wrapper {
  .el-dialog__header {
    border-bottom: 1px solid #eee !important;
  }
  .the_first_row {
    margin-bottom: 11px;
    .el-col {
      > span {
        padding-right: 5px;
      }
      .el-input {
        width: 140px;
      }
    }
  }
}
.the_stockDifference_wrapper /deep/ .el-table .sort-caret.ascending{
  border-bottom-color: #ffffff;
}
.the_stockDifference_wrapper /deep/ .el-table .sort-caret.descending{
  border-top-color: #ffffff;
}
.the_stockDifference_wrapper /deep/ .el-table .ascending .sort-caret.ascending{
  border-bottom-color: #1890ff;
}
.the_stockDifference_wrapper /deep/ .el-table .descending .sort-caret.descending{
  border-top-color: #1890ff;
}
</style>
