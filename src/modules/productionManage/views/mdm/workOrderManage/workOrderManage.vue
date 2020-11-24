<template>
  <section class="section">
    <magical-table
      ref="magicalTable"
      class="calc85"
      :loading="block.loading"
      :form="block.form"
      :table="block.table"
      :pagination="block.pagination"
      @onSubmit="onSubmit"
      @pageSizeChange="pageSizeChange"
      @pageNumChange="pageNumChange">
      <template #buttons>
        <el-button type="primary" @click="handlerAdd">新增</el-button>
        <el-button type="primary" :loading="block.loading1" @click="handlerStateEdit">状态修改</el-button>
        <div style="display: inline-block; padding: 0 11px;">
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
        <el-button type="primary" :loading="block.loading2" @click="handlerExport">导出</el-button>
      </template>
    </magical-table>
    <magical-table
      type="dialog"
      :title="modal.title"
      :show="modal.show"
      @close="modal.show = false"
      :closeOnClickModal="false"
      width="60%"
      :needTable="false"
      :needPagination="false"
      :form="modal.form"
      ref="magicalTableModal">
      <div slot="footer" style="text-align: right">
        <el-Button type="primary" @click="handlerSave" :loading="modal.loading" >保存</el-Button>
        <el-Button @click="modal.show = false">取消</el-Button>
      </div>
    </magical-table>
    <magical-table
      type="dialog"
      :title="modal1.title"
      :show.sync="modal1.show"
      :closeOnClickModal="false"
      width="30%"
      :needTable="false"
      :needPagination="false"
      :form="modal1.form"
      ref="magicalTableModal1">
      <div slot="footer" style="text-align: right">
        <el-Button type="primary" @click="handlerStateEditSave" :loading="modal1.loading" >保存</el-Button>
        <el-Button @click="modal1.show = false">取消</el-Button>
      </div>
    </magical-table>
  </section>
</template>

<script>
  import magicalTable from 'lib@/components/awesome/magicalTable';
  import {parseTime} from "@/utils";
  import {downloadFileLink} from "@/utils/file";
  import MImport from "lib@/components/import";
  import workOrderManageAdd from './workOrderManageAdd';
  export default {
    name: "workOrderManage",
    components: {
      magicalTable,
      MImport
    },
    data() {
      return {
        block: {
          loading: false,
          loading1: false,
          loading2: false,
          form: {
            formData: [
              {
                label: '工厂',
                prop: 'factoryId',
                type: 'quickSearch',
                showKey: "factoryName",
                showInput: '',
                name: "factory_display",
                value: '',
                callback: (selection, scope) => {
                  scope.value = selection.factoryId;
                  this.block.form.formData[1].preQueryData = {};
                  this.$refs['magicalTable'].clearInputByName('resource_display'); // 为了解决showInput值无法清空问题
                  if(selection){
                    this.block.form.formData[1].preQueryData = {'t.FACTORY_CODE': selection.factoryCode};
                  }
                },
              },
              {
                label: '产线',
                prop: 'resourceId',
                type: 'quickSearch',
                showKey: "productionLineName",
                preQueryData: {},
                showInput: '',
                name: "resource_display",
                value: '',
                callback: (selection, scope) => {
                  scope.value = selection.resourceId;
                },
              },
              {
                label: '工单编号',
                value: '',
                prop: 'workOrderCode',
                type: 'text'
              },
              {
                label: '订单号',
                value: '',
                prop: 'orderCode',
                type: 'text'
              },
              {
                label: '物料编码',
                value: '',
                prop: 'itemId',
                type: 'quickSearch',
                showKey: "itemCode",
                preQueryData: {},
                showInput: '',
                name: "item_display",
                callback: (selection, scope) => {
                  scope.value = selection.itemId;
                },
              },
              {
                label: '客户',
                prop: 'customerId',
                type: 'quickSearch',
                showKey: "customerName",
                showInput: '',
                name: "psi_base_customer",
                value: '',
                callback: (selection, scope) => {
                  scope.value = selection.customerId;
                },
              },
              {
                label: '工单状态',
                value: '',
                prop: 'status',
                type: 'select',
                options: () => {
                  return this.dict.PSS_WORK_ORDER_STATUS
                }
              },
              {
                label: '工单来源',
                value: '',
                prop: 'source',
                type: 'select',
                options: () => {
                  return this.dict.PSS_WORK_ORDER_SOURCE
                }
              },
              {
                label: '创建时间从',
                value: '',
                prop: 'creationDateFrom',
                type: 'datePicker',
                dateType: 'datetime',
                valueFormat: 'yyyy-MM-dd hh:mm:ss',
              },
              {
                label: '创建时间至',
                value: '',
                prop: 'enableDatetimeTo',
                type: 'datePicker',
                dateType: 'datetime',
                valueFormat: 'yyyy-MM-dd hh:mm:ss'
              },
              {
                label: '计划开工时间从',
                value: '',
                prop: 'planStartDateFrom',
                type: 'datePicker',
                dateType: 'datetime',
                valueFormat: 'yyyy-MM-dd hh:mm:ss'
              },
              {
                label: '计划开工时间至',
                value: '',
                prop: 'planStartDateTo',
                type: 'datePicker',
                dateType: 'datetime',
                valueFormat: 'yyyy-MM-dd hh:mm:ss'
              },
              {
                label: '计划完工时间从',
                value: '',
                prop: 'planFinishDateFrom',
                type: 'datePicker',
                dateType: 'datetime',
                valueFormat: 'yyyy-MM-dd hh:mm:ss'
              },
              {
                label: '计划完工时间至',
                value: '',
                prop: 'planFinishDateTo',
                type: 'datePicker',
                dateType: 'datetime',
                valueFormat: 'yyyy-MM-dd hh:mm:ss'
              },
            ]
          },
          table: {
            tableData: [],
            columns: [
              {
                type: "selection",
                width: 50,
                fixed: 'left'
              },
              {
                label: '序号',
                type: "index",
                width: 50,
                fixed: 'left'
              },
              {
                label: '工厂',
                prop: 'factoryName',
                minWidth: 90,
              },
              {
                label: '工单编码',
                prop: 'workOrderCode',
                minWidth: 150,
              },
              {
                label: '物料编码',
                prop: 'itemCode',
                minWidth: 150,
              },
              {
                label: '客户物料编码',
                prop: 'cusItemCode',
                minWidth: 130,
              },
              {
                label: '物料描述',
                prop: 'itemName',
                width: 130
              },
              {
                label: '原料供应商',
                prop: 'rawMaterialVendor',
                minWidth: 130,
              },
              {
                label: '产线',
                prop: 'productionLineName',
                minWidth: 130,
              },
              {
                label: '工单数量',
                prop: 'workOrderQty',
                minWidth: 130,
              },
              {
                label: '完工数量',
                prop: 'finishedQty',
                minWidth: 130,
              },
              {
                label: '工单状态',
                prop: 'status',
                minWidth: 130,
                render: ({row, $index}) => {
                  return this.$getLabelByValue(this.dict.PSS_WORK_ORDER_STATUS, row.status, 'label', 'value');
                }
              },
              {
                label: '计划开工时间',
                prop: 'planStartDate',
                minWidth: 150,
              },
              {
                label: '计划完工时间',
                prop: 'planFinishDate',
                minWidth: 150,
              },
              {
                label: '试制编码',
                prop: 'trialProductionNo',
                minWidth: 130,
              },
              {
                label: '客户',
                prop: 'customerName',
                minWidth: 130,
              },
              {
                label: '订单号',
                prop: 'orderCode',
                minWidth: 130,
              },
              {
                label: '工单来源',
                prop: 'source',
                minWidth: 130,
                render: ({row, $index}) => {
                  return this.$getLabelByValue(this.dict.PSS_WORK_ORDER_SOURCE, row.source, 'label', 'value');
                }
              },
              {
                label: '备注',
                prop: 'remark',
                minWidth: 130,
              },
              {
                label: '创建时间',
                prop: 'creationDate',
                minWidth: 150,
              },
              {
                label: '操作',
                width: 80,
                prop: 'operation',
                align: 'center',
                tooltip: false,
                render: ({row}) => {
                  let disabled = row.status === 'CLOSED' ? true : false;
                  return {
                    component: 'buttons',
                    options: [
                      {
                        text: '修改',
                        type: 'text',
                        disabled,
                        click: ({row, $index}) => {
                          this.handlerEdit(row, $index)
                        }
                      }
                    ]
                  }

                },
                fixed: 'right'
              },
            ],
          },
          pagination: {
            total: 0,
            pageSize: 15,
            pageNum: 1,
          }
        },
        modal: {
          title: '工单_修改',
          show: false,
          form: {
            formData: [
              {
                label: '工厂',
                prop: 'factoryName',
                type: 'span',
                span: 12,
                value: '',
                rules: {required: true}
              },
              {
                label: '工单编码',
                type: 'span',
                prop: 'workOrderCode',
                span: 12,
                value: '',
                rules: {required: true}
              },
              {
                label: '物料编码',
                prop: 'itemCode',
                type: 'span',
                span: 12,
                value: '',
                rules: {required: true},
              },
              {
                label: '客户物料编码',
                type: 'span',
                prop: 'cusItemCode',
                span: 12,
                value: '',
                rules: {required: true}
              },
              {
                label: '物料描述',
                type: 'span',
                prop: 'itemName',
                span: 12,
                value: ''
              },
              {
                label: '原料供应商',
                value: '',
                type: 'text',
                prop: 'rawMaterialVendor',
                span: 12
              },
              {
                label: '产线',
                value: '',
                type: 'select',
                prop: 'resourceId',
                options: () => {
                  return this.modal.resourceList;
                },
                span: 12
              },
              {
                label: '工单数量',
                value: '',
                type: 'inputNumber',
                prop: 'workOrderQty',
                precision: 0,
                span: 12,
                max: 10000000000,
                min: 0,
                style: {width: '100%'},
                // controls: false,
                disabled: () => {
                  let status = this.block.table.tableData[this.modal.currentIndex].status;
                  if(status === 'CLOSED'){
                    return true;
                  } else {
                    return false;
                  }
                }
              },
              {
                label: '完工数量',
                value: '',
                type: 'span',
                prop: 'finishedQty',
                span: 12
              },
              {
                label: '工单状态',
                value: '',
                type: 'select',
                prop: 'status',
                span: 12,
                options: () => {
                  return this.modal.statusList
                }
              },
              {
                label: '计划开工时间',
                value: '',
                prop: 'planStartDate',
                type: 'datePicker',
                span: 12,
                valueFormat: 'yyyy-MM-dd hh:mm:ss',
                dateType: 'datetime',
                rules: {required: true, message: '计划开工时间不能为空', trigger: 'change'}
              },
              {
                label: '计划完工时间',
                value: '',
                prop: 'planFinishDate',
                type: 'datePicker',
                span: 12,
                valueFormat: 'yyyy-MM-dd hh:mm:ss',
                dateType: 'datetime',
                rules: {required: true, message: '计划完工时间不能为空', trigger: 'change'}
              },
              {
                label: '客户',
                value: '',
                type: 'span',
                span: 12,
                prop: 'customerName'
              },
              {
                label: '订单号',
                value: '',
                type: 'text',
                span: 12,
                prop: 'orderCode'
              },
              {
                label: '工单来源',
                value: '',
                type: 'span',
                span: 12,
                prop: 'sourceName'
              },
              {
                label: '备注',
                value: '',
                type: 'text',
                span: 12,
                prop: 'remark'
              },
            ],
            settings: {
              needRightPart: false,
              labelWidth: '110px',
              formItemStyle: {marginBottom: '12px'},
              clearDisabledValue: true
            }
          },
          typeId: '',
          typeName: '',
          loading: false,
          resourceList: [],
          statusList: []
        },
        modal1: {
          title: '修改状态',
          show: false,
          form: {
            formData: [
              {
                label: '工单状态',
                value: '',
                type: 'select',
                prop: 'status',
                span: 24,
                clearable: false,
                options: () => {
                  return this.modal1.statusList
                }
              }
            ],
            settings: {
              needRightPart: false,
              labelWidth: '110px',
              formItemStyle: {marginBottom: '12px'},
              clearDisabledValue: true
            }
          },
          statusList: []
        },
        dict: {
          PSS_WORK_ORDER_STATUS: [],
          PSS_WORK_ORDER_SOURCE: []
        },
        iModal: {
          title: "导入",
          extraData:{},
          upLoadUrl: "/pss/member/production/workorder/import",
          upLoadResultUrl: "/pss/member/production/workorder/import/result",
        },
      }
    },
    methods: {
      // 查询
      onSubmit(condition) {
        this.onSearch();
      },
      // pageSize
      pageSizeChange(pageSize) {
        this.block.pagination.pageNum = 1;
        this.block.pagination.pageSize = pageSize;
        this.onSearch();
      },
      // pageNum
      pageNumChange(currentPage) {
        this.block.pagination.pageNum = currentPage;
        this.onSearch();
      },
      // 查询
      onSearch() {
        let condition = this.$refs['magicalTable'].getCondition();
        let params = {
          ...condition,
          pageNo: this.block.pagination.pageNum,
          pageSize: this.block.pagination.pageSize
        };

        let url = '/pss/member/production/workorder/listPage';
        this.block.loading = true;
        this.$http({
          url,
          method: 'post',
          data: params
        }).then(data => {
          this.block.loading = false;
          if (data && data.success) {
            this.block.pagination.total = data.data.total;
            this.block.table.tableData = data.data.list;
          }
        }).catch(() => {
          this.block.loading = false;
        });
      },
      // 新增
      handlerAdd() {
        this.$emit("tab-add", {
          component: workOrderManageAdd,
          params: {},
          title: '工单新增',
          name: 'workOrderManageAdd'
        });
      },
      // 修改
      handlerEdit(row, index){
        this.modal.currentIndex = index;
        this.queryQuickList({_quickKey: 'resource_display' ,preQueryData: {'t.FACTORY_CODE': row.factoryCode}}).then(res => {
          this.modal.resourceList = res.map(item => {return {...item, label: item.productionLineName, value: item.resourceId}});
        });
        row.sourceName = this.$getLabelByValue(this.dict.PSS_WORK_ORDER_SOURCE, row.source, 'label', 'value');
        this.modal.statusList = JSON.parse(JSON.stringify(this.dict.PSS_WORK_ORDER_STATUS));
        this.modal.statusList.forEach(item => {
          /**
           * 1.“已取消”，不能修改为“已关闭”。
           * 2.“已发放”且工单已绑定容器/标签，不能修改为“未发放”
           */
          item.disabled = false;
          if(row.status === 'CANCELLED'){
            if(item.value === 'CLOSED') item.disabled = true;
          }
          // else if(row.status === 'ISSUED'){
          //   if(item.value === 'UNISSUED') item.disabled = true;
          // }
        });
        this.modal.show = true;
        this.$nextTick(() => {
          this.$refs['magicalTableModal'].setFormDefaultValue(row);
        });
        // this.modal.form.formData.forEach(item => {
        //   item.value = row[item.prop];
        //   if(item.prop === 'itemCode'){
        //     item.value = row.itemCode;
        //     item.showInput = row.itemCode;
        //   }
        // });

      },

      // 快查产线
      queryQuickList({_quickKey, preQueryData }){
        return new Promise(resolve => {
          let params = {
            query: JSON.stringify(preQueryData || {}),
            extendQuery: JSON.stringify({
              _quickKey,
              entityId: 10
            })
          };
          let data = {
            pageSize: 10,
            pageNum: 1,
            params: JSON.stringify(params)
          };
          let url = '/pss/member/quicksearch/quicksearchConfig/listByFormCondition';
          this.$http({
            url,
            method: 'post',
            data
          }).then(res => {
            if (res.success && res.data.data) {
              resolve(res.data.data);
            }else{
              resolve([])
            }
          }).catch(() => {
            resolve([])
          });
        });
      },
      // 保存
      handlerSave() {
        let flag = this.$refs['magicalTableModal'].validateForm();
        if (flag) {
          let condition = this.$refs['magicalTableModal'].getCondition();
          let currentRow = this.block.table.tableData[this.modal.currentIndex];
          let params = {
            id: currentRow.id,
            workOrderQty: condition.workOrderQty,
            status: condition.status,
            planStartDate: condition.planStartDate,
            planFinishDate: condition.planFinishDate,
            resourceId: condition.resourceId,
            orderCode: condition.orderCode,
            remark: condition.remark,
            rawMaterialVendor: condition.rawMaterialVendor,
            trialProductionNo: currentRow.trialProductionNo,
          };
          let url = '/pss/member/production/workorder/modify';
          this.modal.loading = true;
          this.$http({
            url,
            data: params,
            method: 'post'
          }).then((res) => {
            this.modal.loading = false;
            if(res.success){
              this.$message.success('保存成功！');
              this.modal.show = false;
              this.onSearch();
            }
          }).catch(() => {
            this.modal.loading = false;
          });
        }
      },
      // 状态修改
      handlerStateEditSave() {
        let slt = this.$refs['magicalTable'].getSelection();
        let ids = slt.map(item => item.id);
        let status = this.modal1.form.formData[0].value;
        // console.log(status);
        // return ;
        let params = {ids, status};
        let url = '/pss/member/production/workorder/batchModifyStatus';
        this.$http({
          url,
          data: params,
          method: 'post'
        }).then((res) => {
          this.modal1.loading = false;
          if(res.success){
            this.$message.success('保存成功！');
            this.modal1.show = false;
            this.onSearch();
          }
        }).catch(() => {
          this.modal1.loading = false;
        });
      },
      // 状态修改
      handlerStateEdit() {
        let slt = this.$refs['magicalTable'].getSelection();
        if(slt.length === 0) {
          this.$message.warning('请勾选数据！');
          return
        }
        if(slt.some(item => slt[0].status !== item.status)){
          this.$message.warning('请勾选单据状态为相同的数据！');
          return
        }
        if(slt.some(item => {return 'CLOSED' === item.status && item.workOrderQty === item.finishedQty})){
          this.$message.warning('单据状态为“已关闭”且“工单数量”=“完工数量”，不能修改状态');
          return
        }
        this.modal1.statusList = JSON.parse(JSON.stringify(this.dict.PSS_WORK_ORDER_STATUS));
        this.modal1.statusList.forEach(item => {
          /**
           * 1.“已取消”，不能修改为“已关闭”。
           * 2.“已发放”且工单已绑定容器/标签，不能修改为“未发放”
           */
          item.disabled = false;
          if(slt[0].status === 'CANCELLED'){
            if(item.value === 'CLOSED') item.disabled = true;
          }
          // else if(slt[0].status === 'ISSUED'){
          //   if(item.value === 'UNISSUED') item.disabled = true;
          // }
        });
        this.modal1.show = true;
        this.$nextTick(() => {
          this.$refs['magicalTableModal1'].setFormDefaultValue({status: slt[0].status});
        });
      },
      // 下载模板
      downloadTemplate() {
        downloadFileLink('/pss/member/production/workorder/template' , parseTime(new Date()) +'_导出.xls' ).catch(() => {
          this.$message.error('下载失败')
        })
      },
      // 导入完成
      uploadSuccess(){
        this.onSearch();
      },
      // 导出
      handlerExport() {
        let condition = this.$refs['magicalTable'].getCondition();
        let params = condition;
        downloadFileLink(
          "/pss/member/production/workorder/export",
          "工单管理.xls",
          params || {}
        ).catch(() => {
          this.$message.error("下载失败");
        });
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
      getDict() {
        return new Promise(resolve => {
          this.getDictByCodes(
            [
              'PSS_WORK_ORDER_STATUS',
              'PSS_WORK_ORDER_SOURCE'
            ],
            () => {
              resolve();
            }
          )
        });
      },
    },
    mounted() {
      this.getDict();
      this.onSearch();
    }
  }
</script>

<style scoped>

</style>