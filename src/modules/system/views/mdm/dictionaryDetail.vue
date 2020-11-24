<template>
  <section class="section">
    <magical-table
      ref="magicalTable"
      class="calc85"
      :loading="block.loading"
      :form="block.form"
      :table="block.table"
      :pagination="block.pagination"
      :needPagination="false"
      @onSubmit="onSubmit">
      <template #buttons>
        <el-button type="primary" @click="handlerAdd">新增</el-button>
        <el-button type="primary" :loading="block.loading1" @click="handlerDelete">删除</el-button>
      </template>
    </magical-table>
    <magical-table
      type="dialog"
      :title="modal.title"
      :show="modal.show"
      @close="modal.show = false"
      :closeOnClickModal="false"
      width="35%"
      :needTable="false"
      :needPagination="false"
      :form="modal.form"
      ref="magicalTableModal1">
      <div slot="footer" style="text-align: right">
        <el-Button type="primary" @click="handlerSave" :loading="modal.loading" >保存</el-Button>
        <el-Button @click="modal.show = false">取消</el-Button>
      </div>
    </magical-table>
  </section>
</template>
<script>
  import {parseTime} from '@/utils'
  import MagicalTable from "lib@/components/awesome/magicalTable/main";

  export default {
    name: 'dictionaryDetail',
    components: {
      MagicalTable,
    },
    data () {
      return {
        block: {
          loading: false,
          loading1: false,
          form: {
            formData: [
              {
                label: '字典编码',
                disabled: true,
                value: '',
                prop: 'dictCode',
                type: 'text',
              },
              {
                label: '字典名称',
                disabled: true,
                value: '',
                prop: 'dictName',
                type: 'text'
              },
              {
                label: '字典描述',
                disabled: true,
                value: '',
                prop: 'description',
                type: 'text'
              },
              {
                label: '条目编码',
                value: '',
                prop: 'dictItemCode',
                type: 'text',
              },
              {
                label: '条目名称',
                value: '',
                prop: 'dictItemName',
                type: 'text'
              },
              {
                label: '条目描述',
                value: '',
                prop: 'itemdescription',
                type: 'text'
              },
              {
                label: '状态',
                prop: 'enabled',
                value: '',
                type: 'select',
                options: [
                  {value: 'Y', label: '有效'},
                  {value: 'N', label: '无效'}
                ]
              }
              // {
              //   label: '生效日期',
              //   value: '',
              //   prop: 'enableTime',
              //   type: 'datePicker',
              //   dateType: 'date'
              // },
              // {
              //   label: '失效日期',
              //   value: '',
              //   prop: 'disableTime',
              //   type: 'datePicker',
              //   dateType: 'date'
              // }
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
                prop: 'dictItemCode',
                label: '条目编码',
              },
              {
                label: '条目名称',
                prop: 'dictItemName',
              },
              { prop: 'description',
                label: '条目描述',
              },
              {
                prop: 'enableDatetime',
                label: '生效日期'
              },
              {
                prop: 'disableDatetime',
                label: '失效日期'
              },
              {
                label: '状态',
                prop: 'enabled',
                minWidth: 80,
                render: ({row}) => {
                  let item = this.dict.enabled.find(item => row.enabled === item.value);
                  return {
                    component: 'tag',
                    type: row.enabled === 'Y' ? 'success' : 'danger',
                    text: item ? item.label : ''
                  }
                },
              },
              {
                prop: 'creationDate',
                label: '创建时间'
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
          title: '',
          show: false,
          form: {
            formData: [
              {
                label: '条目编码',
                value: '',
                prop: 'dictItemCode',
                disabled: () => {
                  return this.modal.type === 'edit';
                },
                type: 'text',
                span: 24,
                rules: {required: true, message: '条目编码不能为空', trigger: 'change'}
              },
              {
                label: '条目名称',
                value: '',
                prop: 'dictItemName',
                type: 'text',
                span: 24,
                rules: {required: true, message: '条目名称不能为空', trigger: 'change'}
              },
              {
                label: '条目描述',
                value: '',
                prop: 'description',
                type: 'text',
                span: 24,
              },
              {
                label: '生效日期',
                value: '',
                prop: 'enableDatetime',
                type: 'datePicker',
                dateType: 'date',
                span: 24,
                rules: {required: true, message: '生效日期不能为空', trigger: 'change'}
              },
              {
                label: '失效日期',
                value: '',
                prop: 'disableDatetime',
                type: 'datePicker',
                dateType: 'date',
                span: 24,
                rules: {required: true, message: '失效日期不能为空', trigger: 'change'}
              }
            ],
            settings: {
              needRightPart: false,
              labelWidth: '80px',
              formItemStyle: {marginBottom: '12px'},
              clearDisabledValue: true
            }
          },
          loading: false,
          type: ''
        },
        dict: {
          type: [
            {label: '系统', value: 'PUBLIC'},
            {label: '用户', value: 'VENDOR'}
          ],
          enabled: [
            {label: '有效', value: 'Y'},
            {label: '无效', value: 'N'}
          ]
        }
      }
    },
    methods: {
     onSubmit(condition) {
        this.onSearch();
      },
      // 查询
      onSearch() {
        let condition = this.$refs['magicalTable'].getCondition();
        let params = {
          "dictId": this.params.id,
          "dictItemCode": condition.dictItemCode,
          "dictItemName" : condition.dictItemName,
          "description" : condition.itemdescription,
          // "enableTime" : condition.enableTime ? condition.enableTime.getTime() : '',
          // "disableTime" : condition.disableTime ? condition.disableTime.getTime() : '',
          enabled: condition.enabled,
          "pageNo" : 1,
          "pageSize" : 10000
        };
        let url = '/pss/member/dict/item/list';
        this.block.loading = true;
        this.$http({
          url,
          method: 'POST',
          data: params,
          loading:true
        }).then(data => {
          this.block.loading = false;
          if (data && data.success) {
            this.block.table.tableData = data.data.list;
            this.block.table.tableData.map(item => {
              let startTimes = item.enableDatetime ? new Date(item.enableDatetime).getTime() : -Infinity;
              let endTimes = item.disableDatetime ? new Date(item.disableDatetime).getTime() : Infinity;
              let nowTimes = new Date().getTime();
              item.enabled = (nowTimes > startTimes && nowTimes < endTimes) ? 'Y' : 'N';
            })
          }
        }).catch(() => {
          this.block.loading = false;
        });
      },

      handlerAdd() {
        this.$refs['magicalTableModal1'].resetForm();
        this.modal.form.formData[3].value = new Date();
        this.modal.form.formData[4].value = this.getAfter30Year();
        this.modal.show = true;
        this.modal.type = 'add';
        this.modal.title = '条目新增';
      },
      // 获取30年之后的时间
      getAfter30Year() {
        let t = new Date();
        let iToDay=t.getDate();
        let iToMon=t.getMonth();
        let iToYear=t.getFullYear();
        let iToHouse=t.getHours();
        let iToMinutes=t.getMinutes();
        let iToSeconds=t.getSeconds();
        return new Date(iToYear + 30, iToMon, iToDay, iToHouse, iToMinutes, iToSeconds);
      },
      // 生成
      handlerSave() {
        let flag = this.$refs['magicalTableModal1'].validateForm();
        let params = this.$refs['magicalTableModal1'].getCondition();
        let url = '';
        let method = '';
        if(this.modal.type === 'add'){
          url = '/pss/member/dict/item';
          params = {
            "dictId" : this.params.id,
            "dictCode": this.params.dictCode,
            "dictItemCode": params.dictItemCode,
            "dictItemName": params.dictItemName,
            "description": params.description,
            "enableDatetime": params.enableDatetime ? params.enableDatetime.getTime() : '',
            "disableDatetime": params.disableDatetime ? params.disableDatetime.getTime() : ''
          };
          method = 'put';
        }else {
          url = '/pss/member/dict/item/modify';
          params ={
            "id" :  this.block.table.tableData[this.modal.currentIndex].id,
            "dictItemName": params.dictItemName,
            "description": params.description,
            "dictItemCode": params.dictItemCode,
            "enableDatetime": params.enableDatetime ? params.enableDatetime.getTime() : '',
            "disableDatetime": params.disableDatetime ? params.disableDatetime.getTime() : ''
          };
          method = 'post';
        }
        if (flag) {
          this.modal.loading = true;
          this.$http({
            url: url,
            method,
            data: params,
          }).then(data => {
            this.modal.loading = false;
            if (data && data.success) {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.onSearch();
              this.modal.show = false;
            }
          }).catch(err => {
            this.modal.loading = false;
            console.log(err)
          })
        }
      },
      // 编辑
      handlerEdit(row, index){
        this.modal.show = true;
        this.modal.currentIndex = index;
        this.modal.type = 'edit';
        this.modal.title = '条目编辑';
        this.$nextTick(() => {
          this.$refs['magicalTableModal1'].setFormDefaultValue({
            ...row,
            enableDatetime: row.enableDatetime ? new Date(row.enableDatetime) : '',
            disableDatetime: row.disableDatetime ? new Date(row.disableDatetime) : '',
          });
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
          let url = '/pss/member/dict/item/batchDelete';
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
        this.block.form.formData[3].options = this.dict.type;
      },
      setFromData() {
        if(this.$attrs.params.flag === 'edit') {
          this.$refs['magicalTable'].setFormDefaultValue({...this.params, enabled: ''});
        }
      }
    },
    mounted() {
      this.getDict();
      this.params = this.$attrs.params.row;
      this.setFromData();
      this.onSearch();
    }
  }
</script>
<style scoped lang="scss">
  .section{
    & /deep/ .el-dialog__wrapper{
      z-index: 2001!important;
    }
    & /deep/ .v-modal{
      z-index: 2000!important;
    }
  }
</style>
