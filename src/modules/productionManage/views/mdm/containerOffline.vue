<template>
  <section class="section">
    <el-row class="part1">
      <el-col :span="24">
        <el-card class="card1" shadow="never">
          <el-row type="flex">
            <label>容器条码</label>
            <el-input class="addInput" ref="addInput" @change="handleChange" :disabled="!form.workOrder" clearable placeholder="请扫描条码"
                      v-model="code_add"></el-input>
            <el-col :class="{tip: true, success: isSuccess}">{{message}}</el-col>
            <div class="buttons">
              <el-button type="primary" @click="handleSubmit">提交</el-button>
              <el-button @click="handleReset">重置</el-button>
            </div>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row type="flex" class="row2">
      <el-col class="form" :span="7">
        <el-card class="card2" shadow="never">
          <div slot="header" class="card-header">
            <span>工单信息</span>
          </div>
          <el-row type="flex" class="card2-row">
            <label>工单</label>
            <div class="value">
              <el-button type="text" @click="handleWordOrderClick" icon="el-icon-search"></el-button>
              <span>{{form.workOrder}}</span>
            </div>
          </el-row>
          <el-row type="flex" class="card2-row">
            <label>物料编码</label>
            <el-col class="value">{{form.itemCode}}</el-col>
          </el-row>
          <el-row type="flex" class="card2-row">
            <label>物料名称</label>
            <el-col class="value">{{form.itemName}}</el-col>
          </el-row>
          <el-row type="flex" class="card2-row">
            <label>客户</label>
            <el-col class="value">{{form.customer}}</el-col>
          </el-row>
          <el-row type="flex" class="card2-row">
            <label>工单数量</label>
            <el-col class="value">{{form.workOrderQty}}</el-col>
          </el-row>
          <el-row type="flex" class="card2-row">
            <label>未完工数量</label>
            <el-col class="value">{{form.unFinishWorkOrderQty}}</el-col>
          </el-row>
          <el-row type="flex" class="card2-row">
            <label>正在下线</label>
            <el-col class="value">{{offlineQty}}</el-col>
          </el-row>
          <el-row type="flex" class="card2-row">
            <label>容器个数</label>
            <el-col class="value">{{containerQty}}</el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col class="table" :span="17">
        <magical-table
          type="card"
          class="card3"
          :needLine="false"
          :needButtons="false"
          :needPagination="false"
          :needQuery="false"
          :table="table">
          <div slot="header" class="card3-header">
            <span class="title">条码信息</span>
            <div class="input">
              <el-input class="delInput"
                        ref="delInput"
                        @change="handleChangeDel"
                        clearable
                        placeholder="删除条码"
                        v-model="code_del">
              </el-input>
              <!--<label>删除条码</label>-->
            </div>
          </div>
        </magical-table>
      </el-col>
    </el-row>
    <magical-table
      :show.sync="modal.show"
      title="工单查询"
      type="dialog"
      :form="modal.form"
      :table="modal.table"
      :pagination="modal.pagination"
      :loading="modal.loading"
      ref="magicalTableM1"
      @rowDblclick="rowDblclick"
      @onSubmit="onSubmitM1"
      @pageSizeChange="pageSizeChangeM1"
      @pageNumChange="pageNumChangeM1">
    </magical-table>
    <audio  autoplay="autoplay" ref="audio" src=""></audio>
  </section>
</template>

<script>
  import MagicalTable from "lib@/components/awesome/magicalTable/main";

  export default {
    components: {
      MagicalTable,
    },
    name: "containerOffline",
    data() {
      return {
        code_add: '',
        code_del: '',
        message: '',
        isSuccess: true,
        form: {
          workOrder: '',
          itemCode: '',
          itemName: '',
          customer: '',
          workOrderQty: '',
          unFinishWorkOrderQty: '',
          offlineQty: 0,
          containerQty: 0,

          workOrderId: '',

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
              label: '物料编码',
              prop: 'itemName',
              minWidth: 130,
            },
            {
              label: '数量',
              prop: 'quantity',
              minWidth: 80,
            },
            {
              label: '箱型',
              prop: 'boxTypeCode',
              minWidth: 80,
            },
            {
              label: '下线时间',
              prop: 'offlineDateTime',
              minWidth: 80,
            }
          ],
          settings: {
            maxHeight: 459
          }
        },
        modal: {
          show: false,
          form: {
            formData: [
              {
                label: '工单编号',
                value: '',
                prop: 'workOrderCode',
                type: 'text',
                span: 12
              },
              {
                label: '物料编码',
                value: '',
                prop: 'itemId',
                type: 'quickSearch',
                showKey: "itemCode",
                preQueryData: {},
                showInput: '',
                name: "item_display",
                span: 12,
                callback: (selection, scope) => {
                  scope.value = selection.itemId;
                },
              },
              {
                label: '计划日期',
                value: new Date(),
                prop: 'planDateForm',
                type: 'datePicker',
                dateType: 'date',
                span: 12,
                rules: {required: true, message: '计划开工时间不能为空', trigger: 'change'}
              },
              {
                label: '计划日期至',
                value: '',
                prop: 'planDateTo',
                dateType: 'date',
                type: 'datePicker',
                span: 12
              },
              {
                label: '工单状态',
                value: 'ISSUED',
                prop: 'status',
                type: 'select',
                options: () => {
                  return this.dict.PSS_WORK_ORDER_STATUS
                },
                span: 12,
              },
              {
                label: '产线',
                prop: 'resourceId',
                type: 'quickSearch',
                showKey: "productionLineName",
                preQueryData: {},
                showInput: '',
                name: "resource_display",
                value: '',
                callback: (selection, scope) => {
                  scope.value = selection.resourceId;
                },
                span: 12
              },
            ],
            settings: {
              needRestBtn: false,
              rightPartStyle: {
                flex: '0 0 92px'
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
                label: '工单编码',
                prop: 'workOrderCode',
                width: 130,
              },
              {
                label: '物料编码',
                prop: 'itemCode',
                minWidth: 130,
              },
              {
                label: '物料描述',
                prop: 'itemName',
                width: 130
              },
              {
                label: '计划数量',
                prop: 'workOrderQty',
                minWidth: 130,
              },
              {
                label: '已入库数量',
                prop: 'finishedQty',
                minWidth: 130,
              }
            ]
          },
          pagination: {
            total: 0,
            pageSize: 15,
            pageNum: 1,
          },
          loading: false,
          currentRow: {}
        },
        dict: {
          PSS_WORK_ORDER_STATUS: []
        },
        sounds: {
          warn1: './sounds/outrange.wav', // 无箱包关系
          warn2: './sounds/Repeatcollection.wav', // 重复
          success1: './sounds/成功.wav', // 成功
          del_success: './sounds/del_success.wav' // 删除成功
        },
      }
    },
    computed: {
      offlineQty() {
        this.form.offlineQty = 0;
        this.table.tableData.forEach(item => {
          this.form.offlineQty += item.quantity;
        });
        return this.form.offlineQty;
      },
      containerQty() {
        return this.table.tableData.length;
      }
    },
    methods: {
      // 播放音频
      playAudio(src) {
        this.$refs['audio'].src = src;
      },
      handleChangeDel(code) {
        code = typeof code === 'string' ? code.toUpperCase().trim() : '';
        if(code.length === 0){
          this.isSuccess = false;
          this.message = '请输入条码！';
          this.playAudio(this.sounds.warn1);
          return
        }else {
          let _index = this.table.tableData.findIndex(item => item.containerCode === code);
          if(_index > -1){
            this.isSuccess = true;
            this.message = `条码【${code}】删除成功，请继续！`;
            this.playAudio(this.sounds.del_success);
            this.table.tableData.splice(_index, 1);
          }else {
            this.isSuccess = false;
            this.message = `条码【${code}】不存在，请检查！`;
            this.playAudio(this.sounds.warn1);
          }
        }
        this.code_del = '';
      },
      handleWordOrderClick() {
        this.modal.show = true;
        this.$nextTick(() => {
          this.onSearchM1();
        });
      },
      // 行双击
      rowDblclick(row) {
        this.validateWorkOrder(row).then(() => {
          this.modal.show = false;
          this.form = {
            workOrder: row.workOrderCode,
            itemCode: row.itemCode,
            itemName:  row.itemName,
            customer: row.customerName,
            workOrderQty: row.workOrderQty,
            unFinishWorkOrderQty: row.workOrderQty - row.finishedQty,
            offlineQty: 0,
            containerQty: 0,
            workOrderId: row.id
          };
          this.table.tableData = [];
        });
      },
      // 校验工单是否合规
      validateWorkOrder(row) {
        return new Promise(resolve => {
          let params = {
            workOrderId: row.id
          };
          let url = '/pss/member/containerOffline/checkWorkOrder';
          this.$http(url, {params}).then(res => {
            debugger;
            if(res.success){
              resolve();
            }
          });
        });
      },
      onSubmitM1() {
        this.onSearchM1();
      },
      // modal pageSizeChange
      pageSizeChangeM1(pageSize) {
        this.modal.pagination.pageNum = 1;
        this.modal.pagination.pageSize = pageSize;
        this.onSearchM1();
      },
      // modal pageNumChange
      pageNumChangeM1(currentPage) {
        this.modal.pagination.pageNum = currentPage;
        this.onSearchM1();
      },
      // 查询
      onSearchM1() {
        let condition = this.$refs['magicalTableM1'].getCondition();
        let params = {
          ...condition,
          pageNo: this.modal.pagination.pageNum,
          pageSize: this.modal.pagination.pageSize
        };
        let url = '/pss/member/production/workorder/listPage';
        this.modal.loading = true;
        this.$http({
          url,
          method: 'post',
          data: params
        }).then(data => {
          this.modal.loading = false;
          if (data && data.success) {
            this.modal.pagination.total = data.data.total;
            this.modal.table.tableData = data.data.list;
          }
        }).catch(() => {
          this.modal.loading = false;
        });
      },
      getDict() {
        return new Promise(resolve => {
          this.getDictByCodes(
            [
              'PSS_WORK_ORDER_STATUS'
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
      // 新增
      handleChange(code) {
        code = typeof code === 'string' ? code.toUpperCase().trim() : '';
        if (code.length === 0) {
          this.isSuccess = false;
          this.message = '请输入条码！';
          return
        }else if (code.length > 0) {
          this.queryCodeInfo(code).then(res => {
            if(this.form.offlineQty >= this.form.unFinishWorkOrderQty){
              this.$message.warning('下线数量已大于等于未完工数量，无法继续下线！');
              this.isSuccess = false;
              this.message = '下线数量已大于等于未完工数量，无法继续下线！';
              this.playAudio(this.sounds.warn1);
              return
            }
            if(this.table.tableData.some(item => item.containerCode === code)){
              this.isSuccess = false;
              this.message = `条码【${code}】重复，请检查！`;
              this.playAudio(this.sounds.warn2);
              return
            }
            this.isSuccess = true;
            this.message = `条码【${code}】扫描成功，请继续！`;
            this.playAudio(this.sounds.success1);
            this.table.tableData.unshift({
              boxTypeCode: res.boxTypeCode,
              containerCode: code,
              containerId: res.containerId,
              containerName: res.containerName,
              offlineDateTime: res.offlineDateTime,
              itemName: this.form.itemName,
              quantity: res.quantity
            });
            // this.form.offlineQty = 0;
            // this.table.tableData.forEach(item => {
            //   this.form.offlineQty += item.quantity;
            // });
            // this.form.containerQty = this.table.tableData.length;
          });
        }
        this.code_add = '';
      },
      // 查询编码明细
      queryCodeInfo(code) {
        return new Promise(resolve => {
          let params = {
            workOrderId: this.form.workOrderId,
            containerCode: code
          };
          let url = '/pss/member/containerOffline/scan';
          this.$http({
            url,
            method: 'post',
            data: params
          }).then(res => {
            if(res.success){
              resolve(res.data);
            }
          }).catch((err) => {
            this.isSuccess = false;
            this.message = err;
            this.playAudio(this.sounds.warn1);
            return
          });
        });
      },
      // 提交
      handleSubmit() {
        if(!this.form.workOrderId){ return this.$message.warning('请选择工单！')}
        if(this.table.tableData.length === 0) {return this.$message.warning('没有容器数据，请检查！')}
        let items = this.table.tableData.map(item => {return {containerId: item.containerId, quantity: item.quantity}});
        let params = {
          workOrderId: this.form.workOrderId,
          items
        };
        let url = '/pss/member/containerOffline/submit';
        this.$http({
          url,
          data: params,
          method: 'post'
        }).then(res => {
          if(res.success){
            this.isSuccess = true;
            this.message = '提交成功！';
            this.$message.success('提交成功！');
            this.handleReset();
          }
        });
      },
      //重置
      handleReset() {
        this.form = {
          workOrder: '',
          itemCode: '',
          itemName: '',
          customer: '',
          workOrderQty: '',
          unFinishWorkOrderQty: '',
          offlineQty: 0,
          containerQty: 0,

          workOrderId: '',

        };
        this.table.tableData = [];
      }
    },
    mounted() {
      this.getDict();
    }
  }
</script>

<style lang="scss" scoped>
  $lineColor: #eae7e7;
  $backgroundColor: #edf0f2;
  .app-main .app-main-container.section /deep/ {
    margin: 5px;
    background: #edf0f2;
    .el-table th {
      background-color: #edf0f2 !important;
    }
    .addInput /deep/ input:focus::-webkit-input-placeholder {
      color: #fff;
    }
    .addInput /deep/ input:focus:-moz-placeholder {
      color: #fff;
    }
    .addInput /deep/ input:focus:-ms-input-placeholder {
      color: #fff;
    }
    .addInput /deep/ input:focus {
      background-color: #34ea8e;
      color: #fff;
    }

    .delInput /deep/ input:focus::-webkit-input-placeholder {
      color: #fff;
    }
    .delInput /deep/ input:focus:-moz-placeholder {
      color: #fff;
    }
    .delInput /deep/ input:focus:-ms-input-placeholder {
      color: #fff;
    }
    .delInput /deep/ input:focus {
      background-color: #C03639;
      color: #fff;
    }
    & > .el-row {
      margin-bottom: 5px;
    }
    .el-card {
      border: none;
      .el-card__header {
        /*padding: 20px;*/
        font-weight: bold;
      }
      .el-card__body {
        padding: 10px;
      }
    }
    .el-card.card1 {
      .el-row {
        align-items: center;
        label {
          flex: 0 0 80px;
          text-align: right;
          padding-right: 8px;
        }
        .addInput {
          flex: 0 0 250px;
        }
        .buttons {
          flex: 0 0 170px;
        }
      }
      .tip {
        padding-left: 10px;
        line-height: 32px;
        font-size: 16px;
        color: #C03639;
      }
      .tip.success {
        color: #409eff;
      }
    }
    .row2 {
      .el-col.form {
        margin-right: 5px;
      }
    }
    .card2 {
      .card2-row {
        label {
          padding: 0 10px;
          line-height: 50px;
          flex: 0 0 85px;
          background-color: $backgroundColor;
          border-top: 1px solid $lineColor;
          border-right: 1px solid $lineColor;
          text-align: center;
        }
        .value {
          border-top: 1px solid $lineColor;
          border-right: 1px solid $lineColor;
          text-align: center;
          line-height: 50px;
        }
      }
      .card2-row:first-child {
        .value {
          display: flex;
          align-items: center;
          flex-flow: row-reverse;
          flex: 1;
          span {
            flex: 1;
            text-align: center;
          }
          button {
            min-width: auto;
          }
        }
      }
      .card2-row:last-child {
        label {
          border-bottom: 1px solid $lineColor;
          padding: 25px 10px;
        }
        .value {
          border-bottom: 1px solid $lineColor;
          font-size: 40px;
          line-height: 110px;
        }
      }
    }
    .card3 {
      .card3-header {
        display: flex;
        align-items: center;
        padding: 0 20px;
        height: 49px;
        .input {
          flex: 1;
          display: flex;
          flex-flow: row-reverse;
          align-items: center;
          .el-input {
            width: 250px;
          }
        }
      }
    }
  }
</style>