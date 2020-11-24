<template>
  <magical-table
    ref="magicalTable"
    class="calc85"
    :loading="block.loading"
    :needQuery="false"
    :needPagination="false"
    :needLine="false"
    :table="block.table">
    <template #buttons>
      <el-button type="primary" @click="handlerAdd">新增</el-button>
      <el-button type="primary" :loading="block.loading1" @click="handleSave">保存</el-button>
    </template>
  </magical-table>
</template>

<script>
  import magicalTable from 'lib@/components/awesome/magicalTable';
  import {parseTime} from "@/utils";
  export default {
    name: "workOrderManageAdd",
    components: {
      magicalTable
    },
    data() {
      return {
        block: {
          loading: false,
          loading1: false,
          table: {
            tableData: [],
            columns: [
              {
                label: '工厂',
                prop: 'factoryId',
                minWidth: 180,
                renderLabel: () => {
                  return {
                    component: 'text',
                    beforeText: '*'
                  }
                },
                render: ({row}) => {
                  return {
                    component: 'quickSearch',
                    showKey: "factoryName",
                    showInput: row.factoryName,
                    name: "factory_display",
                    callback: (selection, scope) => {
                      row.factoryId = selection.factoryId;
                      row.factoryCode = selection.factoryCode;
                      row.factoryName = selection.factoryName;
                      row.resourceId = '';
                      this.queryQuickList({_quickKey: 'resource_display' ,preQueryData: {'t.FACTORY_CODE': row.factoryCode}}).then(res => {
                        row.resourceList = res.map(item => {return {...item, label: item.productionLineName, value: item.resourceId}});
                        if(res.length === 1) {
                          this.$nextTick(() => {
                            row.resourceId = res[0].resourceId;
                          });
                        }
                      });
                    },
                  }
                }
              },
              {
                label: '工单编码',
                prop: 'workOrderCode',
                minWidth: 130,
                renderLabel: () => {
                  return {
                    component: 'text',
                    beforeText: '*'
                  }
                },
                render: () => {
                  return {
                    component: 'input'
                  }
                }
              },
              {
                label: '物料编码',
                prop: 'itemId',
                minWidth: 180,
                renderLabel: () => {
                  return {
                    component: 'text',
                    beforeText: '*'
                  }
                },
                render: ({row, $index}) => {
                  return {
                    component: 'quickSearch',
                    showKey: "itemId",
                    showInput: row.itemCode,
                    name: "item_display",
                    callback: (selection, scope) => {
                      row.itemCode = selection.itemCode;
                      row.itemName = selection.itemName;
                      row.itemId =  selection.itemId;
                      row.cusItemCodeList = [];
                      row.itemRelationId = '';
                      row.customerId = '';
                      row.cusOrgCodeStr = '';
                      if(selection){
                        this.queryQuickList({_quickKey: 'items_relation_display' ,preQueryData: {'t.ITEM_CODE': row.itemCode}}).then(res => {
                          row.cusItemCodeList = res.map(item => {return {...item, label: item.cusItemCode, value: item.relationId}});
                          if(res.length === 1) {
                            this.$nextTick(() => {
                              row.itemRelationId = res[0].relationId;
                              row.customerId = res[0].customerId;
                              row.cusOrgCodeStr = `${res[0].cusOrgCode}_${res[0].customerCode}`;
                            });
                          }
                        });
                      }
                    },
                  }
                }
              },
              {
                label: '客户物料编码',
                prop: 'itemRelationId',
                minWidth: 180,
                render: ({row, $index}) => {
                  return {
                    component: 'select',
                    options: row.cusItemCodeList,
                    change: (val) => {
                      row.customerId = '';
                      row.cusOrgCodeStr = '';
                      if(val) {
                        let cusRow = row.cusItemCodeList.find(item => val === item.value);
                        if(cusRow) {
                          row.customerId = cusRow.customerId;
                          row.cusOrgCodeStr = `${cusRow.cusOrgCode}_${cusRow.customerCode}`
                        }
                      }
                    }
                  }
                }
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
                render: ({row, $index}) => {
                  return {
                    component: 'input'
                  }
                }
              },
              // {
              //   label: '产线',
              //   prop: 'resourceId',
              //   minWidth: 130,
              //   renderLabel: () => {
              //     return {
              //       component: 'text',
              //       beforeText: '*'
              //     }
              //   },
              //   render: ({row, $index}) => {
              //     return {
              //       component: 'quickSearch',
              //       showKey: "factoryName",
              //       disabled: !row.factoryId,
              //       preQueryData: {'t.FACTORY_CODE': row.factoryCode},
              //       showInput: row.factoryName,
              //       name: "resource_display",
              //       callback: (selection, scope) => {
              //         row.resourceId = selection.resourceId;
              //       },
              //     }
              //   }
              // },
              {
                label: '产线',
                prop: 'resourceId',
                minWidth: 180,
                render: ({row, $index}) => {
                  return {
                    component: 'select',
                    options: row.resourceList
                  }
                }
              },

              {
                label: '工单数量',
                prop: 'workOrderQty',
                width: 130,
                renderLabel: () => {
                  return {
                    component: 'text',
                    beforeText: '*'
                  }
                },
                render: ({row, $index}) => {
                  return {
                    component: 'inputNumber',
                    style: {width: '120px'},
                    controls: false,
                    max: 10000000000,
                    min: 0
                  }
                }
              },
              {
                label: '工单状态',
                prop: 'status',
                minWidth: 130,
                renderLabel: () => {
                  return {
                    component: 'text',
                    beforeText: '*'
                  }
                },
                render: ({row, $index}) => {
                  return {
                    component: 'select',
                    options: this.dict['PSS_WORK_ORDER_STATUS']
                  }
                }
              },
              {
                label: '计划开工时间',
                prop: 'planStartDate',
                minWidth: 150,
                renderLabel: () => {
                  return {
                    component: 'text',
                    beforeText: '*'
                  }
                },
                render: ({row, $index}) => {
                  return {
                    component: 'datePicker',
                    dateType: 'datetime',
                    valueFormat: 'yyyy-MM-dd hh:mm:ss'
                  }
                }
              },
              {
                label: '计划完工时间',
                prop: 'planFinishDate',
                minWidth: 150,
                renderLabel: () => {
                  return {
                    component: 'text',
                    beforeText: '*'
                  }
                },
                render: ({row, $index}) => {
                  return {
                    component: 'datePicker',
                    dateType: 'datetime',
                    valueFormat: 'yyyy-MM-dd hh:mm:ss'
                  }
                }
              },
              {
                label: '试制编码',
                prop: 'trialProductionNo',
                minWidth: 150,
                render: ({row, $index}) => {
                  return {
                    component: 'input'
                  }
                }
              },
              {
                label: '客户',
                prop: 'cusOrgCodeStr',
                minWidth: 130,
              },
              {
                label: '订单号',
                prop: 'orderCode',
                minWidth: 150,
                render: () => {
                  return {
                    component: 'input'
                  }
                }
              },
              {
                label: '备注',
                prop: 'remark',
                minWidth: 150,
                renderLabel: () => {
                  return {
                    component: 'text'
                  }
                },
                render: () => {
                  return {
                    component: 'input'
                  }
                }
              },
              {
                label: '工单来源',
                prop: 'source',
                minWidth: 130,
              },
              {
                label: '操作',
                width: 80,
                prop: 'operation',
                align: 'center',
                tooltip: false,
                render: () => {
                  return {
                    component: 'buttons',
                    options: [
                      {
                        text: '删除',
                        type: 'text',
                        click: ({row, $index}) => {
                          this.handlerDelete(row, $index)
                        }
                      }
                    ]
                  }

                },
                fixed: 'right'
              },
            ]
          }
        },
        dict: {
          PSS_WORK_ORDER_STATUS: []
        }
      }
    },
    methods: {
      handlerDelete(row, $index) {
        this.block.table.tableData.splice($index, 1);
      },
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
      queryCusItemCodeList(itemCode) {
        return new Promise(resolve => {
          let params = {
            query: JSON.stringify({'t.ITEM_CODE': itemCode}),
            extendQuery: JSON.stringify({
              _quickKey: 'items_relation_display',
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
              let cusItemCodeList = res.data.data.map(item => {return {...item, label: item.cusItemCode, value: item.relationId}});
              resolve(cusItemCodeList);
            }else{
              resolve([])
            }
          }).catch(() => {
            resolve([])
          });
        });
      },
      // 查询
      onSearch() {
        let params = {
          pageNo: this.block.pagination.pageNum,
          pageSize: this.block.pagination.pageSize
        };

        let url = '';
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
        this.block.table.tableData.unshift({
          workOrderCode: '',
          workOrderQty: '',
          itemId: '',
          itemRelationId: '',
          customerId: '',
          status: '',
          planStartDate: '',
          planFinishDate: '',
          factoryId: '',
          resourceId: '',
          orderCode: '',
          remark: '',
          rawMaterialVendor: '',
          trialProductionNo: '',
          cusOrgCodeStr: '',
          cusItemCodeList: [],
          resourceList: [],
        });
      },
      // 保存
      handleSave() {
        if(this.validateData()) {
          let list = this.block.table.tableData.map(item =>{
            return {
              workOrderCode: item.workOrderCode,
              workOrderQty: item.workOrderQty,
              itemId: item.itemId,
              itemRelationId: item.itemRelationId,
              customerId: item.customerId,
              status: item.status,
              planStartDate: item.planStartDate,
              planFinishDate: item.planFinishDate,
              factoryId: item.factoryId,
              resourceId: item.resourceId,
              orderCode: item.orderCode,
              remark: item.remark,
              rawMaterialVendor: item.rawMaterialVendor,
              trialProductionNo: item.trialProductionNo,
            }
          });
          let data = { list };
          let url = '/pss/member/production/workorder/add';
          this.block.loading1 = true;
          this.$http({
            url,
            data,
            method: 'post'
          }).then((res) => {
            this.block.loading1 = false;
            if(res.success){
              this.$message.success('保存成功！');
              this.$emit("tab-remove", "workOrderManageAdd")
            }
          }).catch(() => {
            this.block.loading1 = false;
          });
        }
      },
      // 校验表格数据
      validateData() {
        if(this.block.table.tableData.length === 0){
          this.$message.warning(`请新增数据！`);
          return;
        }
        for(let item of this.block.table.tableData) {
          let col = this.block.table.columns.find(innerItem => innerItem.hasOwnProperty('renderLabel') && !item[innerItem.prop]);
          if(col){
            this.$message.warning(`请录入${col.label}数据！`);
            return
          }
        }
        return true;
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
            ],
            () => {
              this.dict['PSS_WORK_ORDER_STATUS'] = this.dict['PSS_WORK_ORDER_STATUS'].filter(item => item.value === 'ISSUED' || item.value === 'UNISSUED');
              // this.block.form.formData[6].options = this.dict['PSS_BASE_STATE'];
              // this.block.form.formData[7].options = this.dict['PSS_BASE_STATE'];
              resolve();
            }
          )
        });
      },
    },
    mounted() {
      this.getDict();
      // this.onSearch();
    }
  }
</script>

<style scoped>

</style>