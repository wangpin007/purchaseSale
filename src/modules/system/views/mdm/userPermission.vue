<template>
  <el-container class="flex-container-notab the_inventory_wrapper"  direction="vertical">
    <el-main>

      <form-wrapper :formArray="preArr" @getFormData="getQuerydata" />

      <!-- <main-header>
        <template slot="left">
          <el-button
            type="primary"
            size="mini"
            @click="editTab('add')"
          >
            {{$t('common.add')}}
          </el-button>

        </template>
      </main-header> -->
      <table-view
        :ref="gridId"
        :table-data="tableData"
        :table-header="tableHeader"
        :current-change="handleCurrentChange"
        :page-size="pageSize"
        :preQueryData="queryParam"
        :show-filter-bar="showFilterBar == 1"
        url="/pss/member/manager/sub"/>
<!--      弹框区域-->
      <el-dialog title="用户权限" width="850px" :visible.sync="dialogFormVisible" v-el-drag-dialog :close-on-click-modal="false">
        <!-- wwww -->
        <el-button
            type="primary"
            size="mini"
            @click="addOnePermission"
          >
            {{$t('common.add')}}
          </el-button>
          <el-table :data="userPermissionList" style="width: 100%"
                border max-height="250px">
                <el-table-column
                  align="center"
                  prop="factoryId"
                  label="工厂"
                  width="150"
                >
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.factoryId">
                      <el-option
                        v-for="item in factoryList"
                        :key="item.factoryId"
                        :label="item.factoryName"
                        :value="item.factoryId"/>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="enableDatetime"
                  label="生效时间"
                  width="220">
                  <template slot-scope="scope">
                    <el-date-picker
                      v-model="scope.row.enableDatetime"
                      type="datetime"/>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="disableDatetime"
                  label="失效时间"
                  width="220">
                  <template slot-scope="scope">
                    <el-date-picker
                      v-model="scope.row.disableDatetime"
                      type="datetime"/>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="creationDate"
                  label="创建时间"
                  width="160">
                  <template slot-scope="scope">
                    <el-date-picker v-model="scope.row.creationDate" type="date" disabled/>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="60">
                  <template slot-scope="scope">
                    <el-button type="text" @click="handleDelClick(scope.$index,scope.row)">删除</el-button>
                  </template>
                </el-table-column>
        </el-table>
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
        currentID:'',
        userPermissionList:[],
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
        warehouseList:[],
        preArr: [
          { prop: 'keywords',
            label: '用户名',
          },
        ]
      }
    },
    created () {
      let _this = this;
      this.tableHeader = [
        { prop: 'username',
          label: '用户名',
          width:150,
        },
        { prop: 'nickeyName',
          label: '昵称',
          minWidth:150,
        },
        { prop: 'email',
          label: '邮箱',
          minWidth:200,
        },
        { prop: 'phoneNo',
          label: '电话',
          width:150,
        },{ prop: 'createTime',
          label: '创建时间',
          width:150,
          formattor(val){
            return val ?parseTime(val):''
          }
        },{ prop: 'operation',
          label: '操作', width:120,fixed:'right',
          showType: 'buttons',
          btnStyle: 'text',
          buttons: [
            {
              callback: function(row){
                this.editTab('edit', row);
              }.bind(this),
              btnStyle: 'text',
              formattor(val){
                return '查看权限'
              }
            },
            /* {
              callback: function(row){
                this.editTab('add');
              }.bind(this),
              btnStyle: 'text',
              formattor(val){
                return '新增权限'
              }
            }, */
          ]
        },
      ];
      this.getFactory()
      this.$nextTick(()=>{
        this.getQuerydata()
      })
    },
    methods: {
      getFactory(){
        // 获取工厂信息
        this.$http({
          url: '/pss/member/factory/list',
          method: 'POST',
          data: {"pageNo": 1,"pageSize": 100000}
        }).then(data => {
          if (data && data.success) {
            this.factoryList = data.data.list;
          }
        }).catch(err => {
          console.log(err)
        })
      },
      getWarehouseList() {
        this.$http({
          url: "/pss/member/warehouse/base",
          method: "GET",
          data: {}
        })
          .then(data => {
            if (data && data.success) {
              this.warehouseList = data.data;
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      // 行删除---
      handleDelClick(index, row) {
        if (row.userPermissionId) {
          this.$confirm("确认删除吗？", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.$http({
                url: "/pss/member/permission",
                method: "DELETE",
                params: {
                  userPermissionId: row.userPermissionId,
                }
              })
                .then(data => {
                  if (data && data.success) {
                    this.userPermissionList.splice(index, 1);
                    this.$message.success("删除成功");
                    this.getQuerydata()
                  }
                })
                .catch(err => {
                  console.log(err);
                });
            })
            .catch(() => {});
        } else {
          this.userPermissionList.splice(index, 1);
        }
      },
      getQuerydata(v){
        this.queryParam = v;
        this.$nextTick(()=>{
          this.$refs[this.gridId].query();
        })
      },
      // 编辑tab
      editTab(type, row) {
        this.currentID = row.id;
        let tab = {};
        if (type == "add") {
          // 新增
          this.dialogFormVisible = true;
        } else {
          // 修改---
          this.$http({
            url: "/pss/member/permission/list",
            method: 'POST',
            data: {
                "userId": row.id,
                "factoryCode": null,
                "pageNo" : 1,
                "pageSize" : 1000
            }
          }).then(data => {
            if (data && data.success) {
              this.dialogFormVisible = true;
              this.userPermissionList = data.data.list ||[]
            }
          }).catch(err => {
            console.log(err)
          })
        }     
      },
      addOnePermission(){
        this.userPermissionList.push({
          "factoryId": "",
          "enableDatetime": "",
          "disableDatetime":"",
        });
      },
      addOne () {
        if(!this.currentID) return;
        if(this.userPermissionList.length ===0) return;
        let uniqueIds=[];
        for(let i of this.userPermissionList) {
          if(!i.factoryId) {
            this.$message.info('请选择工厂');
            return;
          }
          if(uniqueIds.includes(i.factoryId)) {
            this.$message.info('工厂不能重复,请重新选择!');
            return;
          }
          uniqueIds.push(i.factoryId);
        }
        let factorArr = this.userPermissionList.map(v=>{
          return{
            "factoryId": v.factoryId,
            "enableDatetime": parseTime(v.enableDatetime),
            "disableDatetime": parseTime(v.disableDatetime)
          }
        })
        // debugger
        let params = {
            "userId": this.currentID,
            "factories": factorArr
        }
        this.$http({
          url: "/pss/member/permission",
          method: 'PUT',
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
      },
      handleCurrentChange (val) {
        this.currentRow = val
      },
    }
  }
</script>
<style scoped lang="scss">

</style>
