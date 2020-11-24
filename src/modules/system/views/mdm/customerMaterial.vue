<template>
  <el-container class="flex-container-notab the_customerMaterial_wrapper" direction="vertical">
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
          <el-button type="primary" size="mini" @click="editTab('add')">{{$t('common.add')}}</el-button>
        </template>
      </main-header>
      <table-view
        :ref="gridId"
        :table-data="tableData"
        :table-header="tableHeader"
        :current-change="handleCurrentChange"
        :page-size="pageSize"
        :preQueryData="queryParam"
        url="/pss/member/items/relation/list"/>
      <!--      弹框区域-->
      <el-dialog
        title="客户物料管理"
        :visible.sync="dialogFormVisible"
        v-el-drag-dialog
        :close-on-click-modal="false"
      >
        <el-form
          ref="form"
          :model="form"
          class="form-incontainer"
          :rules="rules"
          :show-message="false"
          label-width="80px"
          label-position="top"
        >
          <el-row type="flex">
            <el-col>
              <el-form-item label="物料编码" :label-width="formLabelWidth" prop="itemCode">
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
                <el-input v-model="form.itemName" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col>
              <el-form-item label="物料单位" :label-width="formLabelWidth" prop="itemUnit">
                <el-input v-model="form.itemUnit" disabled />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="客户物料单位" :label-width="formLabelWidth">
                <el-input v-model="form.cusItemUnit" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col>
              <el-form-item label="客户编码" :label-width="formLabelWidth" prop="customerCode">
                <!-- <el-select v-model="form.customerCode" @change="getCustomerId">
                  <el-option
                    v-for="item in customerList"
                    :key="item.customerCode"
                    :label="item.customerCode"
                    :value="item.customerCode"
                  ></el-option>
                </el-select> -->
                <QuickSearch
                  :showInput="form.customerCode"
                  show-key="customerCode"
                  :scope-data="form"
                  name="psi_base_customer"
                  @close-quicksearch="getCustomerObj"
                />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="客户库存组织编码" :label-width="formLabelWidth">
                <el-input v-model="form.cusOrgCode" disabled/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col>
              <el-form-item label="客户物料编码" :label-width="formLabelWidth" prop="cusItemCode">
                <el-input v-model="form.cusItemCode" />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="客户物料名称" :label-width="formLabelWidth" prop="cusItemName">
                <el-input v-model="form.cusItemName" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col>
              <el-form-item label="生效时间" :label-width="formLabelWidth" prop="enableDatetime">
                <el-date-picker v-model="form.enableDatetime" type="datetime" placeholder="选择日期" />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="失效时间" :label-width="formLabelWidth" prop="disableDatetime">
                <el-date-picker v-model="form.disableDatetime" type="datetime" placeholder="选择日期" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addOne">确 定</el-button>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>
<script>
import MImport from "lib@/components/import";
import { downloadFileLink } from "@/utils/file";
import QuickSearch from "lib@/components/QuickSearch";
import TableView from "lib@/components/Table/TableView";
import MainHeader from "lib@/components/Table/MainHeader";
import FormWrapper from "lib@/components/Table/FormWrapper";
import { parseTime, transformData } from "@/utils";

export default {
  name: "customerMaterial",
  components: {
    TableView,
    MainHeader,
    FormWrapper,
    QuickSearch, MImport
  },
  data() {
    return {
      iModal: {
        title: "导入",
        extraData:{},
        upLoadUrl: "/pss/member/items/relation/import",
        upLoadResultUrl: "/pss/member/items/relation/import/result",
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
      isModify: false,
      form: {
        relationId: "",
        itemId: "",
        itemCode: "",
        itemName: "",
        customerId: "",
        customerCode: "",
        cusItemCode: "",
        cusItemName: "",
        enableDatetime: "",
        disableDatetime: "",
        cusOrgCode: "",
        itemUnit: '',
        cusItemUnit: ''
      },
      rules: {
        itemCode: [{ required: true, message: "请输入物料编码" }],
        customerCode: [{ required: true, message: "请输入客户编码" }],
        cusItemCode: [{ required: true, message: "请输入客户物料编码" }],
        cusItemName: [{ required: true, message: "请输入客户物料名称" }],
        enableDatetime: [{ required: true, message: "请输入状态" }],
        disableDatetime: [{ required: true, message: "请输入状态" }]
      },
      dialogFormVisible: false,
      formLabelWidth: "100px",
      isActive: false,
      preArr: [
        {
          label: "物料编码",
          prop: "itemCode",
          type: "quicksearch",
          showKey: "itemCode",
          name: "item_display"
        },
        { prop: "customerCode", label: "客户编码" },
        { prop: "cusItemCode", label: "客户物料编码" }
      ],
      customerList: [],
      itemList: [],
      queryParam: {}
    };
  },
  created() {
    this.tableHeader = [
      { prop: "itemCode", label: "物料编码", width: 150 },
      { prop: "itemName", label: "物料名称", width: 200 },
      { prop: "itemUnit", label: "物料单位", width: 100 },
      { prop: "customerCode", label: "客户编码", width: 150 },
      { prop: "cusItemCode", label: "客户物料编码", width: 150 },
      { prop: "cusItemName", label: "客户物料名称", minWidth: 200 },
      { prop: "cusItemUnit", label: "客户物料单位", minWidth: 100 },
      {
        prop: "creationDate",
        label: "创建时间",
        width: 150,
        formattor(val) {
          return val ? parseTime(val) : "";
        }
      },
      {
        prop: "enableDatetime",
        label: "生效时间",
        width: 150,
        formattor(val) {
          return val ? parseTime(val) : "";
        }
      },
      {
        prop: "disableDatetime",
        label: "失效时间",
        width: 150,
        formattor(val) {
          return val ? parseTime(val) : "";
        }
      },
      {
        prop: "operation",
        label: "操作",
        width: 70,
        fixed: "right",
        showType: "buttons",
        btnStyle: "text",
        buttons: [
          {
            callback: function(row) {
              this.editTab("edit", row);
            }.bind(this),
            btnStyle: "text",
            formattor(val) {
              return "修改";
            }
          }
          /* {
              callback: function(row){
                this.deleteOne(row);
              }.bind(this),
              btnStyle: 'text',
              formattor(val){
                return '删除'
              }
            }, */
        ]
      }
    ];
    this.getCustomer();
    this.getMaterial();
    this.$nextTick(() => {
      this.getQuerydata();
    });
  },
  methods: {
    getCustomer() {
      // 获取客户信息
      this.$http({
        url: "/pss/member/customer/list",
        method: "POST",
        data: { pageNo: 1, pageSize: 100000 }
      })
        .then(data => {
          if (data && data.success) {
            this.customerList = data.data.list;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getMaterial() {
      // 获取物料信息
      this.$http({
        url: "/pss/member/items/list",
        method: "POST",
        data: { pageNo: 1, pageSize: 100000 }
      })
        .then(data => {
          if (data && data.success) {
            this.itemList = data.data.list;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getQuerydata(v) {
      this.queryParam = v;
      this.$nextTick(() => {
        this.$refs[this.gridId].query();
      });
    },
    // 编辑tab
    editTab(type, row) {
      if (type == "add") {
        // 新增
        for (let i in this.form) {
          this.form[i] = "";
        }
        this.isModify = false;
        this.form.enableDatetime = new Date().getTime();
        this.form.disableDatetime = new Date().setFullYear(2030);
      } else {
        // 修改
        for (let i in this.form) {
          this.form[i] = row[i];
        }
        this.isModify = true;
        //
        /* if (this.customerList.filter(v => v.customerCode == this.form.customerCode)) {
          this.form.cusOrgCode = this.customerList.filter(
            v => v.customerCode == this.form.customerCode
          )[0]
            ? this.customerList.filter(v => v.customerCode == this.form.customerCode)[0].cusOrgCode
            : "";
        } */
      }
      this.dialogFormVisible = true;
    },
    addOne() {
      //验证form表单
      this.$refs.form.validate(valid => {
        if (valid) {
          // =====
          // this.form.enableDatetime = parseTime(this.form.enableDatetime);
          // this.form.disableDatetime = parseTime(this.form.disableDatetime);
          let url = "",
            methodType = "",
            params = {};
          if (this.isModify) {
            // 修改模式
            url = "/pss/member/items/relation/modify";
            methodType = "POST";
            params = {
              relationId: this.form.relationId,
              itemId: this.form.itemId,
              // itemCode: this.form.itemCode,
              // itemUnit: this.form.itemUnit,
              customerId: this.form.customerId,
              // customerCode: this.form.customerCode,
              cusItemCode: this.form.cusItemCode,
              cusItemName: this.form.cusItemName,
              // cusItemUnit: this.form.cusItemUnit,
              enableDatetime: parseTime(this.form.enableDatetime),
              disableDatetime: parseTime(this.form.disableDatetime)
            };
          } else {
            url = "/pss/member/items/relation";
            methodType = "PUT";
            params = {
              itemId: this.form.itemId,
              itemCode: this.form.itemCode,
              itemUnit: this.form.itemUnit,
              customerId: this.form.customerId,
              customerCode: this.form.customerCode,
              cusItemCode: this.form.cusItemCode,
              cusItemName: this.form.cusItemName,
              cusItemUnit: this.form.cusItemUnit,
              enableDatetime: parseTime(this.form.enableDatetime),
              disableDatetime: parseTime(this.form.disableDatetime)
            };
          }
          // this.form.factoryId有值就是修改模式---否则为新增
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
        } else {
          return false;
        }
      });
    },
    uploadSuccess(val){
      this.getQuerydata()
    },
    downloadTemplate() {    // 下载模板
      downloadFileLink('/pss/member/items/relation/template' , parseTime(new Date()) +'_导出.xls' ).catch(() => {
        this.$message.error('下载失败')
      })
    },
    getItemObj(val, scope) {
      scope.itemId = val ? val.itemId : "";
      scope.itemCode = val ? val.itemCode : "";
      scope.itemName = val ? val.itemName : "";
      scope.itemUnit = val ? val.itemUnit : "";
      scope.cusItemUnit = val ? val.itemUnit : "";
    },
    getCustomerObj(val, scope) {
      scope.customerId = val ? val.customerId : "";
      scope.customerCode = val ? val.customerCode : "";
      scope.cusOrgCode = val ? val.cusOrgCode : "";
    },
    deleteOne(row) {
      this.$confirm(this.$t("common.delRow"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning"
      })
        .then(() => {
          let addStr = "?relationId=" + row.relationId;
          this.$http({
            url: "/pss/member/items/relation" + addStr,
            method: "DELETE",
            data: {},
            loading: true
          })
            .then(data => {
              if (data && data.success) {
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.$refs[this.gridId].query();
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {});
    },
    getCustomerCode(val) {
      if (val && this.itemList.filter(v => v.itemCode == val)) {
        this.form.itemId = this.itemList.filter(v => v.itemCode == val)[0]
          ? this.itemList.filter(v => v.itemCode == val)[0].itemId
          : "";
        this.form.itemName = this.itemList.filter(v => v.itemCode == val)[0]
          ? this.itemList.filter(v => v.itemCode == val)[0].itemName
          : "";
      }
    },
    getCustomerId(val) {
      if (val && this.customerList.filter(v => v.customerCode == val)) {
        this.form.customerId = this.customerList.filter(
          v => v.customerCode == val
        )[0]
          ? this.customerList.filter(v => v.customerCode == val)[0].customerId
          : "";
      }
    },

    handleCurrentChange(val) {
      this.currentRow = val;
    }
  }
};
</script>
<style scoped lang="scss">
</style>
