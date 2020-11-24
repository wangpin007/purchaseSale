<template>
  <section class="section">
    <magical-table
      ref="magicalTable"
      class="calc50"
      :loading="block.loading"
      :form="block.form"
      :table="block.table"
      :pagination="block.pagination"
      @onSubmit="onSubmit"
      @pageSizeChange="pageSizeChange"
      @pageNumChange="pageNumChange">
      <template #buttons>
        <el-button type="primary" :loading="block.loading1" @click="handlerExport">导出</el-button>
      </template>
    </magical-table>
  </section>
</template>

<script>
  import MagicalTable from "lib@/components/awesome/magicalTable/main";
  import {parseTime} from "@/utils";
  import {downloadFileLink} from "@/utils/file";
  export default {
    components: {MagicalTable},
    name: "boxTypeAndMateRelation",
    data() {
      return {
        block: {
          loading: false,
          loading1: false,
          form: {
            formData: [
              {
                label: '物料编码',
                prop: 'itemCode',
                type: 'quickSearch',
                span: 7,
                showKey: "itemCode",
                name: "item_display",
                value: '',
                callback: (selection, scope) => {
                  scope.value = selection.itemCode || '';
                }
              },
              {
                label: '箱型',
                value: '',
                prop: 'boxTypeCode',
                span: 7,
                type: 'text',
              },
              {
                label: '创建时间',
                type: 'datePicker',
                dateType: 'daterange',
                span: 10,
                rangeSeparator: '至',
                value: [],
                prop: 'creationDate',
                unlinkPanels: true
              },
            ],
            settings: {
              labelWidth: '90px',
              needCollapseBtn: false,
              rightPartStyle: {
                flex: '0 0 180px'
              }
            }
          },
          table: {
            tableData: [],
            columns: [
              {
                label: '序号',
                type: "index",
                width: 50,
                fixed: 'left'
              },
              {
                label: '箱型',
                prop: 'boxTypeCode',
                minWidth: 130,
              },
              {
                label: '物料编码',
                prop: 'itemCode',
                minWidth: 130,
              },
              {
                label: '物料描述',
                prop: 'itemName',
                minWidth: 130,
              },
              {
                label: '创建时间',
                prop: 'creationDate',
                minWidth: 130,
                formatter: (row) => {
                  return row.creationDate ? parseTime(row.creationDate) : '';
                }
              }
            ]
          },
          pagination: {
            total: 0,
            pageSize: 15,
            pageNum: 1,
          }
        }
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
      // 查询
      onSearch() {
        let condition = this.$refs['magicalTable'].getCondition();
        let params = {
          itemCode: condition.itemCode,
          boxTypeCode: condition.boxTypeCode,
          createDateFrom: (condition.creationDate && condition.creationDate.length !== 0) ? parseTime(condition.creationDate[0]) : '',
          createDateTo: (condition.creationDate && condition.creationDate.length !== 0)  ? parseTime(condition.creationDate[1]) : '',
          pageNo: this.block.pagination.pageNum,
          pageSize: this.block.pagination.pageSize
        };
        let url = '/pss/member/itemBoxType/listPage';
        this.block.loading = true;
        this.$http({
          url,
          method: 'post',
          data: params
        }).then(data => {
          this.block.loading = false;
          if (data && data.success) {
            this.block.pagination.total = data.data.total;
            this.block.table.tableData = data.data.list;
          }
        }).catch(() => {
          this.block.loading = false;
        });
      },
      // 导出
      handlerExport() {
        let condition = this.$refs['magicalTable'].getCondition();
        let params = {
          itemCode: condition.itemCode,
          boxTypeCode: condition.boxTypeCode,
          createDateFrom: (condition.creationDate && condition.creationDate.length !== 0) ? parseTime(condition.creationDate[0]) : '',
          createDateTo: (condition.creationDate && condition.creationDate.length !== 0)  ? parseTime(condition.creationDate[1]) : '',
        };
        downloadFileLink(
          "/pss/member/itemBoxType/export",
          "箱型与物料关系.xls",
          params || {}
        ).catch(() => {
          this.$message.error("下载失败");
        });
      },
    },
    mounted() {
      this.onSearch();
    }
  }
</script>

<style scoped>

</style>