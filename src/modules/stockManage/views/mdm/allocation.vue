<template>
  <el-container class="flex-container-notab the_instock_wrapper"  direction="vertical">
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
          <el-button
            type="primary"
            size="mini"
            @click="editTab('add')"
          >
            {{$t('common.add')}}
          </el-button>
          <el-button
            size="mini"
            @click="exportOne"
          >
            {{$t('common.export')}}
          </el-button>
          <el-button
            size="mini"
            @click="batchCancel"
          >
            {{$t('common.cancel')}}
          </el-button>
        </template>
      </main-header>
      <table-view
        :ref="gridId"
        :table-data="tableData"
        :table-header="tableHeader"
        :checkbox="true"
        :checkChange="getCheckedData"
        :current-change="handleCurrentChange"
        :page-size="pageSize"
        :preQueryData="queryParam"
        url="/pss/member/allocation/list"
      />
<!--      弹框区域-->
      <el-dialog title="库存调拨单管理" :visible.sync="dialogFormVisible" v-el-drag-dialog :close-on-click-modal="false" :close-on-press-escape="false" width="1000px">
          <div class="flex-container-notab" style="height: 333px">
              <el-row class="the_first_row">
                <el-col :span="8">
                  <span style="padding-right: 11px;">调拨单号</span>
                  <el-input v-model="form.allocationNum" disabled style="width:222px"/>
                </el-col>
                <el-col :span="8">
                  <span style="padding-right: 11px;float:left;line-height: 32px;">调出工厂</span>
                  <div style="display: inline-block">
                      <QuickSearch
                          :showInput="form.outFactoryCode"
                          show-key="outFactoryCode"
                          :scope-data="form"
                          name="factory_display"
                          @close-quicksearch="getOutFacObj"
                        />
                  </div>
                  
                </el-col>
                <el-col :span="8">
                  <span style="padding-right: 11px;float:left;line-height: 32px;">调入工厂</span>
                  <div style="display: inline-block">
                      <QuickSearch
                          :showInput="form.inFactoryCode"
                          show-key="inFactoryCode"
                          :scope-data="form"
                          name="factory_display"
                          @close-quicksearch="getinFacObj"
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
            <el-table :data="tableData2" style="width: 100%"  border height="112px">
              <el-table-column type="index" width="50"/>
              <!-- <el-table-column align="center" prop="outFactoryId" label="调出工厂" width="150">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.outFactoryId" :disabled="isReadOnly">
                    <el-option
                      v-for="item in factoryList"
                      :key="item.factoryId"
                      :label="item.factoryCode"
                      :value="item.factoryId"/>
                  </el-select>
                </template>
              </el-table-column> -->
              <el-table-column align="center" prop="outWarehouseId" label="调出仓库" width="150">
                <!-- <template slot-scope="scope">
                  <el-select v-model="scope.row.outWarehouseId" :disabled="isReadOnly">
                    <el-option
                      v-for="item in warehouseList"
                      :key="item.warehouseId"
                      :label="item.warehouseCode"
                      :value="item.warehouseId"/>
                  </el-select>
                </template> -->
                <template slot-scope="scope">
                  <QuickSearch :preQueryData="{'t.FACTORY_ID': form.outFactoryId}"
                    :disabled="isReadOnly"
                    :showInput="scope.row.outWarehouseCode"
                    show-key="outWarehouseCode"
                    :scope-data="scope.row"
                    name="warehouse_display"
                    @close-quicksearch="getOutWarehouseObj"
                  />
                </template>
              </el-table-column>
              <!-- <el-table-column align="center" prop="inFactoryId" label="调入工厂" width="150">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.inFactoryId" :disabled="isReadOnly">
                    <el-option
                      v-for="item in factoryList"
                      :key="item.factoryId"
                      :label="item.factoryCode"
                      :value="item.factoryId"/>
                  </el-select>
                </template>
              </el-table-column> -->
              <el-table-column align="center" prop="inWarehouseId" label="调入仓库" width="150">
                <!-- <template slot-scope="scope">
                  <el-select v-model="scope.row.inWarehouseId" :disabled="isReadOnly" @change="getWarehouseBatch(scope)">
                    <el-option
                      v-for="item in warehouseList"
                      :key="item.warehouseId"
                      :label="item.warehouseCode"
                      :value="item.warehouseId"/>
                  </el-select>
                </template> -->
                <template slot-scope="scope">
                  <QuickSearch :preQueryData="{'t.FACTORY_ID': form.inFactoryId}"
                    :disabled="isReadOnly"
                    :showInput="scope.row.inWarehouseCode"
                    show-key="inWarehouseCode"
                    :scope-data="scope.row"
                    name="warehouse_display"
                    @close-quicksearch="getInWarehouseObj"
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
                  </el-select> -->
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
              <el-table-column align="center" prop="itemName" label="物料名称" min-width="150">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.itemName" disabled />
                </template>
              </el-table-column>
              <el-table-column align="center" prop="itemUnit" label="单位" width="80">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.itemUnit" disabled />
                </template>
              </el-table-column>
              <!-- <el-table-column align="center" prop="outBatchCode" label="调出批次号" width="100">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.outBatchCode" :disabled="isReadOnly"/>
                </template>
              </el-table-column> -->
              <el-table-column align="center" prop="outBatchCode" label="调出批次号" width="150">
                <template slot-scope="scope">
                  <QuickSearch :preQueryData="{'t.ITEM_CODE': scope.row.itemCode, 't.WAREHOUSE_CODE': scope.row.outWarehouseCode}"
                    :disabled="isReadOnly || !scope.row.itemCode || !scope.row.outWarehouseCode"
                    :showInput="scope.row.outBatchCode"
                    show-key="batchCode"
                    :scope-data="scope.row"
                    name="inventory_display2"
                    @close-quicksearch="getBatchObj"
                  />
                </template>
              </el-table-column>
              <el-table-column align="center" prop="inBatchCode" label="调入批次号" width="100">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.inBatchCode" :disabled="isReadOnly"/>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="quantity" label="数量" width="100">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.quantity" type="number" />
                </template>
              </el-table-column>
              <el-table-column align="center" prop="comments" label="备注" width="150">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.comments" :disabled="isReadOnly"/>
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
                <el-button  size="mini" @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="closeDialog">确定</el-button>
              </template>
            </main-header>
          </div>
      </el-dialog>

    </el-main>
  </el-container>
</template>
<script>
import QuickSearch from "lib@/components/QuickSearch";
import MImport from "lib@/components/import";
  import TableView from 'lib@/components/Table/TableView'
  import MainHeader from 'lib@/components/Table/MainHeader';
  import TableEdit from 'lib@/components/Table/TableEdit'
  import FormWrapper from 'lib@/components/Table/FormWrapper'
  import {parseTime, transformData} from '@/utils'
  import { downloadFileLink } from '@/utils/file'

  export default {
    name: 'allocation',
    components: {
      TableView,MainHeader,TableEdit, FormWrapper, MImport,QuickSearch
    },
    data () {
      return {
        iModal: {
          title: "导入",
          extraData:{},
          upLoadUrl: "/pss/member/allocation/import",
          upLoadResultUrl: "/pss/member/allocation/import/result",
        },
        name: '',
        description: '',
        gridData: [],
        pageSize: 15,
        gridId: 'list',
        selectList: [],
        currentRow: null,
        showFilterBar: 1,
        tableHeader: [],
        tableData: [],
        warehouseList:[],
        factoryList:[],
        unitList:[],
        itemList:[],
        statusList:[],
        queryParam:{},
        isReadOnly: false,
        preArr:[
          {label:'调拨单号',prop:'allocationNum'},
          {label:'创建日期',prop:'createDateTimeFrom', type:'date'},
          {label:'至',prop:'createDateTimeTo', type:'date'},
          {label:'调入工厂',prop:'inFactoryId'},
          {label:'调入仓库',prop:'inWarehouseId'},
          {
            label: "物料编码",
            prop: "itemCode",
            type: "quicksearch",
            showKey: "itemCode",
            name: "item_display",
            propExt: "itemId",  
          },
          {label:'调出工厂',prop:'outFactoryId'},
          {label:'调出仓库',prop:'outWarehouseId'},
          {label:'批次号',prop:'batchCode'},
          {label:'状态',prop:'status'},
          {
            label: "过滤取消单据",
            prop: "filterCancelledOrders",
            default: 'Y',
            type: 'checkbox',
            trueLabel: 'Y',
            falseLabel: 'N'
          }
        ],
        dialogFormVisible: false,
        formLabelWidth: '100px',
        isActive: false,
        // 弹框专用数据
        tableData2:[],
        form:{
          "allocationNum" : "",
          "allocationLines": "",
          outFactoryId:"",
          outFactoryCode:"",
          inFactoryId:"",
          inFactoryCode:"",
        }
      }
    },
    created () {
      this.tableHeader = [
        { prop: 'allocationNum',
          label: '调拨单号',
          sortable: true,
          width:120,
        },{ prop: 'outWarehouseCode',
          label: '调出仓库',
          sortable: true,
          width:100,
        },{ prop: 'inWarehouseCode',
          label: '调入仓库',
          sortable: true,
          width:100,
        },{ prop: 'itemCode',
          label: '物料编码',
          sortable: true,
          width:150,
        },{ prop: 'itemName',
          label: '物料名称',
          sortable: true,
          width:200,
        },{ prop: 'itemUnit',
          label: '单位',
          sortable: true,
          width:85,
        },{ prop: 'outBatchCode',
          label: '调出批次号',
          sortable: true,
          width:120,
        },{ prop: 'inBatchCode',
          label: '调入批次号',
          sortable: true,
          width:120,
        },{ prop: 'quantity',
          label: '数量',
          sortable: true,
          width:85,align:'right'
        },{ prop: 'actualOutQuantity',
          label: '实际调出数量',
          sortable: true,
          width:130,align:'right'
        },{ prop: 'actualInQuantity',
          label: '实际调入数量',
          sortable: true,
          width:130,align:'right'
        },{ prop: 'comments',
          label: '备注',
          sortable: true,
          width:100,
        },{ prop: 'creationDate',
          label: '创建时间',
          sortable: true,
          width:140,
          formattor(val){
            return val ?parseTime(val):''
          }
        },{ prop: 'createdBy',
          label: '创建人',
          sortable: true,
          width:100,
        },{ prop: 'status',
          label: '状态',
          sortable: true,
          width:100,
        },{ prop: 'operation',
          label: '操作',editType: 'none',fixed:'right',
          width: 60,
          showType: 'button',
          btnStyle: 'text',
          callback: function (row) {
            this.currentRow = row
            this.editTab()
          }.bind(this),
          formattor (val) {
            return '编辑'
          },
          show: function (row) {
            if (row.status === '完成') {
              return false
            } else {
              return true
            }
          }
        },
      ];
      this.getStatus();
      this.getItemList();
      this.getUnitList();
      this.getFactoryList();
      this.getWarehouseList();
      this.$nextTick(()=>{
        this.getQuerydata({filterCancelledOrders: 'Y'})
      })
    },
    methods: {
      getQuerydata(v){
        this.queryParam = v;
        this.$nextTick(()=>{
          this.$refs[this.gridId].query();
        })
      },
      getStatus() {
        // 获取状态
        this.$http({
          url: '/pss/member/dict/item/byDictCode?dictCode=' + "PSS_ALLOCATION_STATUS",
          method: 'GET',
          data: {}
        }).then(data => {
          if (data && data.success) {
            this.statusList = data.data;
            this.$set(this.preArr,9,{
              label:'状态',prop:'status',type:'select',
              options: transformData(data.data,['dictItemCode','dictItemName'])
            })
          }
        }).catch(err => {
          console.log(err)
        })
      },
      // 行删除---
      handleDelClick (index, row) {
        if (row.allocationLinesId) {
          this.$confirm('确认删除吗？', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http({
              url: '/pss/member/allocation/line',
              method: 'DELETE',
              params: {
                allocationHeaderId: row.allocationHeaderId,
                allocationLinesId: row.allocationLinesId,
              },
              loading:true
            }).then(data => {
              if (data && data.success) {
                this.$message.success('删除成功');
                this.dialogFormVisible = false;
                this.getQuerydata({filterCancelledOrders: 'Y'})
              }
            }).catch(err => {
              console.log(err)
            })
          }).catch(() => {})
        } else {
          this.tableData2.splice(index, 1)
        }
      },
      getFactoryList(){
        this.$http({
          url: '/pss/member/factory/base',
          method: 'GET',
          data: {}
        }).then(data => {
          if (data && data.success) {
            this.factoryList = data.data;
            this.$set(this.preArr,3,{
              label:'调入工厂',prop:'inFactoryId',type:'select',
              options: transformData(data.data,['factoryId','factoryCode'])
            })
            this.$set(this.preArr,6,{
              label:'调出工厂',prop:'outFactoryId',type:'select',
              options: transformData(data.data,['factoryId','factoryCode'])
            })
          }
        }).catch(err => {
          console.log(err)
        })
      },
      getWarehouseList(){
        this.$http({
          url: '/pss/member/warehouse/base',
          method: 'GET',
          data: {}
        }).then(data => {
          if (data && data.success) {
            this.warehouseList = data.data;
            // this.$set(this.preArr,4,{
            //   label:'调入仓库',prop:'inWarehouseId',type:'select',
            //   options: transformData(data.data,['warehouseId','warehouseCode'])
            // })
            // this.$set(this.preArr,7,{
            //   label:'调出仓库',prop:'outWarehouseId',type:'select',
            //   options: transformData(data.data,['warehouseId','warehouseCode'])
            // })
          }
        }).catch(err => {
          console.log(err)
        })
      },
      getItemObj(val, scope) {
        scope.itemId = val ? val.itemId : "";
        scope.itemCode = val ? val.itemCode : "";
        scope.itemName = val ? val.itemName : "";
        scope.itemUnit = val ? val.itemUnit : "";
      },
      getoneItem(scope){
        if(scope.row.itemId && this.itemList.length && this.itemList.filter(v=>v.itemId==scope.row.itemId)) {
          scope.row.itemName = this.itemList.filter(v=>v.itemId==scope.row.itemId)[0].itemName
          scope.row.itemUnit = this.itemList.filter(v=>v.itemId==scope.row.itemId)[0].itemUnit
        }
      },
      getWarehouseBatch(scope){
        let targetRow = this.warehouseList.filter(v=>v.warehouseId==scope.row.inWarehouseId)[0]
        if(targetRow.batchCode =='YES') {
          this.$message.info(`该仓库${targetRow.warehouseCode}已启用批次，请填写批次号！`);
          scope.row.warehouseCode = targetRow.warehouseCode;
          scope.row.requireBatchCode = true;
        } else {
          scope.row.requireBatchCode = false;
        }
      },
      getItemList(){
        this.$http({
          url: '/pss/member/items/base',
          method: 'GET',
          data: {}
        }).then(data => {
          if (data && data.success) {
            this.itemList = data.data;
            /* this.$set(this.preArr,5,{
              label:'物料编码',prop:'itemId',type:'select',
              options: transformData(data.data,['itemId','itemCode'])
            }) */
          }
        }).catch(err => {
          console.log(err)
        })
      },
      getUnitList() {
        // 获取单位
        this.$http({
          url: '/pss/member/dict/item/byDictCode?dictCode=' + "PSS_UNIT",
          method: 'GET',
          data: {}
        }).then(data => {
          if (data && data.success) {
            this.unitList = data.data;
          }
        }).catch(err => {
          console.log(err)
        })
      },
      // 编辑tab
      editTab(type) {
        let tab = {};
        if (type == "add") {
          // 新增
          this.isReadOnly = false;
          this.tableData2 =[]
          this.form.allocationNum = 'DB' +parseTime(new Date(),'{y}{m}{d}') + String(Math.random()).slice(2,6);
        } else {
          // 修改
          this.isReadOnly =true;
          this.form.allocationNum = this.currentRow.allocationNum;
          if(this.itemList.length>0 && this.itemList.filter(v=>v.itemCode==this.currentRow.itemCode)) {
            this.currentRow.itemId = this.itemList.filter(v=>v.itemCode==this.currentRow.itemCode)[0].itemId
          }
          if(this.warehouseList.length>0 && this.warehouseList.filter(v=>v.warehouseCode==this.currentRow.inWarehouseCode)) {
            this.currentRow.inWarehouseId = this.warehouseList.filter(v=>v.warehouseCode==this.currentRow.inWarehouseCode)[0].warehouseId
          }
          if(this.warehouseList.length>0 && this.warehouseList.filter(v=>v.warehouseCode==this.currentRow.outWarehouseCode)) {
            this.currentRow.outWarehouseId = this.warehouseList.filter(v=>v.warehouseCode==this.currentRow.outWarehouseCode)[0].warehouseId
          }
          if(this.factoryList.length>0 && this.factoryList.filter(v=>v.factoryCode==this.currentRow.outFactoryCode)) {
            this.currentRow.outFactoryId = this.factoryList.filter(v=>v.factoryCode==this.currentRow.outFactoryCode)[0].factoryId
          }
          if(this.factoryList.length>0 && this.factoryList.filter(v=>v.factoryCode==this.currentRow.inFactoryCode)) {
            this.currentRow.inFactoryId = this.factoryList.filter(v=>v.factoryCode==this.currentRow.inFactoryCode)[0].factoryId
          }
          this.tableData2 = [this.currentRow];
        }
        this.dialogFormVisible = true;
      },
      exportOne () {
        downloadFileLink('/pss/member/allocation/export', '调拨单报表.xls', this.queryParam ||{}).catch(() => {
          this.$message.error('下载失败')
        })
      },
      uploadSuccess(val){
        this.getQuerydata({filterCancelledOrders: 'Y'})
      },
      downloadTemplate() {    // 下载模板
        downloadFileLink('/pss/member/allocation/template' , parseTime(new Date()) +'_导出.xls' ).catch(() => {
          this.$message.error('下载失败')
        })
      },
      handleCurrentChange (val) {
        this.currentRow = val
      },
      getCheckedData(val){
        this.selectList = val.slice(0);
      },
      batchCancel(){
        if(this.selectList.length ===0) {
          this.$message.error('请选择数据！')
            return
        }
        for(let i of this.selectList) {
          if(i.status !=='拟定') {
            this.$message.error('只有拟定状态的可以取消！')
            return
          }
        }
        let allocationHeaderIds = this.selectList.map(v=>v.allocationHeaderId);
        this.$http({
          url: '/pss/member/allocation/cancel',
          method: 'POST',
          data: {allocationHeaderIds: allocationHeaderIds}
        }).then(data => {
          if (data && data.success) {
            this.$message.success('保存成功');
            this.getQuerydata({filterCancelledOrders: 'Y'})
          }
        }).catch(err => {
          console.log(err)
        })
      },
      addOne(){
        if (!this.form.outFactoryCode) {
          this.$message.info("请先选择调出工厂");
          return;
        }
        if (!this.form.inFactoryCode) {
          this.$message.info("请先选择调入工厂");
          return;
        }
        this.tableData2.push({
          lineSeq: this.editIndex++,
          status:'NEW_ORDER',
          itemId:'',
          itemName:'',
          itemUnit:'',
          // inFactoryId:'',
          // outFactoryId:'',
          inWarehouseId:'',
          outWarehouseId:'',
          outWarehouseCode:'',
          inWarehouseCode:'',
          outBatchCode:'',
          inBatchCode:'',
          quantity:'',
          comments:'',
        })
      },
      getOutFacObj(val, scope) {
        scope.outFactoryId = val ? val.factoryId : "";
        scope.outFactoryCode = val ? val.factoryCode : "";
      },
      getinFacObj(val, scope) {
        scope.inFactoryId = val ? val.factoryId : "";
        scope.inFactoryCode = val ? val.factoryCode : "";
      },
      getOutWarehouseObj(val, scope) {
        scope.outWarehouseId = val ? val.warehouseId : "";
        scope.outWarehouseCode = val ? val.warehouseCode : "";
        if (!val) {
          scope.outBatchCode = '';
          scope.quantity = '';
        }
      },
      getInWarehouseObj(val, scope) {
        scope.inWarehouseId = val ? val.warehouseId : "";
        scope.inWarehouseCode = val ? val.warehouseCode : "";
      },
      getBatchObj(val, scope) {
        scope.outBatchCode = val ? val.batchCode : "";
        scope.quantity = val ? val.quantity : "";
      },
      closeDialog(){
        if(this.tableData2.length <1) return;
        let url ='', methodType = '', params ={};
        if(this.isReadOnly) {
          // 修改模式-
          url = '/pss/member/allocation/modify';
          methodType = 'POST';
          // params = {
          //   version: this.currentRow.version,
          //   quantity: this.tableData2[0].quantity,
          //   allocationLinesId: this.tableData2[0].allocationLinesId,
          // }
          params = {
            "allocationHeaderId" : this.currentRow.allocationHeaderId,
            "allocationLines" : [{
              version: this.tableData2[0].version,
              quantity: this.tableData2[0].quantity,
              allocationLinesId: this.tableData2[0].allocationLinesId,
            }]
          }
        } else {
          for(let i of this.tableData2){
            if(i.requireBatchCode && !i.batchCode) {
              this.$message.info(`该仓库${i.warehouseCode}已启用批次，请填写批次号！`);
              return;
            }
          }
          this.form.allocationLines = this.tableData2;
          url = '/pss/member/allocation';
          methodType = 'PUT';
          params =this.form;
        }
        this.$http({
          url: url,
          method: methodType,
          data: params,
          loading:true
        }).then(data => {
          if (data && data.success) {
            this.dialogFormVisible = false
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            this.$refs[this.gridId].query();
          }
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
</script>
<style scoped lang="scss">
  .the_instock_wrapper{
    .el-dialog__header {
      border-bottom: 1px solid #eee !important;
    }
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
