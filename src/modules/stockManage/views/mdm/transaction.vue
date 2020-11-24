<template>
  <el-container class="flex-container-notab the_instock_wrapper"  direction="vertical">
    <el-main>

      <main-header :lSpan="20" :rSpan="4" class="main-header">
        <template slot="left">
          <el-form ref="form" :model="form" class="form-incontainer" label-width="80px" label-position="top">
            <el-row type="flex">
              <el-col>
                <el-form-item label="事务处理类型" :label-width="formLabelWidth">
                  <el-select v-model="form.transactionListType" @change="queryByType">
                    <el-option
                      v-for="item in transactionList"
                      :key="item.id"
                      :label="item.dictItemName"
                      :value="item.dictItemCode">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="单据号" :label-width="formLabelWidth">
                  <el-input v-model="form.transactionNum" />
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="物料编码" :label-width="formLabelWidth">
                  <QuickSearch
                    :showInput="form.itemCode"
                    show-key="itemCode"
                    :scope-data="form"
                    name="item_display"
                    @close-quicksearch="getItemObj"
                  />
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="物料名称" :label-width="formLabelWidth">
                  <el-input v-model="form.itemName" disabled/>
                </el-form-item>
              </el-col>
              <el-col v-if="changeLabel">
                <el-form-item :label="changeLabel" :label-width="formLabelWidth">
                  <el-input v-model="form.order"/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </template>
        <template slot="right">
          <el-button type="primary" size="mini" @click="queryByType">查询</el-button>
          <el-button size="mini" @click="toTranscation" :disabled="isDisabled">过账</el-button>
        </template>
      </main-header>
      <el-button type="primary" style="width: 80px;" @click="handlerExport">导出</el-button>
      <el-table :data="tableData" ref="multipleTable" style="width: 100%"  border height="333" class="the_main_table" @select="selectClick" @selection-change="handleSelectionChange" @row-click="rowClick">
         <el-table-column align="center" type="index" label="序号" width="80"/>
         <el-table-column align="center" type="selection" width="55"/>
         <!-- <el-table-column :show-overflow-tooltip="true" prop="warehousingNum" label="单据号" width="150"/> -->
         <el-table-column :show-overflow-tooltip="true" prop="warehousingNum" label="入库单编号" width="150" v-if="form.transactionListType=='PRODUCT_WAREHOUSING' || form.transactionListType=='COSTCENTER_WAREHOUSING' || form.transactionListType=='PURCHASE_WAREHOUSING' || form.transactionListType=='RETURNED_WAREHOUSING'"/>
         <el-table-column :show-overflow-tooltip="true" prop="exwarehousingNum" label="出库单编号" width="150" v-if="form.transactionListType=='PRODUCT_EXWAREHOUSING' || form.transactionListType=='COST_CENTER_EXWAREHOUSING' || form.transactionListType=='SEAL_ORDER_EXWAREHOUSING' || form.transactionListType=='REJECTS_EXWAREHOUSING'"/>
         <el-table-column :show-overflow-tooltip="true" prop="differenceNum" label="盘点单编号" width="150" v-if="form.transactionListType=='DIFFERENCE'"/>
         <el-table-column :show-overflow-tooltip="true" prop="allocationNum" label="调拨单号" width="150" v-if="form.transactionListType=='ALLOCATION_IN' || form.transactionListType=='ALLOCATION_OUT'"/>
        <!-- 单据号根据类型进行动态切换字段 -->
         <el-table-column :show-overflow-tooltip="true" prop="prodOrder" label="生产订单" width="150" v-if="form.transactionListType=='PRODUCT_WAREHOUSING'"/>
         <el-table-column :show-overflow-tooltip="true" prop="costCenter" label="成本中心" width="150" v-if="form.transactionListType=='COSTCENTER_WAREHOUSING'"/>
         <el-table-column :show-overflow-tooltip="true" prop="poNum" label="采购订单" width="150" v-if="form.transactionListType=='PURCHASE_WAREHOUSING'"/>
         <el-table-column :show-overflow-tooltip="true" prop="prodOrder" label="生产订单领料" width="150" v-if="form.transactionListType=='PRODUCT_EXWAREHOUSING'"/>
         <el-table-column :show-overflow-tooltip="true" prop="costCenter" label="成本中心出库" width="150" v-if="form.transactionListType=='COST_CENTER_EXWAREHOUSING'"/>
         <el-table-column :show-overflow-tooltip="true" prop="saleOrderNum" label="销售订单出库" width="150" v-if="form.transactionListType=='SEAL_ORDER_EXWAREHOUSING'"/>
         <!--<el-table-column :show-overflow-tooltip="true" prop="saleOrderNum" label="不良品出库" width="150" v-if="form.transactionListType=='REJECTS_EXWAREHOUSING'"/>-->
         <!--<el-table-column :show-overflow-tooltip="true" prop="saleOrderNum" label="调拨出库" width="150" v-if="form.transactionListType=='ALLOCATION_OUT'"/>
         <el-table-column :show-overflow-tooltip="true" prop="saleOrderNum" label="调拨入库" width="150" v-if="form.transactionListType=='ALLOCATION_IN'"/>-->
         <el-table-column :show-overflow-tooltip="true" prop="historyInventory" label="历史库存查询" width="150" v-if="form.transactionListType=='ITEMS_CHARGE_OFF'"/>
         <el-table-column :show-overflow-tooltip="true" prop="itemCode" label="物料编码" width="150"/>
         <el-table-column :show-overflow-tooltip="true" prop="itemName" label="物料名称" min-width="150"/>
         <el-table-column :show-overflow-tooltip="true" prop="itemUnit" label="单位" width="60"/>
         <el-table-column :show-overflow-tooltip="true" prop="warehouseCode" label="仓库" width="100" v-if="form.transactionListType !=='ALLOCATION_IN' && form.transactionListType !=='ALLOCATION_OUT'"/>
         <el-table-column :show-overflow-tooltip="true" prop="inWarehouseCode" label="调入仓库" width="100" v-if="form.transactionListType=='ALLOCATION_IN' || form.transactionListType=='ALLOCATION_OUT'"/>
         <el-table-column :show-overflow-tooltip="true" prop="outWarehouseCode" label="调出仓库" width="100" v-if="form.transactionListType=='ALLOCATION_IN' || form.transactionListType=='ALLOCATION_OUT'"/>
         <el-table-column :show-overflow-tooltip="true" prop="batchCode" label="批次号" width="110" v-if="form.transactionListType !=='ALLOCATION_IN' && form.transactionListType !=='ALLOCATION_OUT'"/>
         <el-table-column :show-overflow-tooltip="true" prop="outBatchCode" label="调出批次号" width="110" v-if="form.transactionListType=='ALLOCATION_IN' || form.transactionListType=='ALLOCATION_OUT'"/>
         <el-table-column :show-overflow-tooltip="true" prop="inBatchCode" label="调入批次号" width="110" v-if="form.transactionListType=='ALLOCATION_IN' || form.transactionListType=='ALLOCATION_OUT'"/>
         <el-table-column :show-overflow-tooltip="true" align="right" prop="currentQuantity" label="当前库存量" width="100"/>
         <el-table-column :show-overflow-tooltip="true" align="right" prop="quantity" label="单据数量" width="80" v-if="form.transactionListType!=='DIFFERENCE'"/>
         <el-table-column :show-overflow-tooltip="true" align="right" prop="substanceAmount" label="单据数量" width="80" v-if="form.transactionListType==='DIFFERENCE'"/>
         <el-table-column :show-overflow-tooltip="true" prop="actualQuantity" label="实际数量" width="100">
          <template slot-scope="scope">
            <el-input v-model="scope.row.actualQuantity" type="number"/>
          </template>
         </el-table-column>

         <el-table-column :show-overflow-tooltip="true" prop="comments" label="备注" width="100"/>
      </el-table>
      <div style="padding:5px">{{ allTotal }}条数据</div>


    </el-main>
  </el-container>
</template>
<script>
import QuickSearch from "lib@/components/QuickSearch";
import MainHeader from 'lib@/components/Table/MainHeader';
import ElButton from "element-ui/packages/button/src/button";
import {downloadFileLink} from "@/utils/file";

  export default {
    name: 'transaction',
    components: {
      ElButton,
      MainHeader, QuickSearch
    },
    data () {
      return {
        transactionList:[],
        tableData:[],
        orderHeaderId:'',
        currentRow:'',
        multipleSelection:[],
        form:{
          itemCode:'',
          itemName:'',
          transactionNum:'',//单据号
          transactionListType:'',
          order: ''
        },
        formLabelWidth: '100px',
      }
    },
    computed:{
      isDisabled(){
        return this.multipleSelection.length ===0
      },
      allTotal(){
        return this.tableData.length
      },
      changeLabel () {
        let label = ''
        switch (this.form.transactionListType) {
          case 'PRODUCT_WAREHOUSING':
            label = '生产订单'
            break
          case 'COSTCENTER_WAREHOUSING':
            label = '成本中心'
            break
          case 'PURCHASE_WAREHOUSING':
            label = '采购订单'
            break
          case 'PRODUCT_EXWAREHOUSING':
            label = '生产订单领料'
            break
          case 'COST_CENTER_EXWAREHOUSING':
            label = '成本中心出库'
            break
          case 'SEAL_ORDER_EXWAREHOUSING':
            label = '销售订单出库'
            break
          case 'DIFFERENCE':
            label = ''
            this.form.order = ''
            break
          case 'ALLOCATION_IN':
            label = ''
            this.form.order = ''
            break
          case 'ALLOCATION_OUT':
            label = ''
            this.form.order = ''
            break
          case 'ITEMS_CHARGE_OFF':
            label = ''
            this.form.order = ''
            break
          default:
            label = ''
            this.form.order = ''
        }
        return label
      }
    },
    created () {
      this.getTranscationList().then(() => {
        if(this.$route.query.type){
          this.form.transactionListType = this.$route.query.type;
          this.queryByType();
        }

      });
    },
    methods: {
      // 获取状态
      getTranscationList() {
        return new Promise(resolve => {
          this.$http({
            url: '/pss/member/dict/item/byDictCode?dictCode=' + "PSS_TRANSACTION_TYPE",
            method: 'GET',
            data: {}
          }).then(data => {
            if (data && data.success) {
              this.transactionList = data.data;
              resolve();
            }
          }).catch(err => {
            console.log(err)
          })
        });

      },
      getType(v){
        console.log(v)
      },
      getItemObj(val, scope) {
        // scope.itemId = val ? val.itemId : "";
        scope.itemCode = val ? val.itemCode : "";
        scope.itemName = val ? val.itemName : "";
      },
      toTranscation(){
        let business = [];
        this.multipleSelection.map(item=>{
          let buessionHeadId,buessionLineId,actualQuantity;
          for(let i in item){
            if(i.endsWith('HeaderId')) buessionHeadId = item[i];
            if(i.endsWith('LinesId')) buessionLineId = item[i];
            actualQuantity = item['actualQuantity'];
          }
          business.push({
            buessionHeadId,
            buessionLineId,
            actualQuantity
          })
        })
        /* for(let i of this.multipleSelection){
          business.push({
            "buessionHeadId": i.warehousingHeaderId || i.exwarehousingHeaderId,
            "buessionLineId": i.warehousingLinesId || i.exwarehousingLinesId,
            "actualQuantity": i.actualQuantity
          })
        } */
        this.$confirm('确认过账吗？', {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          
          this.$http({
            url: '/pss/member/transactional/handle',
            method: 'POST',
            data:{
              "type": this.form.transactionListType,
              "business": business
            }
          }).then(data => {
            if (data && data.success) {
              // let qqq = data.data ||'';
              this.$message({
                message: `操作成功`,
                type: 'success'
              });
              this.queryByType()
            }
          }).catch(err => {
            console.log(err)
          })

        }).catch(()=>{
        })
      },
       queryByType(){
        if(!this.form.transactionListType) {
          this.$message.warning('请选择事务处理类型！')
          return
        }
         this.$http({
           url: '/pss/member/transactional/list',
           method: 'post',
           data: {
             type: this.form.transactionListType,
             num: this.form.transactionNum || '',
             itemCode: this.form.itemCode || '',
             order: this.form.order || '',
           },
           loading: true
         }).then(data => {
           if (data && data.success) {
             this.orderHeaderId = data.data.headerId;
             this.tableData =[];
             let resItems =[];
             let resKey='warehousingNum';
             switch (this.form.transactionListType) {
               case 'PRODUCT_WAREHOUSING':
                 resKey='warehousingNum';
                 resItems = data.data.productWarehousings
                 break
               case 'COSTCENTER_WAREHOUSING':
                 resKey='warehousingNum';
                 resItems = data.data.costCenterWarehousings
                 break
               case 'PURCHASE_WAREHOUSING':
                 resKey='warehousingNum';
                 resItems = data.data.purchaseWarehousings
                 break
               case 'PRODUCT_EXWAREHOUSING':
                 resKey='exwarehousingNum';
                 resItems = data.data.productExWarehousings
                 break
               case 'COST_CENTER_EXWAREHOUSING':
                 resKey='exwarehousingNum';
                 resItems = data.data.costCenterExWarehousings
                 break
               case 'SEAL_ORDER_EXWAREHOUSING':
                 resKey='exwarehousingNum';
                 resItems = data.data.sealOrderExWarehousings
                 break
               case 'DIFFERENCE':
                 resKey='differenceNum';
                 resItems = data.data.differences
                 break
               case 'ALLOCATION_IN':
                 resKey='allocationNum';
                 resItems = data.data.allocations
                 break
               case 'ALLOCATION_OUT':
                 resKey='allocationNum';
                 resItems = data.data.allocations
                 break
               case 'ITEMS_CHARGE_OFF':
                 resKey='allocationNum';
                 resItems = data.data.itemsChargeOffs
                 break
               case 'REJECTS_EXWAREHOUSING':
                 // resKey='rejectsExWarehousings';
                 resItems = data.data.rejectsExWarehousings
                 break
               case 'RETURNED_WAREHOUSING':
                 // resKey='rejectsExWarehousings';
                 resItems = data.data.returnedWarehousings
                 break
               default:
                 resItems = []
             }
             
             if(resItems && resItems.length !==0){
                // if(this.form.itemCode) {
                //   let filterArr1 = resItems.filter(v=>v.itemCode===this.form.itemCode).map(x=>x[resKey]);
                //   let emptyArr =[];
                //   for(let i=0;i<filterArr1.length;i++) {
                //     let keyitem = resItems.filter(x=>x[resKey] ===filterArr1[i]);
                //     emptyArr=emptyArr.concat(keyitem)
                //   }
                //   for(let j of emptyArr) {
                //     let item = Object.assign({actualQuantity:j.quantity || j.substanceAmount},j);
                //     this.tableData.push(item)
                //   }
                //   return
                // }else{
                  for(let i of resItems) {
                    let item = Object.assign({actualQuantity:i.quantity || i.substanceAmount ||0},i);
                    this.tableData.push(item)
                  }
                // }
             }
           }
         }).catch(err => {
           console.log(err)
         })
       },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      rowClick(val) {
        let rows = this.tableData.filter(v=>v.warehousingNum ===val.warehousingNum);
        this.toggleSelection(rows);
      },
      selectClick(select,val) {
        let rows = this.tableData.filter(v=>v.warehousingNum ===val.warehousingNum).filter(v=>v.warehousingLinesId !==val.warehousingLinesId);
        this.toggleSelection(rows);
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handlerExport(){
        if(!this.form.transactionListType) {
          this.$message.warning('请选择事务处理类型！')
          return
        }
        let params = {
          type: this.form.transactionListType,
          num: this.form.transactionNum || '',
          itemCode: this.form.itemCode || '',
          order: this.form.order || '',
        };
        downloadFileLink(
          "/pss/member/transactional/export",
          "库存事物处理.xls",
          params
        ).catch(() => {
          this.$message.error("下载失败");
        });
      }
    }
  }
</script>
<style scoped lang="scss">
  .the_instock_wrapper{
    .el-dialog__header {
      border-bottom: 1px solid #eee !important;
    }
    .the_main_table {
      margin: 5px 0;
    }
  }
  .the_instock_wrapper /deep/ .main-header{
    padding: 10px 10px 0;
    border-bottom: 1px solid #e6e9ec;
    margin-bottom: 5px;
  }
</style>
