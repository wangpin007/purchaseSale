<template>
  <magical-table
    ref="magicalTable"
    class="wrap calc85"
    :loading="loading"
    :form="form"
    :table="table"
    :pagination="pagination"
    @onSubmit="onSubmit"
    @pageSizeChange="pageSizeChange"
    @pageNumChange="pageNumChange">
    <template #buttons>
      <m-import
        ref="import"
        class="importBtn"
        :title="iModal.title"
        :extraData="iModal.extraData"
        :upLoadUrl="iModal.upLoadUrl"
        :upLoadResultUrl="iModal.upLoadResultUrl"
        @downloadTemplate="downloadTemplate"
        @handleSuccess="uploadSuccess"
        :showSuccessDeal="true"
      ></m-import>
      <el-button type="primary" size="mini" @click="editTab('add')">{{$t('common.add')}}</el-button>
      <el-button size="mini" @click="exportOne">{{$t('common.export')}}</el-button>
      <el-button size="mini" :loading="loading1" @click="batchCancel">{{$t('common.cancel')}}</el-button>
    </template>
  </magical-table>
</template>
<script>
  import MImport from "lib@/components/import";
  import {parseTime, transformData} from "@/utils";
  import {downloadFileLink} from "@/utils/file";
  import warehousingAdd from "./warehousingAdd";
  import MagicalTable from "lib@/components/awesome/magicalTable/main";


  export default {
    name: "warehousingList",
    components: {
      MagicalTable,
      MImport
    },
    provide() {
      return {context: this};
    },
    data() {
      return {
        warehouseId: '',
        iModal: {
          title: "导入",
          extraData: {},
          upLoadUrl: "/pss/member/warehousing/import",
          upLoadResultUrl: "/pss/member/warehousing/import/result",
        },
        form: {
          formData: [
            {
              label: "入库类型",
              prop: "warehousingType",
              type: "select",
              value: '',
              options: []
            },
            {
              label: "入库单号",
              prop: "warehousingNum",
              type: 'text',
              value: '',
            },
            {
              label: "生产订单",
              prop: "prodOrder",
              type: 'text',
              value: '',
            },
            {
              label: "成本中心",
              prop: "costCenter",
              type: "select",
              options: [],
              value: '',
            },
            {
              label: "采购订单",
              prop: "poNum",
              type: 'text',
              value: ''
            },
            {
              label: "采购订单行",
              prop: "poLineId",
              type: 'text',
              value: ''
            },
            {
              label: "物料编码",
              prop: "itemCode",
              type: "quickSearch",
              showKey: "itemCode",
              name: "item_display",
              value: '',
              callback: (selection, scope) => {
                scope.value = selection.itemCode;
                this.form.formData[7].value = selection.itemName;
              }
            },
            {
              label: "物料名称",
              prop: "itemName",
              value: '',
              type: 'text',
              disabled: true
            },
            {
              label: "批次号",
              prop: "batchCode",
              value: '',
              type: 'text'
            },
            {
              label: "仓库",
              prop: "warehouseCode",
              value: '',
              type: "quickSearch",
              showKey: "warehouseCode",
              name: "warehouse_display",
              callback: (selection, scope) => {
                scope.value = selection.warehouseCode;
                this.warehouseId = selection.warehouseId;
              }
            },
            {
              label: "创建人",
              prop: "createdBy",
              value: '',
              type: 'text'
            },
            {
              label: "库存组织",
              prop: "cusOrgCode",
              value: '',
              type: 'text'
            },
            {
              label: "状态",
              prop: "status",
              value: '',
              type: 'select',
              options: []
            },
            {
              label: "创建日期",
              prop: "createDateFrom",
              value: '',
              type: "datePicker",
              valueFormat: 'yyyy-MM-dd'
            },
            {
              label: "至",
              prop: "createDateTo",
              value: '',
              type: "datePicker",
              valueFormat: 'yyyy-MM-dd'
            },
            {
              label: "备注",
              prop: "comments",
              value: '',
              type: 'text'
            },
            {
              label: "过滤取消单据",
              prop: "filterCancelledOrders",
              type: 'checkbox',
              value: 'Y',
              trueLabel: 'Y',
              falseLabel: 'N'
            },
          ]
        },
        table: {
          columns: [
            {
              type: 'selection',
              width: 60
            },
            {
              type: 'index',
              label: '序号',
              width: 60
            },
            {
              prop: "warehousingType",
              label: "入库类型",
              width: 120,
              sortable: true
            },
            {
              prop: "warehousingNum",
              label: "入库单号",
              width: 130,
              sortable: true
            },
            {
              prop: "lineSeq",
              label: "入库单行号",
              width: 110,
              sortable: true
            },
            {prop: "itemCode", label: "物料编码", width: 120, sortable: true},
            {prop: "itemName", label: "物料名称", width: 200, sortable: true},
            {
              prop: "batchCode",
              label: "批次号",
              sortable: true,
              width: 100,
              formatter: (row, column) => {
                return this.$getLabelByValue(this.dict['PSS_ENABLE_BATCH'], row[column.property], 'label', 'value');
              },
            },
            {prop: "quantity", label: "数量", width: 100, sortable: true},
            {prop: "actualQuantity", label: "实际数量", width: 100, sortable: true},
            {prop: "itemUnit", label: "单位", width: 100, sortable: true},
            {prop: "prodOrder", label: "生产订单", width: 120, sortable: true},
            {
              prop: "costCenter",
              label: "成本中心",
              width: 120,
              sortable: true,
              formatter: (row) => {
                return this.$getLabelByValue(this.dict['PSS_COST_CENTER'], row.costCenter, 'label', 'value');
              }
            },
            {prop: "poNum", label: "采购订单", width: 120, sortable: true},
            {prop: "poLineId", label: "采购订单行", width: 120, sortable: true},
            {prop: "warehouseCode", label: "仓库", width: 120, sortable: true},
            {prop: "cusOrgCode", label: "库存组织", width: 120, sortable: true},
            {
              prop: "creationDate",
              label: "创建时间",
              sortable: true,
              width: 150,
              formatter: (row) =>{
                return row.creationDate ? parseTime(row.creationDate) : "";
              }
            },
            {prop: "createdBy", label: "创建人", width: 100, sortable: true},
            {prop: "status", label: "状态", width: 100, sortable: true},
            {prop: "comments", label: "备注", width: 150, sortable: true},
            {
              prop: "operation",
              label: "操作",
              fixed: "right",
              width: 60,
              render: ({row, col}) => {
                if(row.status !== "完成"){
                  return {
                    component: 'button',
                    type: 'text',
                    text: '编辑',
                    click: () => {
                      this.editTab("edit", row);
                    }
                  }
                }else {
                  return ''
                }
              },
            }
          ],
          tableData: [],
          settings: {}
        },
        pagination: {
          pageSize: 15,
          pageNum: 1,
          total: 0
        },
        loading: false,
        loading1: false,
        dict: {
          'PSS_ORDER_STATUS': [],
          'PSS_ENABLE_BATCH': [],
          'PSS_WAREHOUSING_TYPE': [],
          'PSS_UNIT': [],
          'PSS_COST_CENTER': []
        },
      };
    },
    created() {
      // console.log(this.$store)
      // debugger
      // let _this = this;
      // this.tableHeader = [
      //   {prop: "warehousingType", label: "入库类型", width: 120, sortable: true},
      //   {prop: "warehousingNum", label: "入库单号", width: 120, sortable: true},
      //   {prop: "lineSeq", label: "入库单行号", width: 120, align: "right", sortable: true},
      //   {prop: "prodOrder", label: "生产订单", width: 120, sortable: true},
      //   {
      //     prop: "costCenter",
      //     label: "成本中心",
      //     width: 120,
      //     sortable: true,
      //     formattor(val) {
      //       return _this.$getLabelByValue(_this.costList, val);
      //     }
      //   },
      //   {prop: "poNum", label: "采购订单", width: 120, sortable: true},
      //   {prop: "poLineId", label: "采购订单行", width: 120, sortable: true},
      //   {prop: "itemCode", label: "物料编码", width: 120, sortable: true},
      //   {prop: "itemName", label: "物料名称", width: 200, sortable: true},
      //   {prop: "itemUnit", label: "单位", width: 100, sortable: true},
      //   {
      //     prop: "batchCode",
      //     label: "批次号",
      //     sortable: true,
      //     width: 100,
      //     formattor(val) {
      //       return _this.$getLabelByValue(_this.batchList, val);
      //     }
      //   },
      //   {prop: "warehouseCode", label: "仓库", width: 120, sortable: true},
      //   {prop: "cusOrgCode", label: "库存组织", width: 120, sortable: true},
      //   {prop: "quantity", label: "数量", width: 100, align: "right", sortable: true},
      //   {prop: "actualQuantity", label: "实际数量", width: 100, align: "right", sortable: true},
      //   {
      //     prop: "creationDate",
      //     label: "创建时间",
      //     sortable: true,
      //     width: 150,
      //     formattor(val) {
      //       return val ? parseTime(val) : "";
      //     }
      //   },
      //   {prop: "createdBy", label: "创建人", width: 100, sortable: true},
      //   {prop: "status", label: "状态", width: 100, sortable: true},
      //   {prop: "comments", label: "备注", width: 150, sortable: true},
      //   {
      //     prop: "operation",
      //     label: "操作",
      //     editType: "none",
      //     fixed: "right",
      //     width: 60,
      //     showType: "button",
      //     btnStyle: "text",
      //     callback: function (row) {
      //       this.editTab("edit", row);
      //     }.bind(this),
      //     formattor(val) {
      //       return "编辑";
      //     },
      //     show: function (row) {
      //       if (row.status === "完成") {
      //         return false;
      //       } else {
      //         return true;
      //       }
      //     }
      //   }
      // ];
      // this.defaultTableHeader = this.tableHeader;
      // this.getBatch();
      // this.getStatus();
      // this.getCostList();
      // this.getItemList();
      // this.getBillType();
      // this.getWarehouseList();
      // this.getUnitList();
      // this.$nextTick(() => {
      //   this.getQuerydata();
      // });
    },
    methods: {
      onSubmit() {
        this.onSearch();
      },
      pageSizeChange(pageSize) {
        this.pagination.pageNum = 1;
        this.pagination.pageSize = pageSize;
        this.onSearch();
      },
      pageNumChange(pageNum) {
        this.pagination.pageNum = pageNum;
        this.onSearch();
      },
      onSearch() {
        let condition = this.getCondition();
        let data = {
          ...condition,
          pageSize: this.pagination.pageSize,
          pageNo: this.pagination.pageNum
        };
        let url = '/pss/member/warehousing/list';
        this.loading = true;
        this.$http({url, method: 'post', data}).then(res => {
          this.loading = false;
          if (res && res.success) {
            this.pagination.total = res.data.total;
            this.table.tableData = res.data.list;
          }
        }).catch(err => {
          this.loading = false;
        })
      },
      getCondition() {
        let condition = {};
        this.form.formData.forEach(item => {
          if(item.value !== ''){
            condition[item.prop] = item.value;
          }
        });
        if(condition.warehouseCode){
          condition.warehouseId = this.warehouseId;
        }
        return condition;
      },
      getDict() {
        this.getDictByCodes(
          [
            'PSS_ORDER_STATUS',
            'PSS_ENABLE_BATCH',
            'PSS_WAREHOUSING_TYPE',
            'PSS_UNIT',
            'PSS_COST_CENTER'
          ],
          () => {
            this.form.formData[0].options = this.dict['PSS_WAREHOUSING_TYPE'];
            this.form.formData[3].options = this.dict['PSS_COST_CENTER'];
            this.form.formData[12].options = this.dict['PSS_ORDER_STATUS'];
          }
        )
      },
      // 批量获取字典接口
      getDictByCodes(codes, callback) {
        let params = codes;
        let url = '/pss/member/dict/item/map';
        let httpParams = {
          url: url,
          method: 'post',
          data: params
        };
        this.$http(httpParams).then(res => {
          if (res.success) {
            codes.forEach(code => {
              let dict = res.data[code];
              for (let name in dict) {
                this.dict[code].push({
                  label: dict[name],
                  value: name
                })
              }
            });
            callback && callback()
          }
        });
      },

      // 编辑tab
      editTab(type, row) {
        let tab = {};
        if (type == "add") {
          // 新增
          tab = {
            component: warehousingAdd,
            params: {flag: "add"},
            title: "入库单新增",
            name: "warehousingAdd"
          };
        } else {
          // 修改
          tab = {
            component: warehousingAdd,
            params: {
              flag: "edit",
              row: row
            },
            title: row.warehousingNum,
            name: "warehousingAdd" + row.warehousingNum
          };
        }
        this.$emit("tab-add", tab);
      },
      /** 成功回调*/
      uploadSuccess(val) {
        this.onSearch();
      },
      /** 导入*/
      downloadTemplate() {    // 下载模板
        downloadFileLink('/pss/member/warehousing/template', parseTime(new Date()) + '_导出.xls').catch(() => {
          this.$message.error('下载失败')
        })
      },
      /** 导出*/
      exportOne() {
        let condition = this.getCondition();
        downloadFileLink(
          "/pss/member/warehousing/export",
          "入库单报表.xls",
          condition || {}
        ).catch(() => {
          this.$message.error("下载失败");
        });
      },
      /** 取消*/
      batchCancel() {
        let slt = this.$refs['magicalTable'].getSelection();
        if (slt.length === 0) {
          this.$message.error("请选择数据！");
          return;
        }
        for (let i of slt) {
          if (i.status !== "拟定") {
            this.$message.error("只有拟定状态的可以取消！");
            return;
          }
        }
        let warehousingHeaderIds = slt.map(
          v => v.warehousingHeaderId
        );
        this.$confirm("确认取消吗？", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.loading1 = true;
          this.$http({
            url: "/pss/member/warehousing/cancel",
            method: "POST",
            data: {warehousingHeaderIds: warehousingHeaderIds}
          }).then(data => {
            this.loading1 = false;
            if (data && data.success) {
              this.$message.success("保存成功");
              this.onSearch();
            }
          }).catch(err => {
            this.loading1 = false;
            console.log(err);
          });
        });
      },
    },
    mounted() {
      this.getDict();
      this.onSearch();
    }
  };
</script>
<style scoped lang="scss">
  .wrap {
    & /deep/ .mButtons {
      display: flex;
      .importBtn {
        margin-right: 10px;
      }
    }
    .el-dialog__header {
      border-bottom: 1px solid #eee !important;
    }
    & /deep/ .el-table {
      .sort-caret.ascending {
        border-bottom-color: #ffffff;
      }
      .sort-caret.descending {
        border-top-color: #ffffff;
      }
      .ascending .sort-caret.ascending {
        border-bottom-color: #1890ff;
      }
      .descending .sort-caret.descending {
        border-top-color: #1890ff;
      }
    }
  }

</style>
