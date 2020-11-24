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
      <el-button type="primary" @click="handlerAdd">新增</el-button>
      <el-button type="primary" :loading="inValidBtnLoading" @click="handlerInvaildAll">失效</el-button>
      <!--<m-import-->
        <!--ref="import"-->
        <!--style="display: inline-block; padding: 0 10px"-->
        <!--:title="iModal.title"-->
        <!--:extraData="iModal.extraData"-->
        <!--:upLoadUrl="iModal.upLoadUrl"-->
        <!--:upLoadResultUrl="iModal.upLoadResultUrl"-->
        <!--@downloadTemplate="downloadTemplate"-->
        <!--@handleSuccess="uploadSuccess"-->
        <!--:showSuccessDeal="true"-->
      <!--&gt;</m-import>-->
      <el-button type="primary" @click="handlerExport">导出</el-button>
      <el-button type="primary" :loading="pushQcBtnLoading" @click="pushQC">同步到品质云</el-button>
    </template>
  </magical-table>
</template>

<script>
  import magicalTable from 'lib@/components/awesome/magicalTable';
  import ElButton from "element-ui/packages/button/src/button";
  import quickSearch from "lib@/components/QuickSearch";
  import {parseTime} from "@/utils";
  import {downloadFileLink} from "@/utils/file";
  import MImport from "lib@/components/import";
  import axios from 'axios';

  export default {
    name: "workshop",
    components: {
      ElButton,
      magicalTable,
      quickSearch,
      MImport
    },
    data() {
      return {
        show: false,
        inValidBtnLoading: false,
        inImportBtnLoading: false,
        pushQcBtnLoading: false,
        postHeaderConfig: {headers: {'Content-Type': 'application/json'}},
        block: {
          loading: false,
          form: {
            formData: [
              {
                label: '工厂编码',
                value: '',
                prop: 'factoryCode',
                showKey: 'factoryName',
                type: 'quickSearch',
                name: 'factory_display',
                callback: (selection, scope) => {
                  scope.value = selection.factoryCode;
                }
              },
              {
                label: '车间编码',
                value: '',
                prop: 'departmentCode',
                type: 'text'
              },
              {
                label: '车间',
                value: '',
                prop: 'departmentName',
                type: 'text'
              },
              {
                label: '状态',
                value: '',
                prop: 'status',
                type: 'select',
                options: []
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
                align: 'center',
                fixed: 'left'
              },
              {
                label: '序号',
                type: "index",
                width: 50,
                align: 'center',
                fixed: 'left'
              },
              {
                label: '工厂编码',
                prop: 'factoryCode',
                minWidth: 130,
                align: 'center',
                render: ({row, col}) => {
                  if(!row.departmentId){
                    return {
                      component: 'quickSearch',
                      showKey: 'factoryCode',
                      showInput: row.factoryCode,
                      name: 'factory_display',
                      callback(e, row){
                        row.factoryCode = e.factoryCode;
                        row.factoryName = e.factoryName;
                      }
                    }
                  }else {
                    return row.factoryCode
                  }
                }
              },
              {
                label: '工厂名称',
                prop: 'factoryName',
                minWidth: 130,
                align: 'center',
              },
              {
                label: '车间编码',
                prop: 'departmentCode',
                minWidth: 130,
                align: 'center',
                render: ({row, $index}) => {
                  if(!row.departmentId){
                    return {
                      component: 'input',
                    }
                  }else {
                    return row.departmentCode
                  }
                }
              },
              {
                label: '车间',
                prop: 'departmentName',
                minWidth: 130,
                align: 'center',
                render: ({row, $index}) => {
                  if(!row.departmentId){
                    return {
                      component: 'input'
                    }
                  } else {
                    return row.departmentName
                  }
                }
              },
              {
                label: '状态',
                prop: 'status',
                width: 100,
                align: 'center',
                tooltip: true,
                render: ({row, column}) => {
                  let item = this.dict[column.property].find(item => row.status === item.value);
                  return {
                    component: 'tag',
                    type: row.status === 'Y' ? 'success' : 'danger',
                    text: item ? item.label : ''
                  }
                },
              },
              {
                label: '生效时间',
                prop: 'enableDatetime',
                minWidth: 130,
                align: 'center',
                formatter: (row) => {
                  return row.enableDatetime ? parseTime(row.enableDatetime) : ''
                }
              },
              {
                label: '失效时间',
                prop: 'disableDatetime',
                minWidth: 130,
                align: 'center',
                formatter: (row) => {
                  return row.disableDatetime ? parseTime(row.disableDatetime) : ''
                }
              },
              {
                label: '操作',
                width: 100,
                prop: 'operation',
                align: 'center',
                tooltip: false,
                render: ({row}) => {
                  let _this = this;

                  if(!row.departmentId){
                    return {
                      component: 'buttons',
                      options: [
                        {
                          text: '保存',
                          type: 'text',
                          click({row, $index}){
                            _this.handlerSave(row)
                          }
                        },
                        {
                          text: '删除',
                          type: 'text',
                          click({row, $index}) {
                            _this.handlerDel($index);
                          }
                        }
                      ]
                    }
                  }else{
                    if(row.status === 'Y'){
                      return {
                        component: 'buttons',
                        options: [
                          {
                            text: '失效',
                            type: 'text',
                            click({row, $index}) {
                              _this.handlerInvalid(row);
                            }
                          }
                        ]
                      }
                    }else {
                      // return {
                      //   component: 'buttons',
                      //   options: [
                      //     {
                      //       text: '删除',
                      //       type: 'text',
                      //       click({row, $index}) {
                      //         _this.delRowByDepamentId(row);
                      //       }
                      //     }
                      //   ]
                      // }
                      return ''
                    }
                  }

                },
                fixed: 'right'
              },
            ],
          },
          pagination: {
            total: 0,
            pageSize: 10,
            pageNum: 1,
          }
        },
        dict: {
          status: []
        },
        iModal: {
          title: "导入",
          extraData: {},
          upLoadUrl: "/pss/member/items/import",
          upLoadResultUrl: "/pss/member/items/import/result",
        },
      }
    },
    methods: {
      // 获取字典
      getDict() {
        this.getDictByCode('PSS_BASE_STATE', (res) => {
          this.dict.status = res;
          this.block.form.formData[3].options = res;
        });
      },
      // 获取字典接口
      getDictByCode(code, callback) {
        let params = {
          dictCode: code
        };
        let url = '/pss/member/dict/item/byDictCode';
        this.$http.get(url, {params}).then(res => {
          if (res.success) {
            let data = res.data.map(({dictItemCode, dictItemName}) => {
              return {value: dictItemCode, label: dictItemName}
            });
            callback && callback(data);
          } else {
            this.$message.error(res.retMsg);
          }
        }).catch(err => {
          console.log(err);
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
          if(res.success){
            codes.forEach(code => {
              let dict = res.data[code];
              for(name in dict){
                this.dict[code].push({
                  label: dict[name],
                  value: name
                })
              }
            });
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
      onSearch() {
        let condition = this.getCondition();
        // let condition = this.$refs['magicalTable'].$refs['mQuery'].getCondition();
        let data = {
          ...condition,
          pageSize: this.block.pagination.pageSize,
          pageNo: this.block.pagination.pageNum
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
      getCondition() {
        return this.$refs['magicalTable'].getCondition();
        // let params = {};
        // this.block.form.formData.forEach(i => {
        //   params[i.prop] = i.value;
        // });
        // return params;
      },
      //新增
      handlerAdd() {
        if (this.block.table.tableData[0] && !this.block.table.tableData[0].departmentId) {
          this.$message.warning('请先保存后再新增！');
        } else {
          this.block.table.tableData.unshift(
            {
              status: 'Y',
              editable: true,
              factoryCode: '',
              factoryName: '',
              departmentName: '',
              departmentCode: '',
              _checked: true,
              enableDatetime: new Date(),
              disableDatetime: this.getAfter30Year()
            }
          );
          this.$refs['magicalTable'].setSelection();
        }
      },
      // 获取30年之后的时间
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
      uploadSuccess(val) {
        this.getQuerydata()
      },
      downloadTemplate() {    // 下载模板
        downloadFileLink('/pss/member/items/template', parseTime(new Date()) + '_导出.xls').catch(() => {
          this.$message.error('下载失败')
        })
      },
      // 导出
      handlerExport() {
        let params = this.getCondition();
        downloadFileLink(
          "/pss/member/department/export",
          "车间.xls",
          params
        ).catch(() => {
          this.$message.error("下载失败");
        });
      },
      // 失效
      handlerInvalid(row) {
        this.$confirm("确认失效吗？", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let params = [row.departmentId];
          let url = '/pss/member/department/modify';
          this.$http({url, data: params, method: 'post'}).then((res) => {
            if (res.success) {
              this.$message.success('失效成功！');
              this.onSearch();
            }
          });
        });
      },
      // 失效
      handlerInvaildAll() {
        let slt = this.getSelection();
        if (this.validate(slt)) {
          this.$confirm("确认失效吗？", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            let data = slt.map(item => item.departmentId);
            let url = '/pss/member/department/modify';
            this.inValidBtnLoading = true;
            this.$http({url, method: 'post', data}).then((res) => {
              this.inValidBtnLoading = false;
              if (res.success) {
                this.$message.success('失效成功！');
                this.onSearch();
              }
            }).catch(() => {
              this.inValidBtnLoading = false;
            });
          });
        }
      },
      // 获取选中行
      getSelection() {
        return this.$refs['magicalTable'].getSelection();
      },
      // 校验选中数据
      validate(slt) {
        if (slt.length === 0) {
          this.$message.warning('请勾选数据');
          return false;
        }
        if (slt.some(item => !item.departmentId)) {
          this.$message.warning('存在未保存的数据，请检查！');
          return false;
        }
        return true;
      },
      // 保存
      handlerSave(row) {
        if (!row.factoryCode) {
          this.$message.warning('工厂编码不能为空');
          return;
        }
        if (!row.departmentCode) {
          this.$message.warning('车间编码不能为空');
          return;
        }
        if (!row.departmentName) {
          this.$message.warning('车间名称不能为空');
          return;
        }
        row.disableDatetime = parseTime(row.disableDatetime);
        row.enableDatetime = parseTime(row.enableDatetime);
        this.$confirm("确认保存吗？", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let url = '/pss/member/department/add';
          let data = row;
          delete data._checked;
          delete data.editable;
          this.$http({
            url,
            method: 'post',
            data
          }).then((data) => {
            if (data && data.success) {
              this.$message.success('保存成功');
              this.onSearch();
            }
          });
        });
      },
      // 删除
      handlerDel($index) {
        this.block.table.tableData.splice($index, 1);
        this.$refs['magicalTable'].clearSelection();
      },
      // 删除表数据
      delRowByDepamentId() {
        this.$confirm("确认删除吗？", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let params = [row.departmentId];
          let url = '/pss/member/department/modify';
          this.$http({url, data: params, method: 'post'}).then((res) => {
            if (res.success) {
              this.$message.success('失效成功！');
              this.onSearch();
            }
          });
        });
      },
      // 工厂快速查询回调
      factoryCallback(selection, scope) {
        scope.factoryCode = selection.factoryCode;
        scope.factoryName = selection.factoryName;
      },
      // 车间快速查询回调
      workshopCallback(selection, scope) {
        scope.departmentCode = selection.factoryCode;
        scope.departmentName = selection.factoryName;
      },
      handlerEdit(row, $index){
        row.editable = true;
        this.block.table.tableData.splice($index, 1, row);
      },
      // 同步
      pushQC() {
        this.$confirm("确认同步吗？", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let url = '/pss/member/resource/postDepartmentResource';
          this.pushQcBtnLoading = true;
          this.$http(url).then(res => {
            this.pushQcBtnLoading = false;
            if(res.success){
              this.$message.success('同步完成');
            }
          }).catch(() => {
            this.pushQcBtnLoading = false;
          })
        });

      }
    },
    mounted() {
      this.getDict();
      this.onSearch();
    }

  }
</script>

<style lang="scss" scoped>

</style>