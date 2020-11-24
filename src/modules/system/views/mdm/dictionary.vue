<template>
  <el-container class="flex-container the_quick_list__outter_wrapper"  direction="vertical">
    <el-main>

      <form-wrapper :formArray="preArr" @getFormData="getQuerydata" />

      <main-header>
        <template slot="left">
          <!--<el-button-->
            <!--type="primary"-->
            <!--size="mini"-->
            <!--@click="editFrom('add')"-->
          <!--&gt;-->
            <!--{{$t('common.add')}}-->
          <!--</el-button>-->
        </template>
      </main-header>
      <table-view
        :ref="gridId"
        :table-data="tableData"
        :table-header="tableHeader"
        :current-change="handleCurrentChange"
        :page-size="pageSize"
        :preQueryData="queryParam"
        :show-filter-bar="showFilterBar == 1"
        url="/pss/member/dict/list"
        url-for-count="/isales-main/mstQuicksearchConfig/queryCount"
      />
      <!--      弹框区域-->
      <el-dialog title="字典管理" :visible.sync="dialogFormVisible" v-el-drag-dialog :close-on-click-modal="false">
        <el-form ref="form" :model="form" class="form-incontainer" :rules="rules" :show-message="false" label-width="80px" label-position="top">
          <el-row type="flex">
            <el-col>
              <el-form-item label="字典编码" :label-width="formLabelWidth" prop="dictCode">
                <el-input v-model="form.dictCode" :disabled="isModify"/>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="字典名称" :label-width="formLabelWidth" prop="dictName">
                <el-input v-model="form.dictName"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col>
              <el-form-item label="字典描述" :label-width="formLabelWidth">
                <el-input v-model="form.description"/>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="状态" :label-width="formLabelWidth" v-if="isModify">
                <el-select v-model="form.enabled">
                  <el-option label="有效" value="Y"></el-option>
                  <el-option label="无效" value="N"></el-option>
                </el-select>
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
  import TableView from 'lib@/components/Table/TableView'
  import MainHeader from 'lib@/components/Table/MainHeader';
  import FormWrapper from 'lib@/components/Table/FormWrapper'
  import dictionaryDetail from './dictionaryDetail'
  import {parseTime} from '@/utils'
  export default {
    name: 'dictionary',
    components: {
      TableView,MainHeader,FormWrapper
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
        statusList:[],
        form: {
          id:'',
          dictCode: '',
          dictName: '',
          description:'',
          enabled:''
        },
        rules: {
          dictCode: [{ required: true, message: '请输入字典编码' }],
          dictName: [{ required: true, message: '请输入字典名称' }],
        },
        isModify: false,
        dialogFormVisible: false,
        formLabelWidth: '100px',
        preArr: [
          { prop: 'dictCode',
            label: '字典编码',
          },{ prop: 'dictName',
            label: '字典名称',
          },{ prop: 'description',
            label: '字典描述',
          },
          // { prop: 'enableDate',
          //   label: '生效日期',type:'date',
          // },{ prop: 'disableDate',
          //   label: '失效日期',type:'date',
          // },
          {
            label: '状态',
            prop: 'enabled',
            type: 'select',
            options: [
              {value: 'Y', label: '有效'},
              {value: 'N', label: '无效'}
            ]
          }
        ],
        queryParam:{},
      }
    },
    created () {
      this.tableHeader = [
        { prop: 'dictCode',
          label: '字典编码',width: 200,
        },{ prop: 'dictName',
          label: '字典名称',width: 200,
        },{ prop: 'description',
          label: '字典描述',minWidth: 200,
        },
        // { prop: 'dictType',
        //   label: '字典类型',minWidth: 100,
        //   formattor(val) {
        //     if ("PUBLIC" == val) {
        //       return '系统'
        //     } else if ("VENDOR" == val) {
        //       return '用户'
        //     } else {
        //       return val
        //     }
        //   },
        // },
        // { prop: 'enableDate',
        //   label: '生效日期',width: 100,
        //   formattor(val){
        //     return val ?parseTime(val,'{y}-{m}-{d}'):''
        //   }
        // },{ prop: 'disableDate',
        //   label: '失效日期',width: 100,
        //   formattor(val){
        //     return val ?parseTime(val,'{y}-{m}-{d}'):''
        //   }
        // },
        { prop: 'enabled',
          label: '状态', width:100,
          formattor(val) {
            if ("Y" == val) {
              return '有效'
            } else if ("N" == val) {
              return '无效'
            } else {
              return val
            }
          },
        },
        // { prop: 'createTime',
        //   label: '创建时间',
        //   width:150,
        //   formattor(val){
        //     return val ?parseTime(val):''
        //   }
        // },
        // { prop: 'tenantId',
        //   label: '供应商',width:150,
        // },
        { prop: 'operation',
          label: '操作',
          // width: 120,
          width:80,
          showType: 'buttons',
          btnStyle: 'text',
          align: 'center',
          fixed:'right',
          buttons: [
            // {
            //   callback: function(row){
            //     this.editFrom('edit', row);
            //   }.bind(this),
            //   btnStyle: 'text',
            //   formattor(val){
            //     return '修改'
            //   }
            // },
            {
              callback: function(row){
                this.editTab(row);
              }.bind(this),
              btnStyle: 'text',
              formattor(val){
                return '查看'
              }
            },
          ]
        },
      ];
      this.$nextTick(()=>{
        this.getQuerydata()
      })
    },
    methods: {
      getQuerydata(v){
        this.queryParam = v;
        this.$nextTick(()=>{
          this.$refs[this.gridId].query();
        })
      },
      // 编辑tab
      editTab(row) {
        this.$emit("tab-add", {
          component: dictionaryDetail,
          params: {
            flag: 'edit',
            row: row
          },
          title: row.dictName,
          name: 'dictionaryDetail' + row.dictName
        });
      },
      /*deleteOne () {
        this.$confirm(this.$t("common.delRow"), {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          let addStr = '?id='+ this.currentRow.id;
          this.$http({
            url: '/pss/member/dict' +addStr,
            method: 'DELETE',
            data: {},
            loading:true
          }).then(data => {
            if (data && data.success) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.$refs[this.gridId].query();
            }
          }).catch(err => {
            console.log(err)
          })
        }).catch(()=>{

        })
      },*/
      handleCurrentChange (val) {
        this.currentRow = val
      },
      editFrom(type, row) {
        if (type == "add") { // 新增
          for(let i in this.form){
            this.form[i]='';
          }
          this.isModify = false;
        } else { // 修改
          for(let i in this.form){
            this.form[i]= row[i];
          }
          this.isModify = true;
        }
        this.dialogFormVisible = true;
      },
      addOne () {
        //验证form表单
        this.$refs.form.validate(valid => {
          if (valid) {
            let url = this.isModify ? '/pss/member/dict/modify' : '/pss/member/dict';
            let methodType = this.isModify ? 'POST' : 'PUT';
            // this.form.factoryId有值就是修改模式---否则为新增
            this.$http({
              url: url,
              method: methodType,
              data: this.form,
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
          } else {
            return false
          }
        })
      },
    }
  }
</script>
<style scoped lang="scss">

</style>
