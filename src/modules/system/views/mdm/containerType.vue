<template>
  <section>
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
      </template>
      <template #tableBody="{ row }">
        <el-tag :type="row.state === 'Y' ? 'success' : 'danger'">{{row.state === 'Y' ? '可用' : '禁用'}}</el-tag>
      </template>
    </magical-table>
    <magical-table
      type="dialog"
      :title="modal.title"
      :show="modal.show"
      @close="modal.show = false"
      :closeOnClickModal="false"
      width="30%"
      :needTable="false"
      :needPagination="false"
      :form="modal.form"
      ref="magicalTableModal">
      <div slot="footer" style="text-align: right">
        <el-Button type="primary" :loading="modal.loading" @click="handlerSave">保存</el-Button>
        <el-Button @click="modal.show = false">取消</el-Button>
      </div>
    </magical-table>
  </section>
</template>

<script>
  import magicalTable from 'lib@/components/awesome/magicalTable';
  import {parseTime} from "@/utils";
  import {downloadFileLink} from "@/utils/file";

  export default {
    name: "containerType",
    components: {
      magicalTable
    },
    data() {
      return {
        block: {
          printBtnLoading: false,
          loading: false,
          table: {
            tableData: [],
            columns: [
              {
                label: '容器类型编码',
                prop: "typeCode",
                width: 130,
                fixed: 'left'
              },
              {
                label: '容器类型名称',
                prop: 'typeName',
                minWidth: 130,
              },
              {
                label: '容器类型描述',
                prop: 'typeDesc',
                minWidth: 130,
              },

              {
                label: '状态',
                prop: 'state',
                width: 100,
                render: ({row}) => {
                  let item = this.dict.PSS_BASE_STATE.find(item => row.state === item.value);
                  return {
                    component: 'tag',
                    type: row.state === 'Y' ? 'success' : 'danger',
                    text: item ? item.label : ''
                  }
                },
              },
              {
                label: '来源',
                prop: 'dataSource',
                width: 100,
              },
              {
                label: '操作',
                width: 100,
                prop: 'operation',
                align: 'center',
                tooltip: false,
                render: () => {
                  let _this = this;
                  return {
                    component: 'buttons',
                    options: [
                      {
                        text: '修改',
                        type: 'text',
                        click({row, $index}) {
                          _this.handlerEdit(row, $index)
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
            pageSize: 100,
            pageNum: 1,
          }
        },
        modal: {
          title: '容器',
          show: false,
          currentIndex: -1,
          type: 'add',
          loading: false,
          form: {
            formData: [
              {
                label: '容器类型编码',
                type: 'text',
                prop: 'typeCode',
                value: '',
                disabled: false,
                span: 24,
                rules: {
                  required: true, message: '容器类型编码不能为空', trigger: 'change'
                }
              },
              {
                label: '容器类型名称',
                type: 'text',
                prop: 'typeName',
                disabled: false,
                value: '',
                span: 24,
                rules: {
                  required: true, message: '容器类型名称不能为空', trigger: 'change'
                }
              },
              {
                label: '容器描述',
                type: 'text',
                rows: 4,
                prop: 'typeDesc',
                disabled: false,
                value: '',
                span: 24,
                rules: {
                  required: true, message: '容器描述不能为空', trigger: 'change'
                }
              },
              {
                label: '状态',
                type: 'checkbox',
                disabled: false,
                value: 'Y',
                prop: 'state',
                trueLabel: 'Y',
                falseLabel: 'N',
                cLabel: '可用',
                span: 24,
              },
            ],
            settings: {
              needRightPart: false,
              labelWidth: '100px',
              formItemStyle: {
                marginBottom: '14px'
              }
            }
          }
        },
        dict: {
          PSS_BASE_STATE: [],
        },
      }
    },
    methods: {
      getDict() {
        return new Promise(resolve => {
          this.getDictByCodes(
            [
              'PSS_BASE_STATE',
            ],
            () => {
              resolve();
            }
          )
        });
      },
      // 批量获取字典接口
      getDictByCodes(codes, callback) {
        let params = codes;
        let url = '/pss/member/dict/item/map';
        let httpParams = {
          url: url,
          method: 'post',
          data: params
        };
        this.$http(httpParams).then(res => {
          if (res.success) {
            codes.forEach(code => {
              let dict = res.data[code];
              for (let name in dict) {
                this.dict[code].push({
                  label: dict[name],
                  value: name
                })
              }
            });
            callback && callback()
          }
        });
      },
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
        let params = {
          pageSize: this.block.pagination.pageSize,
          pageNo: this.block.pagination.pageNum
        };
        let url = '/pss/member/containerType/listPage';
        this.block.loading = true;
        this.$http({
          url,
          method: 'POST',
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
        this.setModalDisabled();
        this.$refs['magicalTableModal'].resetForm();
        this.modal.form.formData.find(i => i.prop === 'state').value = 'Y';
        this.modal.show = true;
      },
      // 修改
      handlerEdit(row, $index) {
        this.modal.type = 'edit';
        this.modal.currentIndex = $index;
        this.setModalDisabled();
        this.modal.form.formData.forEach(item => {
          item.value = row[item.prop];
        });
        this.modal.show = true;
      },
      // 设置弹框是否可编辑
      setModalDisabled() {
        if(this.modal.type === 'add'){
          this.modal.form.formData[0].disabled = false;
          this.modal.form.formData[1].disabled = false;
          this.modal.form.formData[3].disabled = true;
        }else if (this.modal.type === 'edit'){
          this.modal.form.formData[0].disabled = true;
          this.modal.form.formData[1].disabled = true;
          this.modal.form.formData[3].disabled = false;
        }

      },
      // 生成
      handlerSave() {
        let flag = this.$refs['magicalTableModal'].validateForm();
        if (flag) {
          let url;
          let data = this.$refs['magicalTableModal'].getCondition();
          if(this.modal.type === 'add') {
            url = '/pss/member/containerType/add';
          }else {
            url = '/pss/member/containerType/modify';
            let row = this.block.table.tableData[this.modal.currentIndex];
            data = {
              ...row,
              ...data
            }
          }
          this.modal.loading = true;
          this.$http({
            url,
            method: 'post',
            data,
          }).then((res) => {
            this.modal.loading = false;
            if(res.success){
              this.$message.success('操作成功！');
              this.modal.show = false;
              this.onSearch();
            }
          }).catch(() => {
            this.modal.loading = false;
          });
        }
      },
    },
    mounted() {
      this.getDict();
      this.onSearch();
    }
  }
</script>

<style scoped>

</style>