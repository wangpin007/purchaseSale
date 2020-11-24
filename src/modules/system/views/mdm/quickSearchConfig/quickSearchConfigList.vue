<template>
  <el-container class="flex-container the_quick_list__outter_wrapper"  direction="vertical">
    <el-main>
      <form-wrapper :formArray="preArr" @getFormData="getQuerydata"/>
      <main-header>
        <template slot="left">
          <el-button
            type="primary"
            size="mini"
            @click="addTab"
          >
            {{$t('common.add')}}
          </el-button>
        </template>
      </main-header>
      <el-table
        ref="multipleTable"
        :data="tableData"
        highlight-current-row border
        style="width: 100%;overflow: auto;"
        @current-change="handleCurrentChange">
        <el-table-column align="center" type="index" width="50"/>
        <el-table-column align="center" prop="name" :label="$t('basisData.quickSearchName')" :show-overflow-tooltip="true"/>
        <el-table-column align="center" prop="description" :label="$t('basisData.quickSearchDescription')" :show-overflow-tooltip="true"/>
        <el-table-column align="center" prop="queryTable" :label="$t('basisData.quickSearchQueryTable')" :show-overflow-tooltip="true"/>
        <el-table-column align="center" prop="operation" :label="$t('common.operation')" width="150">
          <template slot-scope="scope">
            <el-button type="text" @click="editTab(scope.row)">{{$t('common.edit')}}</el-button>
            <el-button type="text" @click="deleteOne(scope.row)">{{$t('common.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-footer class="page-bar">
        <pager-bar
          :dataCount="dataCount"
          :queryTotal="queryTotal"
          :pageIndex="pageIndex"
          :pageSize="pageSize"
          :pageCount="pageCount"
          :pageQuery="pageQuery"
          ref="pager"
        ></pager-bar>
      </el-footer>
    </el-main>
  </el-container>
</template>
<script>
import { tabTodoWatch, tabTodoMixin } from '@/utils/mixins'
import quickSearchConfigDetail from './quickSearchConfigDetail'
import MainHeader from 'lib@/components/Table/MainHeader'
import FormWrapper from 'lib@/components/Table/FormWrapper'
import PagerBar from 'lib@/components/Pager'

export default {
  name: 'quickSearchConfigList',
  components: {
    MainHeader, FormWrapper, quickSearchConfigDetail, PagerBar
  },
  mixins: [tabTodoWatch, tabTodoMixin],
  data () {
    return {
      pageSize: 15,
      dataCount: 0,
      queryTotal: -1,
      pageIndex: 1,
      currentRow: null,
      tableData: [],
      preArr: [
        { prop: 'name',
          label: '名称',
        },{ prop: 'description',
          label: '描述',
        },{ prop: 'queryTable',
          label: '查询表',
        },
      ],
    }
  },
  created () {
    this.$nextTick(()=>{
      this.getQuerydata()
    })

  },
  methods: {
    pageQuery(opr,pageSize) {
      if(pageSize){
        this.pageSize = pageSize;
        this.pageIndex = 1
      }else if (opr == "prev") {
        this.pageIndex -= 1;
      } else if (opr == "next") {
        this.pageIndex += 1;
      }
      this.getQuerydata();
    },
    pageCount() {

    },
    getQuerydata(v){
      let filterParam = v ? Object.assign({"pageNum": this.pageIndex,"pageSize": this.pageSize},v) :{"pageNum": this.pageIndex,"pageSize": this.pageSize};
      this.$http({
        url: "/pss/member/quicksearch/quicksearchConfig/listPage",
        method: "POST",
        data: filterParam,
        loading:true
      }).then(data => {
        if(data && data.data) {
          if (data.data.list == null || data.data.list.length === 0) {
            this.dataCount = 0
            this.tableData = []
          } else {
            this.tableData = data.data.list
            this.dataCount = data.data.total
            this.queryTotal = data.data.total
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 新增
    addTab () {
      this.$emit('tab-add', {
        component: quickSearchConfigDetail,
        params: { flag: 'add' },
        title: '快速查询新增',
        name: 'quickSearchConfigDetail'
      })
    },
    editTab (row) {
      this.$emit('tab-add', {
        component: quickSearchConfigDetail,
        params: {
          flag: 'edit',
          row: row
        },
        title: row.name,
        name: 'quickSearchConfigDetail' + row.name
      })
    },

    deleteOne (row) {
      this.$confirm(this.$t("common.delRow"), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        let rmList = [{id: row.quicksearchConfigId}];
        this.$http({
          url: "/pss/member/quicksearch/quicksearchConfig/removeConfig",
          method: 'POST',
          data: { params:JSON.stringify(rmList) },
          loading: true
        })
          .then(data => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getQuerydata()
          })
          .catch(err => {
            console.log(err);
          });
      }).catch(()=>{
      })
    },
    handleCurrentChange (val) {
      this.currentRow = val
    },
  }
}
</script>
<style scoped lang="scss">
.the_quick_list__outter_wrapper{

}
</style>
