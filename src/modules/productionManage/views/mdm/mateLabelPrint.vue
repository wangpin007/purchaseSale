<template>
  <section class="section">
    <div class="header">
      <el-button type="primary" :loading="genLoading" @click="handleGenerate">生成</el-button>
      <el-button type="primary" :loading="priLoading"  @click="handlePreview">预览打印</el-button>
      <!--<el-button type="primary" :loading="priLoading"  @click="handlePrint">打印</el-button>-->
      <el-button type="primary" @click="handleReset">重置</el-button>
      <el-button type="primary" :loading="scrLoading"  @click="handleScrapped">报废</el-button>
    </div>
    <magical-table
      type="card"
      :needLine="false"
      :needButtons="false"
      @pageSizeChange="pageSizeChange"
      @pageNumChange="pageNumChange"
      :form="form"
      :table="table"
      :loading="loading"
      ref="magicalTable"
      :pagination="pagination">
    </magical-table>
    <magical-table
      :show.sync="modal.show"
      title="工单查询"
      type="dialog"
      :form="modal.form"
      :table="modal.table"
      :pagination="modal.pagination"
      :loading="modal.loading"
      ref="magicalTableM1"
      @rowDblclick="rowDblclickM1"
      @currentChange="currentChange"
      @onSubmit="onSubmitM1"
      @pageSizeChange="pageSizeChangeM1"
      @pageNumChange="pageNumChangeM1">
    </magical-table>
    <div id="mateLabel" style="display: none">
      <div v-for="(item, index) in printData" :key="index" class="mateLabelPrint-label-item">
        <!--<div class="label-top">{{item.companyName}}</div>-->
        <div class="label-middle">
          <div :id="item.labelNo" class="mid-qrcode"></div>
          <div class="mid-text">
            <div class="text-row">
              <label>企业名称：</label><span>{{item.companyName}}</span>
            </div>
            <div class="text-row">
              <label>数量：</label><span>{{item.quantity}}</span><span>{{item.itemUnit}}</span>
            </div>
            <div class="text-row">
              <label>物料编码：</label><span>{{item.itemCode}}</span>
            </div>
            <div class="text-row">
              <label>物料描述：</label><span>{{item.itemName}}</span>
            </div>
            <div class="text-row">
              <label>批次：</label><span>{{item.itemCode}}</span>
            </div>
            <div class="text-row">
              <label>打印时间：</label><span>{{item.printDateTime}}</span>
            </div>
          </div>
        </div>
        <!--<div class="label-foot">-->
          <!--<div>-->
            <!--<label>物料描述：</label><span>{{item.itemName}}</span>-->
          <!--</div>-->
          <!--<div>-->
            <!--<label>批次：</label><span>{{item.itemCode}}</span>-->
          <!--</div>-->
          <!--<div>-->
            <!--<label>打印时间：</label><span>{{item.printDateTime}}</span>-->
          <!--</div>-->
        <!--</div>-->

      </div>
    </div>
    <!--打印设置-->
    <magical-table
      type="dialog"
      :title="modal2.title"
      :show.sync="modal2.show"
      width="30%"
      :form="modal2.form"
      ref="magicalTableM2">
      <div slot="footer">
        <el-button @click="modal2.show = false">取 消</el-button>
        <el-button type="primary" @click="printConfirm">确 定</el-button>
      </div>
    </magical-table>
  </section>
</template>

<script>
  import MagicalTable from "lib@/components/awesome/magicalTable/main";
  // import QRCode from 'qrcodejs2'
  import getLodop from '@/utils/lodopFuncs'

  export default {
    components: {
      MagicalTable
    },
    name: "mateLabelPrint",
    data() {
      return {
        form: {
          formData: [
            {
              label: '工单',
              prop: 'workOrderCode',
              type: 'text',
              value: '',
              renderIcon: () => {
                return {
                  component: 'icon',
                  click: (val) => {
                    this.modal.show = true;
                    this.$nextTick(() => {
                      this.onSearchM1();
                    })
                  }
                }
              },
              change: (val) => {
                if(!val){
                  this.$refs['magicalTable'].setFormDefaultValue({
                    itemCode: '',
                    itemName: '',
                    workOrderQty: '',
                    notGeneratedQuantity: '',
                    minimumPackagesNum: '',
                    genBatchSize: ''
                  });
                }
              }
            },
            {
              label: '物料编码',
              value: '',
              prop: 'itemCode',
              type: 'span',
            },
            {
              label: '物料名称',
              value: '',
              prop: 'itemName',
              type: 'span',
            },
            {
              label: '工单数量',
              value: '',
              prop: 'workOrderQty',
              type: 'span',
            },
            {
              label: '未生成数量',
              value: '',
              prop: 'notGeneratedQuantity',
              type: 'span',
            },
            {
              label: '最小包装',
              value: '',
              prop: 'minimumPackagesNum',
              type: 'inputNumber',
              // controls: false,
              min: 0,
              max: 10000000,
              // precision: 0,
              style: 'width: 100%',
              change: (val) => {
                if(val === 0){
                  this.form.formData[6].value = 0
                }else {
                  this.form.formData[6].value = this.form.formData[4].value / val;
                }
              }
            },
            {
              label: '生成张数',
              value: 0,
              min: 0,
              max: 10000000,
              prop: 'genBatchSize',
              step: 1,
              type: 'inputNumber',
              precision: 0,
              // controls: false,
              style: 'width: 100%'
            },
            {
              label: '备注',
              value: '',
              prop: 'meno',
              type: 'text'
            },
            {
              label: '',
              value: '',
              prop: 'isMantissa',
              type: 'checkbox',
              falseLabel: 'N',
              trueLabel: 'Y',
              cLabel: '生成特定尾数标签'
            },
            {
              label: '条码规则',
              value: '',
              prop: 'itemBarCodeRule',
              type: 'select',
              options: () => {
                return this.dict.ITEM_LABEL_BARCODE_RULE
              },
              rules: {required: true, message: '条码规则不能为空', trigger: 'change'}
            },
            // {
            //   label: '打印机',
            //   value: '',
            //   prop: 'printer',
            //   type: 'select',
            //   options: () => {
            //     return this.dict.printer
            //   }
            // },
          ],
          settings: {
            needRightPart: false,

          }
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
            // {
            //   label: '序号',
            //   type: "index",
            //   width: 50,
            //   fixed: 'left'
            // },
            {
              label: '物料标签',
              prop: 'labelNo',
              minWidth: 180,
            },
            {
              label: '物料编码',
              prop: 'itemCode',
              width: 130,
            },
            {
              label: '数量',
              prop: 'quantity',
              width: 100,
            },
            {
              label: '生成序号',
              prop: 'seqInBatch',
              width: 100,
            },
            {
              label: '生成张数',
              prop: 'genBatchSize',
              width: 100,
            },
            {
              label: '生成批号',
              prop: 'batchNumber',
              width: 100,
            },
            {
              label: '客户',
              prop: 'customerCode',
              width: 100,
            },
            {
              label: '标签状态',
              prop: 'status',
              width: 100,
              render: ({row, $index}) => {
                let text = this.$getLabelByValue(this.dict.ITEM_LABEL_STATUS, row.status, 'label', 'value');
                let type = '';
                if(row.status === 'GENERATED'){
                  type = '';
                }else if(row.status === 'PRINTED'){
                  type = 'success';
                }else if(row.status === 'OFFLINED'){
                  type = 'info';
                }else if(row.status === 'CANCELED'){
                  type = 'danger';
                }
                return {
                  component: 'tag',
                  type,
                  text
                }
              }
            },
            {
              label: '特定尾数标签',
              prop: 'isMantissa',
              width: 100,
            },
          ],
          settings: {
            height: 500
          }
        },
        pagination: {
          total: 0,
          pageSize: 100,
          pageNum: 1,
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
        modal2: {
          type: 'print',
          title: '打印设置',
          show: false,
          form: {
            formData: [
              {
                label: '标签列数',
                value: 1,
                prop: 'colNum',
                type: 'select',
                span: 24,
                clearable: false,
                options: [{label: 1, value: 1}, {label: 2, value: 2}, {label: 3, value: 3}, {label: 4, value: 4}],
                rules: {required: true, message: '标签个数不能为0', trigger: 'change'},
                change: (val) => {
                  let colSpacingIndex = this.modal2.form.formData.findIndex(i => i.prop === 'colSpacing');
                  let colSpacingDict = this.dict.PSS_MATE_LABEL_PRINT_DEFAULT.find(i => i.value.toUpperCase() === 'colSpacing'.toUpperCase());
                  let rowSpacingIndex = this.modal2.form.formData.findIndex(i => i.prop === 'rowSpacing');
                  let rowSpacingDict = this.dict.PSS_MATE_LABEL_PRINT_DEFAULT.find(i => i.value.toUpperCase() === 'colSpacing'.toUpperCase());
                  if(val === 1){
                    this.modal2.form.formData[colSpacingIndex].hide = true;
                    this.modal2.form.formData[colSpacingIndex].value = 0;
                    this.modal2.form.formData[rowSpacingIndex].hide = true;
                    this.modal2.form.formData[rowSpacingIndex].value = 0;
                  }else{
                    this.modal2.form.formData[colSpacingIndex].hide = false;
                    if(colSpacingDict) this.modal2.form.formData[colSpacingIndex].value = colSpacingDict.description * 1;
                    this.modal2.form.formData[rowSpacingIndex].hide = false;
                    if(colSpacingDict) this.modal2.form.formData[rowSpacingIndex].value = rowSpacingDict.description * 1;
                  }
                }
              },
              {
                label: '标签宽度',
                value: 250,
                prop: 'width',
                type: 'inputNumber',
                min: 0,
                max: 10000000,
                style: 'width: 100%',
                span: 24,
                clearable: true,
                rules: {required: true, message: '纸张高度不能为空', trigger: 'change'}
              },
              {
                label: '标签高度',
                value: 300,
                prop: 'height',
                type: 'inputNumber',
                min: 0,
                max: 10000000,
                style: 'width: 100%',
                span: 24,
                clearable: true,
                rules: {required: true, message: '上边距不能为空', trigger: 'change'}
              },
              {
                label: '列间距',
                value: 0,
                hide: true,
                prop: 'colSpacing',
                type: 'inputNumber',
                min: 0,
                max: 10000000,
                style: 'width: 100%',
                span: 24,
                clearable: true,
                rules: {required: true, message: '列间距不能为空', trigger: 'change'}
              },
              {
                label: '行间距',
                value: 0,
                hide: true,
                prop: 'rowSpacing',
                type: 'inputNumber',
                min: 0,
                max: 10000000,
                style: 'width: 100%',
                span: 24,
                clearable: true,
                rules: {required: true, message: '行间距不能为空', trigger: 'change'}
              },
              {
                label: '上边距',
                value: 0,
                prop: 'top',
                type: 'inputNumber',
                min: 0,
                max: 10000000,
                style: 'width: 100%',
                span: 24,
                clearable: true,
                rules: {required: true, message: '上边距不能为空', trigger: 'change'}
              },
              {
                label: '左边距',
                value: 0,
                prop: 'left',
                type: 'inputNumber',
                min: 0,
                max: 10000000,
                style: 'width: 100%',
                span: 24,
                clearable: true,
                rules: {required: true, message: '左边距不能为空', trigger: 'change'}
              },
            ],
            settings: {
              labelWidth: '90px',
              needRightPart: false
            }
          }
        },
        dict: {
          PSS_WORK_ORDER_STATUS: [],
          ITEM_LABEL_BARCODE_RULE: [],
          ITEM_LABEL_STATUS: [],
          PSS_MATE_LABEL_PRINT_DEFAULT: []
          // printer: [{label: '惠普', value: '1'}]
        },
        loading: false,
        genLoading: false,
        priLoading: false,
        scrLoading: false,
        printData: []
      }
    },
    methods: {
      groupingBySize(data, size) {
        let result = [];
        for(let i = 0; i < data.length; i += size){
          result.push(data.slice(i, i + size));
        }
        return result;
      },
      // 生成
      handleGenerate() {
        let formData = this.$refs['magicalTable'].getCondition();
        if(!formData.workOrderCode) {
          this.$message.warning('请选择工单!');
          return;
        }
        if(!formData.minimumPackagesNum) {
          this.$message.warning('最小包装数不能为0');
          return;
        }
        if(!formData.genBatchSize) {
          this.$message.warning('生成张数不能为0');
          return;
        }
        if(!formData.itemBarCodeRule) {
          this.$message.warning('条码规则不能为空');
          return;
        }
        this.$confirm('确认生成吗？', '提示', {
          type: 'warning',
        }).then(() => {
          this.generate(formData);
        })
      },
      // 生成
      generate(formData) {
        let params = {
          workOrderCode: formData.workOrderCode,
          minimunPackagesNum: formData.minimumPackagesNum,
          genBatchSize: formData.genBatchSize,
          itemBarCodeRule: formData.itemBarCodeRule,
          isMantissa: formData.isMantissa
        };
        let url = '/pss/member/itemLabel/generation';
        this.genLoading = true;
        this.$http({url, data: params, method: 'post'}).then(res => {
          this.genLoading = false;
          if(res.success){
            this.$message.success('生成完成！');
            this.queryDetail();
          }
        }).catch(err => {
          this.genLoading = false;
        });
      },
      // 预览
      handlePreview() {
        let slt = this.$refs['magicalTable'].getSelection();
        if(slt.length === 0){
          this.$message.warning('请勾选数据');
          return
        }
        if(slt.some(item => item.status === 'CANCELED')){
          this.$message.warning('存在标签状态为已作废数据，请检查');
          return;
        }
        // if(slt.some(item => item.status === 'PRINTED')){
        //   this.$message.warning('存在标签状态为已打印数据，请检查');
        //   return;
        // }
        let props = ['colNum', 'width', 'height', 'top', 'left', 'colSpacing', 'rowSpacing'];
        props.forEach(item => {
          let colNumIndex = this.modal2.form.formData.findIndex(i => i.prop.toUpperCase() === item.toUpperCase());
          let dict = this.dict.PSS_MATE_LABEL_PRINT_DEFAULT.find(i => i.value.toUpperCase() === item.toUpperCase());
          if(dict) this.modal2.form.formData[colNumIndex].value = dict.description * 1;
        });
        let colSpacingIndex = this.modal2.form.formData.findIndex(i => i.prop.toUpperCase() === 'colSpacing'.toUpperCase());
        let colSpacingDict = this.dict.PSS_MATE_LABEL_PRINT_DEFAULT.find(i => i.value.toUpperCase() === 'colSpacing'.toUpperCase());
        let rowSpacingIndex = this.modal2.form.formData.findIndex(i => i.prop.toUpperCase() === 'rowSpacing'.toUpperCase());
        let rowSpacingDict = this.dict.PSS_MATE_LABEL_PRINT_DEFAULT.find(i => i.value.toUpperCase() === 'rowSpacing'.toUpperCase());
        let colNumDict = this.dict.PSS_MATE_LABEL_PRINT_DEFAULT.find(i => i.value.toUpperCase() === 'colNum'.toUpperCase());
        if(colNumDict){
          let colNum = colNumDict.description * 1;
          if(colNum === 1){
            this.modal2.form.formData[colSpacingIndex].value = 0;
            this.modal2.form.formData[rowSpacingIndex].value = 0;
          }else {
            this.modal2.form.formData[colSpacingIndex].hide = false;
            this.modal2.form.formData[rowSpacingIndex].hide = false;
            if(colSpacingDict){
              this.modal2.form.formData[colSpacingIndex].value = colSpacingDict.description * 1;
              this.modal2.form.formData[rowSpacingIndex].value = rowSpacingDict.description * 1;
            }
          }
        }

        this.modal2.title = '打印设置';
        this.modal2.show = true;
      },
      // 打印设置 【确定】
      printConfirm() {
        let slt = this.$refs['magicalTable'].getSelection();
        let params = slt.map(item => item.id);
        let url = '/pss/member/itemLabel/printing';
        this.$http({
          url,
          data: params,
          method: 'post'
        }).then(res => {
          if(res.success){
            this.printData = res.data.printings;
            let colNum = this.$refs['magicalTableM2'].getCondition().colNum;
            let width = this.$refs['magicalTableM2'].getCondition().width;
            let height = this.$refs['magicalTableM2'].getCondition().height;
            let top = this.$refs['magicalTableM2'].getCondition().top;
            let left = this.$refs['magicalTableM2'].getCondition().left;
            let colSpacing = this.$refs['magicalTableM2'].getCondition().colSpacing;
            let rowSpacing = this.$refs['magicalTableM2'].getCondition().rowSpacing;
            let data = this.groupingBySize(this.printData, colNum);
            this.LODOP = getLodop();
            this.LODOP.PRINT_INIT("");
            if(colNum === 1){
              this.LODOP.SET_PRINT_PAGESIZE(1, left + (width + colSpacing) * colNum, height, "");
              data.forEach(item => {
                this.LODOP.NewPageA();
                this.LODOP.SET_PRINT_MODE("POS_BASEON_PAPER",true);
                this.AddPrintContent(item, top, left, colSpacing);
              });
              this.LODOP.PREVIEW();
            }else {
              this.LODOP.SET_PRINT_PAGESIZE(3, left + (width + colSpacing) * colNum, 0, "");
              this.LODOP.SET_PRINT_MODE("POS_BASEON_PAPER",true);
              this.AddPrintContentAll(data, top, left, width, height, colSpacing, rowSpacing);
              this.LODOP.PRINT_SETUP();
            }
          }
        })
      },
      AddPrintContent(data, top, left, colSpacing) {
        data.forEach((innerItem, colIndex) => {
          this.LODOP.ADD_PRINT_BARCODE(top, left + colIndex * (colSpacing + 72),82,82,"QRCode", innerItem.labelNo);
          this.LODOP.ADD_PRINT_HTM(top + 75, left + colIndex * (colSpacing + 73),77,36, `<div style="word-break:break-all; font-size: 6px; line-height: 6px; padding-left: 2px">${innerItem.labelNo}</div>`);
        });
      },
      AddPrintContentAll(data, top, left, width, height, colSpacing, rowSpacing) {
        data.forEach((row, rowIndex) => {
          row.forEach((col, colIndex) => {
            this.LODOP.ADD_PRINT_BARCODE(top + rowIndex * (100 + rowSpacing) ,left + colIndex * (colSpacing + 72),82,82,"QRCode", col.labelNo);
            this.LODOP.ADD_PRINT_HTM(top + 72 + rowIndex * (100 + rowSpacing), left + colIndex * (colSpacing + 73),77,36, `<div style="word-break:break-all; font-size: 6px; line-height: 6px; padding-left: 2px">${col.labelNo}</div>`);
          });
        });
      },
      // 重置
      handleReset() {
        this.$refs['magicalTable'].resetForm();
        this.pagination.pageSize = 100;
        this.pagination.pageNum = 1;
        this.table.tableData = [];

      },
      // 报废
      handleScrapped() {
        let slt = this.$refs['magicalTable'].getSelection();
        if(slt.length === 0){
          this.$message.warning('请勾选数据');
          return
        }
        this.$confirm('确认报废吗？', '提示', {
          type: 'warning',
        }).then(() => {
          this.scrapped(slt);
        });
      },
      // 报废
      scrapped(slt) {
        let params = slt.map(item => item.id);
        let url = '/pss/member/itemLabel/cancel';
        this.scrLoading = true;
        this.$http({
          url,
          data: {ids: params},
          method: 'post'
        }).then(res => {
          this.scrLoading = false;
          if(res.success){
            this.queryDetail();
          }
        }).catch(err => {
          this.scrLoading = false;
        })
      },
      // pageSize
      pageSizeChange(pageSize) {
        this.pagination.pageNum = 1;
        this.pagination.pageSize = pageSize;
        this.queryDetail();
      },
      // pageNum
      pageNumChange(currentPage) {
        this.pagination.pageNum = currentPage;
        this.queryDetail();
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
      // 双击行点击
      rowDblclickM1(row) {
        this.modal.currentRow = row;
        this.queryDetail();
      },
      // 单击当前行
      currentChange(val) {
        // debugger;
        // this.modal.currentRow = val;
      },
      // 保存
      queryDetail() {
        let currentRow =  this.modal.currentRow;
        let workOrderCode = currentRow.workOrderCode;
        if(!workOrderCode){
          this.$message.warning('请选择数据！');
          return;
        }
        this.queryMateLabel().then(res => {
          this.$refs['magicalTable'].setFormDefaultValue({
            workOrderCode,
            itemCode: currentRow.itemCode,
            itemName: currentRow.itemName,
            workOrderQty: currentRow.workOrderQty,
            notGeneratedQuantity: res.notGeneratedQuantity,
            minimumPackagesNum: res.minimumPackagesNum || 0,
            genBatchSize: (res.notGeneratedQuantity === 0 || res.minimumPackagesNum === 0) ? 0 : res.notGeneratedQuantity/res.minimumPackagesNum,
            isMantissa: 'N',
          });
          this.pagination.total = res.prdItemLabels.total;
          this.table.tableData = res.prdItemLabels.list;
          this.$nextTick(() => {
            this.table.tableData.forEach((item) => {
              if(item.status === 'GENERATED') item._checked = true;
            });
            this.$refs['magicalTable'].setSelection('_checked', true);
          });
          this.modal.show = false;
        });
      },
      // 查询物料标签
      queryMateLabel() {
        return new Promise(resolve => {
          let params = {
            workOrderCode: this.modal.currentRow.workOrderCode,
            pageSize: this.pagination.pageSize,
            pageNo: this.pagination.pageNum
          };
          let url = '/pss/member/itemLabel/listPage';
          let httpParams = {
            url,
            data: params,
            method: 'post'
          };
          this.loading = true;
          this.$http(httpParams).then(res => {
            this.loading = false;
            if(res.success) {
              resolve(res.data);
            }
          }).catch(err => {
            this.loading = false;
            console.log(err);
          })
        });
      },
      getDict() {
        this.getLabelList();
        return new Promise(resolve => {
          this.getDictByCodes(
            [
              'PSS_WORK_ORDER_STATUS',
              'ITEM_LABEL_BARCODE_RULE',
              'ITEM_LABEL_STATUS'
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

      getLabelList() {
        return new Promise(resolve => {
          this.$http({
            url: "/pss/member/dict/item/byDictCode?dictCode=" + "PSS_MATE_LABEL_PRINT_DEFAULT",
            // url: "/pss/dict/item/byDictCode?dictCode=" + "PSS_UNIT",
            method: "GET",
            data: {}
          })
            .then(data => {
              if (data && data.success) {
                this.dict.PSS_MATE_LABEL_PRINT_DEFAULT = data.data || [];
                this.dict.PSS_MATE_LABEL_PRINT_DEFAULT.forEach(item => {
                  item.label = item.dictItemName;
                  item.value = item.dictItemCode;
                });
                resolve(true);
              }
            })
            .catch(err => {
              console.log(err);
            });
        });
        // 获取单位

      },
    },
    mounted() {
      this.getDict();
      // this.onSearch();
    }
  }
</script>

<style lang="scss" scoped>
  .section{
    .calc103{
      height: calc(100vh - 103px)
    }
    .header{
      padding: 10px;
      border-bottom: 1px solid #DCDFE6;
    }
  }
</style>
<style lang="scss">
  .mateLabelPrint-label-item{
    margin-bottom: 20px;
    .label-middle{
      display: flex;
      justify-content: center;
      .mid-qrcode /deep/{
        img{
          width: 132px;
          height: 132px;
          background-color: #fff; //设置白色背景色
          padding: 6px; // 利用padding的特性，挤出白边
          box-sizing: border-box;
        }
      }
      .mid-text{
        .text-row{
          padding-left: 10px;
          line-height: 21px;
          font-size: 14px;
        }
      }
    }
  }
</style>