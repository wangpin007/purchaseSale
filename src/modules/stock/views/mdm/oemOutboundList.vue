<template>
  <magical-table
    ref="magicalTable"
    class="workshop"
    :loading="block.loading"
    :form="block.form"
    :table="block.table"
    :pagination="block.pagination"
    @onSubmit="onSubmit"
    @pageSizeChange="pageSizeChange"
    @pageNumChange="pageNumChange">
    <template #buttons>
      <el-button type="primary" :loading="block.loading1" @click="orderBackReview">单据反审核</el-button>
    </template>
  </magical-table>
</template>

<script>
  import MagicalTable from "lib@/components/awesome/magicalTable/main";

  export default {
    components: {MagicalTable},
    name: "oemOutboundList",
    data() {
      return {
        block: {
          loading: false,
          loading1: false,
          form: {
            formData: [
              {
                label: '单据类型',
                type: 'select',
                value: '',
                prop: 'orderType',
                options: []
              },
              {
                label: '单据号',
                value: '',
                prop: 'orderNum',
                type: 'text'
              },
              {
                label: '物料编码',
                value: '',
                prop: 'itemCode',
                type: 'text'
              },
              {
                label: '创建时间',
                value: '',
                prop: 'creationDate',
                type: 'datePicker',
                dateType: 'date'
              }
            ]
          },
          table: {
            tableData: [],
            columns: [
              {
                label: '',
                type: "selection",
                width: 50,
                fixed: 'left'
              },
              {
                label: '序号',
                type: "index",
                width: 50,
                fixed: 'left'
              },
              {
                label: '单据类型',
                prop: 'orderType',
                minWidth: 100,
                formatter: (row, column) => {
                  return this.$getLabelByValue(this.dict[column.property], row[column.property], 'label', 'value');
                }
              },
              {
                label: '出库单号',
                prop: 'orderNumber',
                minWidth: 130,
              },
              {
                label: '生产订单',
                prop: 'departmentCode',
                minWidth: 130
              },
              {
                label: '物料编码',
                prop: 'itemCode',
                minWidth: 130
              },
              {
                label: '物料名称',
                prop: 'itemName',
                width: 130
              },
              {
                label: '单位',
                prop: 'unit',
                minWidth: 80
              },
              {
                label: '批次号',
                prop: '',
                minWidth: 80
              },
              {
                label: '仓库',
                prop: 'itemName',
                width: 130
              },
              {
                label: '计划数量',
                prop: 'itemName',
                width: 130
              },
              {
                label: '扫码数量',
                prop: 'itemName',
                width: 130
              },
              {
                label: '创建人',
                prop: 'itemName',
                width: 130
              },
              {
                label: '创建时间',
                prop: 'itemName',
                width: 130
              },
              {
                label: '审核人',
                prop: 'itemName',
                width: 130
              },
              {
                label: '审核时间',
                prop: 'itemName',
                width: 130
              },
              {
                label: '状态',
                prop: 'status',
                width: 130,
                formatter: (row, column) => {
                  return this.$getLabelByValue(this.dict[column.property], row[column.property], 'label', 'value');
                }
              },

            ],
          },
          pagination: {
            total: 0,
            pageSize: 15,
            pageNum: 1,
          }
        },
        dict: {
          orderType: [
            {label: 'OEM成品出库', value: 'OEM_STOCK_OUT'},
            {label: 'OEM复检出库(自动)', value: 'OEM_SYS_STOCK_OUT'}
            ],
          status: [
            {label: '完成', value: 'FINISH'},
            {label: '未完成', value: 'UNFINISH'}
          ]
        },
      }
    },
    methods: {
      // 查询
      onSubmit(condition) {
        this.onSearch();
      },
      // pageSize
      pageSizeChange(pageSize) {
        this.block.pagination.pageNum = 1;
        this.block.pagination.pageSize = pageSize;
        this.onSearch();
      },
      // pageNum
      pageNumChange(currentPage) {
        this.block.pagination.pageNum = currentPage;
        this.onSearch();
      },
      onSearch() {
        let condition = this.getCondition();
        let data = {
          ...condition,
          pageSize: this.block.pagination.pageSize,
          pageNum: this.block.pagination.pageNum
        };
        let url = '/pss/member/department/listPage';
        this.block.loading = true;
        this.$http({url, method: 'post', data}).then(res => {
          this.block.loading = false;
          if (res && res.success) {
            this.block.pagination.total = res.data.total;
            this.block.table.tableData = res.data.list;
          }
        }).catch(() => {
          this.block.loading = false;
        });
      },
      // 单据反审核
      orderBackReview() {
        let slt = this.$refs['magicalTable'].getSelection();
        if(slt.length === 0){
          this.$message.warning('请勾选数据');
          return false;
        }
        this.$confirm("确认反审核吗？", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let params = slt.map(item => item.id);
          let url = '/pss/member/itemContainerType/batchDelete';
          this.block.loading1 = true;
          this.$http({
            url,
            data: params,
            method: 'post'
          }).then((res) => {
            this.block.loading1 = false;
            if(res.success){
              this.$message.success('操作成功！');
              this.onSearch();
            }
          }).catch(() => {
            this.block.loading1 = false;
          });
        });
      },
      getDict() {
        this.block.form.formData[0].options = this.dict.orderType;
      }
    },
    mounted() {
      this.getDict();
    }
  }
</script>

<style scoped>

</style>