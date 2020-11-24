<template>
  <section class="section">
    <magical-table
      ref="magicalTable"
      :loading="block.loading"
      :form="block.form"
      :table="block.table"
      :pagination="block.pagination"
      @onSubmit="onSubmit"
      @pageSizeChange="pageSizeChange"
      @pageNumChange="pageNumChange">
      <template #buttons>
        <el-button type="primary" @click="handlerAdd">新增</el-button>
        <div style="display: inline-block; padding: 0 11px;">
          <m-import
            ref="import"
            :title="iModal.title"
            :extraData="iModal.extraData"
            :upLoadUrl="iModal.upLoadUrl"
            :upLoadResultUrl="iModal.upLoadResultUrl"
            @downloadTemplate="downloadTemplate"
            @handleSuccess="uploadSuccess"
            :showSuccessDeal="true"
          ></m-import>
        </div>
        <el-button type="primary" :loading="block.loading2" @click="handlerExport">导出</el-button>
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
        <el-Button type="primary" @click="handlerSave" :loading="modal.loading">保存</el-Button>
        <el-Button @click="modal.show = false">取消</el-Button>
      </div>
    </magical-table>
  </section>
</template>

<script>
  import magicalTable from 'lib@/components/awesome/magicalTable';
  import {parseTime} from "@/utils";
  import {downloadFileLink} from "@/utils/file";
  import MImport from "lib@/components/import";
  export default {
    name: "vehicleManagement",
    components: {
      magicalTable,
      MImport
    },
    data() {
      return {
        block: {
          loading: false,
          loading1: false,
          loading2: false,
          form: {
            formData: [
              {
                label: '运输车牌',
                value: '',
                prop: 'registrationNumber',
                type: 'text'
              },
              {
                label: '司机姓名',
                value: '',
                prop: 'driverName',
                type: 'text'
              },
              {
                label: 'RFID',
                value: '',
                prop: 'rfid',
                type: 'text'
              },
              {
                label: '状态',
                value: '',
                prop: 'state',
                type: 'select',
                options: []
              },
              {
                label: '生效日期',
                value: '',
                prop: 'enableDatetime',
                type: 'datePicker',
                dateType: 'date',
                valueFormat: 'yyyy-MM-dd'
              },
              {
                label: '失效日期',
                value: '',
                prop: 'disableDatetime',
                type: 'datePicker',
                dateType: 'date',
                valueFormat: 'yyyy-MM-dd'
              }
            ]
          },
          table: {
            tableData: [],
            columns: [
              // {
              //   type: "selection",
              //   width: 50,
              //   fixed: 'left'
              // },
              // {
              //   label: '序号',
              //   type: "index",
              //   width: 50,
              //   fixed: 'left'
              // },
              {
                label: '运输车牌',
                prop: 'registrationNumber',
                minWidth: 90,
              },
              {
                label: '司机姓名',
                prop: 'driverName',
                minWidth: 80,
              },
              {
                label: '证件号',
                prop: 'rfid',
                minWidth: 130,
              },
              {
                label: '行驶证号',
                prop: 'vehicleIdentityNumber',
                minWidth: 130,
              },
              {
                label: '联系电话',
                prop: 'driverMobileNumber',
                width: 130
              },
              {
                label: '生效日期',
                prop: 'enableDatetime',
                minWidth: 130,
              },
              {
                label: '失效日期',
                prop: 'disableDatetime',
                minWidth: 130,
              },
              {
                label: '状态',
                prop: 'state',
                minWidth: 130,
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
          title: '车辆新增',
          show: false,
          form: {
            formData: [
              {
                label: '运输车牌',
                prop: 'registrationNumber',
                type: 'text',
                span: 24,
                value: '',
                rules: {required: true, message: '运输车牌不能为空', trigger: 'change'},
                disabled: () => {
                  return this.modal.type === 'edit'
                }
              },
              {
                label: '行驶证号',
                type: 'text',
                prop: 'vehicleIdentityNumber',
                span: 24,
                value: '',
                rules: {required: true, message: '行驶证号不能为空', trigger: 'change'},
                disabled: () => {
                  return this.modal.type === 'edit'
                }
              },
              {
                label: 'RFID',
                prop: 'rfid',
                type: 'text',
                span: 24,
                value: '',
                disabled: () => {
                  return this.modal.type === 'edit'
                }
              },
              {
                label: '司机姓名',
                type: 'text',
                prop: 'driverName',
                rules: {required: true, message: '司机姓名不能为空', trigger: 'change'},
                span: 24,
                value: '',
              },
              {
                label: '联系电话',
                type: 'text',
                value: '',
                prop: 'driverMobileNumber',
                span: 24,
              },
              {
                label: '身份证',
                type: 'text',
                value: '',
                prop: 'identity',
                span: 24,
                rules: {required: true, message: '身份证不能为空', trigger: 'change'},
              },
              {
                label: '生效日期',
                value: '',
                prop: 'enableDatetime',
                type: 'datePicker',
                span: 24,
                valueFormat: 'yyyy-MM-dd',
                dateType: 'date'
              },
              {
                label: '失效日期',
                value: '',
                prop: 'disableDatetime',
                type: 'datePicker',
                span: 24,
                valueFormat: 'yyyy-MM-dd',
                dateType: 'date'
              }
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
          loading: false,
          type: 'add'
        },
        dict: {
          PSS_BASE_STATE: []
        },
        iModal: {
          title: "导入",
          extraData:{},
          upLoadUrl: "/pss/member/vehicle/import",
          upLoadResultUrl: "/pss/member/vehicle/import/result",
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
        let condition = this.$refs['magicalTable'].getCondition();
        let params = {
          ...condition,
          pageSize: this.block.pagination.pageSize,
          pageNo: this.block.pagination.pageNum
        };
        let url = '/pss/member/vehicle/listPage';
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
            this.block.table.tableData.map(item => {
              let startTimes = item.enableDatetime ? new Date(item.enableDatetime).getTime() : -Infinity;
              let endTimes = item.disableDatetime ? new Date(item.disableDatetime).getTime() : Infinity;
              let nowTimes = new Date().getTime();
              item.state = (nowTimes > startTimes && nowTimes < endTimes) ? 'Y' : 'N';
            })
          }
        }).catch(() => {
          this.block.loading = false;
        });
      },
      // 新增
      handlerAdd() {
        this.modal.type = 'add';
        this.modal.show = true;
        this.$refs['magicalTableModal1'].resetForm();
        this.$nextTick(() => {
          this.$refs['magicalTableModal1'].setFormDefaultValue({
            enableDatetime: parseTime(new Date(), '{y}-{m}-{d}'),
            disableDatetime: parseTime(this.getAfter30Year(), '{y}-{m}-{d}')
          });
        });
      },
      // 修改
      handlerEdit(row, index){
        this.modal.type = 'edit';
        this.modal.currentIndex = index;
        this.modal.show = true;
        this.$nextTick(() => {
          this.$refs['magicalTableModal1'].setFormDefaultValue({
            ...row,
            enableDatetime: row.enableDatetime ? row.enableDatetime.split(' ')[0] : '',
            disableDatetime: row.disableDatetime ? row.disableDatetime.split(' ')[0] : '',
          });
        });
      },
      // 保存
      handlerSave() {
        let flag = this.$refs['magicalTableModal1'].validateForm();
        let params = this.$refs['magicalTableModal1'].getCondition();
        let url;
        if(this.modal.type === 'add'){
          url = '/pss/member/vehicle/add';
        }else {
          url = '/pss/member/vehicle/modify';
          params = {
            vehicleId: this.block.table.tableData[this.modal.currentIndex].vehicleId,
            ...params
          }
        }
        if (flag) {
          this.modal.loading = true;
          this.$http({
            url,
            data: params,
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
      // 下载模板
      downloadTemplate() {
        downloadFileLink('/pss/member/vehicle/template' , parseTime(new Date()) +'_导出.xls' ).catch(() => {
          this.$message.error('下载失败')
        })
      },
      // 导入完成
      uploadSuccess(){
        this.onSearch();
      },
      // 导出
      handlerExport() {
        let params = this.$refs['magicalTable'].getCondition();
        downloadFileLink(
          "/pss/member/vehicle/export",
          "车辆信息.xls",
          params || {}
        ).catch(() => {
          this.$message.error("下载失败");
        });
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
      },
      getDict() {
        return new Promise(resolve => {
          this.getDictByCodes(
            [
              'PSS_BASE_STATE',
            ],
            () => {
              this.block.form.formData[3].options = this.dict['PSS_BASE_STATE'];
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
      getAfter30Year(){
        let t = new Date();
        let iToDay=t.getDate();
        let iToMon=t.getMonth();
        let iToYear=t.getFullYear();
        let iToHouse=t.getHours();
        let iToMinutes=t.getMinutes();
        let iToSeconds=t.getSeconds();
        return new Date(iToYear + 30, iToMon, iToDay, iToHouse, iToMinutes, iToSeconds);
      },
    },
    mounted() {
      this.getDict();
      this.onSearch();
    }
  }
</script>

<style scoped lang="scss">
  .section /deep/ .el-dialog__wrapper {
    z-index: 2001!important;
  }
  .section/deep/ .v-modal{
    z-index: 2000!important;
  }
</style>