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
        :page-size="pageSize"
        :show-filter-bar="showFilterBar == 1"
        :preQueryData="queryParam"
        url="/pss/member/factory/list"
        url-for-count="/isales-main/mstQuicksearchConfig/queryCount"
      />
      <!--      弹框区域-->
      <el-dialog
        title="工厂管理"
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
              <el-form-item label="工厂编码" :label-width="formLabelWidth" prop="factoryCode">
                <el-input v-model="form.factoryCode" :disabled="isDisabled" />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="工厂名称" :label-width="formLabelWidth" prop="factoryName">
                <el-input v-model="form.factoryName" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col>
              <el-form-item label="供应商编码" :label-width="formLabelWidth">
                <el-input v-model="form.vendorCode" />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="GSC密钥" :label-width="formLabelWidth">
                <el-input v-model="form.gscToken" />
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
import TableView from "lib@/components/Table/TableView";
import MainHeader from "lib@/components/Table/MainHeader";
import FormWrapper from "lib@/components/Table/FormWrapper";
import { parseTime, transformData } from "@/utils";

export default {
  name: "factory",
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
      form: {
        factoryId: "", //新增模式无---修改模式有factoryId
        factoryCode: "",
        factoryName: "",
        enableDatetime: "",
        disableDatetime: "",
        vendorCode: "",
        gscToken: ""
      },
      isDisabled: false,
      rules: {
        factoryCode: [{ required: true, message: "请输入工厂编码" }],
        factoryName: [{ required: true, message: "请输入工厂名称" }],
        enableDatetime: [{ required: true, message: "请输入生效时间" }],
        disableDatetime: [{ required: true, message: "请输入失效时间" }]
      },
      dialogFormVisible: false,
      formLabelWidth: "100px",
      isActive: false,
      preArr: [
        { prop: "factoryCode", label: "工厂编码" },
        { prop: "factoryName", label: "工厂名称" }
      ],
      queryParam: {}, //前置查询条件
      statusList: []
    };
  },
  created() {
    this.tableHeader = [
      { prop: "factoryCode", label: "工厂编码", width: 150 },
      { prop: "factoryName", label: "工厂名称", minWidth: 150 },
      { prop: "vendorCode", label: "供应商编码", width: 150 },
      { prop: "gscToken", label: "GSC密钥", width: 150 },
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
        showType: "buttons",
        btnStyle: "text",
        fixed: "right",
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
    this.getStatus();
    this.$nextTick(() => {
      this.getQuerydata();
    });
  },
  methods: {
    getStatus() {
      let addStr = "?dictCode=PSS_BASE_STATUS";
      this.$http({
        url: "/pss/member/dict/item/byDictCode" + addStr,
        method: "GET",
        data: {}
      })
        .then(data => {
          if (data && data.success) {
            this.statusList = data.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    addOne() {
      //验证form表单
      this.$refs.form.validate(valid => {
        if (valid) {
          // =====parseTime
          this.form.enableDatetime = parseTime(this.form.enableDatetime);
          this.form.disableDatetime = parseTime(this.form.disableDatetime);
          let url = this.form.factoryId
            ? "/pss/member/factory/modify"
            : "/pss/member/factory";
          let methodType = this.form.factoryId ? "POST" : "PUT";
          // this.form.factoryId有值就是修改模式---否则为新增
          this.$http({
            url: url,
            method: methodType,
            data: this.form,
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
        this.form.enableDatetime = new Date().getTime();
        this.form.disableDatetime = new Date().setFullYear(2030);
        this.isDisabled = false;
      } else {
        // 修改
        for (let i in this.form) {
          this.form[i] = row[i];
        }
        this.isDisabled = true;
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
          let addStr = "?factoryId=" + row.factoryId;
          this.$http({
            url: "/pss/member/factory" + addStr,
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
    handleCurrentChange(val) {
      this.currentRow = val;
    }
  }
};
</script>
<style scoped lang="scss">
</style>
