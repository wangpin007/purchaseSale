<template>
  <el-container class="flex-container-notab the_instock_wrapper"  direction="vertical">
    <el-main>
        <form-wrapper :formArray="preArr" @getFormData="getQuerydata" />

      <main-header>
        <template slot="left">
          <el-button
            type="primary"
            size="mini"
            @click="exportData"
          >
            {{$t('common.export')}}
          </el-button>
        </template>
      </main-header>
      <table-view
        :ref="gridId"
        :table-data="tableData"
        :table-header="tableHeader"
        :page-size="pageSize"
        :preQueryData="queryParam"
        url="/pss/member/transactional/items/list" />

    </el-main>
  </el-container>
</template>
<script>
  import TableView from 'lib@/components/Table/TableView'
  import MainHeader from 'lib@/components/Table/MainHeader';
  import FormWrapper from 'lib@/components/Table/FormWrapper'
  import { downloadFileLink } from "@/utils/file";
  import {parseTime, transformData} from '@/utils'
  export default {
    name: 'warehouseDetail',
    components: {
      TableView,MainHeader, FormWrapper
    },
    data () {
      return {
        name: '',
        description: '',
        gridData: [],
        pageSize: 15,
        gridId: 'list',
        selectList: [],
        currentRow: null,
        showFilterBar: 1,
        tableHeader: [],
        transcationTypeList: [],
        tableData: [],
        queryParam: {},
        preArr:[
          {label:'事物处理类型',prop:'transactionType'},
          {label:'物料凭证',prop:'transactionNum'},
          {label:'单据号',prop:'businessNum'},
          {label:'生产订单',prop:'prodOrder'},
          {label:'采购订单',prop:'poNum'},
          {label:'销售订单',prop:'saleOrderNum'},
          {label:'成本中心',prop:'costCenter'},
          {
            label: "物料编码",
            prop: "itemCode",
            type: "quicksearch",
            showKey: "itemCode",
            name: "item_display",
          },
          {
            label:'工厂编码',
            prop:'factoryCode',
            type: "quicksearch",
            showKey: "factoryCode",
            name: "factory_display",
          },
          {
            label:'仓库编码',
            prop: "warehouseCode",
            type: "quicksearch",
            showKey: "warehouseCode",
            name: "warehouse_display",
          },
          {label:'创建人',prop:'createdBy'},
          {label:'创建时间',prop:'creationDate',type:'date'},
        ],
      }
    },
    created () {
      this.tableHeader = [
        { prop: 'transactionType',
          label: '事务处理类型',
          width:120,
        },{ prop: 'transactionNum',
          label: '物料凭证',
          width:100,
        },{ prop: 'businessNum',
          label: '单据号',
          width:100,
        },{ prop: 'lineSeq',
          label: '行号',
          width:100,
        },{ prop: 'prodOrder',
          label: '生产订单',
          width:100,
        },{ prop: 'costCenter',
          label: '成本中心',
          width:100,
        },{ prop: 'poNum',
          label: '采购订单',
          width:100,
        },{ prop: 'prdetail',
          label: '采购订单行',
          width:120,
        },{ prop: 'saleOrderNum',
          label: '销售订单',
          width:100,
        },{ prop: 'saleLineId',
          label: '销售订单行',
          width:120,
        },{ prop: 'itemCode',
          label: '物料编码',
          width:150,
        },{ prop: 'itemName',
          label: '物料名称',
          minWidth:200,
        },{ prop: 'specification',
          label: '规格型号',
          width:100,
        },{ prop: 'itemUnit',
          label: '单位',
          width:80,
        },{ prop: 'batchCode',
          label: '批次号',
          width:100,
        },{ prop: 'warehouseCode',
          label: '仓库',
          width:100,
        },{ prop: 'quantity',
          label: '数量',
          width:100,
        },{ prop: 'creationDate',
          label: '录入日期',
          width:100,
          formattor(val) {
            return val ? parseTime(val, "{y}-{m}-{d}") : "";
          }
        },{ prop: 'createdBy',
          label: '录入人',
          width:100,
        },{ prop: 'comments',
          label: '备注',
          width:100,
        },
      ];
      this.$nextTick(() => {
        this.getQuerydata();
      });
      this.getCostCenterList();
      this.getTranscationType();
    },
    methods: {
      getCostCenterList() {
        // 成本中心
        this.$http({
          url: '/pss/member/dict/item/byDictCode?dictCode=' + "PSS_COST_CENTER",
          method: 'GET',
          data: {}
        }).then(data => {
          if (data && data.success) {
            // this.transcationTypeList = data.data;
            this.$set(this.preArr,6,{
              label:'成本中心',prop:'costCenter',type:'select',
              options: transformData(data.data,['dictItemCode','dictItemName'])
            })
          }
        }).catch(err => {
          console.log(err)
        })
      },
      getTranscationType() {
        // 获取事务处理类型
        this.$http({
          url: '/pss/member/dict/item/byDictCode?dictCode=' + "PSS_TRANSACTION_TYPE",
          method: 'GET',
          data: {}
        }).then(data => {
          if (data && data.success) {
            this.transcationTypeList = data.data;
            this.$set(this.preArr,0,{
              label:'事物处理类型',prop:'transactionType',type:'select',
              options: transformData(data.data,['dictItemCode','dictItemName'])
            })
          }
        }).catch(err => {
          console.log(err)
        })
      },
      queryList () {
        // debugger
        // this.$refs[this.gridId].query();
      },
      getQuerydata(v) {
        this.queryParam = v;
        this.$nextTick(() => {
          this.$refs[this.gridId].query();
        });
      },
      exportData () {
        downloadFileLink( "/pss/member/transactional/items/export",
          "出入库明细.xls",
          this.queryParam || {}
        ).catch(() => {
          this.$message.error("下载失败");
        });
      },
    }
  }
</script>
<style scoped lang="scss">
  .the_instock_wrapper{
    .el-dialog__header {
      border-bottom: 1px solid #eee !important;
    }
  }
</style>
