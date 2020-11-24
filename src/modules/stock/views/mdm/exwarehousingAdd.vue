<template>
  <el-container class="flex-container the_exwarehousingAdd_wrapper" direction="vertical">
    <el-main>
      <el-row style="padding: 11px;">
        <el-col :span="6">
          <el-button type="primary" size="mini" @click="addOne" :disabled="isReadOnly">新增</el-button>
          <el-button type="primary" size="mini" @click="closeDialog">保存</el-button>
          <el-button type="primary" size="mini" @click="printBill">打印</el-button>
        </el-col>
        <el-col :span="6">
          <span style="padding-right: 11px;">出库类型</span>
          <el-select v-model="form.exwarehousingType" @change="getType" filterable :disabled="isReadOnly">
            <el-option
              v-for="item in billTypeList"
              :key="item.id"
              :label="item.dictItemName"
              :value="item.dictItemCode"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <span style="padding-right: 11px;">出库单号</span>
          <el-input v-model="form.exwarehousingNum" disabled style="width: 150px;" />
        </el-col>
        <el-col :span="6">
          <span style="padding-right: 11px;float:left;line-height: 32px;">工厂</span>
          <div style="display: inline-block">
              <!--<QuickSearch-->
                      <!--:showInput="form.factoryCode"-->
                      <!--show-key="factoryCode"-->
                      <!--:scope-data="form"-->
                      <!--name="factory_display"-->
                      <!--@close-quicksearch="getFacObj"-->
                    <!--/>-->
            <el-select v-model="form.factoryCode" @change="getWarehouseList" filterable :disabled="isReadOnly">
              <el-option
                v-for="(item, i) in factoryList"
                :key="i"
                :label="item.factoryName"
                :value="item.factoryCode"
              >
                <el-row style="width: 300px;">
                  <el-tooltip effect="dark" :content="item.factoryName" placement="top-start">
                    <el-col :span="17" style="overflow: hidden; padding: 0 5px">
                      {{ item.factoryName }}
                    </el-col>
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="item.factoryCode" placement="top-start">
                    <el-col :span="7" style="overflow: hidden; padding: 0 5px">
                      {{ item.factoryCode }}
                    </el-col>
                  </el-tooltip>
                </el-row>
              </el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>

      <!--出库单录入-->
      <el-table :data="tableData" style="width: 100%" border height="112px">
        <el-table-column align="center" type="index" width="50" />
        <el-table-column
          align="center"
          prop="prodOrder"
          label="生产订单"
          width="150"
          v-if="form.exwarehousingType=='PRODUCT_PICKING'"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row.prodOrder" :disabled="isReadOnly" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="costCenter"
          label="成本中心"
          width="150"
          v-if="form.exwarehousingType=='COST_CENTER_OUT'"
        >
          <template slot-scope="scope">
            <el-select v-model="scope.row.costCenter" :disabled="isReadOnly">
              <el-option
                v-for="item in costList"
                :key="item.id"
                :label="item.dictItemName"
                :value="item.dictItemCode"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="saleOrderNum"
          label="销售订单"
          width="150"
          v-if="form.exwarehousingType=='SEAL_ORDER_OUT'"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row.saleOrderNum" :disabled="isReadOnly" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="saleLineId"
          label="销售订单行"
          width="150"
          v-if="form.exwarehousingType=='SEAL_ORDER_OUT'"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row.saleLineId" type="number" :disabled="isReadOnly" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="itemId" label="物料编码" width="150">
          <template slot-scope="scope">
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
          width="150"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="itemUnit"
          label="单位"
          width="80"
          :formatter="(row) => {return this.$getLabelByValue(this.unitList, row.itemUnit)}"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="customerCode"
          label="客户编码"
          width="150"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.customerId"
              :disabled="isReadOnly"
              @change="getCustomerInfo(scope)"
            >
              <el-option
                v-for="item in customerList"
                :key="item.customerId"
                :label="item.customerCode"
                :value="item.customerId"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="customerName"
          label="客户名称"
          width="150"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="cusOrg"
          label="客户库存组织"
          width="150"
          :show-overflow-tooltip="true"
        />
        <el-table-column align="center" prop="warehouseId" label="仓库" width="150">
          <template slot-scope="scope">
            <!--<QuickSearch :preQueryData="{'t.FACTORY_ID': form.factoryId}"-->
              <!--:disabled="isReadOnly"-->
              <!--:showInput="scope.row.warehouseCode"-->
              <!--show-key="warehouseCode"-->
              <!--:scope-data="scope.row"-->
              <!--name="warehouse_display"-->
              <!--@close-quicksearch="getWarehouseObj"-->
            <!--/>-->
            <el-select v-model="scope.row.warehouseCode" @change="warehouseChange(scope.row)" filterable>
              <el-option
                v-for="(item, i) in warehouseList"
                :key="i"
                :label="item.warehouseName"
                :value="item.warehouseCode"
              >
                <el-row style="width: 300px;">
                  <el-col :span="17">
                    {{ item.warehouseName }}
                  </el-col>
                  <el-col :span="7">
                    {{ item.warehouseCode }}
                  </el-col>
                </el-row>
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="batchCode" label="批次号" width="150">
          <template slot-scope="scope">
            <QuickSearch :preQueryData="{'t.ITEM_CODE': scope.row.itemCode, 't.WAREHOUSE_CODE': scope.row.warehouseCode}"
              :disabled="isReadOnly || !scope.row.itemCode || !scope.row.warehouseCode"
              :showInput="scope.row.batchCode"
              show-key="batchCode"
              :scope-data="scope.row"
              name="inventory_display2"
              @close-quicksearch="getBatchObj"
            />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="quantity" label="数量" width="100">
          <template slot-scope="scope">
            <el-input v-model="scope.row.quantity" type="number" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="comments" label="备注" width="100">
          <template slot-scope="scope">
            <el-input v-model="scope.row.comments" :disabled="isReadOnly" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="60">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDelClick(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- page -->
      <el-row type="flex" v-if="isReadOnly">
        <el-col>
          <c-pagination
            ref="queryPagination"
            style="margin: 2px;padding:2px"
            class="c-query-table-pagination"
            :total="queryTotal"
            :page-num="viewIndex"
            :page-size="viewSize"
            @current-change="changeCurrentIndex"
            @size-change="changeCurrentSize"
          />
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>
<script>
import QuickSearch from "lib@/components/QuickSearch";
import { tabTodoMixin } from "@/utils/mixins";
import MainHeader from "lib@/components/Table/MainHeader";
import { parseTime, transformData } from "@/utils";
import { downloadFileLink } from "@/utils/file";
import CPagination from "lib@/components/c-pagination";

export default {
  name: "exwarehousingAdd",
  components: {
    MainHeader,
    QuickSearch,CPagination
  },
  mixins: [tabTodoMixin],
  data() {
    return {
      queryTotal: -1,
      viewSize: 10,
      viewIndex: 1,
      tableData: [],
      customerList: [],
      initcustomerList: [],
      allcustomerList: [],
      itemList: [],
      costList: [],
      batchList: [],
      warehouseList: [],
      billTypeList: [],
      unitList: [],
      factoryList: [], // 工厂
      // 弹框专用数据
      editIndex: 1,
      isSelectd: false,
      isReadOnly: false,
      form: {
        factoryId: "",
        factoryCode: "",
        exwarehousingNum: "",
        exwarehousingType: "",
        exWarehousingLines: []
      }
    };
  },
  created() {

    this.getDict().then(res => {
      if(!res.some(i => !i)){
        if (this.$attrs.params.flag == "edit") {
          this.isReadOnly = true;
          this.getDetail();
        };
      }
    });
    // this.getCostList();
    // this.getItemList();
    // this.getBillType();

    // this.getWarehouseList();
    // this.getUnitList();
    // this.getallCustomer();
    // this.getCustomerList();
  },
  methods: {
    getDict(){
      return Promise.all([
        this.getFactoryList(),
        this.getItemList(),
        this.getBillType(),
        this.getUnitList(),
        this.getCostList(),
        this.getCustomerList(),
        this.getallCustomer()
      ]);
    },
    // 改变 currentNum
    changeCurrentIndex(currentNum) {
      this.viewIndex =currentNum;
      this.getDetail()
    },
    // 改变 currentSize
    changeCurrentSize(currentSize) {
      this.viewSize =currentSize;
      this.getDetail()
    },
    getDetail() {
      this.$http({
        url: "/pss/member/exwarehousing/list",
        method: "POST",
        data: { 
          exwarehousingNum: this.$attrs.params.row.exwarehousingNum,
          pageSize: this.viewSize,
          pageNo: this.viewIndex 
        },
        loading: true
      })
        .then(data => {
          if (data && data.success) {
            this.queryTotal = data.data.total;
            this.form.exWarehousingLines = data.data.list;
            this.form.exwarehousingNum = data.data.list[0].exwarehousingNum;
            this.form.exwarehousingType = this.billTypeList.filter(
              v => v.dictItemName == data.data.list[0].exwarehousingType
            )[0].dictItemCode;
            this.form.factoryCode = data.data.list[0].factoryCode;
            this.getWarehouseList(this.form.factoryCode).then(() => {
              this.$nextTick(() => {
                this.tableData = data.data.list;
              });
            });
            // if (this.billTypeList.length > 0) {
            //   this.form.exwarehousingType = this.billTypeList.filter(
            //     v => v.dictItemName == this.tableData[0].exwarehousingType
            //   )[0].dictItemCode;
            // }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    getItemList() {
      return new Promise(resolve => {
        this.$http({
          url: "/pss/member/items/base",
          method: "GET",
          data: {}
        })
          .then(data => {
            if (data && data.success) {
              this.itemList = data.data;
              resolve(true)
            }
          })
          .catch(err => {
            console.log(err);
          });
      })
    },
    // 获取出库单类型
    getBillType() {
      return new Promise(resolve => {
        this.$http({
          url: "/pss/member/dict/item/byDictCode?dictCode=" + "PSS_EXWAREHOUSING_TYPE",
          method: "GET",
          data: {}
        })
          .then(data => {
            if (data && data.success) {
              this.billTypeList = data.data;
              if (
                this.tableData.length > 0 &&
                this.tableData[0].exwarehousingType &&
                this.billTypeList.filter(
                  v => v.dictItemName == this.tableData[0].exwarehousingType
                )
              ) {
                this.form.exwarehousingType = this.billTypeList.filter(
                  v => v.dictItemName == this.tableData[0].exwarehousingType
                )[0].dictItemCode;
              }
              resolve(true);
            }
          })
          .catch(err => {
            console.log(err);
          });
      });
    },
    // 获取单位
    getUnitList() {
      return new Promise(resolve => {
        this.$http({
          url: "/pss/member/dict/item/byDictCode?dictCode=" + "PSS_UNIT",
          method: "GET",
          data: {}
        })
          .then(data => {
            if (data && data.success) {
              this.unitList = data.data;
              resolve(true);
            }
          })
          .catch(err => {
            console.log(err);
          });
      });
    },
    // 获取成本中心下拉值
    getCostList() {
      return new Promise(resolve => {
        this.$http({
          url: "/pss/member/dict/item/byDictCode?dictCode=" + "PSS_COST_CENTER",
          method: "GET",
          data: {}
        })
          .then(data => {
            if (data && data.success) {
              this.costList = data.data;
              resolve(true);
            }
          })

      });
    },
    // 获取仓库
    getWarehouseList(e) {
      return new Promise(resolve => {
        this.form.factoryId = this.factoryList.find(i => i.factoryCode === e).factoryId;
        let url = "/pss/member/warehouse/base";
        let params = {
          factoryId: this.form.factoryId
        };
        this.$http(url, {params}).then(data => {
          if (data && data.success) {
            // if(this.$attrs.params.flag == "edit"){
            //   this.warehouseList = data.data;
            // }else{
            //   this.warehouseList = data.data.filter(i => i.disableDatetime >(new Date().getTime()));
            // }
            this.warehouseList = data.data;
            resolve();
          }
        })
          .catch(err => {
            console.log(err);
          });
      });
    },
    // 获取工厂
    getFactoryList() {
      return new Promise(resolve => {
        let url = "/pss/member/factory/base";
        this.$http(url).then(data => {
          if (data && data.success) {
            this.factoryList = data.data;
            if (this.factoryList.length === 1) {
              this.$nextTick(() => {
                this.form.factoryCode = this.factoryList[0].factoryCode;
                this.getWarehouseList(this.form.factoryCode);
              });
            }
            resolve(true);
          }
        })
          .catch(err => {
            console.log(err);
          });
      });
    },
    addOne() {
      if (!this.form.exwarehousingType) {
        this.$message.info("请先选择出库类型");
        return;
      }
      if (!this.form.factoryCode) {
        this.$message.info("请先选择工厂");
        return;
      }
      // if (this.tableData.length >= 10) return;
      let warehouseId = '';
      let warehouseCode = '';
      if(this.warehouseList.length === 1) {
        warehouseCode = this.warehouseList[0].warehouseCode;
        warehouseId = this.warehouseList[0].warehouseId;
      }
      this.tableData.push({
        lineSeq: this.editIndex++,
        status: "NEW_ORDER",
        itemId: "",
        itemCode: "",
        itemName: "",
        itemUnit: "",
        warehouseId,
        warehouseCode,
        batchCode: "",
        quantity: "",
        comments: "",
        customerId: "",
        customerName: "",
        cusOrg: ""
      });
    },
    delOne() {
      //
    },
    getType(val) {
      this.isSelectd = true;
      this.form.exwarehousingNum =
        "CK" +
        parseTime(new Date(), "{y}{m}{d}") +
        String(Math.random()).slice(2, 6);
    },
    // 获取所有的客户信息
    getallCustomer() {
      return new Promise(resolve => {
        this.$http({
          url: "/pss/member/customer/base",
          method: "POST",
          data: {}
        })
          .then(data => {
            if (data && data.success) {
              this.customerList = data.data;
              this.allcustomerList = data.data;
              resolve(true);
            }
          })
          .catch(err => {
            console.log(err);
          });
      });
    },
    // 获取物料对应的---客户的数据
    getCustomerList() {
      return new Promise(resolve => {
        this.$http({
          url: "/pss/member/items/relation/base",
          method: "GET",
          data: {}
        })
          .then(data => {
            if (data && data.success) {
              // this.customerList = data.data;
              this.initcustomerList = data.data;
              // this.customerList = data.data.filter(v=>v.itemCode==itemCodeVal)
              resolve(true);
            }
          })
          .catch(err => {
            console.log(err);
          });
      });
    },
    getFacObj(val, scope) {
        scope.factoryId = val ? val.factoryId : "";
        scope.factoryCode = val ? val.factoryCode : "";
      },    
    getBatchObj(val, scope) {
      scope.batchCode = val ? val.batchCode : "";
      scope.quantity = val ? val.quantity : "";
    },
    getWarehouseObj(val, scope) {
      scope.warehouseId = val ? val.warehouseId : "";
      scope.warehouseCode = val ? val.warehouseCode : "";
      scope.requireBatchCode = val && val.batchCode == "YES" ? true :false;
      if (!val) {
        scope.batchCode = '';
        scope.quantity = '';
      }
    },
    getItemObj(val, scope) {
      scope.itemId = val ? val.itemId : "";
      scope.itemCode = val ? val.itemCode : "";
      scope.itemName = val ? val.itemName : "";
      scope.itemUnit = val ? val.itemUnit : "";
      if (val) {
        this.customerList = this.initcustomerList.filter(
          v => v.itemCode == val.itemCode
        );
      } else {
        this.customerList = [];
        scope.batchCode = '';
        scope.quantity = '';
      }
    },
    getoneItem(scope) {
      if (
        this.itemList.length &&
        this.itemList.filter(v => v.itemId == scope.row.itemId)
      ) {
        scope.row.itemName = this.itemList.filter(
          v => v.itemId == scope.row.itemId
        )[0].itemName;
        scope.row.itemUnit = this.itemList.filter(
          v => v.itemId == scope.row.itemId
        )[0].itemUnit;
        let itemCodeVal = this.itemList.filter(
          v => v.itemId == scope.row.itemId
        )[0].itemCode;
        this.customerList = this.customerList.filter(
          v => v.itemCode == itemCodeVal
        );
      }
    },
    getCustomerInfo(scope) {
      if (
        this.customerList.length &&
        this.customerList.filter(v => v.customerId == scope.row.customerId)
      ) {
        scope.row.cusOrg = this.allcustomerList.filter(
          v => v.customerId == scope.row.customerId
        )
          ? this.allcustomerList.filter(
              v => v.customerId == scope.row.customerId
            )[0].cusOrg
          : "";
        scope.row.customerName = this.allcustomerList.filter(
          v => v.customerId == scope.row.customerId
        )
          ? this.allcustomerList.filter(
              v => v.customerId == scope.row.customerId
            )[0].customerName
          : "";
      }
    },
    getWarehouseBatch(scope) {
      let targetRow = this.warehouseList.filter(
        v => v.warehouseId == scope.row.warehouseId
      )[0];
      if (targetRow && targetRow.batchCode == "YES") {
        this.$message.info(
          `该仓库${targetRow.warehouseCode}已启用批次，请填写批次号！`
        );
        scope.row.warehouseCode = targetRow.warehouseCode;
        scope.row.requireBatchCode = true;
      } else {
        scope.row.requireBatchCode = false;
      }
    },
    reset() {
      this.tableData = [];
      for (let i in this.form) {
        this.form[i] = "";
      }
    },
    // 行删除---
    handleDelClick(index, row) {
      if (row.exwarehousingLinesId) {
        this.$confirm("确认删除吗？", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$http({
              url: "/pss/member/exwarehousing/line",
              method: "DELETE",
              params: {
                exwarehousingHeaderId: row.exwarehousingHeaderId,
                exwarehousingLinesId: row.exwarehousingLinesId
              }
            })
              .then(data => {
                if (data && data.success) {
                  this.$message.success("删除成功");
                  this.$emit(
                    "tab-remove",
                    "exwarehousingAdd" +
                      (this.$attrs.params.flag == "edit"
                        ? this.$attrs.params.row.exwarehousingNum
                        : "")
                  );
                  this.__setTabTodo("exwarehousingList.getQuerydata");
                }
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(() => {});
      } else {
        this.tableData.splice(index, 1);
      }
    },
    printBill() {},
    closeDialog() {
      if (this.tableData.length < 1) {
        this.$message.info(`请录入信息！`);
        return;
      }
      this.isSelectd = false;
      let url = "",
        methodType = "",
        params = {};
      if (this.isReadOnly) {
        // 修改模式-
        url = "/pss/member/exwarehousing/modify";
        methodType = "POST";
        let exWarehousingLines = [];
        for (let i of this.tableData) {
          exWarehousingLines.push({
            version: i.version,
            quantity: i.quantity,
            warehouseId: i.warehouseId,
            exwarehousingLinesId: i.exwarehousingLinesId
          });
        }
        params = {
          exwarehousingHeaderId: this.tableData[0].exwarehousingHeaderId,
          exWarehousingLines: exWarehousingLines
        };
      } else {
        if (!this.form.exwarehousingType) {
          this.$message.info(`请选择出库类型！`);
          return;
        }
        for (let i of this.tableData) {
          if (!i.itemId) {
            this.$message.info(`请选择物料信息！`);
            return;
          }
          if (!i.warehouseId) {
            this.$message.info(`请选择仓库信息！`);
            return;
          }
          if (!i.quantity) {
            this.$message.info(`请录入数量信息！`);
            return;
          }
          if (
            this.form.exwarehousingType == "PRODUCT_PICKING" &&
            !i.prodOrder
          ) {
            this.$message.info(`请录入生产订单！`);
            return;
          }
          if (
            this.form.exwarehousingType == "COST_CENTER_OUT" &&
            !i.costCenter
          ) {
            this.$message.info(`请录入成本中心！`);
            return;
          }
          if (
            this.form.exwarehousingType == "SEAL_ORDER_OUT" &&
            !i.saleOrderNum
          ) {
            this.$message.info(`请录入销售订单！`);
            return;
          }
          if (
            this.form.exwarehousingType == "SEAL_ORDER_OUT" &&
            !i.saleLineId
          ) {
            this.$message.info(`请录入销售订单行！`);
            return;
          }
          if (i.requireBatchCode && !i.batchCode) {
            this.$message.info(
              `该仓库${i.warehouseCode}已启用批次，请填写批次号！`
            );
            return;
          }
        }
        this.form.exWarehousingLines = this.tableData;
        url = "/pss/member/exwarehousing";
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
            this.$message.success("保存成功");
            this.$emit(
              "tab-remove",
              "exwarehousingAdd" +
                (this.$attrs.params.flag == "edit"
                  ? this.$attrs.params.row.exwarehousingNum
                  : "")
            );
            this.__setTabTodo("exwarehousingList.getQuerydata");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    warehouseChange(row){
      let warehouseId = this.$getLabelByValue(this.warehouseList, row.warehouseCode, 'warehouseId', 'warehouseCode');
      row.warehouseId = warehouseId;
    }
  }
};
</script>
<style scoped lang="scss">
.the_exwarehousingAdd_wrapper {
  .el-dialog__header {
    border-bottom: 1px solid #eee !important;
  }
}
</style>
