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
        @click="addNew"
      >
        新建
      </el-button>
    </template>
  </c-query-table>
</template>
<script>
import CQueryTable from 'lib@/components/c-query-table'
import { tabTodoWatch, tabTodoMixin } from '@/utils/mixins'
import Form from './Form'
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
      label: '活动编号',
      prop: 'code',
      minWidth: '100',
      render: (h, { row }) => {
        return (
          <span>{ row.code }</span>
        )
      }
    }, {
      label: '活动名称',
      prop: 'name',
      minWidth: '160',
      render: (h, { row }) => {
        return (
          <span>{ row.name }</span>
        )
      }
    }, {
      label: '活动区域',
      prop: 'region',
      minWidth: '100',
      render: (h, { row }) => {
        return (
          <span>{ row.region }</span>
        )
      }
    }, {
      label: '活动时间1',
      prop: 'date1',
      minWidth: '100',
      render: (h, { row }) => {
        return (
          <span>{ row.date1 }</span>
        )
      }
    }, {
      label: '活动时间2',
      prop: 'date2',
      minWidth: '100',
      render: (h, { row }) => {
        return (
          <span>{ row.date2 }</span>
        )
      }
    }, {
      label: '活动性质',
      prop: 'type',
      minWidth: '100',
      render: (h, { row }) => {
        return (
          <span>{ row.type }</span>
        )
      }
    }, {
      label: '活动形式',
      prop: 'desc',
      minWidth: '100',
      render: (h, { row }) => {
        return (
          <span>{ row.desc }</span>
        )
      }
    },
    {
      label: '特殊资源',
      prop: 'resource',
      minWidth: '100',
      render: (h, { row }) => {
        return (<span>{ row.resource }</span>)
      }
    },
    {
      label: '即时配送',
      prop: 'delivery',
      minWidth: '100',
      render: (h, { row }) => {
        return (
          <span>{ row.delivery ? '是' : '否' }</span>
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
  name: 'List1',
  components: {
    CQueryTable
  },
  mixins: [tabTodoWatch, tabTodoMixin],
  data () {
    return {
      queryForm: getQueryForm.call(this), // 查询条件
      columns: getColumns.call(this), // 表格列数据
      tableList: [],
      tableTotal: 0, // 分页数据
      tableLoading: false
    }
  },
  created () {
    /**
     * code: '',
     name: '',
     region: '',
     date1: '',
     date2: '',
     delivery: false,
     type: [],
     resource: '',
     desc: ''
     */

    this.tableList = [
      {
        index: 1,
        code: '编码1',
        name: '名称1',
        region: '区域1',
        date1: '2020-01-21',
        date2: '2020-02-11',
        delivery: false,
        type: '类型1',
        resource: '活动资源1',
        desc: '活动形式1',
        failureData: '2019-12-19 18:10:49'
      }
    ]
  },
  methods: {
    addNew () {
      // 打开tab页面-------'订货输入(新增)',
      this.$emit('tab-add', {
        component: Form,
        params: { flag: 'add' },
        title: '列表新增',
        name: 'FormDemo'
      })
    },
    handleQueryChange (queryParams) {

      // this.fetchUserList(queryParams)
    },
    insertNew (val) {
      if (val && val.includes('{') && val.includes('}')) {
        let item = JSON.parse(val)
        this.tableList.push(item)
        this.tableTotal = this.tableList.length
      }
    }
  }
}
</script>
