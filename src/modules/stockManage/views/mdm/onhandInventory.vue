<template>
  <el-container class="flex-container-notab the_instock_wrapper" direction="vertical">
    <el-main>
      <form-wrapper :formArray="preArr" @getFormData="getQuerydata" />

      <main-header>
        <template slot="left">
          <el-button type="primary" size="mini" @click="exportData">{{$t('common.export')}}</el-button>
          <el-button type="primary" size="mini" @click="handlePush">同步</el-button>
        </template>
      </main-header>
      <table-view
        :ref="gridId"
        :table-data="tableData"
        :table-header="tableHeader"
        :preQueryData="queryParam"
        :page-size="pageSize"
        url="/pss/member/inventory/list"
      />
    </el-main>
  </el-container>
</template>
<script>
import TableView from "lib@/components/Table/TableView";
import MainHeader from "lib@/components/Table/MainHeader";
import FormWrapper from "lib@/components/Table/FormWrapper";
import { downloadFileLink } from "@/utils/file";
import { parseTime, transformData } from "@/utils";

export default {
  name: "onhandInventory",
  components: {
    TableView,
    MainHeader,
    FormWrapper
  },
  data() {
    return {
      pageSize: 15,
      gridId: "list",
      tableHeader: [],
      tableData: [],
      preArr: [
        { 
          label:'工厂编码',
          prop:'factoryCode',
          type: "quicksearch",
          showKey: "factoryCode",
          name: "factory_display",
          propExt:'factoryId',
         },
        {
          label:'仓库编码',
          prop: "warehouseCode",
          type: "quicksearch",
          showKey: "warehouseCode",
          name: "warehouse_display",
          propExt: "warehouseId",
        },
        { 
          label: "物料编码",
          prop: "itemCode",
          type: "quicksearch",
          showKey: "itemCode",
          name: "item_display",
          propExt: "itemId",
        },
        {
          label:'同步状态',
          prop:'gscPushStatus',
          type:'select',
          options: []
        },
      ],
      queryParam: {},
      dict: { PSS_GSC_PUSH_STATUS: [] }
    };
  },
  created() {
    let _this = this;
    this.tableHeader = [
      { prop: "itemCode", label: "物料编码", width: 150, align: 'center' },
      { prop: "itemName", label: "物料名称", minWidth: 280, align: 'center' },
      { prop: "specification", label: "规格型号", width: 100, align: 'center' },
      { prop: "itemUnit", label: "单位", width: 60, align: 'center' },
      { prop: "factoryName", label: "工厂", width: 100, align: 'center' },
      { prop: "warehouseName", label: "仓库", width: 100, align: 'center' },
      { prop: "batchCode", label: "批次号", width: 100, align: 'center' },
      { prop: "quantity", label: "数量", width: 100, align: 'center'},
      {
        prop: "gscPushStatus",
        label: "同步状态",
        width: 100,
        align: 'center',
        formattor(val) {
          return _this.$getLabelByValue(_this.dict.PSS_GSC_PUSH_STATUS, val, 'label', 'value')
        }
      },
      { prop: "gscPushResult", label: "同步信息", width: 100, align: 'center'},
      // {
      //   prop: "",
      //   label: "操作",
      //   width: 80,
      //   fixed: 'right',
      //   align: 'center',
      //   showType: 'button',
      //   btnStyle: 'text',
      //   formattor(row, col){
      //     return '同步信息'
      //   },
      //   callback: (row) => {
      //     this.handlePush(row);
      //   }
      // },
      /*{ prop: 'cusItemCode',
          label: '客户物料编码',
          width:150,
        },{ prop: 'cusItemName',
          label: '客户物料名称',
          width:150,
        },*/
    ];
    this.getDict();
    this.getItemList();
    this.getFactoryList();
    this.getWarehouseList();
    // this.getWarehouseClassifyList();
    this.$nextTick(() => {
      this.getQuerydata();
    });
  },
  methods: {
    getQuerydata(v) {
      this.queryParam = v;
      this.$nextTick(() => {
        this.$refs[this.gridId].query();
      });
    },
    exportData() {
      downloadFileLink(
        "/pss/member/inventory/export",
        "库存现有量.xls",
        this.queryParam || {}
      ).catch(() => {
        this.$message.error("下载失败");
      });
    },
    getFactoryList() {
      this.$http({
        url: "/pss/member/factory/base",
        method: "GET",
        data: {}
      })
        .then(data => {
          if (data && data.success) {
            // this.factoryList = data.data;
            /* this.$set(this.preArr, 0, {
              label: "工厂编码",
              prop: "factoryId",
              type: "select",
              options: transformData(data.data, ["factoryId", "factoryCode"])
            }); */
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
            // this.warehouseList = data.data;
            /* this.$set(this.preArr, 1, {
              label: "仓库编码",
              prop: "warehouseId",
              type: "select",
              options: transformData(data.data, [
                "warehouseId",
                "warehouseCode"
              ])
            }); */
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getWarehouseClassifyList() {
      // 获取仓库分类
      this.$http({
        url: "/pss/member/dict/item/byDictCode?dictCode=" + "PSS_WAREHOUSE_CLASSIFY",
        method: "GET",
        data: {}
      })
        .then(data => {
          if (data && data.success) {
            // this.warehouseClassifyList = data.data;
            /*this.$set(this.preArr,3,{
              prop: 'warehouseClassify', label: '仓库分类',type:'select',
              options: transformData(data.data,['dictItemCode','dictItemName'])
            })*/
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
            // this.itemList = data.data;
            /* this.$set(this.preArr, 2, {
              label: "物料编码",
              prop: "itemId",
              type: "select",
              options: transformData(data.data, ["itemId", "itemCode"])
            }); */
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getDict() {
      this.getDictByCodes(
        [
          'PSS_GSC_PUSH_STATUS',
        ],
        () => {
          this.preArr[3].options = this.dict['PSS_GSC_PUSH_STATUS'];
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
    // 同步
    handlePush(row) {
      this.$confirm(`是否同步？`, `提示`,{
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.push(row);
      })
    },
    push() {
      let url = '/pss/member/inventory/pushToGSC';
      this.$http({
        url,
        loading: true,
      }).then(res => {
        if(res.success){
          this.$message.success('同步成功！');
          this.getQuerydata();
        }
      })
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
</style>
