<template>
  <section class="section">
    <magical-table
      ref="magicalTable"
      :loading="block.loading"
      :needQuery="false"
      :needLine="false"
      :table="block.table"
      :pagination="block.pagination"
      @onSubmit="onSubmit"
      @pageSizeChange="pageSizeChange"
      @pageNumChange="pageNumChange">
      <template #buttons>
        <el-button type="primary" @click="handlerAdd">新增</el-button>
        <el-button type="primary" :loading="block.loading1" @click="handlerDelete">删除</el-button>
      </template>
    </magical-table>
    <magical-table
      type="dialog"
      :title="modal.title"
      :show.sync="modal.show"
      :closeOnClickModal="false"
      width="30%"
      :needTable="false"
      :needPagination="false"
      :form="modal.form"
      ref="magicalTableModal1">
      <div slot="footer" style="text-align: right">
        <el-Button type="primary" @click="handlerSave" :loading="modal.loading">保存</el-Button>
        <el-Button @click="modal.show = false">取消</el-Button>
      </div>
    </magical-table>
  </section>
</template>

<script>
  import magicalTable from 'lib@/components/awesome/magicalTable';
  import {parseTime} from "@/utils";
  export default {
    name: "conTypeAndMateRelation",
    components: {
      magicalTable
    },
    data() {
      return {
        block: {
          loading: false,
          loading1: false,
          table: {
            tableData: [],
            columns: [
              {
                type: "selection",
                width: 50,
                fixed: 'left'
              },
              // {
              //   label: '序号',
              //   type: "index",
              //   width: 50,
              //   fixed: 'left'
              // },
              {
                label: '容器类型编码',
                prop: 'containerTypeCode',
                minWidth: 130,
              },
              {
                label: '容器类型名称',
                prop: 'containerTypeName',
                minWidth: 130,
              },
              {
                label: '物料编码',
                prop: 'itemCode',
                minWidth: 130,
              },
              {
                label: '物料名称',
                prop: 'itemName',
                minWidth: 130,
              },
              {
                label: '缺省数量',
                prop: 'quantity',
                width: 80
              },
              {
                label: '来源',
                prop: 'dataSource',
                minWidth: 130,
              },
              {
                label: '操作',
                width: 80,
                prop: 'operation',
                align: 'center',
                tooltip: false,
                render: () => {
                  return {
                    component: 'buttons',
                    options: [
                      {
                        text: '修改',
                        type: 'text',
                        click: ({row, $index}) => {
                          this.handlerEdit(row, $index)
                        }
                      }
                    ]
                  }

                },
                fixed: 'right'
              },
            ],
          },
          pagination: {
            total: 0,
            pageSize: 15,
            pageNum: 1,
          }
        },
        modal: {
          type: 'add',
          title: '容器类型与物料关系',
          show: false,
          form: {
            formData: [
              {
                label: '容器类型编码',
                prop: 'containerTypeId',
                type: 'quickSearch',
                showKey: "typeCode",
                showInput: null,
                name: "container_type_display",
                span: 24,
                value: '',
                callback: (selection, scope) => {
                  scope.value = selection.typeId;
                  this.modal.form.formData[1].value = selection.typeName;
                },
                style: 'width: 100%',
                rules: {required: true, message: '容器类型不能为空', trigger: 'change'},
                disabled: () => {
                  return this.modal.type === 'edit';
                }
              },
              {
                label: '容器类型名称',
                type: 'text',
                disabled: true,
                prop: 'containerTypeName',
                span: 24,
                value: '',
              },
              {
                label: '物料编码',
                prop: 'itemId',
                type: 'quickSearch',
                showKey: "itemCode",
                name: "item_display",
                showInput: null,
                span: 24,
                value: '',
                callback: (selection, scope) => {
                  scope.value = selection.itemId;
                  this.modal.form.formData[3].value = selection.itemName;
                },
                style: 'width: 100%',
                rules: {required: true, message: '容器类型不能为空', trigger: 'change'},
                disabled: () => {
                  return this.modal.type === 'edit';
                }
              },
              {
                label: '物料名称',
                type: 'text',
                prop: 'itemName',
                disabled: true,
                span: 24,
                value: '',
              },
              {
                label: '存放数量',
                type: 'inputNumber',
                value: 0,
                stepStrictly: true,
                controls: false,
                prop: 'quantity',
                // max: 1000,
                min: 0,
                span: 24,
                style: 'width: 100%',
                rules: {required: true, message: '生成数量不能为空', trigger: 'change'}
              },
            ],
            settings: {
              needRightPart: false,
              labelWidth: '110px',
              formItemStyle: {marginBottom: '12px'},
              clearDisabledValue: true
            }
          },
          typeId: '',
          typeName: '',
          loading: false
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
      // 查询
      onSearch() {
        let params = {pageSize: this.block.pagination.pageSize, pageNo: this.block.pagination.pageNum};
        let url = '/pss/member/itemContainerType/listPage';
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
      // 新增
      handlerAdd() {
        this.modal.type = 'add';
        this.$refs['magicalTableModal1'].resetForm();
        this.modal.show = true;
      },
      // 修改
      handlerEdit(row, index){
        this.modal.type = 'edit';
        this.modal.currentIndex = index;
        this.modal.show = true;
        this.$nextTick(() => {
          this.$refs['magicalTableModal1'].setFormDefaultValue({
            ...row,
            containerTypeId: row.containerTypeCode, // 防止触发校验报必填
            itemId: row.itemCode // 防止触发校验报必填
          });
          this.$refs['magicalTableModal1'].setInputByName('container_type_display', row.containerTypeCode);
          this.$refs['magicalTableModal1'].setInputByName('item_display', row.itemCode);
        })
      },
      // 保存
      handlerSave() {
        let flag = this.$refs['magicalTableModal1'].validateForm();
        let params = this.$refs['magicalTableModal1'].getCondition();
        let isDefault;
        let url;
        if(this.modal.type === 'add'){
          url = '/pss/member/itemContainerType/add';
          isDefault = 'Y';
        }else {
          url = '/pss/member/itemContainerType/modify';
          isDefault = 'N';
          params = {
            id: this.block.table.tableData[this.modal.currentIndex].id,
            version: this.block.table.tableData[this.modal.currentIndex].version,
            quantity: params.quantity,
          }
        }
        if (flag) {
          if(params.quantity === 0){ this.$message.warning('存放数量不能为0'); return}
          this.modal.loading = true;
          this.$http({
            url,
            data: {...params, isDefault},
            method: 'post'
          }).then((res) => {
            this.modal.loading = false;
            if(res.success){
              this.$message.success('保存成功！');
              this.modal.show = false;
              this.onSearch();
            }
          }).catch(() => {
            this.modal.loading = false;
          })
        }
      },
      // 删除
      handlerDelete() {
        let slt = this.$refs['magicalTable'].getSelection();
        if(slt.length === 0){
          this.$message.warning('请勾选数据');
          return false;
        }
        this.$confirm("确认删除吗？", {
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
              this.$message.success('删除成功');
              this.onSearch();
            }
          }).catch(() => {
            this.block.loading1 = false;
          });
        });
      }
    },
    mounted() {
      this.onSearch();
    }
  }
</script>

<style scoped lang="scss">
  .section/deep/ .el-input-number .el-input__inner{
    text-align: left;
  }
</style>