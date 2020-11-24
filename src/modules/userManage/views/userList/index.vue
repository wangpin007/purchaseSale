<template>
  <c-query-table
    :loading="tableLoading"
    :query-form="queryForm"
    :columns="columns"
    :data="tableList"
    :total="tableTotal"
    @query-change="handleQueryChange"
  >
    <template slot="left">
      <el-button
        type="primary"
        @click="createUser"
      >
        新建用户
      </el-button>
    </template>
  </c-query-table>
</template>
<script>
import CQueryTable from 'lib@/components/c-query-table'
import { statuOptions } from 'mod@/userManage/config/status'
// 查询条件
function getQueryForm () {
  return [
    {
      label: '用户编号', // 表单标题
      formType: 'input', // 表单类型为 input
      valueType: 'string', // 值类型字符串
      name: 'code', // 表单字段名称
      placeholder: '请输入用户编号', // input占位符
      defaultExpand: true // 默认显示（true为显示| false为隐藏）
    },
    {
      label: '用户状态状态',
      formType: 'select', // 下拉类型
      name: 'status',
      defaultExpand: true,
      placeholder: '选择状态',
      options: statuOptions
    },
    {
      label: '创建日期',
      formType: 'datepicker', // 日期
      type: 'daterange', // 日期类别为 (日期的类型根据日期组件)
      name: ['startDate', 'endDate'], // 两个日期
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      defaultTime: ['00:00:00', '23:59:59'],
      defaultExpand: true
    },
    {
      label: '失效日期',
      formType: 'datepicker', // 日期
      name: 'failureData', // 单个日期
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      defaultExpand: true
    },
    {
      label: '年度',
      formType: 'datepicker',
      name: 'periodYear',
      type: 'year',
      defaultExpand: true,
      placeholder: '请选择'
    },
    {
      label: '用户名称',
      formType: 'input',
      valueType: 'string',
      name: 'name',
      placeholder: '请输入用户名称',
      defaultExpand: false
    }
  ]
}

function getColumns () {
  return [
    {
      type: 'index',
      label: '序号',
      minWidth: '60'
    },
    {
      label: '用户编号',
      prop: 'code',
      minWidth: '160',
      render: (h, { row }) => {
        return (
          <span>{ row.code }</span>
        )
      }
    },
    {
      label: '用户名称',
      prop: 'name',
      minWidth: '240',
      render: (h, { row }) => {
        return (<span>{ row.name }</span>)
      }
    },
    {
      label: '用户名称',
      prop: 'name',
      minWidth: '240',
      render: (h, { row }) => {
        return (<span>{ row.name }</span>)
      }
    },
    {
      label: '用户名称',
      prop: 'name',
      minWidth: '240',
      render: (h, { row }) => {
        return (<span>{ row.name }</span>)
      }
    },
    {
      label: '用户名称',
      prop: 'name',
      minWidth: '240',
      render: (h, { row }) => {
        return (<span>{ row.name }</span>)
      }
    },
    {
      label: '用户名称',
      prop: 'name',
      minWidth: '240',
      render: (h, { row }) => {
        return (<span>{ row.name }</span>)
      }
    },
    {
      label: '用户名称',
      prop: 'name',
      minWidth: '240',
      render: (h, { row }) => {
        return (<span>{ row.name }</span>)
      }
    },
    {
      label: '失效日期',
      minWidth: '100',
      prop: 'failureData',
      showOverflowTooltip: true,
      render: (h, { row }) => { // 日期渲染
        return (
          <span>{ row.failureData ? (this.$dayjs(row.failureData).format('YYYY-MM-DD')) : '' }</span>
        )
      }
    },
    {
      label: '操作',
      width: '100',
      fixed: 'right',
      render: (h, { row }) => {
        return (
          <ElButton
            type="text"
            onClick={() => { this.viewDetail(row) }}
          >
            查看详情
          </ElButton>
        )
      }
    }
  ]
}
export default {
  name: 'UserList',
  components: {
    CQueryTable
  },
  data () {
    return {
      queryForm: getQueryForm.call(this), // 查询条件
      columns: getColumns.call(this), // 表格列数据
      tableList: [], // 表格数据
      tableTotal: 0, // 分页数据
      tableLoading: false // 显示数据加载动画 （true|false）
    }
  },
  methods: {
    createUser () {
      // this.$nextTick(() => {
      //   this.$router.replace({ name: 'ProjectCreateProject' })
      // })
    },
    fetchUserList (query) {
      this.tableLoading = true
      // apiGetProjectList(query).then(({ code, data }) => {
      //   if (code === 0 && data) {
      //     this.tableTotal = data.total
      //     this.tableList = data.list
      //   }
      // }).finally(() => {
      //   this.tableLoading = false
      // })
    },
    handleQueryChange (queryParams) {
      // this.fetchUserList(queryParams)
    },
    // 查看详情
    viewDetail (row) {
      this.$router.push({
        name: 'userDetail',
        params: {
          id: row.id
        }
      })
    }
  }
}
</script>
