<template>
  <el-container class="flex-container-notab the_instock_wrapper"  direction="vertical">
    <el-main>
    <div class="form-container-outter">
    
      <el-form ref="form" :model="form" class="form-container" label-width="80px" :class="{ formExpand: isActive }">
          <div class="btnGroup">
            <el-button type="primary" size="mini" @click="getQuerydata">{{$t('common.search')}}</el-button>
            <el-button size="mini" @click="resetQuerydata">{{$t('common.reset')}}</el-button>
            <el-button type="text" size="mini" :class="['toggleBtn', { btnExpand: isActive }]" @click="handleClick">{{taggleTex}}<i class="el-icon-arrow-down" /></el-button>
        </div>
          <el-row type="flex">
            <el-col>
              <el-form-item label="工厂编码" :label-width="formLabelWidth">
                <QuickSearch
                  :showInput="form.factoryCode"
                  show-key="itemCode"
                  :scope-data="form"
                  name="factory_display"
                  @close-quicksearch="getFacObj"
                />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="仓库编码" :label-width="formLabelWidth">
                <QuickSearch
                  :showInput="form.warehouseCode"
                  show-key="itemCode"
                  :scope-data="form"
                  name="warehouse_display"
                  @close-quicksearch="getWarehouseObj"
                />
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
            
          </el-row>
          <el-row type="flex">
            <el-col>
              <el-form-item label="库龄时段1" :label-width="formLabelWidth">
                <el-input v-model="form.time1" type="number"/>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="库龄时段2" :label-width="formLabelWidth">
                <el-input v-model="form.time2" type="number"/>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="库龄时段3" :label-width="formLabelWidth">
                <el-input v-model="form.time3" type="number"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col>
              <el-form-item label="库龄时段4" :label-width="formLabelWidth">
                <el-input v-model="form.time4" type="number"/>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="库龄时段5" :label-width="formLabelWidth">
                <el-input v-model="form.time5" type="number"/>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="库龄时段6" :label-width="formLabelWidth">
                <el-input v-model="form.time6" type="number"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col>
              <el-form-item label="库龄时段7" :label-width="formLabelWidth">
                <el-input v-model="form.time7" type="number"/>
              </el-form-item>
            </el-col>
            <el-col><p></p></el-col>
            <el-col><p></p></el-col>
          </el-row>
        </el-form>
    </div>
<!--<form-wrapper :formArray="preArr" @getFormData="getQuerydata" />-->
<main-header>
        <template slot="left">
          <el-button
            type="primary"
            size="mini"
            @click="exportData"
          >
            {{$t('common.export')}}
          </el-button>
        </template>
      </main-header>

      <table-view
        :ref="gridId"
        :table-data="tableData"
        :table-header="tableHeader"
        :preQueryData="queryParam"
        :page-size="pageSize"
        url="/pss/member/inventory/age" />
    </el-main>
  </el-container>
</template>
<script>
import QuickSearch from "lib@/components/QuickSearch";
  import TableView from 'lib@/components/Table/TableView'
  import MainHeader from 'lib@/components/Table/MainHeader';
  import FormWrapper from 'lib@/components/Table/FormWrapper'
  import { downloadFileLink } from '@/utils/file'

  export default {
    name: 'page1',
    components: {
      TableView,MainHeader, FormWrapper, QuickSearch
    },
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
        queryParam:{},
        formLabelWidth: "80px",
      isActive: true,
      taggleTex: '展开',
      form:{
        itemCode:'',
        factoryCode:'',
        warehouseCode:'',
        time1: 3,
        time2: 7,
        time3: 14,
        time4: 21,
        time5: 30,
        time6: 60,
        time7: 90,
      },
        preArr:[
          {
            label:'工厂编码',
            prop:'factoryCode',
            type: "quicksearch",
            showKey: "factoryCode",
            name: "factory_display",
          },{
            label:'仓库编码',
            prop: "warehouseCode",
            type: "quicksearch",
            showKey: "warehouseCode",
            name: "warehouse_display",
          },
          {
            label: "物料编码",
            prop: "itemCode",
            type: "quicksearch",
            showKey: "itemCode",
            name: "item_display",
          },
          {label:'库龄时段1',prop:'time1'},
          {label:'库龄时段2',prop:'time2'},
          {label:'库龄时段3',prop:'time3'},
          {label:'库龄时段4',prop:'time4'},
          {label:'库龄时段5',prop:'time5'},
          {label:'库龄时段6',prop:'time6'},
          {label:'库龄时段7',prop:'time7'},
        ],
        labelArr: ['数量（0-3天）', '数量（4-7天）', '数量（8-13天）', '数量（14-33天）', 
          '数量（34-55天）', '数量（56-67天）','数量（68-90天）','数量（>91天）'],

      }
    },
    created () {
      
      this.getQuerydata();
    },
    methods: {
      getQuerydata(v){
        if(!(this.form.time1 && this.form.time2 && this.form.time3 && this.form.time4 && this.form.time5 && this.form.time6 && this.form.time7)) {
          this.$message.info('请按升序输入所有的库龄时段')
          return;
        }
        if((Number(this.form.time1) >= Number(this.form.time2))||(Number(this.form.time2) >= Number(this.form.time3))||(Number(this.form.time3) >= Number(this.form.time4))||(Number(this.form.time4) >= Number(this.form.time5))||(Number(this.form.time5) >= Number(this.form.time6))||(Number(this.form.time6) >= Number(this.form.time7))) {
          this.$message.info('请按升序输入所有的库龄时段')
          return;
        }
        // console.log('---form--',  this.form)
        this.queryParam = Object.assign({}, this.form);
        // this.queryParam["times"]=[3,7,14,21,30,60,90]
        this.queryParam["times"]=[this.form.time1, this.form.time2, this.form.time3, this.form.time4, this.form.time5, this.form.time6, this.form.time7]
        this.setTableHeader()
        this.$nextTick(()=>{
          this.$refs[this.gridId].query();
        })
      },
      setTableHeader(){
        this.labelArr[0] = `数量（0-${this.form.time1}天）`;
        this.labelArr[1] = `数量（${this.form.time1 -(-1)}-${this.form.time2}天）`;
        this.labelArr[2] = `数量（${this.form.time2 -(-1)}-${this.form.time3}天）`;
        this.labelArr[3] = `数量（${this.form.time3 -(-1)}-${this.form.time4}天）`;
        this.labelArr[4] = `数量（${this.form.time4 -(-1)}-${this.form.time5}天）`;
        this.labelArr[5] = `数量（${this.form.time5 -(-1)}-${this.form.time6}天）`;
        this.labelArr[6] = `数量（${this.form.time6 -(-1)}-${this.form.time7}天）`;
        this.labelArr[7] = `数量（>${this.form.time7 -(-1)}天）`;
        let _this=this;
        this.tableHeader = [
          { prop: 'itemCode',
            label: '物料编码',
            width:150,
          },{ prop: 'itemName',
            label: '物料名称',
            minWidth: 200,
          },{ prop: 'specification',
            label: '规格型号',
            width:100,
          },{ prop: 'itemUnit',
            label: '单位',
            width:60,
          },{ prop: 'factoryCode',
            label: '工厂编码',
            width:120,
          },{ prop: 'warehouseCode',
            label: '仓库编码',
            width:100,
          },{ prop: 'quantity',
            label: '库存总数',
            width:100,
          },{ prop: 'quantities',
            label: _this.labelArr[0],width:110,
            formattor(quantities) {
              return quantities[0]
            }
          },{ prop: 'quantities',
            label: _this.labelArr[1],width:110,
            formattor(quantities) {
              return quantities[1]
            }
          },{ prop: 'quantities',
            label: _this.labelArr[2],width:110,
            formattor(quantities) {
              return quantities[2]
            }
          },{ prop: 'quantities',
            label: _this.labelArr[3],width:120,
            formattor(quantities) {
              return quantities[3]
            }
          },{ prop: 'quantities',
            label: _this.labelArr[4],width:120,
            formattor(quantities) {
              return quantities[4]
            }
          },{ prop: 'quantities',
            label: _this.labelArr[5],width:120,
            formattor(quantities) {
              return quantities[5]
            }
          },{ prop: 'quantities',
            label: _this.labelArr[6],width:120,
            formattor(quantities) {
              return quantities[6]
            }
          },{ prop: 'quantities',
            label: _this.labelArr[7],width:120,
            formattor(quantities) {
              return quantities[7]
            }
          },
        ];
      },
      resetQuerydata(){
        for(let i in this.form) {
          this.form[i] ='';
        }
      },
      exportData () {
        downloadFileLink('/pss/member/inventory/age/export', '库龄分析报表.xls', this.queryParam ||{}).catch(() => {
          this.$message.error('下载失败')
        })
      },
      getFacObj(val, scope) {
        scope.factoryCode = val ? val.factoryCode : "";
      },
      getWarehouseObj(val, scope) {
        scope.warehouseCode = val ? val.warehouseCode : "";
      },
      getItemObj(val, scope) {
        scope.itemCode = val ? val.itemCode : "";
      },
      handleCurrentChange (val) {
        this.currentRow = val
      },
      selectionChange (val) {},
      // 切换开合
      handleClick() {
        this.isActive = !this.isActive;
        this.taggleTex = this.isActive ? '收缩' : '展开';
      },
    }
  }
</script>
<style scoped lang="scss">
.form-container-outter{
  padding: 11px;
  
  .form-container {
    height: 53px;
    position: relative;
    padding-right: 260px;
    .el-form {
      padding-right: 240px;
    }
    .btnGroup {
      position: absolute;
      top: 10px;
      right: 5px;
      z-index: 999;
      .toggleBtn {
        font-size: 12px;
        min-width: 50px;
        padding-left: 0;
        padding-right: 0;
      }
    }
    .el-form .el-row .el-form-item:first-child {
      margin-bottom: 10px;
    }
    &.list-page-query {
      padding-left: 5px;
      padding-right: 5px;
      border-right: 0;
      border-left: 0;
      // margin-bottom: 10px;
      border-top: 0;
    }
  }
  .formExpand {
    height: auto;
  }
  .btnExpand i {
    transform: rotate(180deg);
  }

}
</style>
