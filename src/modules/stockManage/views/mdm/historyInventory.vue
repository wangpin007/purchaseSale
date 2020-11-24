<template>
  <!--<el-container class="flex-container-notab the_instock_wrapper"  direction="vertical">-->
    <!--<el-main>-->
<!--<form-wrapper :formArray="preArr" @getFormData="getQuerydata" :initActive='true' />-->
<!--<main-header>-->
        <!--<template slot="left">-->
          <!--<el-button-->
            <!--type="primary"-->
            <!--size="mini"-->
            <!--@click="exportData"-->
          <!--&gt;-->
            <!--{{$t('common.export')}}-->
          <!--</el-button>-->
        <!--</template>-->
      <!--</main-header>-->

      <!--<table-view-->
        <!--:ref="gridId"-->
        <!--:table-data="tableData"-->
        <!--:table-header="tableHeader"-->
        <!--:preQueryData="queryParam"-->
        <!--:page-size="pageSize"-->
        <!--url="/pss/member/inventory/history" />-->
    <!--</el-main>-->
  <!--</el-container>-->
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
      <el-button type="primary" size="mini" @click="exportData">{{$t('common.export')}}</el-button>
    </template>
  </magical-table>
</template>
<script>
  // import TableView from 'lib@/components/Table/TableView'
  // import MainHeader from 'lib@/components/Table/MainHeader';
  // import FormWrapper from 'lib@/components/Table/FormWrapper'
  import { downloadFileLink } from '@/utils/file'
  import {parseTime} from  '@/utils'
  import MagicalTable from "lib@/components/awesome/magicalTable/main";
  export default {
    name: 'page1',
    components: {
      MagicalTable,
      // TableView,MainHeader, FormWrapper
    },
    data () {
      return {
        block: {
          loading: false,
          form: {
            formData: [
              {
                label: "物料编码",
                prop: "itemCode",
                type: "quickSearch",
                showKey: "itemCode",
                name: "item_display",
                showInput: '',
                value: '',
                callback: (selection, scope) => {
                  scope.value = selection.itemCode;
                  // this.block.form.formData[1].preQueryData = {};
                  // this.$refs['magicalTable'].clearInputByName('resource_display'); // 为了解决showInput值无法清空问题
                  // if(selection){
                  //   this.block.form.formData[1].preQueryData = {'t.FACTORY_CODE': selection.factoryCode};
                  // }
                },
              },
              {
                label:'工厂编码',
                prop:'factoryCode',
                type: "quickSearch",
                showKey: "factoryCode",
                name: "factory_display",
                showInput: '',
                value: '',
                callback: (selection, scope) => {
                  scope.value = selection.factoryCode;
                },
              },
              {
                label:'仓库编码',
                prop: "warehouseCode",
                type: "quickSearch",
                showKey: "warehouseCode",
                name: "warehouse_display",
                showInput: '',
                value: '',
                callback: (selection, scope) => {
                  scope.value = selection.warehouseCode;
                },
              },
              {
                label:'回滚时间',
                prop:'rollbackTime',
                type:'datePicker',
                dateType: 'datetime',
                value: parseTime(new Date())
              }
            ]
          },
          table: {
            tableData: [],
            columns: [
              {
                label: '序号',
                type: 'index',
                prop: 'index'
              },
              {
                prop: 'itemCode',
                label: '物料编码',
                width:150,
              },
              {
                prop: 'itemName',
                label: '物料名称',
                minWidth:200,
              },
              {
                prop: 'specification',
                label: '规格型号',
                width:100,
              },
              {
                prop: 'itemUnit',
                label: '单位',
                width:80,
              },
              {
                prop: 'factoryCode',
                label: '工厂编码',
                width:100,
              },
              {
                prop: 'warehouseCode',
                label: '仓库编码',
                width:100,
              },
              {
                prop: 'batchCode',
                label: '批次号',
                width:100,
              },
              {
                prop: 'timeQuantity',
                label: '时间点库存量',
                width:100,
              },
              {
                prop: 'quantity',
                label: '现有库存量',
                width:100,
              },
              {
                prop: 'comments',
                label: '备注',
                minWidth:150,
              }
            ],
            settings: {
              showSummary: true,
              summaryMethod: ({ columns, data }) => {
                const sums = [];
                columns.forEach((column, index) => {
                  if (index === 1) {
                    sums[index] = '合计';
                    return;
                  }
                  const values = data.map(item => Number(item[column.property]));
                  if(column.property === 'timeQuantity' || column.property === 'quantity'){
                    sums[index] = values.reduce((prev, curr) => {
                      const value = Number(curr);
                      if (!isNaN(value)) {
                        return prev + curr;
                      } else {
                        return prev;
                      }
                    }, 0);
                  }else {
                    sums[index] = '';
                  }
                  // if (!values.every(value => isNaN(value))) {
                  //   sums[index] = values.reduce((prev, curr) => {
                  //     const value = Number(curr);
                  //     if (!isNaN(value)) {
                  //       return prev + curr;
                  //     } else {
                  //       return prev;
                  //     }
                  //   }, 0);
                  //   sums[index] += ' 元';
                  // } else {
                  //   sums[index] = '';
                  // }
                });
                return sums;
              }
            }
          },
          pagination: {
            total: 0,
            pageSize: 15,
            pageNum: 1,
          }
        },

        // name: '',
        // description: '',
        // gridData: [],
        // pageSize: 15,
        // gridId: 'list',
        // selectList: [],
        // currentRow: null,
        // showFilterBar: 1,
        // tableHeader: [],
        // tableData: [],
        // queryParam:{},
        // preArr:[
        //   {
        //     label: "物料编码",
        //     prop: "itemCode",
        //     type: "quicksearch",
        //     showKey: "itemCode",
        //     name: "item_display",
        //   },
        //   {
        //     label:'工厂编码',
        //     prop:'factoryCode',
        //     type: "quicksearch",
        //     showKey: "factoryCode",
        //     name: "factory_display",
        //   },{
        //     label:'仓库编码',
        //     prop: "warehouseCode",
        //     type: "quicksearch",
        //     showKey: "warehouseCode",
        //     name: "warehouse_display",
        //   },
        //   {label:'回滚时间',prop:'rollbackTime',type:'datetime', default: parseTime(new Date())
        //   },
        // ],

      }
    },
    // created () {
    //   this.tableHeader = [
    //     { prop: 'itemCode',
    //       label: '物料编码',
    //       width:150,
    //     },{ prop: 'itemName',
    //       label: '物料名称',
    //       minWidth:200,
    //     },{ prop: 'specification',
    //       label: '规格型号',
    //       width:100,
    //     },{ prop: 'itemUnit',
    //       label: '单位',
    //       width:80,
    //     },{ prop: 'factoryCode',
    //       label: '工厂编码',
    //       width:100,
    //     },{ prop: 'warehouseCode',
    //       label: '仓库编码',
    //       width:100,
    //     },{ prop: 'batchCode',
    //       label: '批次号',
    //       width:100,
    //     },{ prop: 'timeQuantity',
    //       label: '时间点库存量',
    //       width:100,
    //     },{ prop: 'quantity',
    //       label: '现有库存量',
    //       width:100,
    //     },{ prop: 'comments',
    //       label: '备注',
    //       minWidth:150,
    //     },
    //   ];
    //   this.$nextTick(()=>{
    //     // this.getQuerydata()
    //   })
    // },
    methods: {
      // getQuerydata(v){
      //   this.queryParam = v;
      //   if(!v || !v.rollbackTime) {
      //     this.$message.info('请先选择回滚时间！')
      //     return;
      //   }
      //   this.$nextTick(()=>{
      //     this.$refs[this.gridId].query();
      //   })
      // },
      // queryOne () {
      //
      // },
      // queryList () {
      //   // debugger
      //   // this.$refs[this.gridId].query();
      // },
      // handleCurrentChange (val) {
      //   this.currentRow = val
      // },
      // selectionChange (val) {},

      // 导出
      exportData () {
        // if(!this.queryParam || !this.queryParam.rollbackTime) {
        //   this.$message.info('请先选择回滚时间！')
        //   return;
        // }
        let condition = this.$refs['magicalTable'].getCondition();
        downloadFileLink('/pss/member/inventory/history/export', '历史库存.xls', condition ||{}).catch(() => {
          this.$message.error('下载失败')
        })
      },


      getDict() {
        return new Promise(resolve => {
          this.getDictByCodes(
            [
              'PSS_UNIT',
            ],
            () => {
              resolve();
            }
          )
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
        let params = {...condition, pageSize: this.block.pagination.pageSize, pageNo: this.block.pagination.pageNum};
        let url = '/pss/member/inventory/history';
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
            this.$nextTick(() =>{
              this.$refs['magicalTable'].$refs['mQuery'].collapse = false;
            });
          }
        }).catch(() => {
          this.block.loading = false;
        });
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
      }
    },
    mounted() {
      // this.getDict();
      this.queryQuickList({_quickKey: 'factory_display' ,preQueryData: {}}).then(res => {
        if(res.length === 1) {
          this.block.form.formData[1].value = res[0].factoryCode;
          this.$refs['magicalTable'].setInputByName('factory_display', res[0].factoryCode);
        }
        this.onSearch();
      });
    }
  }
</script>
<style scoped lang="scss">

</style>
