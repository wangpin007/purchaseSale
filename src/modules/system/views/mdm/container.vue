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
        <el-button type="primary" @click="handlerAdd">新增</el-button>
        <el-button type="primary" @click="handlerPreview">打印预览</el-button>
        <el-button type="primary" :loading="block.loading1" @click="handlerPrint">打印</el-button>
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
      ref="magicalTableModal1">
      <div slot="footer" style="text-align: right">
        <el-Button type="primary" @click="handlerSave" :loading="modal.loading" >生成</el-Button>
        <el-Button @click="modal.show = false">取消</el-Button>
      </div>
    </magical-table>
    <magical-table
      type="dialog"
      :title="modal2.title"
      :show="modal2.show"
      @close="modal2.show = false"
      :closeOnClickModal="false"
      width="30%"
      :needTable="false"
      :needPagination="false"
      :form="modal2.form"
      ref="magicalTableModal2">
      <div slot="footer" style="text-align: right">
        <el-Button type="primary" :loading="modal2.loading" @click="handlerSave2">保存</el-Button>
        <el-Button @click="modal2.show = false">取消</el-Button>
      </div>
    </magical-table>
    <div id="containerCodePrint" style="display: none"></div>
  </section>

</template>

<script>
  import magicalTable from 'lib@/components/awesome/magicalTable';
  import {parseTime} from "@/utils";
  import {downloadFileLink} from "@/utils/file";
  import JsBarcode from 'jsbarcode'
  import getLodop from '@/utils/lodopFuncs'

  export default {
    name: "container",
    components: {
      magicalTable
    },
    data() {
      return {
        block: {
          loading1: false,
          loading: false,
          form: {
            formData: [
              {
                label: '容器类型',
                prop: 'typeCode',
                type: 'quickSearch',
                showKey: "typeName",
                name: "container_type_display",
                value: '',
                callback: (selection, scope) => {
                  scope.value = selection.typeCode;
                }
              },
              {
                label: '容器条码',
                value: '',
                prop: 'containerCode',
                type: 'text',
              },
              {
                label: '容器状态',
                value: '',
                prop: 'status',
                type: 'select',
                options: []
              },
              {
                label: '使用状态',
                value: '',
                prop: 'state',
                type: 'select',
                options: []
              },
            ],
            // settings: {
            //   isCollapse: false
            // }
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
                label: '容器条码',
                prop: 'containerCode',
                minWidth: 130,
              },
              {
                label: '容器名称',
                prop: 'containerName',
                minWidth: 130,
              },
              {
                label: '容器类型',
                prop: 'typeCode',
                minWidth: 130,
              },
              {
                label: '容器类型名称',
                prop: 'typeName',
                minWidth: 130,
              },
              {
                label: '容器状态',
                prop: 'status',
                minWidth: 80,
                formatter: (row) => {
                  return this.$getLabelByValue(this.dict['PSS_CONTAINER_STATUS'], row.status, 'label', 'value');
                }
              },
              {
                label: '使用状态',
                prop: 'state',
                minWidth: 80,
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
                minWidth: 130,
              },
              {
                label: '箱型',
                prop: 'boxTypeCode',
                minWidth: 80,
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
            ]
          },
          pagination: {
            total: 0,
            pageSize: 15,
            pageNum: 1,
          }
        },
        modal: {
          title: '容器生成',
          show: false,
          form: {
            formData: [
              {
                label: '条码规则',
                type: 'select',
                prop: 'ruleCode',
                value: '',
                options: [],
                span: 24,
                rules: {required: true, message: '条码规则不能为空', trigger: 'change'}
              },
              {
                label: '容器类型',
                prop: 'typeCode',
                type: 'quickSearch',
                showKey: "typeName",
                showInput: null,
                name: "container_type_display",
                span: 24,
                value: '',
                callback: (selection, scope) => {
                  scope.value = selection.typeCode;
                  this.modal.typeId = selection.typeId;
                  this.modal.typeName = selection.typeName;
                },
                style: 'width: 100%',
                rules: {required: true, message: '容器类型不能为空', trigger: 'change'}
              },
              {
                label: '生成数量',
                type: 'inputNumber',
                value: 0,
                stepStrictly: true,
                controls: false,
                prop: 'generateNum',
                max: 1000,
                min: 0,
                span: 24,
                style: 'width: 100%',
                rules: {required: true, message: '生成数量不能为空', trigger: 'change'}
              }
            ],
            settings: {
              needRightPart: false,
              labelWidth: '80px',
              formItemStyle: {marginBottom: '12px'}
            }
          },
          typeId: '',
          typeName: '',
          loading: false,
        },
        modal2: {
          title: '容器编辑',
          show: false,
          form: {
            formData: [
              {
                label: '容器编码',
                type: 'text',
                prop: 'containerCode',
                value: '',
                disabled: true,
                span: 24
              },
              {
                label: '容器名称',
                type: 'text',
                prop: 'containerName',
                value: '',
                span: 24
              },
              {
                label: '箱型',
                type: 'text',
                prop: 'boxTypeCode',
                value: '',
                span: 24
              },
              {
                label: '状态',
                type: 'checkbox',
                disabled: true,
                value: '',
                prop: 'state',
                trueLabel: 'Y',
                falseLabel: 'N',
                cLabel: '可用',
                span: 24,
              },
            ],
            settings: {
              needRightPart: false,
              labelWidth: '80px',
              formItemStyle: {marginBottom: '12px'}
            }
          },
          currentIndex: null,
          loading: false
        },
        dict: {
          PSS_BASE_STATE: [],
          PSS_CONTAINER_STATUS: [],
          CONTAINER_BARCODE_RULE: []
        },
        LODOP: null
      }
    },
    methods: {
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
        let condition = this.$refs['magicalTable'].getCondition();
        let params = {...condition, pageSize: this.block.pagination.pageSize, pageNo: this.block.pagination.pageNum};
        let url = '/pss/member/container/listPage';
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
      getDict() {
        return new Promise(resolve => {
          this.getDictByCodes(
            [
              'PSS_BASE_STATE',
              'PSS_CONTAINER_STATUS',
              'CONTAINER_BARCODE_RULE'
            ],
            () => {
              this.block.form.formData[3].options = this.dict['PSS_BASE_STATE'];
              this.block.form.formData[2].options = this.dict['PSS_CONTAINER_STATUS'];
              this.modal.form.formData[0].options = this.dict['CONTAINER_BARCODE_RULE'];
              resolve();
            }
          )
        });
      },
      // 打印预览
      handlerPreview() {
        let slt = this.$refs['magicalTable'].getSelection();
        if(slt.length === 0){
          this.$message.warning('请勾选数据预览！');
          return
        }
        slt.forEach(item => {
          this.LODOP = getLodop();
          this.LODOP.PRINT_INITA(0, 0, 522, 333, "");
          this.LODOP.SET_PRINT_PAGESIZE(0, 880, 250, "");
          this.AddPrintContent(item.containerCode);
          this.LODOP.PREVIEW();
        });
      },
      // 打印
      handlerPrint() {
        let slt = this.$refs['magicalTable'].getSelection();
        if(slt.length === 0){
          this.$message.warning('请勾选数据！');
          return
        }
        this.$confirm('确认打印？', '提示', {
          type: 'warning'
        }).then(() => {
          slt.forEach(item => {
            this.LODOP = getLodop();
            this.LODOP.PRINT_INITA(0, 0, 522, 333, "");
            this.LODOP.SET_PRINT_PAGESIZE(0, 880, 250, "");
            this.AddPrintContent(item.containerCode);
            this.LODOP.PRINT();
          });
        });
      },
      AddPrintContent(code) {
        this.LODOP.ADD_PRINT_BARCODE(0, 0, 276, 60,"128A", code);
        this.LODOP.SET_PRINT_STYLEA(16, "FontColor", 0);
      },
      // 新增
      handlerAdd() {
        this.modal.show = true;
        this.$refs['magicalTableModal1'].resetForm();
      },
      // 生成
      handlerSave() {
        let flag = this.$refs['magicalTableModal1'].validateForm();
        let params = this.$refs['magicalTableModal1'].getCondition();
        if (flag) {
          if(params.generateNum === 0){ this.$message.warning('生成数量不能为0'); return}
          let url = '/pss/member/container/add';
          this.modal.loading = true;
          this.$http({
            url,
            data: {...params, typeId: this.modal.typeId, typeName: this.modal.typeName },
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
          });
        }
      },
      // 保存
      handlerSave2() {
        let url = '/pss/member/container/modify';
        let condition = this.$refs['magicalTableModal2'].getCondition();
        let params ={
          containerId: this.block.table.tableData[this.modal2.currentIndex].containerId,
          containerName: condition.containerName,
          boxTypeCode: condition.boxTypeCode,
          state: condition.state,
          version: this.block.table.tableData[this.modal2.currentIndex].version
        };
        this.modal2.loading = true;
        this.$http({
          url,
          data: params,
          method: 'post'
        }).then((res) => {
          this.modal2.loading = false;
          if(res.success){
            this.$message.success('修改成功！');
            this.modal2.show = false;
            this.onSearch();
          }
        }).catch(() => {
          this.modal2.loading = false;
        });
      },
      // 修改
      handlerEdit(row, index){
        this.modal2.show = true;
        this.modal2.currentIndex = index;
        this.modal2.form.formData.forEach(item => {
          item.value = row[item.prop];
        });
        this.modal2.form.formData[1].disabled = true;
        this.modal2.form.formData[2].disabled = true;
        if(row.dataSource === 'CLOUD'){
          this.modal2.form.formData[1].disabled = false;
        }
        if(row.status === 'IDLE'){
          this.modal2.form.formData[2].disabled = false;
        }
      },
      // 打印
      printpage(myDiv){
        var newstr = document.getElementById(myDiv).innerHTML;
        var oldstr = document.body.innerHTML;
        document.body.innerHTML = newstr;
        window.print();
        document.body.innerHTML = oldstr;
        location.reload();
        return false;
      },
    },
    mounted() {
      this.getDict();
      this.onSearch();
    }
  }
</script>

<style scoped lang="less">
  .section/deep/ .el-input-number .el-input__inner{
    text-align: left;
  }
</style>