<template>
  <el-container class="flex-container the_quick_list__outter_wrapper"  direction="vertical">
    <el-main>
      <main-header class="no-side">
        <template slot="left">
          <el-button type="primary" :class="{ btnExpand: isActive }" @click="isActive=!isActive" size="mini"><i class="el-icon-arrow-up"></i></el-button>
          <el-button type="primary" @click="reset" size="mini">重置</el-button>
        </template>
      </main-header>
      <div class="form-container" :class="{ formExpand: isActive }">
        <el-form ref="form" :model="form" label-width="80px">
          <el-row type="flex">
            <el-col>
              <el-form-item label="名称" :label-width="formLabelWidth">
                <el-input v-model="form.name" ></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="查询匹配规则" :label-width="formLabelWidth">
                <el-select v-model="form.region">
                  <el-option label="全匹配" value="allMatch"></el-option>
                  <el-option label="左匹配" value="leftMatch"></el-option>
                  <el-option label="右匹配" value="rightMatch"></el-option>
                  <el-option label="全等匹配" value="equalMatch"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="描述" :label-width="formLabelWidth">
                <el-input v-model="form.description"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col>
              <el-form-item label="查询表" :label-width="formLabelWidth">
                <el-input v-model="form.queryTable"></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="下拉显示条数" :label-width="formLabelWidth">
                <el-input v-model="form.queryMaxSize"></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="显示值主键" :label-width="formLabelWidth">
                <el-select v-model="form.valueAttr">
                  <el-option label="全匹配" value="allMatch"></el-option>
                  <el-option label="左匹配" value="leftMatch"></el-option>
                  <el-option label="右匹配" value="rightMatch"></el-option>
                  <el-option label="全等匹配" value="equalMatch"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <main-header>
        <template slot="left">
          <el-button
            type="primary"
            size="mini"
            @click="queryList"
          >
            查询
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="editTab('add')"
          >
            新增
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="editTab"
            :disabled="! currentRow"
          >
            修改
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="deleteOne"
          >
            删除
          </el-button>
        </template>
      </main-header>
      <table-view
        :ref="gridId"
        :table-data="tableData"
        :table-header="tableHeader"
        :current-change="handleCurrentChange"
        :check-change="selectionChange"
        :row-dblclick="rowDblclick"
        :page-size="pageSize"
        :show-filter-bar="showFilterBar == 1"
        :checkbox="true"
        url="/isales-main/mstQuicksearchConfig/queryList"
        url-for-count="/isales-main/mstQuicksearchConfig/queryCount"
      />
    </el-main>
  </el-container>
</template>
<script>
import { tabTodoWatch, tabTodoMixin } from '@/utils/mixins'
import quickConfigDetail from './QuickConfigDetail'
import TableView from 'lib@/components/Table/TableView'
import MainHeader from 'lib@/components/Table/MainHeader';

export default {
  name: 'QuickList',
  components: {
    TableView,MainHeader
  },
  mixins: [tabTodoWatch, tabTodoMixin],
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
      tableData: [],
      form: {
        name: '',
        region: '',
        description: '',
        queryTable: '',
        queryMaxSize: '',
        valueAttr: '',
      },
      formLabelWidth: '100px',
      isActive: false,
    }
  },
  created () {
    this.tableHeader = [
      { prop: 'name',
        label: '快速查询名称',width:120,
        // filter: { type: "text", clearable: true },

        showType: 'button',
        btnStyle: 'text',
        callback: function(row){
          this.currentRow = row;
          this.editTab('edit');
        }.bind(this),
        formattor(val){
          return val || '--'
        }
      },{ prop: 'isDisplay',
        label: '是否展示',
        width:100,
        formattor(val) {
          if ("Y" == val) {
            return '<span class="el-icon-success" style="color:#67C23A"></span>'
          } else if ("N" == val) {
            return '<span class="el-icon-error" style="color:#F56C6C"></span>'
          } else {
            return val
          }
        },
      },{ prop: 'region',
        label: '查询匹配规则',
        width:200,
      },{ prop: 'description',
        label: '描述',
        width:200,
      },{ prop: 'queryTable',
        label: '查询表',
        width:200,
      },{ prop: 'queryMaxSize',
        label: '下拉显示条数',
        width:200,
      },{ prop: 'valueAttr',
        label: '显示值主键',
        width:200,
      },{ prop: 'queryLanguage',
        label: '下拉查询语句',
        width:200,
      },{ prop: 'dialogQueryLanguage',
        label: '弹出框查询语句',
        width:200,
      },
    ];
    setTimeout(()=>{
      let listdata = []
      for(let i=0;i<13;i++){
        listdata.push({
          name: 't_inventory'+i,
          isDisplay: Math.random()>0.5 ?'Y':'N',
          region: '查询匹配规则'+i,
          description: '仓库表无关联'+i,
          queryTable: '查询表'+i,
          queryMaxSize: i,
          valueAttr: '显示值主键'+i,
          queryLanguage: '下拉查询语句'+i,
          dialogQueryLanguage: '弹出框查询语句'+i,
        })
      }
      this.$refs[this.gridId].tableData = listdata
    },555)

  },
  methods: {
    queryOne () {

    },
    reset(){      //重置所有过滤条件
      for(let i in this.form){
        this.form[i]='';
      }
    },
    queryList () {
      let listdata = []
      for(let i=0;i<3;i++){
        listdata.push({
          name: 't_inventory'+i,
          region: '查询匹配规则'+i,
          description: '仓库表无关联'+i,
          queryTable: '查询表'+i,
          queryMaxSize: i,
          valueAttr: '显示值主键'+i,
          queryLanguage: '下拉查询语句'+i,
          dialogQueryLanguage: '弹出框查询语句'+i,
        })
      }
      this.$refs[this.gridId].tableData = listdata
      // debugger
      // this.$refs[this.gridId].query();
    },
    // 编辑tab
    editTab(type) {
      let tab = {};
      if (type == "add") {
        // 新增
        tab = {
          component: quickConfigDetail,
          params: { flag: 'add' },
          title: '快速查询新增',
          name: 'quickConfigDetail'
        }
      } else {
        // 修改
        if (this.currentRow == null) {
          this.$message({
            message: '请选择一行数据'
          });
          return false;
        }
        let name = this.currentRow.name;
        debugger
        tab = {
          component: quickConfigDetail,
          params: {
            flag: 'edit',
            row: this.currentRow
          },
          title: this.currentRow.name,
          name: 'quickConfigDetail' + this.currentRow.name
        }
      }
      this.$emit("tab-add", tab);
    },
    deleteOne () {

    },
    handleCurrentChange (val) {
      this.currentRow = val
    },
    selectionChange (val) {},
    // 双击行
    rowDblclick(row, event, column) {
      this.editTab('edit');
    },
  }
}
</script>
<style scoped lang="scss">
.the_quick_list__outter_wrapper{
  .form-container{
    height: 50px;
  }
  .formExpand{
    height: auto;
  }
  .btnExpand i{
    transform: rotate(180deg);
  }
}
</style>
