<template>
  <el-container class="flex-container-notab the_inventory_wrapper" direction="vertical">
    <el-main>

      <form-wrapper :formArray="preArr" ref="mForm" @getFormData="getQuerydata"/>

      <main-header>
        <template slot="left">
          <div style="padding: 0 11px;float: left;">
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
          <el-button
            type="primary"
            size="mini"
            @click="editTab('add')"
          >
            {{$t('common.add')}}
          </el-button>
          <el-button type="primary" size="mini" :loading="inValidBtnLoading" @click="handlerInvalid">
            {{$t('common.inactive')}}
          </el-button>
          <el-button type="primary" size="mini" @click="handlerExport">{{$t('table.export')}}</el-button>

        </template>
      </main-header>
      <table-view
        :ref="gridId"
        :checkbox="true"
        :table-data="tableData"
        :table-header="tableHeader"
        :current-change="handleCurrentChange"
        :page-size="pageSize"
        :show-filter-bar="showFilterBar == 1"
        :preQueryData="queryParam"
        url="/pss/member/items/list"/>
      <!--      弹框区域-->
      <el-dialog title="物料管理" :visible.sync="dialogFormVisible" v-el-drag-dialog :close-on-click-modal="false">
        <el-form ref="form" :model="form" class="form-incontainer" :rules="rules" :show-message="false"
                 label-width="80px" label-position="top">
          <el-row type="flex">
            <el-col>
              <el-form-item label="物料编码" :label-width="formLabelWidth" prop="itemCode">
                <el-input v-model="form.itemCode" :disabled="!!form.itemId"/>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="物料名称" :label-width="formLabelWidth" prop="itemName">
                <el-input v-model="form.itemName"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col>
              <el-form-item label="规格型号" :label-width="formLabelWidth">
                <el-input v-model="form.specification"/>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="基本单位" :label-width="formLabelWidth" prop="itemUnit">
                <el-select v-model="form.itemUnit">
                  <el-option
                    v-for="item in unitList"
                    :key="item.id"
                    :label="item.dictItemName"
                    :value="item.dictItemCode"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col>
              <el-form-item label="物料类型" :label-width="formLabelWidth" prop="itemType">
                <el-select v-model="form.itemType">
                  <el-option
                    v-for="item in itemTypeList"
                    :key="item.id"
                    :label="item.dictItemName"
                    :value="item.dictItemCode"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="物料类别" :label-width="formLabelWidth" prop="itemGroup">
                <el-select v-model="form.itemGroup">
                  <el-option
                    v-for="item in itemGroupList"
                    :key="item.id"
                    :label="item.dictItemName"
                    :value="item.dictItemCode"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col>
              <el-form-item label="生效时间" :label-width="formLabelWidth" prop="enableDatetime">
                <el-date-picker v-model="form.enableDatetime" type="datetime" placeholder="选择日期"/>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="失效时间" :label-width="formLabelWidth" prop="disableDatetime">
                <el-date-picker v-model="form.disableDatetime" type="datetime" placeholder="选择日期"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addOne">确 定</el-button>
        </div>
      </el-dialog>

    </el-main>
  </el-container>
</template>
<script>
  import MImport from "lib@/components/import";
  import {downloadFileLink} from "@/utils/file";
  import TableView from 'lib@/components/Table/TableView'
  import MainHeader from 'lib@/components/Table/MainHeader';
  import FormWrapper from 'lib@/components/Table/FormWrapper'
  import {parseTime, transformData} from '@/utils'

  export default {
    name: 'material',
    components: {
      TableView, MainHeader, FormWrapper, MImport
    },
    data() {
      return {
        inValidBtnLoading: false,
        iModal: {
          title: "导入",
          extraData: {},
          upLoadUrl: "/pss/member/items/import",
          upLoadResultUrl: "/pss/member/items/import/result",
        },
        name: '',
        description: '',
        gridData: [],
        pageSize: 15,
        gridId: 'list',
        selectList: [],
        currentRow: null,
        showFilterBar: 1,
        tableHeader: [],
        tableData: [],
        statusList: [],
        unitList: [],
        itemTypeList: [],
        itemGroupList: [],
        form: {
          itemId: '',
          itemCode: '',
          itemName: '',
          itemUnit: '',
          itemType: '',
          specification: '',
          itemGroup: '',
          enableDatetime: '',
          disableDatetime: '',
          orgCode: 'o1',
        },
        rules: {
          itemCode: [{required: true, message: '请输入物料编码'}],
          itemName: [{required: true, message: '请输入物料名称'}],
          // specification: [{ required: true, message: '请输入规格型号' }],
          itemUnit: [{required: true, message: '请输入基本单位'}],
          itemType: [{required: true, message: '请输入物料类型'}],
          itemGroup: [{required: true, message: '请输入物料组'}],
          enableDatetime: [{required: true, message: '请输入状态'}],
          disableDatetime: [{required: true, message: '请输入状态'}],
        },
        queryParam: {},
        dialogFormVisible: false,
        formLabelWidth: '100px',
        isActive: false,
        preArr: [
          {
            prop: 'itemCode',
            label: '物料编码',
          }, {
            prop: 'itemName',
            label: '物料名称',
          }, {
            prop: 'specification',
            label: '规格型号',
          }, {
            prop: 'itemType',
            label: '物料类型', type: 'select',
            options: []
          }, {
            prop: 'itemGroup',
            label: '物料类别', type: 'select',
            options: []
          }, {
            prop: 'status',
            label: '状态', type: 'select',
            options: []
          },
        ]
      }
    },
    created() {
      let _this = this;
      this.tableHeader = [
        {
          prop: 'itemCode',
          label: '物料编码',
          width: 150,
        }, {
          prop: 'itemName',
          label: '物料名称',
          minWidth: 200,
        }, {
          prop: 'specification',
          label: '规格型号',
          width: 150,
        }, {
          prop: 'itemUnit',
          label: '单位',
          width: 100,
          formattor(val) {
            return _this.$getLabelByValue(_this.unitList, val)
          },
        }, {
          prop: 'itemType',
          label: '物料类型',
          width: 150,
          formattor(val) {
            return _this.$getLabelByValue(_this.itemTypeList, val)
          },
          // this.itemTypeList
        }, {
          prop: 'itemGroup',
          label: '物料类别',
          width: 150,
          formattor(val) {
            return _this.$getLabelByValue(_this.itemGroupList, val)
          },
        }, {
          prop: 'creationDate',
          label: '创建时间',
          width: 150,
          formattor(val) {
            return val ? parseTime(val) : ''
          }
        }, {
          prop: 'enableDatetime',
          label: '生效时间',
          width: 150,
          formattor(val) {
            return val ? parseTime(val) : ''
          }
        }, {
          prop: 'disableDatetime',
          label: '失效时间',
          width: 150,
          formattor(val) {
            return val ? parseTime(val) : ''
          }
        }, {
          prop: 'operation',
          label: '操作', width: 70, fixed: 'right',
          showType: 'buttons',
          btnStyle: 'text',
          buttons: [
            {
              callback: function (row) {
                this.editTab('edit', row);
              }.bind(this),
              btnStyle: 'text',
              formattor(val) {
                return '修改'
              }
            },
            /* {
              callback: function(row){
                this.deleteOne(row);
              }.bind(this),
              btnStyle: 'text',
              formattor(val){
                return '删除'
              }
            }, */
          ]
        },
      ];

      this.getStatus()
      this.getUnitList()
      this.getItemType()
      this.getItemGroup()
      this.$nextTick(() => {
        // this.setTimeout(() => {}, 3000)
        this.getQuerydata()
      })
    },
    methods: {
      getItemType() {
        // 获取物料类型
        this.$http({
          url: '/pss/member/dict/item/byDictCode?dictCode=' + "PSS_BASE_ITEM_TYPE",
          method: 'GET',
          data: {}
        }).then(data => {
          if (data && data.success) {
            this.itemTypeList = data.data;
            this.$set(this.preArr, 3, {
              prop: 'itemType',
              label: '物料类型', type: 'select',
              options: transformData(data.data, ['dictItemCode', 'dictItemName'])
            })
          }
        }).catch(err => {
          console.log(err)
        })
      },
      getItemGroup() {
        // 获取物料组
        this.$http({
          url: '/pss/member/dict/item/byDictCode?dictCode=' + "PSS_BASE_ITEM_GROUP",
          method: 'GET',
          data: {}
        }).then(data => {
          if (data && data.success) {
            this.itemGroupList = data.data;
            this.$set(this.preArr, 4, {
              prop: 'itemGroup',
              label: '物料类别', type: 'select',
              options: transformData(data.data, ['dictItemCode', 'dictItemName'])
            })
          }
        }).catch(err => {
          console.log(err)
        })
      },
      getUnitList() {
        // 获取单位
        this.$http({
          url: '/pss/member/dict/item/byDictCode?dictCode=' + "PSS_UNIT",
          method: 'GET',
          data: {}
        }).then(data => {
          if (data && data.success) {
            this.unitList = data.data;
          }
        }).catch(err => {
          console.log(err)
        })
      },
      getStatus() {
        // 获取状态
        this.$http({
          url: '/pss/member/dict/item/byDictCode?dictCode=' + "PSS_BASE_STATUS",
          method: 'GET',
          data: {}
        }).then(data => {
          if (data && data.success) {
            this.statusList = data.data;
            this.$set(this.preArr, 5, {
              prop: 'status', label: '状态', type: 'select',
              options: transformData(data.data, ['dictItemCode', 'dictItemName'])
            })
          }
        }).catch(err => {
          console.log(err)
        })
      },
      getQuerydata(v) {
        this.queryParam = v;
        this.$nextTick(() => {
          this.$refs[this.gridId].query();
        })
      },
      // 编辑tab
      editTab(type, row) {
        if (type == "add") {
          // 新增
          for (let i in this.form) {
            this.form[i] = '';
          }
          this.form.orgCode = 'org1'
          this.form.enableDatetime = new Date().getTime();
          this.form.disableDatetime = new Date().setFullYear(2030);
        } else {
          // 修改
          for (let i in this.form) {
            this.form[i] = row[i];
          }
        }
        this.dialogFormVisible = true;
      },
      //导出
      handlerExport() {
        let params = this.$refs['mForm'].formData;
        downloadFileLink(
          "/pss/member/items/export",
          "物料报表.xls",
          params
        ).catch(() => {
          this.$message.error("下载失败");
        });
      },
      //失效
      handlerInvalid() {
        let slt = this.$refs[this.gridId].$refs['tableGrid'].selection;
        if(slt.length === 0){ this.$message('请勾选数据'); return}
        this.$confirm('是否失效？', {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          let itemIds = slt.map(item => item.itemId);
          let params = {itemIds};
          let url = '/pss/member/items/batchDisable';
          console.log(itemIds);
          this.inValidBtnLoading = true;
          this.$http({
            url: url,
            method: 'POST',
            data: params
          }).then(data => {
            if (data && data.success) {
              this.inValidBtnLoading = false;
              this.$message.success('操作成功');
              this.$refs[this.gridId].query();
            }
          }).catch(err => {
            console.log(err)
          })
        });
      },
      uploadSuccess(val) {
        this.getQuerydata()
      },
      downloadTemplate() {    // 下载模板
        downloadFileLink('/pss/member/items/template', parseTime(new Date()) + '_导出.xls').catch(() => {
          this.$message.error('下载失败')
        })
      },
      deleteOne(row) {
        this.$confirm(this.$t("common.delRow"), {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          let addStr = '?itemId=' + row.itemId;
          this.$http({
            url: '/pss/member/items' + addStr,
            method: 'DELETE',
            data: {}
          }).then(data => {
            if (data && data.success) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.$refs[this.gridId].query();
            }
          }).catch(err => {
            console.log(err)
          })
        }).catch(() => {

        })
      },
      addOne() {
        //验证form表单
        this.$refs.form.validate(valid => {
          if (valid) {
            // =====
            this.form.enableDatetime = parseTime(this.form.enableDatetime);
            this.form.disableDatetime = parseTime(this.form.disableDatetime);
            let url = this.form.itemId ? '/pss/member/items/modify' : '/pss/member/items';
            let methodType = this.form.itemId ? 'POST' : 'PUT';
            // this.form.itemId有值就是修改模式---否则为新增
            if (this.form.itemId) delete this.form.itemCode
            this.$http({
              url: url,
              method: methodType,
              data: this.form
            }).then(data => {
              if (data && data.success) {
                this.dialogFormVisible = false
                this.$message({
                  message: '保存成功',
                  type: 'success'
                });
                this.$refs[this.gridId].query();
              }
            }).catch(err => {
              console.log(err)
            })
          } else {
            return false
          }
        })

      },
      handleCurrentChange(val) {
        this.currentRow = val
      },
    }
  }
</script>
<style scoped lang="scss">

</style>
