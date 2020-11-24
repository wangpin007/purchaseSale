<template>
  <el-container class="flex-container-notab the_inventory_wrapper" direction="vertical">
    <el-main>
      <form-wrapper :formArray="preArr" @getFormData="getQuerydata" />

      <main-header>
        <template slot="left">
          <el-button type="primary" size="mini" @click="editTab('add')">{{$t('common.add')}}</el-button>
        </template>
      </main-header>
      <table-view
        :ref="gridId"
        :table-data="tableData"
        :table-header="tableHeader"
        :current-change="handleCurrentChange"
        :preQueryData="queryParam"
        :page-size="pageSize"
        :show-filter-bar="showFilterBar == 1"
        url="/pss/member/customer/list"
        url-for-count="/isales-main/mstQuicksearchConfig/queryCount"
      />
      <!--      弹框区域-->
      <el-dialog
        title="客户管理"
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
              <el-form-item
                :label="$t('basisData.customerCode')"
                :label-width="formLabelWidth"
                prop="customerCode"
              >
                <el-input v-model="form.customerCode" :disabled="!!form.customerId" />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item
                :label="$t('basisData.customerName')"
                :label-width="formLabelWidth"
                prop="customerName"
              >
                <el-input v-model="form.customerName" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col>
              <el-form-item
                :label="$t('basisData.cusOrgCode')"
                :label-width="formLabelWidth"
                prop="cusOrgCode"
              >
                <el-input v-model="form.cusOrgCode" :disabled="!!form.customerId" />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item
                :label="$t('basisData.cusOrg')"
                :label-width="formLabelWidth"
                prop="cusOrg"
              >
                <el-input v-model="form.cusOrg" />
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
          <el-row type="flex">
            <el-col>
              <el-form-item label="是否允许推送GSC" :label-width="formLabelWidth">
                <el-checkbox v-model="form.allowPush" true-label="Y" false-label="N" @change="handleChange" />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="是否允许推送物料" :label-width="formLabelWidth">
                <el-checkbox v-model="form.allowPushAsl" true-label="Y" false-label="N" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">{{$t('common.cancel')}}</el-button>
          <el-button type="primary" @click="addOne">{{$t('common.confirm')}}</el-button>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>
<script>
import TableView from "lib@/components/Table/TableView";
import MainHeader from "lib@/components/Table/MainHeader";
import FormWrapper from "lib@/components/Table/FormWrapper";
import { parseTime, transformData } from "@/utils";

export default {
  name: "customer",
  components: {
    TableView,
    MainHeader,
    FormWrapper
  },
  data() {
    return {
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
      statusList: [],
      yesNoList: [],
      queryParam: {},
      form: {
        customerId: "",
        customerCode: "",
        customerName: "",
        cusOrg: "",
        cusOrgCode: "",
        enableDatetime: "",
        disableDatetime: "",
        allowPush: "",
        // allowPushGsc: "",
        allowPushAsl: ''
      },
      rules: {
        customerCode: [{ required: true, message: "请输入客户编码" }],
        customerName: [{ required: true, message: "请输入客户名称" }],
        cusOrg: [{ required: true, message: "请输入客户库存组织" }],
        cusOrgCode: [{ required: true, message: "请输入客户库存组织编码" }],
        enableDatetime: [{ required: true, message: "请输入状态" }],
        disableDatetime: [{ required: true, message: "请输入状态" }]
      },
      dialogFormVisible: false,
      formLabelWidth: "100px",
      isActive: false,
      preArr: [
        { prop: "customerCode", label: "客户编码" },
        { prop: "customerName", label: "客户名称" },
        { prop: "cusOrg", label: "客户库存组织" }
      ]
    };
  },
  created() {
    let _this = this;
    this.tableHeader = [
      {
        prop: "customerName",
        label: _this.$t("basisData.customerName"),
        minWidth: 150
      },
      {
        prop: "customerCode",
        label: _this.$t("basisData.customerCode"),
        width: 150
      },
      { prop: "cusOrg", width: 200, label: _this.$t("basisData.cusOrg") },
      {
        prop: "cusOrgCode",
        label: _this.$t("basisData.cusOrgCode"),
        width: 150
      },
      // {
      //   prop: "allowPushGsc",
      //   label: "是否允许推送GSC",
      //   width: 120,
      //   formattor: (val) => {
      //     return this.$getLabelByValue(this.yesNoList, val);
      //   }
      // },
      {
        prop: "allowPush",
        label: "是否允许推送GSC",
        width: 120,
        formattor(val){
          return _this.$getLabelByValue(_this.yesNoList, val);
        }
      },
      {
        prop: "allowPushAsl",
        label: "是否允许推送物料",
        width: 120,
        formattor(val){
          return _this.$getLabelByValue(_this.yesNoList, val);
        }
      },
      {
        prop: "creationDate",
        label: _this.$t("common.creationDate"),
        width: 150,
        formattor(val) {
          return val ? parseTime(val) : "";
        }
      },
      {
        prop: "enableDatetime",
        label: _this.$t("common.enableDateTime"),
        width: 150,
        formattor(val) {
          return val ? parseTime(val) : "";
        }
      },
      {
        prop: "disableDatetime",
        label: _this.$t("common.disableDateTime"),
        width: 150,
        formattor(val) {
          return val ? parseTime(val) : "";
        }
      },
      {
        prop: "operation",
        label: _this.$t("common.operation"),
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
              return _this.$t("common.edit");
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
    this.getStatus();
    this.getYesNO();
    this.$nextTick(() => {
      this.getQuerydata();
    });
  },
  methods: {
    getStatus() {
      // 获取状态
      this.$http({
        url: "/pss/member/dict/item/byDictCode?dictCode=" + "PSS_BASE_STATUS",
        method: "GET",
        data: {}
      })
        .then(data => {
          if (data && data.success) {
            this.statusList = data.data;
            // this.$set(this.preArr,5,{
            //   prop: 'status', label: '状态',type:'select',
            //   options: transformData(data.data,['dictItemCode','dictItemName'])
            // })
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getYesNO() {
      // 获取状态
      this.$http({
        url: "/pss/member/dict/item/byDictCode?dictCode=" + "COMMON_Y_N",
        method: "GET",
        data: {}
      })
        .then(data => {
          if (data && data.success) {
            this.yesNoList = data.data;
            // this.$set(this.preArr,5,{
            //   prop: 'status', label: '状态',type:'select',
            //   options: transformData(data.data,['dictItemCode','dictItemName'])
            // })
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
        // 新增---new Date().setYear(2030)
        for (let i in this.form) {
          this.form[i] = "";
        }
        this.form.allowPush = "N";
        this.form.allowPushAsl = "N";
        this.form.enableDatetime = new Date().getTime();
        this.form.disableDatetime = new Date().setFullYear(2030);
      } else {
        // 修改
        for (let i in this.form) {
          this.form[i] = row[i];
        }
      }
      this.dialogFormVisible = true;
    },
    deleteOne(row) {
      this.$confirm(this.$t("common.delRow"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning"
      })
        .then(() => {
          let addStr = "?customerId=" + row.customerId;
          this.$http({
            url: "/pss/member/customer" + addStr,
            method: "DELETE",
            data: {}
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
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    addOne() {
      //验证form表单
      this.$refs.form.validate(valid => {
        if (valid) {
          // ===== // this.form.customerId有值就是修改模式---否则为新增
          this.form.enableDatetime = parseTime(this.form.enableDatetime);
          this.form.disableDatetime = parseTime(this.form.disableDatetime);
          let url = this.form.customerId
            ? "/pss/member/customer/modify"
            : "/pss/member/customer";
          let methodType = this.form.customerId ? "POST" : "PUT";
          let mofifyForm = { customerId: this.form.customerId };
          if (this.form.customerId) {
            for (let i in this.form) {
              if (this.form[i] !== this.currentRow[i]) {
                mofifyForm[i] = this.form[i];
              }
            }
          }

          this.$http({
            url: url,
            method: methodType,
            data: this.form.customerId ? mofifyForm : this.form
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
    handleChange(val) {
      // if(val === 'Y'){
      //   this.rules.cusOrgCode[0].required = true;
      //   this.rules.cusOrg[0].required = true;
      // }else{
      //   this.rules.cusOrgCode[0].required = false;
      //   this.rules.cusOrg[0].required = false;
      // }
    }
  }
};
</script>
<style scoped lang="scss">
</style>
