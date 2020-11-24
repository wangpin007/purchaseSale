<template>
  <el-container class="flex-container-notab the_inventory_wrapper"  direction="vertical">
    <el-main>

      <form-wrapper :formArray="preArr" @getFormData="getQuerydata" />

      <main-header>
        <template slot="left">
          <el-button
            type="primary"
            size="mini"
            @click="editTab('add')"
          >
            {{$t('common.add')}}
          </el-button>

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
        url="/pss/member/warehouse/list"
        url-for-count="/isales-main/mstQuicksearchConfig/queryCount"
      />
<!--      弹框区域-->
      <el-dialog title="仓库管理" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
        <el-form ref="form" :model="form" class="form-incontainer" :rules="rules" :show-message="false" label-width="80px" label-position="top">
          <el-row type="flex">
            <el-col>
              <el-form-item label="工厂编码" :label-width="formLabelWidth" prop="factoryId">
                <!--<el-select v-model="form.factoryId" :disabled="!!form.warehouseId">
                  <el-option
                    v-for="item in factoryList"
                    :key="item.factoryId"
                    :label="item.factoryCode"
                    :value="item.factoryId">
                  </el-option>
                </el-select>-->
                  <QuickSearch
                    :showInput="form.factoryCode"
                    show-key="factoryCode"
                    :scope-data="form"  :disabled="!!form.warehouseId"
                    name="factory_display"
                    @close-quicksearch="getfactoryObj"
                  />
              </el-form-item>
            </el-col>
            <el-col></el-col>
          </el-row>
          <el-row type="flex">
            <el-col>
              <el-form-item label="仓库编码" :label-width="formLabelWidth" prop="warehouseCode">
                <el-input v-model="form.warehouseCode" :disabled="!!form.warehouseId"/>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="仓库名称" :label-width="formLabelWidth" prop="warehouseName">
                <el-input v-model="form.warehouseName"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col>
              <el-form-item label="仓库分类" :label-width="formLabelWidth" prop="warehouseClassify">
                <el-select v-model="form.warehouseClassify" clearable filterable>
                  <el-option
                    v-for="item in warehouseClassifyList"
                    :key="item.id"
                    :label="item.dictItemName"
                    :value="item.dictItemCode">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="客户库存组织" :label-width="formLabelWidth">
                <el-select v-model="form.customerId" clearable filterable>
                  <el-option
                    v-for="item in customerList"
                    :key="item.customerId"
                    :label="item.cusOrgCode"
                    :value="item.customerId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col>
              <el-form-item label="负责人" :label-width="formLabelWidth" prop="responsiblePerson">
                <el-input v-model="form.responsiblePerson"/>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="电话" :label-width="formLabelWidth" prop="telephone">
                <el-input v-model="form.telephone" type="number"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col>
              <el-form-item label="启用批次" :label-width="formLabelWidth" prop="batchCode">
                <el-select v-model="form.batchCode" clearable filterable>
                  <el-option
                    v-for="item in batchList"
                    :key="item.id"
                    :label="item.dictItemName"
                    :value="item.dictItemCode">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col>
              <p></p>
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
import QuickSearch from "lib@/components/QuickSearch";
  import TableView from 'lib@/components/Table/TableView'
  import MainHeader from 'lib@/components/Table/MainHeader';
  import FormWrapper from 'lib@/components/Table/FormWrapper'
  import {parseTime, transformData} from '@/utils'

  export default {
    name: 'warehouse',
    components: {
      TableView,MainHeader,FormWrapper, QuickSearch
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
        form: {
          factoryId:'',
          warehouseId: '',
          warehouseCode: '',
          warehouseName: '',
          warehouseClassify: '',
          customerId: '',
          batchCode: '',
          enableDatetime: '',
          disableDatetime: '',
          responsiblePerson: '',
          telephone: '',
        },
        rules: {
          factoryId: [{ required: true, message: '请输入工厂编码' }],
          warehouseCode: [{ required: true, message: '请输入仓库编码' }],
          warehouseName: [{ required: true, message: '请输入仓库名称' }],
          warehouseClassify: [{ required: true, message: '请输入仓库分类' }],
          cusOrgCode: [{ required: true, message: '请输入客户编码' }],
          // customerId: [{ required: true, message: '请输入客户库存组织' }],
          responsiblePerson: [{ required: true, message: '请输入负责人' }],
          telephone: [{ required: true, message: '请输入电话' }],
          batchCode: [{ required: true, message: '请输入启用批次' }],
          enableDatetime: [{ required: true, message: '请输入状态' }],
          disableDatetime: [{ required: true, message: '请输入状态' }],
        },
        dialogFormVisible: false,
        formLabelWidth: '100px',
        isActive: false,
        queryParam:{},
        statusList:[],
        batchList:[],
        warehouseClassifyList:[],
        factoryList:[],
        customerList:[],
        customerList2:[],
        preArr: [
          { prop: 'factoryCode',
            label: '工厂编码',
            type: 'quicksearch',
            showKey: 'factoryCode',
            name: 'factory_display'
          },{ prop: 'warehouseCode',
            label: '仓库编码',
          },{ prop: 'warehouseName',
            label: '仓库名称',
          },{ prop: 'warehouseClassify',
            label: '仓库分类',type:'select',
            options: []
          },{ prop: 'cusOrgCode',
            label: '客户库存组织',type:'select',
            options:[]
          },{ prop: 'status',
            label: '状态',type:'select',
            options: []
          },
        ]
      }
    },
    created () {
      let _this = this;
      this.tableHeader = [
        { prop: 'factoryId',
          label: '工厂编码',
          width:150,
          formattor(val){
            let item = _this.factoryList.filter(v=>v.factoryId==val);
            return (item && item[0]) ? item[0].factoryCode : val
          },
        },{ prop: 'warehouseCode',
          label: '仓库编码',
          width:150,
        },{ prop: 'warehouseName',
          label: '仓库名称',
          width:150,
        },{ prop: 'warehouseClassify',
          label: '仓库分类',
          width:150,
          formattor(val){
            return _this.$getLabelByValue(_this.warehouseClassifyList,val)
          },
        },{ prop: 'batchCode',
          label: '启用批次',
          width:100,
          formattor(val){
            return _this.$getLabelByValue(_this.batchList,val)
          },          
        },{ prop: 'customerId',
          label: '客户编码',width:100,
          formattor(val){
            if(_this.customerList2.filter(v=>v.customerId==val) && _this.customerList2.filter(v=>v.customerId==val)[0]) {
              return _this.customerList2.filter(v=>v.customerId==val)[0].customerCode
            }
          },
        },{ prop: 'customerId',
          label: '客户库存组织',
          width:150,
          formattor(val){
            if(_this.customerList2.filter(v=>v.customerId==val) && _this.customerList2.filter(v=>v.customerId==val)[0]) {
              return _this.customerList2.filter(v=>v.customerId==val)[0].cusOrgCode
            }
          },
          // cusOrgCode
        },{ prop: 'responsiblePerson',
          label: '负责人',
          width:100,
        },{ prop: 'telephone',
          label: '电话',
          width:120,
        },{ prop: 'creationDate',
          label: '创建时间',
          width:150,
          formattor(val){
            return val ?parseTime(val):''
          }
        },{ prop: 'enableDatetime',
          label: '生效时间',
          width:150,
          formattor(val){
            return val ?parseTime(val):''
          }
        },{ prop: 'disableDatetime',
          label: '失效时间',
          width:150,
          formattor(val){
            return val ?parseTime(val):''
          }
        },{ prop: 'operation',
          label: '操作', width:70,fixed:'right',
          showType: 'buttons',
          btnStyle: 'text',
          buttons: [
            {
              callback: function(row){
                this.editTab('edit', row);
              }.bind(this),
              btnStyle: 'text',
              formattor(val){
                return '修改'
              }
            },
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
        },
      ];
      this.getStatus()
      this.getBatch()
      this.getWarehouseList()
      this.getFactory()
      this.getCustomer()
      this.$nextTick(()=>{
        this.getQuerydata()
      })
    },
    methods: {
      getfactoryObj(val, scope) {
        scope.factoryId = val ? val.factoryId : "";
        scope.factoryCode = val ? val.factoryCode : "";
        // scope.factoryName = val ? val.factoryName : "";
      },
      getStatus() {
        // 获取状态
        this.$http({
          url: '/pss/member/dict/item/byDictCode?dictCode=' + "PSS_BASE_STATUS",
          method: 'GET',
          data: {}
        }).then(data => {
          if (data && data.success) {
            this.statusList = data.data;
            this.$set(this.preArr,5,{
              prop: 'status', label: '状态',type:'select',
              options: transformData(data.data,['dictItemCode','dictItemName'])
            })
          }
        }).catch(err => {
          console.log(err)
        })
      },
      getBatch() {
        // 获取批次
        this.$http({
          url: '/pss/member/dict/item/byDictCode?dictCode=' + "PSS_ENABLE_BATCH",
          method: 'GET',
          data: {}
        }).then(data => {
          if (data && data.success) {
            this.batchList = data.data;
          }
        }).catch(err => {
          console.log(err)
        })
      },
      getWarehouseList() {
        // 获取仓库分类
        this.$http({
          url: '/pss/member/dict/item/byDictCode?dictCode=' + "PSS_WAREHOUSE_CLASSIFY",
          method: 'GET',
          data: {}
        }).then(data => {
          if (data && data.success) {
            this.warehouseClassifyList = data.data;
            this.$set(this.preArr,3,{
              prop: 'warehouseClassify', label: '仓库分类',type:'select',
              options: transformData(data.data,['dictItemCode','dictItemName'])
            })
          }
        }).catch(err => {
          console.log(err)
        })
      },
      getFactory(){
        // 获取工厂信息
        this.$http({
          url: '/pss/member/factory/list',
          method: 'POST',
          data: {"pageNo": 1,"pageSize": 100000}
        }).then(data => {
          if (data && data.success) {
            this.factoryList = data.data.list;
            /* this.$set(this.preArr,0,{
              prop: 'factoryId', label: '工厂编码',type:'select',
              options: transformData(data.data.list,['factoryId','factoryCode'])
            }) */
          }
        }).catch(err => {
          console.log(err)
        })
      },
      getCustomer(){
        // 获取工厂信息
        this.$http({
          url: '/pss/member/customer/base',
          method: 'POST',
          data: {"pageNo": 1,"pageSize": 100000}
        }).then(data => {
          if (data && data.success) {
            console.log(data.data)
            this.customerList = data.data;
            this.customerList2 = data.data;
            this.$set(this.preArr,4,{
              prop: 'cusOrgCode', label: '客户库存组织',type:'select',
              options: transformData(data.data,['cusOrgCode','cusOrgCode'])
            })
          }
        }).catch(err => {
          console.log(err)
        })
      },
      getQuerydata(v){
        this.queryParam = v;
        if(v){
          if(v.factoryCode) {
          let item = this.factoryList.filter(x=>x.factoryCode== v.factoryCode);
            this.queryParam.factoryId = (item && item[0]) ? item[0].factoryId : '';
          } else {
            delete this.queryParam.factoryId;
          }
        }
        this.$nextTick(()=>{
          this.$refs[this.gridId].query();
        })
      },
      // 编辑tab
      editTab(type, row) {
        let tab = {};
        if (type == "add") {
          // 新增
          for(let i in this.form){
            this.form[i]='';
          }
          this.form.enableDatetime = new Date().getTime();
          this.form.disableDatetime = new Date().setFullYear(2030);
        } else {
          // 修改
          for(let i in this.form){
            this.form[i]=row[i];
          }
          let item = this.factoryList.filter(v=>v.factoryId== row.factoryId);
          this.form.factoryCode = (item && item[0]) ? item[0].factoryCode : '';
        }
        this.dialogFormVisible = true;
      },
      deleteOne (row) {
        this.$confirm(this.$t("common.delRow"), {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          let addStr = '?warehouseId='+ row.warehouseId;
          this.$http({
            url: '/pss/member/warehouse' +addStr,
            method: 'DELETE',
            data: {}
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
      },
      addOne () {
        //验证form表单
        this.$refs.form.validate(valid => {
          if (valid) {
            // =====
            this.form.enableDatetime = parseTime(this.form.enableDatetime);
            this.form.disableDatetime = parseTime(this.form.disableDatetime);
            let url = this.form.warehouseId ? '/pss/member/warehouse/modify' : '/pss/member/warehouse';
            let methodType = this.form.warehouseId ? 'POST' : 'PUT';
            // this.form.warehouseId有值就是修改模式---否则为新增
            let params = Object.assign({}, this.form);
            if(this.form.warehouseId) delete params.warehouseCode
            this.$http({
              url: url,
              method: methodType,
              data: params
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
      handleCurrentChange (val) {
        this.currentRow = val
      },
    }
  }
</script>
<style scoped lang="scss">

</style>
