<template>
  <!--<el-container direction="vertical" class="salesWarehouse">-->
  <!--<el-main>-->
  <!--&lt;!&ndash;<nav-tabs :tabsList="tabs" :curTab="activeTab"></nav-tabs>&ndash;&gt;-->
  <!---->
  <!--</el-main>-->
  <!--</el-container>-->
  <section class="salesWarehouse">
    <el-row>
      <el-col :span="24">
        <el-card class="card1" shadow="never">
          <el-form :model="formData" :rules="rules" ref="form1" label-width="100px">
            <el-row type="flex">
              <el-col :span="2" style="text-align: left;">
                <el-button type="primary" @click="submitForm('form1')" :loading="loading">确认出库</el-button>
                <!--<el-button @click="handlerPrint" :disabled="!block2.formData.orderNumber">打印</el-button>-->
              </el-col>
              <el-col :span="22" style="text-align: right">
                <strong>当前仓库：</strong><strong>{{ formData.sendWarehouse }}</strong>
                <el-button type="text" @click="switchBtnClick">切换仓库</el-button>
              </el-col>
              <!--<el-col :span="7">-->
              <!--<el-form-item label="单据类型" prop="exwarehousingType">-->
              <!--<el-select v-model="formData.exwarehousingType" filterable clearable placeholder="请选择单据类型"-->
              <!--@change="orderTypeChange">-->
              <!--<el-option v-for="(item, index) in dict.exwarehousingType" :key="index" :label="item.dictItemName"-->
              <!--:value="item.dictItemCode"></el-option>-->
              <!--</el-select>-->
              <!--</el-form-item>-->
              <!--</el-col>-->
              <!--<el-col :span="7">-->
              <!--<el-form-item label="发出仓库" prop="sendWarehouse">-->
              <!--&lt;!&ndash;<QuickSearch&ndash;&gt;-->
              <!--&lt;!&ndash;ref="quickSearch"&ndash;&gt;-->
              <!--&lt;!&ndash;show-key="warehouseName"&ndash;&gt;-->
              <!--&lt;!&ndash;:scope-data="block1.formData"&ndash;&gt;-->
              <!--&lt;!&ndash;name="warehouse_display"&ndash;&gt;-->
              <!--&lt;!&ndash;@close-quicksearch="issueWarehouseChange"&ndash;&gt;-->
              <!--&lt;!&ndash;/>&ndash;&gt;-->
              <!--<el-select v-model="formData.sendWarehouseCode" @change="sendWarehouseChange" clearable filterable placeholder="请选择发出仓库">-->
              <!--<el-option v-for="(item, index) in dict.sendWarehouse" :key="index" :label="item.label"-->
              <!--:value="item.value"></el-option>-->
              <!--</el-select>-->
              <!--</el-form-item>-->
              <!--</el-col>-->
              <!--<el-col :span="7">-->
              <!--<el-form-item label="目标仓库" prop="receiveWarehouse">-->
              <!--<el-select v-model="formData.receiveWarehouseCode" clearable filterable placeholder="请选择目标仓库"-->
              <!--@change="receiveWarehouseChange">-->
              <!--<el-option v-for="(item, index) in dict.receiveWarehouse" :key="index" :label="item.dictItemName"-->
              <!--:value="item.dictItemCode"></el-option>-->
              <!--</el-select>-->
              <!--</el-form-item>-->
              <!--</el-col>-->
            </el-row>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-card class="card2" shadow="never">
          <el-row type="flex">
            <img class="img" :src="qrcordSrc">
            <el-input class="salesWarehouseInput" ref="addInput" @change="addCode" clearable placeholder="请扫描条码"
                      v-model="code"></el-input>
            <el-col :class="{tip: true, success: isSuccess}">{{message}}</el-col>
            <label>删除条码</label>
            <el-input class="salesWarehouseInput1" ref="delInput" @change="delCode" clearable placeholder="请扫描条码"
                      v-model="code1"></el-input>
            <!--<div class="sum"><small>累计数量：</small><strong>36</strong></div>-->

          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row type="flex" :gutter="8">
      <el-col :span="7">
        <el-card class="card3" shadow="never">
          <div slot="header" class="card-header">
            <span>出库信息</span>
          </div>
          <el-row type="flex" class="card3-row">
            <label>单据号</label>
            <el-col class="value">{{formData.stageNum}}</el-col>
          </el-row>
          <el-row type="flex" class="card3-row">
            <label>单据类型</label>
            <el-col class="value">{{formData.exwarehousingTypeLabel}}</el-col>
          </el-row>
          <el-row type="flex" class="card3-row">
            <label>发出仓库</label>
            <el-col class="value">{{formData.sendWarehouse}}</el-col>
          </el-row>
          <el-row type="flex" class="card3-row">
            <label>发往仓库</label>
            <el-col class="value">{{formData.receiveWarehouse}}</el-col>
          </el-row>
          <el-row type="flex" class="card3-row">
            <label>产品编码</label>
            <el-col class="value">{{formData.productCode}}</el-col>
          </el-row>
          <el-row type="flex" class="card3-row">
            <label>当前扫描</label>
            <!--<el-col class="value">{{formData.codeAmount}}</el-col>-->
            <el-col class="value">{{sumAmount}}</el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="17">
        <el-card class="card4" shadow="never">
          <div slot="header" class="card-header">
            <span>产品信息</span>
            <el-button type="primary" style="margin-left: 10px; padding: 8px 10px;" @click="onOpenM3">已扫条码</el-button>
          </div>
          <m-table
            :data="block1.tableData"
            :columns="block1.columns"
            border
            :maxHeight="237">
          </m-table>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <!--<el-card class="card5" shadow="never">-->
        <!--<div slot="header" class="card-header">-->
        <!--<span>已扫条码</span>-->
        <!--</div>-->
        <!--<m-table-->
        <!--:data="block2.tableData"-->
        <!--:maxHeight="500"-->
        <!--:border="true"-->
        <!--:columns="block2.columns">-->
        <!--</m-table>-->
        <!--</el-card>-->
      </el-col>
    </el-row>
    <audio  autoplay="autoplay" ref="audio" src=""></audio>
    <!--<el-button type="primary" @click="playAudio(sounds.success1)">播放</el-button>-->
    <magical-table
      title="请选择单据类型/发出/目标仓库"
      width="30%"
      :close-on-click-modal="false"
      :show="modal1.show"
      @close="modal1.show = false"
      :needTable="false"
      ref="magicalTableModal1"
      :needPagination="false"
      :form="modal1.form"
      type="dialog">
      <el-button class="min-button" slot="footer" type="danger" @click="handleNext">下一步</el-button>
    </magical-table>
    <magical-table
      type="dialog"
      ref="magicalTableModal2"
      :form="modal2.form"
      :table="modal2.table"
      :show.sync="modal2.show"
      title="获取单据号"
      width="70%"
      @pageSizeChange="pageSizeChangeM2"
      @pageNumChange="pageNumChangeM2"
      @rowDblclick="rowDblclickM2">
    </magical-table>
    <magical-table
      type="dialog"
      ref="magicalTableModal3"
      :show.sync="modal3.show"
      title="已扫条码"
      :loading="modal3.loading"
      :form="modal3.form"
      :table="modal3.table"
      :pagination="modal3.pagination"
      @pageSizeChange="pageSizeChangeM3"
      @pageNumChange="pageNumChangeM3">
    </magical-table>
    <el-dialog :visible.sync="modal4.show"
               title="提示" v-el-drag-dialog
               :close-on-click-modal="false"
               :show-close="false"
               v-el-drag-dialog>
      <i class="el-icon-success" style="margin-right: 10px; color: #409eff;"></i>{{modal4.message}}
      <el-button slot="footer" type="primary" @click="afterSave">确定</el-button>
    </el-dialog>
  </section>

</template>
<script>
  import qrcordSrc from '@/assets/salesWarehouse/qrcode.png'
  import mTable from "lib@/components/awesome/table";
  import QuickSearch from "lib@/components/QuickSearch";
  import ElButton from "element-ui/packages/button/src/button";
  import MagicalTable from "lib@/components/awesome/magicalTable/main";
  import {parseTime} from "@/utils";
  import ElDialog from "element-ui/packages/dialog/src/component";

  export default {
    name: 'salesWarehouse',
    components: {
      ElDialog,
      MagicalTable,
      ElButton,
      mTable,
      QuickSearch
    },
    data() {
      return {
        loading: false,
        search: '',
        qrcordSrc: qrcordSrc,
        formData: {
          stageNum: '',
          exwarehousingType: '',
          exwarehousingTypeLabel: '',
          // exwarehousingNum: '',
          sendWarehouse: '',
          sendWarehouseCode: '',
          sendWarehouseId: '',
          receiveWarehouse: '',
          receiveWarehouseCode: '',
          receiveWarehouseId: '',
          productCode: '',
          codeAmount: 0, // 扫描数量，弃用，用sumAmount产品总数替代
        },
        rules: {
          exwarehousingType: [
            {required: true, message: '请选择单据类型', trigger: 'change'}
          ],
          sendWarehouse: [
            {required: true, message: '请选择发出仓库', trigger: 'change'}
          ],
          receiveWarehouse: [
            {required: true, message: '请选择目标仓库', trigger: 'change'}
          ]
        },
        code: '',
        code1: '',
        message: '',
        isSuccess: true,
        block1: {
          tableData: [],
          columns: [
            {
              label: '产品编码',
              prop: 'productCode',
              width: 150,
              align: 'center'
            },
            {
              label: '产品总数',
              prop: 'sumAmount',
              width: 120,
              align: 'center'
            },
            {
              label: '数量',
              prop: 'bigBoxAmount',
              width: 80,
              align: 'center'
            },
            {
              label: '箱包规格',
              prop: 'bigBoxSize',
              width: 80,
            },
            {
              label: '工单号',
              prop: 'makeOrderNum',
              width: 180,
            },
            {
              label: '产品描述',
              prop: 'productDesc',
              align: 'center',
              minWidth: 150,
            }
          ]
        },
        block2: {
          tableData: [],
          columns: [
            {
              label: '序号',
              type: "index",
              width: 50,
            },
            {
              label: '条码',
              prop: 'barCode',
              width: 180,
            },
            {
              label: '条码类型',
              prop: 'barType',
              width: 100,
            },
            {
              label: '产品编码',
              prop: 'productCode',
              width: 130,
            },
            {
              label: '产品型号',
              prop: 'productType',
              width: 130,
            },
            {
              label: '产品描述',
              prop: 'productDesc',
              minWidth: 180,
            },
            {
              label: '工单号',
              prop: 'makeOrderNum',
              width: 180,
            },
            {
              label: '产品数量',
              prop: 'amount',
              width: 80,
            },
            // {
            //   label: '操作',
            //   width: 120,
            //   prop: 'operation',
            //   render: ({row, $index}) => {
            //     let _this = this;
            //     return {
            //       component: 'button',
            //       type: 'text',
            //       text: '删除',
            //       click() {
            //         _this.delBtnClick(row, $index);
            //       }
            //     }
            //   }
            // },
          ]
        },
        nextTime: null,
        lastTime: null,
        nextCode: '',
        dict: {
          exwarehousingType: [],
          sendWarehouse: [],
          receiveWarehouse: []
        },
        sounds: {
          warn1: './sounds/outrange.wav', // 无箱包关系
          warn2: './sounds/Repeatcollection.wav', // 重复
          success1: './sounds/成功.wav', // 成功
          del_success: './sounds/del_success.wav' // 删除成功
        },
        modal1: {
          show: false,
          form: {
            formData: [
              {
                type: 'select',
                prop: 'exwarehousingType',
                label: '单据类型',
                value: 'OEM_STOCK_OUT',
                span: 24,
                options: () => {
                  return this.dict.exwarehousingType.map(item => {return {label: item.dictItemName, value: item.dictItemCode}});
                },
                rules: {required: true, message: '请选择单据类型', trigger: 'change'},
              },
              {
                type: 'select',
                prop: 'sendWarehouse',
                label: '发出仓库',
                value: '',
                span: 24,
                options: () => {
                  return this.dict.sendWarehouse;
                },
                rules: {required: true, message: '请选择发出仓库', trigger: 'change'}
              },
              {
                type: 'select',
                prop: 'receiveWarehouse',
                label: '目标仓库',
                value: '',
                span: 24,
                options: () => {
                  return this.dict.receiveWarehouse.map(item => {return {label: item.dictItemName, value: item.dictItemCode}});
                },
                rules: {required: true, message: '请选择目标仓库', trigger: 'change'}
              }
            ],
            settings: {
              needRightPart: false,
              labelWidth: '80px',
              formItemStyle: {
                marginBottom: '12px'
              }
            }
          }
        },
        modal2: {
          show: false,
          form: {
            formData: [
              {
                label: '单据号',
                value: '',
                prop: 'stageNum',
                type: 'text',
                span: 12,
                change: () => {
                  this.onSearchM2();
                }
                // rules: {required: true, message: '单据号为必填', trigger: 'change'}
              },
              {
                label: '',
                prop: 'none',
                formItemStyle: { display: 'none'},
                type: 'text',
                value: '',
              },
              {
                type: 'button',
                labelWidth: '0',
                span: 6,
                text: '查询历史',
                loading: false,
                btnType: 'primary',
                style: 'margin-left: 5px;',
                click: () => {
                  this.onSubmitM2();
                }
              },
              {
                type: 'buttons',
                labelWidth: '0',
                span: 6,
                formItemStyle: {'textAlign': 'right'},
                options: [
                  {
                    text: '创建新单据',
                    loading: false,
                    type: 'primary',
                    click: () => {
                      this.handleCreated();
                    }
                  }
                ]
              }
            ],
            settings: {
              needCollapseBtn: false,
              needRightPart: false,
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
                label: '单据号',
                prop: 'stageNum',
                minWidth: 130,
              },
              // {
              //   label: '完成数量',
              //   prop: 'completeNum',
              //   minWidth: 130,
              // },
              {
                label: '创建人',
                prop: 'createdBy',
                minWidth: 130,
              },
              {
                label: '创建时间',
                prop: 'creationDate',
                minWidth: 130,
                formatter(row) {
                  return parseTime(new Date(row.creationDate));
                }
              },
              {
                label: '操作',
                width: 80,
                prop: 'operation',
                render: ({row}) => {
                  return {
                    component: 'button',
                    type: 'text',
                    text: '删除',
                    click: () => {
                      this.$confirm('是否删除？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                      }).then(() => {
                        // 删除单据
                        this.delStage(row.stageNum).then(res => {
                          this.onSearchM2();
                          this.$message.success('删除成功！');
                        });
                      });
                    }
                  }
                }
              },
            ],
            settings: {
              height: 350
            }
          },
          pagination: {
            total: 0,
            pageSize: 10,
            pageNum: 1,
            pageSizes: [3 ,5, 10, 15, 20, 30]
          },
          allData: []
        },
        modal3: {
          show: false,
          loading: false,
          form: {
            formData: [
              {
                label: '条码',
                prop: 'barCode',
                type: 'text',
                value: '',
                placeHolder: '请输入条码',
                change: (val) => {
                  this.onSubmitM3();
                }
              },
              {
                label: '',
                prop: 'none',
                formItemStyle: { display: 'none'},
                type: 'text',
                value: '',
              },
              {
                type: 'buttons',
                labelWidth: '0',
                span: 8,
                options: [
                  {
                    text: '查询 ',
                    loading: false,
                    type: 'primary',
                    style: 'margin-left: 5px;',
                    click: () => {
                      this.onSubmitM3();
                    }
                  },
                ]
              },
            ],
            settings: {
              needRightPart: false
            }
          },
          table: {
            tableData: [],
            columns: [
              {
                label: '序号',
                type: "index",
                width: 50,
              },
              {
                label: '条码',
                prop: 'barCode',
                width: 180,
              },
              {
                label: '条码类型',
                prop: 'barType',
                width: 100,
              },
              {
                label: '产品编码',
                prop: 'productCode',
                width: 130,
              },
              {
                label: '产品型号',
                prop: 'productType',
                width: 130,
              },
              {
                label: '产品描述',
                prop: 'productDesc',
                minWidth: 180,
              },
              {
                label: '工单号',
                prop: 'makeOrderNum',
                width: 180,
              },
              {
                label: '产品数量',
                prop: 'amount',
                width: 80,
              },
              // {
              //   label: '操作',
              //   width: 120,
              //   prop: 'operation',
              //   render: ({row, $index}) => {
              //     let _this = this;
              //     return {
              //       component: 'button',
              //       type: 'text',
              //       text: '删除',
              //       click() {
              //         _this.delBtnClick(row, $index);
              //       }
              //     }
              //   }
              // },
            ]
          },
          pagination: {
            total: 0,
            pageSize: 10,
            pageNum: 1,
            pageSizes: [3 ,5, 10, 15, 20, 30]
          }
        },
        modal4: {
          show: false,
          message: ''
        }
      }
    },
    computed: {
      sumAmount() {
        let total = 0;
        this.block1.tableData.forEach(item => {
          total += item.sumAmount;
        });
        return total;
      }
    },
    methods: {
      // 确认出库
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.block1.tableData.length > 0){
              this.$confirm('是否出库？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.save();
              }).catch(() => {
              });
            }else{
              this.$message.warning('未找到扫码数据，请检查！')
            }
          }
        });
      },
      // 确认出库
      save() {
        let details = this.block1.tableData.map(i => {return {productNo: i.productCode, qty: i.sumAmount, productDesc: i.productDesc}});
        let params = {
          stageNum: this.formData.stageNum,
          exwarehousingType: this.formData.exwarehousingType,
          sendWarehouseId: this.formData.sendWarehouseId,
          sendWarehouse: this.formData.sendWarehouseCode,
          receiveWarehouseId: this.formData.receiveWarehouseId,
          receiveWarehouse: this.formData.receiveWarehouseCode,
          details
        };
        let url = '/pss/member/salesDelivery/exWarehousing';
        this.loading = true;
        let httpParams = {
          url: url,
          method: 'post',
          data: params,
          timeout: 600000
        };
        this.$http(httpParams).then(res => {
          this.loading = false;
          if(res.success){
            this.modal4.show = true;
            this.modal4.message = `出库成功，出库单号为【${res.data}】`;
            this.playAudio(this.sounds.success1);
            this.delStage(this.formData.stageNum);
            // 编码清空前，设置编码禁用，防止重复出库
            this.setCodeDisable().then(() => {
              if(!res.success) {
                this.$message.error('禁用条码接口异常');
                new Error();
              }
            }).catch(err => {
              this.$message.error('禁用条码接口异常');
              new Error(err);
            });
          }
        }).catch((err) => {
          this.$alert(`${err}`, {
            confirmButtonText: '确定',
            type: 'warning'
          });
          this.isSuccess = false;
          this.message = `${err}`;
          // this.loading = false;
        });
      },
      setCodeDisable(){
        return new Promise(resolve => {
          let url = '/pss/member/salesDelivery/setCodeDisable';
          let params = this.block2.tableData.map(i => i.barCode);
          let httpParams = {
            url: url,
            method: 'post',
            data: params
          };
          this.$http(httpParams).then(res => {
            if(res.success){
              resolve();
            }
          })
        });
      },
      // 保存后清空数据
      afterSave() {
        this.formData.stageNum = '';
        this.formData.productCode = '';
        // this.formData.codeAmount = 0;
        this.block1.tableData = [];
        this.block2.tableData = [];
        this.message = '';
        this.modal4.show = false;
      },
      // 打印
      // handlerPrint() {
      //   window.print();
      // },
      // 删除数据库条码
      delStageCode(row) {
        return new Promise(resolve => {
          let params = {barcode: row.barCode};
          let url = '/pss/member/salesDelivery/deleteBarcode';
          this.$http({
            url,
            method: 'get',
            params
          }).then(res => {
            resolve(res)
          })
        });
      },
      // 添加
      addCode(code) {
        let h = this.$createElement;
        // this.$refs['form1'].validate((valid) => {
        //   if (valid) {
        //     code = typeof code === 'string' ? code.toUpperCase().trim() : '';
        //     this.scanCode(code);
        //   }else {
        //     this.playAudio(this.sounds.warn1);
        //     this.$message({
        //       message: h('p', null, [
        //         h('span', {style: 'color: #909399'}, '请填写带 '),
        //         h('span', {style: 'color: red'}, '*'),
        //         h('span', {style: 'color: #909399'}, ' 信息后扫码 '),
        //       ]),
        //       type: 'warning'
        //     });
        //   }
        // });
        code = typeof code === 'string' ? code.toUpperCase().trim() : '';
        this.scanCode(code);
        this.code = '';
        this.focusByRefName('addInput');
      },
      // 删除
      delCode(code) {
        code = typeof code === 'string' ? code.toUpperCase().trim() : '';
        this.delStageCode({barCode: code}).then((res) =>{
          if(res.success){
            let index = this.block2.tableData.findIndex(item => item.barCode === code);
            let row = this.block2.tableData[index];
            if(index === -1){
              this.isSuccess = false;
              this.message = `条码【${code}】已删除，不要重复删除！`;
              this.playAudio(this.sounds.warn2);
              return
            }else {
              this.isSuccess = true;
              this.message = `条码【${code}】删除成功！`;
              this.playAudio(this.sounds.del_success);

              this.block2.tableData.splice(index, 1);
              let index1 = this.block1.tableData.findIndex(i => i.productCode === row.productCode);
              let row1 = this.block1.tableData[index1];
              row1.sumAmount -= row.amount;
              row1.bigBoxAmount -= 1;
              if(row1.sumAmount === 0){
                this.block1.tableData.splice(index1, 1);
              }else {
                this.$set(this.block1.tableData, index1, row1);
              }
            }
            // this.formData.codeAmount -= 1;
          }
        }).catch(err => {
          this.isSuccess = false;
          this.message = err.message;
          this.playAudio(this.sounds.warn1);
        });
        this.code1 = '';
        // this.focusByRefName('delInput');
      },
      // 通过ref名获取焦点
      focusByRefName(name){
        // if (this.timer) {
        //   clearTimeout(this.timer);
        // }
        // this.timer = setTimeout(() => {
        //   this.$refs[name].focus();
        // }, 1000);
      },
      // 获取扫描编码后查询数据
      scanCode(code){
        if(!this.formData.stageNum || !this.formData.exwarehousingType || !this.formData.sendWarehouseCode || !this.formData.receiveWarehouse) {
          this.isSuccess = false;
          this.message = '请先选择仓库并创建单据！';
          this.playAudio(this.sounds.warn1);
          return
        }
        if (code.length === 0) {
          this.isSuccess = false;
          this.message = '请输入条码！';
          this.playAudio(this.sounds.warn1);
          return
        }else if (code.length > 0) {
          this.queryCodeInfo(code).then(res => {
            if(!res.data){ this.playAudio(this.sounds.warn1); return }
            let codeList = res.data.codeList;
            if(codeList.length === 0){
              this.isSuccess = false;
              this.message = `未找到条码【${code}】信息，请检查！`;
              this.playAudio(this.sounds.warn1);
            } else if (codeList.length > 0){
              this.isSuccess = true;
              this.message = `条码【${code}】扫描成功，请继续扫码！`;
              this.playAudio(this.sounds.success1);
              let barType = res.data.cartonFlag ? '大箱' : '彩箱';
              let productCode = codeList[0].productCode;
              let productType = codeList[0].productType;
              let productDesc = codeList[0].productDesc;
              let makeOrderNum = codeList[0].makeOrderNum;
              let amount = codeList.length;
              this.block2.tableData.unshift({
                barCode: code,
                barType,
                productCode,
                productType,
                productDesc,
                makeOrderNum,
                amount
              });
              let index = this.block1.tableData.findIndex(i => productCode === i.productCode);
              let row = this.block1.tableData[index];
              if(row){ // 更新
                row.bigBoxSize = amount;
                row.sumAmount += amount;
                row.bigBoxAmount += 1;
                row.makeOrderNum = makeOrderNum;
                this.$set(this.block1.tableData, index, row);
              } else { // 新增一行
                let bigBoxAmount = 1;// 大箱数量
                let bigBoxSize = amount; // 箱包规格
                let sumAmount = amount;
                this.block1.tableData.unshift({
                  productCode,
                  sumAmount,
                  bigBoxAmount,
                  bigBoxSize,
                  makeOrderNum,
                  productDesc
                });
              }
              // this.formData.codeAmount += 1;
              this.formData.productCode = productCode;
            }
          });
        }
      },
      queryCodeInfo(code){
        return new Promise(resolve => {
          let params = {
            barcode: code,
            stageNum: this.formData.stageNum,
            sendWarehouseCode: this.formData.sendWarehouseCode,
            receiveWarehouseCode: this.formData.receiveWarehouseCode,
            exwarehousingType: this.formData.exwarehousingType
          };
          let url = '/pss/member/salesDelivery/getCodeMessage';
          this.$http({
            url,
            method: 'post',
            data: params
          }).then(res => {
            if(res.success){
              resolve(res);
            }
          }).catch((err) => {
            this.isSuccess = false;
            if(err.message.includes('已存在')){
              this.message = err;
              this.playAudio(this.sounds.warn2);
            }else {
              this.message = err;
              this.playAudio(this.sounds.warn1);
            }
          });
        });
      },
      // 获取字典
      getDict() {
        this.getDictByCode('PSS_EXWAREHOUSING_TYPE', (data) => {
          this.dict.exwarehousingType = data;
        });
        this.getDictByCode('PSS_WAREHOUSE_CUSTOME', (data) => {
          this.dict.receiveWarehouse = data;
          if(data.length === 1){
            this.$nextTick(() => {
              this.modal1.form.formData[2].value = data[0].dictItemCode;
              // this.formData.receiveWarehouseCode = data[0].dictItemCode;
              // this.receiveWarehouseChange(this.formData.receiveWarehouseCode);
            });
          }
        });
        this.getSendWarehouse();
      },
      // 字典接口
      getDictByCode(code, callback) {
        let params = {
          dictCode: code
        };
        let url = '/pss/member/dict/item/byDictCode';
        this.$http.get(url, {params}).then(res => {
          if (res.success) {
            callback && callback(res.data);
          } else {
            this.$message.error(res.retMsg);
          }
        }).catch(err => {
          console.log(err);
        });
      },
      // 发出仓库change
      getSendWarehouse() {
        let url = '/pss/member/salesDelivery/getSendWarehouse';
        this.$http(url).then(res => {
          if (res.success) {
            this.dict.sendWarehouse = res.data.map(i => { return {label: i.warehouseName, value: i.warehouseCode, id: i.warehouseId}});
            if(this.dict.sendWarehouse.length === 1){
              this.$nextTick(() => {
                // this.formData.sendWarehouseCode = this.dict.sendWarehouse[0].value;
                this.modal1.form.formData[1].value = this.dict.sendWarehouse[0].value;
                // this.sendWarehouseChange(this.formData.sendWarehouseCode);
              })
            }
          }
        });
      },
      sendWarehouseChange(val){
        this.formData.sendWarehouse = this.$getLabelByValue(this.dict.sendWarehouse, val, 'label', 'value');
        this.formData.sendWarehouseId = this.$getLabelByValue(this.dict.sendWarehouse, val, 'id', 'value');
      },
      // 订单类型change
      orderTypeChange(val) {
        this.formData.exwarehousingTypeLabel = this.$getLabelByValue(this.dict.exwarehousingType, val);
      },
      // 目标仓库change
      receiveWarehouseChange(val) {
        this.formData.receiveWarehouse = this.$getLabelByValue(this.dict.receiveWarehouse, val);
        this.formData.receiveWarehouseId = this.$getLabelByValue(this.dict.receiveWarehouse, val, 'id', 'dictItemCode');
      },
      // 播放音频
      playAudio(src) {
        this.$refs['audio'].src = src;
      },

      // === 9-25 start===
      // 打开
      onOpenM3(condition) {
        this.modal3.show = true;
        this.$nextTick(() => {
          this.onSearchM3();
        });
      },
      onSubmitM3() {
        this.modal3.pagination.pageNum = 1;
        this.onSearchM3();
      },
      // pageSize
      pageSizeChangeM3(pageSize) {
        this.modal3.pagination.pageNum = 1;
        this.modal3.pagination.pageSize = pageSize;
        this.onSearchM3();
      },
      // pageNum
      pageNumChangeM3(currentPage) {
        this.modal3.pagination.pageNum = currentPage;
        this.onSearchM3();
      },
      onSearchM3() {
        let str = this.$refs['magicalTableModal3'].getCondition().barCode;
        let data = this.block2.tableData.filter(item => item.barCode.includes(str));
        this.modal3.table.tableData = data.slice((this.modal3.pagination.pageNum - 1) * this.modal3.pagination.pageSize, this.modal3.pagination.pageNum * this.modal3.pagination.pageSize);
        this.modal3.pagination.total = data.length;
      },
      // == 9-25 end===
      // 行点击
      rowDblclickM2(row) {
        let params = {
          stageNum: row.stageNum
        };
        let url = '/pss/member/salesDelivery/getStageInfo';
        let httpParams = {
          url,
          method: 'get',
          params,
          loading: true
        };
        this.$http(httpParams).then(res => {
          if(res.success && res.data){
            this.formData.stageNum = row.stageNum;
            this.formData.exwarehousingType = row.exwarehousingType;
            this.formData.exwarehousingTypeLabel = this.$getLabelByValue(this.dict.exwarehousingType, row.exwarehousingType);
            this.formData.sendWarehouse = this.$getLabelByValue(this.dict.sendWarehouse, row.sendWarehouseCode, 'label', 'value');
            this.formData.sendWarehouseCode = row.sendWarehouseCode;
            this.formData.sendWarehouseId = this.$getLabelByValue(this.dict.sendWarehouse, row.sendWarehouseCode, 'id', 'value');
            this.formData.receiveWarehouse = this.$getLabelByValue(this.dict.receiveWarehouse, row.receiveWarehouseCode);
            this.formData.receiveWarehouseCode = row.receiveWarehouseCode;
            this.formData.receiveWarehouseId = this.$getLabelByValue(this.dict.receiveWarehouse, row.receiveWarehouseCode, 'id', 'dictItemCode');
            this.block2.tableData = res.data;
            if(this.block2.tableData.length > 0){
              this.block2.tableData.forEach(item => {
                item.barType = item.cartonFlag ? '大箱' : '彩箱';
                item.barCode = item.barcode;
              });
              let group = this.groupArr(this.block2.tableData, 'productCode');
              this.block1.tableData = [];
              group.forEach(item => {
                let productCode = item.type;
                let sumAmount = item.sumAmount;
                let bigBoxAmount = item.list.length;
                let bigBoxSize = item.list[0].amount;
                let makeOrderNum = item.list[0].makeOrderNum;
                let productDesc = item.list[0].productDesc;
                this.block1.tableData.push({
                  productCode,
                  sumAmount,
                  bigBoxAmount,
                  bigBoxSize,
                  makeOrderNum,
                  productDesc
                })
              });
            }
            this.modal2.show = false;
          }
        }).catch(err => {

        });
      },
      // 数据分组
      groupArr(list, field) {
        var obj = {};
        for (var i = 0; i < list.length; i++) {
          for (let item in list[i]) {
            if (item == field) {
              obj[list[i][item]] = {
                list: obj[list[i][field]] ? obj[list[i][field]].list : [],
                type: list[i][field],
                sumAmount: obj[list[i][field]] ? obj[list[i][field]].sumAmount : 0
              };
            }
          }
          obj[list[i][field]].list.push(list[i]);
          obj[list[i][field]].sumAmount += list[i].amount;
        }
        var att = [];
        for (let item in obj) {
          att.push({
            list: obj[item].list,
            type: obj[item].type,
            sumAmount: obj[item].sumAmount,
          })
        }
        return att;
      },
      // 提交
      onSubmitM2() {
        this.onSearchM2();
      },
      // pageSize
      pageSizeChangeM2(pageSize) {
        this.modal2.pagination.pageNum = 1;
        this.modal2.pagination.pageSize = pageSize;
        this.onSearchM2();
      },
      // pageNum
      pageNumChangeM2(currentPage) {
        this.modal2.pagination.pageNum = currentPage;
        this.onSearchM2();
      },
      // 查询
      onSearchM2() {
        let str = this.$refs['magicalTableModal2'].getCondition().stageNum;
        let params = {
          // pageSize: this.modal2.pagination.pageSize,
          // pageNo: this.modal2.pagination.pageNum,
          stageNum: str
        };
        let url = '/pss/member/salesDelivery/getStage';
        this.modal2.loading = true;
        this.$http({
          url,
          method: 'get',
          params
        }).then(res => {
          this.modal2.loading = false;
          if (res && res.success) {
            this.modal2.allData = res.data || [];
            this.modal2.pagination.total = this.modal2.allData.length;
            this.modal2.table.tableData = this.modal2.allData.slice((this.modal2.pagination.pageNum - 1) * this.modal2.pagination.pageSize, this.modal2.pagination.pageNum * this.modal2.pagination.pageSize);
          }
        }).catch(() => {
          this.modal2.loading = false;
        });
      },
      // 创建单据
      handleCreated() {
        let stageNum = `CK${this.getCurrentTime()}`;
        this.formData.stageNum = stageNum;
        this.block1.tableData = [];
        this.block2.tableData = [];
        this.isSuccess = true;
        this.message = `单据创建成功，开始扫码！`;
        // this.playAudio(this.sounds.success1);
        this.modal2.show = false;
        // 测试
        // this.block2.tableData = [{"barCode":"331100007920401110162W","barType":"大箱","productCode":"C1061010002931","productType":"电脑式电饭煲 MB-FS5073A FS5073A 860W","productDesc":"电脑式电饭煲 MB-FS5073A FS5073A 860W","makeOrderNum":"106902001294401#1","amount":4},{"barCode":"331100007920401110161W","barType":"大箱","productCode":"21061011000755","productType":"MB-FB10M205","productDesc":"机械式电饭煲 MB-FB10M205 FB10M205 300W","makeOrderNum":"106902001233879#1","amount":6},{"barCode":"331100007920401110160W","barType":"大箱","productCode":"21061011000755","productType":"MB-FB10M205","productDesc":"机械式电饭煲 MB-FB10M205 FB10M205 300W","makeOrderNum":"106902001233879#1","amount":6},{"barCode":"331100007920401110159W","barType":"大箱","productCode":"21061011000755","productType":"MB-FB10M205","productDesc":"机械式电饭煲 MB-FB10M205 FB10M205 300W","makeOrderNum":"","amount":4},{"barCode":"341A54162010824110998W","barType":"大箱","productCode":"C1061010000465","productType":"电脑式电饭煲 MB-WFD4015 WFD4015 860W","productDesc":"电脑式电饭煲 MB-WFD4015 WFD4015 860W","makeOrderNum":"","amount":3}]
        // let group = this.groupArr(this.block2.tableData, 'productCode');
        // console.log(group);

      },
      getCurrentTime(){
        let currentDate = parseTime(new Date(), '{y}{m}{d}{h}{i}{s}');
        return currentDate;
      },
      // 切换仓库
      switchBtnClick() {
        this.modal1.show = true;
      },
      // 下一步
      handleNext() {
        let flag = this.$refs['magicalTableModal1'].validateForm();
        if (flag) {
          let condition = this.$refs['magicalTableModal1'].getCondition();
          this.formData.exwarehousingType = condition.exwarehousingType;
          this.formData.exwarehousingTypeLabel = this.$getLabelByValue(this.dict.exwarehousingType, condition.exwarehousingType);
          this.formData.sendWarehouse = this.$getLabelByValue(this.dict.sendWarehouse, condition.sendWarehouse, 'label', 'value');
          this.formData.sendWarehouseCode = condition.sendWarehouse;
          this.formData.sendWarehouseId = this.$getLabelByValue(this.dict.sendWarehouse, condition.sendWarehouse, 'id', 'value');
          this.formData.receiveWarehouse = this.$getLabelByValue(this.dict.receiveWarehouse, condition.receiveWarehouse);
          this.formData.receiveWarehouseCode = condition.receiveWarehouse;
          this.formData.receiveWarehouseId = this.$getLabelByValue(this.dict.receiveWarehouse, condition.receiveWarehouse, 'id', 'dictItemCode');
          this.modal1.show = false;
          this.modal2.show = true;
          this.$nextTick(() => {
            this.onSearchM2();
          });

        }
      },
      // 删除条码
      delStage(stageNum) {
        return new Promise(resolve => {
          let params = {stageNum};
          let url = '/pss/member/salesDelivery/deleteStage';
          this.$http({
            url,
            method: 'get',
            params
          }).then(res => {
            if(res.success){
              resolve();
            }
          })
        });
      }
    },
    mounted() {
      this.modal1.show = true;
      this.getDict();
      // this.bindKeydown();
      this.$refs['form1'].clearValidate();
    },
  }
</script>
<style lang="less" scoped>
  @lineColor: #eae7e7;
  .app-main .app-main-container.salesWarehouse {
    background-color: transparent;
    margin: 5px 5px 0;
  }

  .salesWarehouse {
    & > .el-row {
      margin-bottom: 5px;
    }
    .el-card /deep/ .el-card__header {
      font-weight: bold;
      padding: 8px 20px;
    }
    .el-card /deep/ .el-card__body {
      padding: 10px;
    }
    .el-card.card3 /deep/ .el-card__body, .el-card.card4 /deep/ .el-card__body {
      min-height: 395px;
    }
    .el-table /deep/ th {
      /*background-color: #edf0f2 !important;*/
    }
    .el-form .el-row .el-form-item {
      margin-bottom: 0;
    }
    .el-form .el-row .el-form-item.is-required {
      margin-bottom: 10px;
    }
    .card1 {
    }
    .card2 /deep/ {
      .el-row{
        align-items: center;
      }
      .img {
        width: 32px;
        height: 32px;
      }
      .salesWarehouseInput {
        flex: 0 0 230px;
        margin: 0 10px;
      }
      label{
        flex: 0 0 80px;
        text-align: right;
      }
      .salesWarehouseInput1{
        flex: 0 0 230px;
        margin: 0 10px;
      }
      .tip {
        margin-right: 10px;
        line-height: 32px;
        font-size: 16px;
        color: #C03639;
      }
      .tip.success {
        color: #409eff;
      }
      .sum {
        width: 200px;
        line-height: 32px;
        font-size: 16px;
      }
      .salesWarehouseInput /deep/ input:focus::-webkit-input-placeholder {
        color: #fff;
      }
      .salesWarehouseInput /deep/ input:focus:-moz-placeholder {
        color: #fff;
      }
      .salesWarehouseInput /deep/ input:focus:-ms-input-placeholder {
        color: #fff;
      }
      .salesWarehouseInput /deep/ input:focus {
        background-color: #409eff;
        color: #fff;
      }

      .salesWarehouseInput1 /deep/ input:focus::-webkit-input-placeholder {
        color: #fff;
      }
      .salesWarehouseInput1 /deep/ input:focus:-moz-placeholder {
        color: #fff;
      }
      .salesWarehouseInput1 /deep/ input:focus:-ms-input-placeholder {
        color: #fff;
      }
      .salesWarehouseInput1 /deep/ input:focus {
        background-color: #C03639;
        color: #fff;
      }

    }
    .card3 {
      .card-header{
        padding: 8px 20px;
      }
      .card3-row {

        label {
          padding: 10px;
          flex:0 0 80px;
          background-color: #88c1f4;
          border-top: 1px solid @lineColor;
          border-right: 1px solid @lineColor;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .value {
          border-top: 1px solid @lineColor;
          border-right: 1px solid @lineColor;
          text-align: center;
          line-height: 60px;
        }
      }
      .card3-row:last-child {
        label {
          border-bottom: 1px solid @lineColor;
          padding: 25px 10px;
        }
        .value {
          border-bottom: 1px solid @lineColor;
          font-size: 40px;
          line-height: 65px;
        }
      }
    }
    .card4 {

    }
  }

</style>
