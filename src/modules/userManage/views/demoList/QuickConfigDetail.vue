<template>
  <el-container class="flex-container the-quick-demo" direction="vertical" >
    <el-main>
      <main-header class="no-side">
        <template slot="left">
          <el-button type="primary" size="mini" @click="submitOne">确定</el-button>
          <el-button type="primary" size="mini" @click="resetOne">重置</el-button>
        </template>
      </main-header>
      <div class="form-container">
      <el-form ref="form" :model="form" label-width="80px">
        <el-row type="flex">
          <el-col>
            <el-form-item label="名称" :label-width="formLabelWidth">
              <el-input v-model="form.name" :disabled="isDisabled"></el-input>
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
        <el-form-item label="下拉查询语句" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.queryLanguage"></el-input>
        </el-form-item>
        <el-form-item label="弹出框查询语句" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.dialogQueryLanguage"></el-input>
        </el-form-item>
      </el-form>
      </div>
      <main-header>
        <template slot="left">
          快速组件配置
        </template>
        <template slot="right">
          <el-button type="primary" size="mini" @click="addOne">新增</el-button>
          <el-button type="primary" size="mini" @click="delOne">删除</el-button>
        </template>
      </main-header>
<!--      <el-row>-->
        <table-edit
          :ref="gridId"
          :tableData="tableData"
          :tableHeader="tableHeader"
          :currentChange="handleCurrentChange"
          :checkChange="selectionChange"
          :pageSize="pageSize"
          :showFilterBar="showFilterBar == 1"
          :checkbox="true"
          :multiCommit="true"
          url="/admin/application/list"
          :autoQuery="false" style="overflow:hidden;"></table-edit>
<!--      </el-row>-->
    </el-main>
  </el-container>
</template>
<script>
import { tabTodoMixin } from '@/utils/mixins'
import MainHeader from 'lib@/components/Table/MainHeader';
import TableEdit from 'lib@/components/Table/TableEdit'

export default {
  name: 'quickConfigDetail',
  components: {
    MainHeader,TableEdit
  },
  mixins: [ tabTodoMixin],
  data () {

    return {
      form: {
        name: '',
        region: '',
        description: '',
        queryTable: '',
        queryMaxSize: '',
        valueAttr: '',
        queryLanguage: '',
        dialogQueryLanguage: '',
      },
      isDisabled: this.$attrs.params.flag =='edit',
      formLabelWidth: '100px',
      gridId:'list',
      pageSize:15,
      dataCount:0,
      queryTotal:-1,
      all: -1,
      tableData:[],
      showDialog:false,
      tableHeader: [],
      showFilterBar:1,
      selectList:[],
      currentRow:'',
    }
  },
  created () {
    debugger
    console.log('tab父页面传值', this.$attrs.params);
    if(this.$attrs.params.flag =='edit'){
      for(let i in this.form){
        this.form[i] = this.$attrs.params.row[i]||''
      }
    }
    this.tableHeader = [
      { prop: 'name',
        label: '快速查询名称',
        width:150,
        editType: 'none',
      },{ prop: 'isDisplay',
        label: '是否展示',
        width:100,
        /*type: "switch",
        switchValues: {
          inactive:"0",
          active:"1"
        },
        formattor: function(val) {
          return val == 1 ? 'Y':'N';
        },*/
        type:'checkbox',
        // formattor: function(val) {
        //   return val == 1 ? 'Y':'N';
        // },
      },{ prop: 'updateTime',
        label: '修改时间',
        width:150,
        type:'date'
      },{ prop: 'region',
        label: '查询匹配规则',
        width:150,
        editable: true,
        type: 'select',
        options: {
          region: [
            {value:'input', label:'文本框'},
            {value:'select', label:'下拉框'}
          ]
        }
      },{ prop: 'description',
        label: '描述',
        width:150,
      },{ prop: 'queryTable',
        label: '查询表',
        width:150,
      },{ prop: 'queryMaxSize',
        label: '下拉显示条数',
        width:150,
        type:'number'
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
      for(let i=0;i<3;i++){
        listdata.push({
          name: 't_inventory'+i,
          // region: '查询匹配规则'+i,
          description: '仓库表无关联'+i,
          queryTable: '查询表'+i,
          queryMaxSize: i,
          valueAttr: '显示值主键'+i,
          queryLanguage: '下拉查询语句'+i,
          dialogQueryLanguage: '弹出框查询语句'+i,
          updateTime:'2020-2-4',
          isDisplay: Math.random()>0.5 ?'Y':'N',
        })
      }
      this.$refs[this.gridId].tableData = listdata
    },555)
  },
  methods: {
    // 选择项变化
    selectionChange(selection) {
      this.selectList = selection;
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    addOne(){
      this.$refs[this.gridId].add();
    },
    delOne(){
      this.$refs[this.gridId].deleteFromView();
    },
    submitOne(){
      console.log(this.$refs[this.gridId].tableData,'---')
      debugger
    },
    resetOne(){
      for(let i in this.form){
        this.form[i]='';
      }
      this.$refs[this.gridId].tableData =[]
    },
  }
}
</script>
<style scoped lang="scss">

</style>
