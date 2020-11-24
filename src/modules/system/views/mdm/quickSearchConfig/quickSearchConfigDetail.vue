<template>
  <el-container class="flex-container the-quick-demo" direction="vertical">
    <el-main>
      <main-header class="no-side">
        <template slot="right">
          <el-button type="primary" size="mini" @click="submitOne">
            {{$t('common.save')}}
          </el-button>
          <el-button type="primary" size="mini" @click="resetOne">
            {{$t('common.reset')}}
          </el-button>
        </template>
      </main-header>
      <div class="form-container">
        <el-form
          ref="form"
          :model="form"
          label-width="80px"
          :show-message="false"
          :rules="rules"
        >
          <el-row type="flex">
            <el-col>
              <el-form-item
                :label="$t('basisData.quickSearchName')"
                :label-width="formLabelWidth"
                prop="name"
              >
                <el-input
                  v-model="form.name"
                  :disabled="isDisabled"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item
                 :label="$t('basisData.queryMatchOperator')"
                :label-width="formLabelWidth"
                prop="queryMatchOperator"
              >
                <el-select v-model="form.queryMatchOperator" clearable>
                  <el-option :label="$t('basisData.allMatch')" value="allMatch" />
                  <el-option :label="$t('basisData.leftMatch')" value="leftMatch" />
                  <el-option :label="$t('basisData.rightMatch')" value="rightMatch" />
                  <el-option :label="$t('basisData.equalMatch')" value="equalMatch" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col>
              <p></p>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col>
              <el-form-item
                :label="$t('basisData.quickSearchQueryTable')"
                :label-width="formLabelWidth"
                prop="queryTable"
              >
                <el-input
                  v-model="form.queryTable"
                  placeholder="请输入查询表并按回车键"
                  @change="getTables('enter')"
                  @keyup.enter.native="getTables('enter')"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item
                :label="$t('basisData.queryMaxSize')"
                :label-width="formLabelWidth"
                prop="queryMaxSize"
              >
                <el-input v-model="form.queryMaxSize" type="number" clearable />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item
                :label="$t('basisData.valueAttr')"
                :label-width="formLabelWidth"
                prop="valueAttr"
              >
                <el-select
                  v-model="form.valueAttr"
                  placeholder
                  filterable
                  clearable
                  allow-create
                  default-first-option
                >
                  <el-option
                    v-for="item in tableColumn"
                    :key="item.attr"
                    :label="item.attr"
                    :value="item.attr"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col>
              <el-form-item :label="$t('basisData.quickSearchDescription')" :label-width="formLabelWidth">
                <el-input v-model="form.description" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item
            :label="$t('basisData.queryLanguage')"
            :label-width="formLabelWidth"
            prop="queryLanguage"
          >
            <el-input v-model="form.queryLanguage" type="textarea" />
          </el-form-item>
          <el-form-item
            :label="$t('basisData.dialogQueryLanguage')"
            :label-width="formLabelWidth"
            prop="dialogQueryLanguage"
          >
            <el-input v-model="form.dialogQueryLanguage" type="textarea" />
          </el-form-item>
        </el-form>
      </div>
      <main-header>
        <template slot="left">
          {{$t('basisData.quickSearchCfg')}}
        </template>
      </main-header>
      <table-edit
        :ref="gridId"
        :table-data="tableData"
        :table-header="tableHeader"
        :current-change="handleCurrentChange"
        :check-change="selectionChange"
        :page-size="pageSize"
        :show-filter-bar="showFilterBar === 1"
        :checkbox="true"
        :multi-commit="true"
        url="/admin/application/list"
        :auto-query="false"
        style="overflow:hidden;"
      />
    </el-main>
  </el-container>
</template>
<script>
// import { getDictItem } from "@/api/common";
import { adaptDictData } from "@/utils";
import { tabTodoMixin } from "@/utils/mixins";
import MainHeader from "lib@/components/Table/MainHeader";
import TableEdit from "lib@/components/Table/TableEdit";

export default {
  name: "quickSearchConfigDetail",
  components: {
    MainHeader,
    TableEdit
  },
  mixins: [tabTodoMixin],
  data() {
    return {
      form: {
        name: "",
        queryMatchOperator: "allMatch",
        description: "",
        queryTable: "",
        queryMaxSize: "15",
        valueAttr: "",
        queryLanguage: "",
        dialogQueryLanguage: "",
        quicksearchConfigId: ""
      },
      resetForm: {},
      rules: {
        name: [{ required: true, trigger: "change" }],
        queryMatchOperator: [{ required: true, change: "change" }],
        queryTable: [{ required: true, trigger: "change" }],
        queryMaxSize: [{ required: true, trigger: "change" }],
        valueAttr: [{ required: true, change: "change" }],
        queryLanguage: [{ required: true, trigger: "change" }],
        dialogQueryLanguage: [{ required: true, trigger: "change" }]
      },
      tableColumn: [],
      queryModuleList: [],
      isDisabled: this.$attrs.params.flag === "edit",
      formLabelWidth: "100px",
      gridId: "list",
      pageSize: 15,
      dataCount: 0,
      queryTotal: -1,
      all: -1,
      tableData: [],
      showDialog: false,
      tableHeader: [],
      showFilterBar: 1,
      selectList: [],
      currentRow: ""
    };
  },
  created() {
    // // debugger
    // console.log('tab父页面传值', this.$attrs.params)
    if (this.$attrs.params.flag === "edit") {
      for (let i in this.form) {
        this.form[i] = this.$attrs.params.row[i] || "";
      }
      this.getDetail();
    }
    let _this = this;
    this.tableHeader = [
      {
        prop: "alias",
        label: _this.$t('basisData.alias'),
        editType: "none",
        width: 60
      },
      {
        prop: "attrOrder",
        label:_this.$t('basisData.attrOrder'),
        width: 80
      },
      {
        prop: "attr",
        label: _this.$t('basisData.attr'),
        editType: "none",
        width: 180
      },
      {
        prop: "title",
        label: _this.$t('basisData.title'),
        width: 250
      },
      {
        prop: "queryItemEnabled",
        label: _this.$t('basisData.queryItemEnabled'),
        type: "switch",
        switchValues: {
          inactive: "N",
          active: "Y"
        },
        // formattor: function(val) {
        //   return val == 1 ? 'Y':'N';
        // },
        width: 70
      },
      {
        prop: "displayItemEnabled",
        label: _this.$t('basisData.displayItemEnabled'),
        type: "switch",
        switchValues: {
          inactive: "N",
          active: "Y"
        },
        // formattor: function(val) {
        //   return val == 1 ? 'Y':'N';
        // },
        width: 70
      },
      {
        prop: "columnWidth",
        label: _this.$t('basisData.columnWidth')
      },
      {
        prop: "dataType",
        label: _this.$t('basisData.dataType'),
        type: "select",
        options: {
          dataType: [
            { value: "input", label: "文本框" },
            { value: "select", label: "下拉框" }
          ]
        }
      },
      {
        prop: "filedoption",
        label: _this.$t('basisData.filedoption')
      }
    ];

    // 模块下拉列表
    /* getDictItem("MODULE_DIVISION").then(res => {
      this.queryModuleList = adaptDictData(res.data, "dict");
    }); */
  },
  methods: {
    getTables(action) {
      this.$http({
        url: "/pss/member/quicksearch/quicksearchConfig/listTables",
        method: "POST",
        data: {
          queryTable: this.form.queryTable
        }
      })
        .then(data => {
          if (action == "enter") {
            // 查询表结构,  更新列表
            this.$refs[this.gridId].tableData = data.data;
          }
          this.tableColumn = data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 选择项变化
    selectionChange(selection) {
      this.selectList = selection;
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    submitOne() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.queryModule = 'base';
          let params = Object.assign({}, this.form);
          params.attrConfigs = this.$refs[this.gridId].tableData || [];
          // // debugger
          // return
          this.$http({
            url: "/pss/member/quicksearch/quicksearchConfig/save",
            method: "POST",
            data: params
          })
            .then(data => {
              if (data) {
                this.$message({
                  message: "保存成功",
                  type: "success"
                });
                if (this.$attrs.params.flag == "edit") {
                  sessionStorage.removeItem("QS_" + this.form.name);
                  this.$emit(
                    "tab-remove",
                    "quickSearchConfigDetail" + this.$attrs.params.row.name
                  );
                } else {
                  this.$emit("tab-remove", "quickSearchConfigDetail");
                }
                this.__setTabTodo("quickSearchConfigList.getQuerydata");
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
    resetOne() {
      for (let i in this.form) {
        this.form[i] = "";
      }
      this.$refs[this.gridId].tableData = [];
    },
    // 详情
    getDetail() {
      this.$http({
        url: "/pss/member/quicksearch/quicksearchConfig/getDetail",
        method: "POST",
        data: { name: this.$attrs.params.row.name },
        loading: true
      })
        .then(data => {
          this.$refs[this.gridId].tableData = data.data.attrConfigs || []; // 列表
        })
        .then(() => {
          this.getTables();
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style scoped lang="scss"></style>
