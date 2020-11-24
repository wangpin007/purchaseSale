<template>
  <section class="section">
    <el-card class="card1" shadow="never">
      <el-row type="flex">
        <el-col :span="8">
          <label>条码类型</label>
          <el-select v-model="codeType">
            <el-option
              v-for="(item, index) in dict.codeType"
              :key="index" :label="item.label"
              :value="item.value">{{item.label}}</el-option>
          </el-select>
        </el-col>
        <el-col :span="8"></el-col>
        <el-col :span="8">
          <el-button type="primary" @click="handleSubmit">提交</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="card2" shadow="never">
      <el-row type="flex">
        <label>条码</label>
        <el-input class="addInput" ref="addInput" @change="handleChange" :disabled="!codeType" clearable placeholder="请扫描条码" v-model="code_add"></el-input>
        <el-col :class="{tip: true, success: isSuccess}">{{message}}</el-col>
      </el-row>
    </el-card>
    <el-row>
      <el-col :span="7">
        <el-card class="card3" shadow="never">
          <div slot="header" class="card-header">
            <span>工单信息</span>
          </div>
          <el-row type="flex" class="card3-row">
            <label>工单</label>
            <div class="value">
              <!--<el-button type="text" @click="handleWordOrderClick" icon="el-icon-search"></el-button>-->
              <span>{{form.workOrder}}</span>
            </div>
          </el-row>
          <el-row type="flex" class="card3-row">
            <label>物料编码</label>
            <el-col class="value">{{form.itemCode}}</el-col>
          </el-row>
          <el-row type="flex" class="card3-row">
            <label>物料名称</label>
            <el-col class="value">{{form.itemName}}</el-col>
          </el-row>
          <el-row type="flex" class="card3-row">
            <label>客户</label>
            <el-col class="value">{{form.customerName}}</el-col>
          </el-row>
          <el-row type="flex" class="card3-row">
            <label>工单数量</label>
            <el-col class="value">{{form.workOrderQty}}</el-col>
          </el-row>
          <el-row type="flex" class="card3-row">
            <label>未完工数量</label>
            <el-col class="value">{{form.unfinishedQty}}</el-col>
          </el-row>
          <el-row type="flex" class="card3-row">
            <label>正在下线</label>
            <el-col class="value">{{offlineQty}}</el-col>
          </el-row>
          <el-row type="flex" class="card3-row">
            <label>条码个数</label>
            <el-col class="value">{{containerQty}}</el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="17">
        <magical-table
          type="card"
          class="card4"
          :needLine="false"
          :needButtons="false"
          :needPagination="false"
          :needQuery="false"
          :table="table">
          <div slot="header" class="card4-header">
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
    <audio  autoplay="autoplay" ref="audio" src=""></audio>
  </section>
</template>

<script>
  import MagicalTable from "lib@/components/awesome/magicalTable/main";

  export default {
    name: "mateOffline",
    components: {
      MagicalTable,
    },
    data() {
      return {
        codeType: 'item',
        code_del: '',
        code_add: '',
        message: '',
        isSuccess: true,
        form: {
          workOrder: '',
          itemCode: '',
          itemName: '',
          customerName: '',
          workOrderQty: '',
          unfinishedQty: '',
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
              label: '物料标签/条码',
              prop: 'labelNo',
              minWidth: 130,
            },
            {
              label: '物料编码',
              prop: 'itemCode',
              minWidth: 130,
            },
            {
              label: '数量',
              prop: 'quantity',
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
        dict: {
          codeType: [
            {label: '物料条码', value: 'item'},
            // {label: '工单条码', value: 'work'}
          ],
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
      // 新增
      handleChange(code) {
        code = typeof code === 'string' ? code.toUpperCase().trim() : '';
        if (code.length === 0) {
          this.isSuccess = false;
          this.message = '请输入条码！';
          return
        }else{
          this.queryCodeInfo(code).then(res => {
            // if(this.form.offlineQty >= this.form.unfinishedQty){
            //   this.$message.warning('下线数量已大于等于未完工数量，无法继续下线！');
            //   this.isSuccess = false;
            //   this.message = '下线数量已大于等于未完工数量，无法继续下线！';
            //   this.playAudio(this.sounds.warn1);
            //   return
            // }
            // if(this.table.tableData.some(item => item.containerCode === code)){
            //   this.isSuccess = false;
            //   this.message = `条码【${code}】重复，请检查！`;
            //   this.playAudio(this.sounds.warn2);
            //   return
            // }
            // this.isSuccess = true;
            // this.message = `条码【${code}】扫描成功，请继续！`;
            // this.playAudio(this.sounds.success1);
            if(this.form.workOrder && this.form.workOrder !== res.workOrder.workOrderCode){ // 第一次扫描
              this.isSuccess = false;
              this.message = '仅能对同一工单下的物料进行批量下线操作';
              this.playAudio(this.sounds.warn1);
              return
            }
            if(this.table.tableData.some(item => item.labelNo === code)){
              this.isSuccess = false;
              this.message = `条码【${code}】重复，请检查！`;
              this.playAudio(this.sounds.warn2);
              return
            }
            if(res.workOrder){
              this.form.workOrder = res.workOrder.workOrderCode;
              this.form.workOrderId = res.workOrder.workOrderId;
              this.form.itemCode = res.workOrder.itemCode;
              this.form.itemName = res.workOrder.itemName;
              this.form.customerName = res.workOrder.customerName;
              this.form.workOrderQty = res.workOrder.workOrderQty;
              this.form.unfinishedQty = res.workOrder.unfinishedQty;
            }
            if(res.itemLabel){
              this.table.tableData.unshift({
                labelNo: code,
                itemCode: res.itemLabel.itemCode,
                quantity: res.itemLabel.quantity,
                offlineDateTime: res.itemLabel.offlineDateTime,
                id: res.itemLabel.id
              });
            }
            this.isSuccess = true;
            this.message = `条码【${code}】扫描成功，请继续！`;
            this.playAudio(this.sounds.success1);
          });
        }
        this.code_add = '';
      },
      // 查询编码明细
      queryCodeInfo(code) {
        return new Promise(resolve => {
          let params = {
            labelNo: code
          };
          let url = '/pss/member/itemOffline/scan';
          this.$http({
            url,
            method: 'get',
            params
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
      handleChangeDel(code) {
        code = typeof code === 'string' ? code.toUpperCase().trim() : '';
        if(code.length === 0){
          this.isSuccess = false;
          this.message = '请输入条码！';
          this.playAudio(this.sounds.warn1);
          return
        }else {
          let _index = this.table.tableData.findIndex(item => item.labelNo === code);
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

      // 提交
      handleSubmit() {
        if(this.table.tableData.length === 0) {return this.$message.warning('没有物料数据，请检查！')}
        let itemLabelId = this.table.tableData.map(item => item.id);
        let params = {
          workOrderId: this.form.workOrderId,
          itemLabelId
        };
        let url = '/pss/member/itemOffline/submit';
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
          customerName: '',
          workOrderQty: '',
          unfinishedQty: '',
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
  }
  .el-card /deep/{
    border: none;
    .el-card__header {
      font-weight: bold;
    }
    .el-card__body {
      padding: 8px;
    }
  }
  .card1,.card2{
    margin-bottom: 5px;
  }
  .section > .el-row{

  }
  .card1{
    .el-row{
      .el-col{
        display: flex;
        align-items: center;
        label{
          flex: 0 0 80px;
          padding-right: 8px;
          text-align: right;
        }
        .el-select{
          flex: 0 0 250px;
        }
      }
      .el-col:last-child{
        display: block;
        text-align: right;
        padding-right: 10px;
      }
    }
  }
  .card2 {
    .el-row{
      align-items: center;
      label{
        flex: 0 0 80px;
        text-align: right;
        padding-right: 8px;
      }
      .el-input{
        flex: 0 0 250px;
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
  }
  .card3{
    margin-right: 5px;
    .card3-row {
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
    .card3-row:first-child {
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
    .card3-row:last-child {
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
  .card4 {
    .card4-header {
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
</style>