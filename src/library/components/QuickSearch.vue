<template>
  <div class="the_quick_search">
    <el-row style="padding: 0;">
      <el-col :span="24" style="position: relative;padding: 0;">
        <el-autocomplete
          v-if="autocomplete"
          v-model="inputName"
          clearable
          showSelect
          :trigger-on-focus="false"
          :fetch-suggestions="querySearchAsync"
          :placeholder="placeholder"
          popper-class="autocomplete-qs-select"
          @select="inputSelect"
          @clear="getSelectData(null)"
          class="the_quick_select"
        >
          <template slot-scope="{ item }">
            <el-row type="flex" class="select-row">
              <el-col class="border" :style="getColWidth(field.width)" :title="item[field.name]" :key="k" v-for="(field, k) of showfields">{{item[field.name]}}</el-col>
            </el-row>
          </template>
        </el-autocomplete>

        <el-select
          v-else
          ref="quickSelectSelect"
          class="the_quick_select"
          :disabled="disabled"
          v-model="inputName"
          clearable
          filterable
          reserve-keyword
          remote
          :allow-create="allowInput"
          :popper-class="selectClass"
          :placeholder = "placeholder"
          :remote-method="remoteMethod"
          :loading="loading"
          :no-data-text="$t('common.noData')"
          :loading-text="$t('common.loading')"
          @change="getSelectData"
          @clear="clearOptions"
          @focus="focus"
          @visible-change="visibleChange">
          <el-option
            class="option-item"
            value=""
            disabled
            v-if="selectGridData.length>0"
          >
            <el-row type="flex" class="select-row">
              <el-col class="border" :style="getColWidth(item.width)" :title="item.label"  :key="key" v-for="(item,key) of showfields">{{ item.label }}</el-col>
            </el-row>
          </el-option>
          <el-option
            class="option-item"
            v-for="(item, key) in selectGridData"
            :key="key"
            :value="item"
          >
            <el-row type="flex" class="select-row">
              <el-col class="border" :style="getColWidth(field.width)" :title="item[field.name]" :key="k" v-for="(field, k) of showfields">{{ item[field.name] }}</el-col>
            </el-row>
          </el-option>
        </el-select>
        <el-button
          :disabled="disabled"
          icon="el-icon-search"
          @click="openDialog('click', $event)"
          class="quick-search-btn"
        ></el-button>
      </el-col>
    </el-row>

    <el-dialog
      width="850px"
      v-el-drag-dialog
      class="the_quick_search_dialog"
      :title="$t('common.quickSearch')"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
      append-to-body>
      <main-header>
        <template slot="left">
          <span>{{$t('common.searchResult')}}</span>
        </template>
        <template slot="right">
          <el-button type="primary" size="mini" @click="query('enter')">{{$t('common.search')}}</el-button>
          <el-button type="primary" size="mini" @click="reset('form')">{{$t('common.reset')}}</el-button>
          <el-button type="primary" size="mini" @click="closeDialog">{{$t('common.confirm')}}</el-button>
        </template>
      </main-header>
      <div class="table_wrapper">
        <el-table
          :data="gridData"
          border
          style="width: 100%"
          height="355"
          ref="quickSearchTable"
          highlight-current-row
          header-cell-class-name="midea-table-cell"
          :empty-text="$t('common.noData')"
          @row-dblclick="getLineData"
          @current-change="handleCurrentChange"
          @selection-change="checkChange"
        >
          <el-table-column v-if="multiSelect" width="30" type="selection"/>
          <el-table-column type="index" width="40" align="center"/>
          <template v-for="(col, key) in tableHeader">
            <el-table-column
              v-if="!col.hidden"
              :key="key"
              :prop="col.name"
              :label="col.label"
              :min-width="col.width"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot="header" slot-scope="scope">
                <div style="display: block">{{col.label}}</div>
                <div style="display: block;padding-bottom: 5px;">
                  <el-input
                    clearable
                    v-model="form[col.name]"
                    v-if="col.name.toLowerCase() in trnasformSqlObj"
                    placeholder
                    @keyup.native.enter="query('enter')"
                    :disabled="!! isDisable(col.name)"
                  />
                </div>
              </template>
            </el-table-column>
          </template>
        </el-table>
      </div>
      <el-footer class="page-bar">
        <pager-bar
          :dataCount="dataCount"
          :queryTotal="queryTotal"
          :pageIndex="viewIndex"
          :pageSize="viewSize"
          :pageCount="pageCount"
          :pageQuery="pageQuery"
          ref="pager"
        ></pager-bar>
      </el-footer>
    </el-dialog>
  </div>
</template>

<script>
  import MainHeader from 'lib@/components/Table/MainHeader';
  import PagerBar from 'lib@/components/Pager'
  import { isNull, isObject, isArray, trim } from '@/utils'

  export default {
    name: "QuickSearch",
    components: { PagerBar, MainHeader },
    inject: {
      elForm: {
        default: ""
      },

      elFormItem: {
        default: ""
      }
    },
    props: {
      name: {
        // 父页面传值--->配置项
        type: String,
        default: function() {
          return "";
        }
      },
      companySort: {
        // 父页面传值--->配置项
        type: String,
        default: function() {
          return "";
        }
      },
      showInput: {
        // 父页面传值input
        type: String,
        default: function() {
          return "";
        }
      },
      showKey: {
        //想要展示的字段属性key
        type: String,
        default: function() {
          return "";
        }
      },
      disabled: {
        type: Boolean,
        default: function() {
          return false;
        }
      },
      allowInput: {
        //允许用户手动录入数据
        type: Boolean,
        default: function() {
          return false;
        }
      },
      isSetValue: {
        //下拉查询是否全匹配-------默认false
        type: Boolean,
        default: function() {
          return false;
        }
      },
      //
      // 展示的字段属性key, 如 {name, code} 中的 name 属性
      displayKey: {
        type: [String, Array],
        default: function() {
          return null;
        }
      },
      // 存储值的字段属性key, 如 {name, code} 中的 code 属性
      valueKey: {
        type: [String, Array],
        default: function() {
          return null;
        }
      },
      // 取值映射
      mapValue: {
        type: Array,
        default: function() {
          return null;
        }
      },
      // 当前行上绑定的 data 对象
      scopeData: {
        type: Object,
        default: function() {
          return null;
        }
      },
      //是否支持多选
      multiSelect: {
        type: Boolean,
        default: function() {
          return false;
        }
      },
      preQueryData: {
        // 前置查询条件
        type: Object,
        default: function() {
          return null;
        }
      },
      extendQueryData: {
        // 扩展查询条件
        type: Object,
        default: function() {
          return null;
        }
      },
      formData: {
        type: Object,
        default: null
      },
      enableFormItem: {
        type: Array,
        default: function() {
          return []
        }
      },
      // 打开弹层是否自动查询
      autoQuery: {
        type: Boolean,
        default: false
      },
      // 打开弹层强制刷新数据
      forceRefresh: {
        type: Boolean,
        default: false
      },
      // 提示
      placeholder: {
        type: String,
        default: ''
      },
      // Select 下拉框的类名
      popperClass: {
        type: String,
        default: ''
      },
      // 指定显示下拉列表显示字段
      selectFields: {
        type: Array,
        default: function() {
          return []
        }
      },
      // 是否为 input 远程搜索
      autocomplete: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        timeout: null,
        loading: false,
        tableHeader: [], // 表头数据
        filterQueryArr: [], //查询条件过滤
        isSizeChanged: false,
        dataCount: 0,
        queryTotal: -1, // 共几条 -1就是问号
        viewIndex: 1,
        viewSize: 10,
        queryParam: {
          pageNum: 1,
          pageSize: 10
        },
        labelObj: [],
        resetObj: [],
        qsFields: [],
        currentRow: "",
        form: {},
        queryForm: {},
        formLabelWidth: "120px",
        dialogTableVisible: false,
        gridData: [],
        //select下拉data区域
        inputName: "",
        idColumn: '',   // 文本框取值字段,来自数据库配置项
        showfields: [],     // 下拉显示字段
        selectClass: '',  // 下拉样式
        selectVisible: false,
        showSelect: false,
        selectGridData: [],
        multipleSelection: [], //多选表格的行数据
        trnasformSqlObj: {}, //用来转换前端查询字段转换----
        initState: false, // 组件初始化未打开的状态
        isConditionChanged: false,   // 查询条件改变状态
      };
    },

    methods: {
      clearInput() {
        this.inputName = null;
      },
      setInput(value){
        this.inputName = value;
      },
      checkChange(val) {
        this.multipleSelection = val;
        // this.dispatchChange();
      },
      dispatchChange() {
        if (!!this.elFormItem) {
          this.elFormItem.$emit("el.form.change");
        }
      },
      // 下拉列宽度
      getColWidth(width) {
        return width ? {'width':width+'px'}:{'width':'150px'}
      },
      async remoteMethod(queryStr) {
        if (this.allowInput ) {
          //允许录入的情况下直接赋值-不要再做请求数据
          this.selectClass = 'qs-select-none';
          this.getSelectData(queryStr);
          return;
        }

        this.loading = true;  // 加载状态

        this.selectClass = this.popperClass;

        if (queryStr) {
          this.showSelect = true;

          await this.getConfigration();
          await this.query('', queryStr);

          // 自动选择
          if (this.selectGridData.length == 1 ) {
            this.getSelectData(this.selectGridData[0]);
            this.$refs.quickSelectSelect.blur();
          }
        } else {
          this.selectGridData = [];
        }
        this.loading = false;  // 加载状态
      },
      getSelectData(row = {}) {
        //获取选中的值并且赋值
        this.setValue(row);
        this.$forceUpdate();
        this.$emit("close-quicksearch", row, this.scopeData);
        // this.dispatchChange();
        this.$nextTick().then(() => {
          this.isConditionChanged = false
        });
      },
      getLineData(row = {}) {
        //双击选中行数据
        this.setValue(row);
        this.$emit("close-quicksearch", row, this.scopeData);
        // this.dispatchChange();
        this.$nextTick().then(() => {
          this.isConditionChanged = false
        });
        this.dialogTableVisible = false;
        this.selectVisible = false;
      },
      clearOptions() {
        //清空下拉选的值--------
        this.selectGridData = [];
        // this.dispatchChange();
      },
      closeSelect(isClose) {
      },
      async openDialog(type) {
        //添加前置事件---
        this.$emit("before-open", true);
        // 非自动查询下，如果绑定的查询条件有变化，清空列表数据
        // if (! this.autoQuery) {
        //   if ( this.forceRefresh || this.isConditionChanged ){
        //     this.reset();
        //   }
        // }
        this.reset();
        this.showSelect = false;
        this.selectVisible = false;
        await this.getConfigration();

        this.formData && Object.assign(this.form, this.formData)  // 设定的form表单信息

        if (this.autoQuery || type=='autoQuery') { // 自动查询
          await this.query();
          // 非点击事件，如果只有一条数据，则自动设值
          if (type=='autoQuery' && this.gridData.length == 1) {
            this.getLineData(this.gridData[0]);
            return;
          }
        }

        this.dialogTableVisible = true;

        type !='click' && this.$emit('query-callback', this.gridData)    // 下拉查询后触发
      },
      closeDialog() {
        if (this.multiSelect) {
          this.$emit("close-quicksearch", this.multipleSelection, this.scopeData);
        } else {
          if (!this.currentRow) {
            this.$message({
              type: 'error',
              message: '请选择一条数据！'
            })
            return;
          }
          this.setValue(this.currentRow);
          this.$emit("close-quicksearch", this.currentRow, this.scopeData);
        }
        this.dialogTableVisible = false;
        // this.dispatchChange();
      },
      handleCurrentChange(val) {
        this.currentRow = val;
      },
      pageQuery(opr, size) {
        // 查询数据的方法
        let allCount = Math.ceil(this.queryTotal / this.viewSize); //总页数---作为判断依据
        if (opr == "prev" && this.queryParam.pageNum == 1) return;
        if (opr == "next" && this.queryParam.pageNum == allCount) return;

        switch (opr) {
          case "prev":
            this.queryParam.pageNum -= 1;
            break;
          case "next":
            this.queryParam.pageNum += 1;
            break;
          default:
            this.viewSize = size;
            this.viewIndex = 1;
            this.queryParam.pageSize = size;
            this.queryParam.pageNum = 1;
        }
        this.isSizeChanged = true;

        this.query(opr);
      },
      pageCount() {
        // 查询共几条的方法
        // this.query('getCount');
      },
      setCache(key, data) {
        sessionStorage.setItem(
          "QS_" + key,
          JSON.stringify(data)
        );
      },
      getCache(key) {
        var data = sessionStorage.getItem("QS_" + key);
        return data ? JSON.parse(data) : null;
      },
      getConfigration() {
        if (this.getCache(this.name)) {
          let data = this.getCache(this.name);
          this.tableHeader = data.colModel.slice(0);
          this.filterQueryArr = Object.values(data.queryData.defCols);
          this.trnasformSqlObj = {};
          for (let i in data.queryData.defCols) {
            if (i != "_id_column") {
              let lowerCase = i
                .replace(/t./g, "")
                .replace(/_/g, "")
                .toLowerCase();
              this.trnasformSqlObj[lowerCase] = i;
            }
          }
          this.tableHeader.forEach(v => {
            this.$set(this.form, v.name, '');
            let { name, label ,width} = v
            this.qsFields.push({name, label,width})
            // this.resetObj.push(v.name);
            // this.labelObj.push(v.label);
          });

          this.idColumn = this.showKey || data.idColumn;
          this.setFields();
          return Promise.resolve();
        }

        return this.$http({
          //获取配置项---展示在页面上的字段
          url: '/pss/member/quicksearch/quicksearchConfig/getConfig',
          method: "POST",
          loading: true,
          data: { name: this.name }
        })
          .then(data => {
            this.tableHeader = data.data.colModel.slice(0);
            this.filterQueryArr = Object.values(data.data.queryData.defCols);
            this.trnasformSqlObj = {};
            for (let i in data.data.queryData.defCols) {
              if (i != "_id_column") {
                let lowerCase = i
                  .replace(/t./g, "")
                  .replace(/_/g, "")
                  .toLowerCase();
                this.trnasformSqlObj[lowerCase] = i;
              }
            }
            this.tableHeader.forEach(v => {
              this.$set(this.form, v.name, '');
              let { name, label } = v
              this.qsFields.push({name, label})
              // this.resetObj.push(v.name);
              // this.labelObj.push(v.label);
            });
            this.idColumn = this.showKey || data.gridData.idColumn;
            this.setFields();

            //设置缓存数据----去除缓存数据
            this.setCache(this.name, {
              colModel: data.data.colModel,
              queryData: data.data.queryData,
              idColumn: data.data.gridData.idColumn
            });
            // this.query();
          })
          .catch(err => {
            console.log(err);
          });
      },
      // 设置下拉显示字段
      setFields() {
        this.showfields = []
        if (this.selectFields.length > 0) {
          for(let name of this.selectFields) {
            let item = this.qsFields.find(v => v.name == name)
            let label = item ? item.label:''
            let width = item ? item.width:''
            this.showfields.push({
              name, label, width
            })
          }
        } else {
          this.showfields = this.qsFields.slice(0, 2)
        }
      },
      // 搜索表单参数
      setQueryParams(otherParams) {
        for (let i in this.form) {
          if (!(i.includes("_") || i.includes(".")) && this.form[i]) {
            let upperCase = this.trnasformSqlObj[i.toLowerCase()];
            if (upperCase) this.queryForm[upperCase] = this.form[i];
          }
        }
        otherParams && Object.assign(this.queryForm, otherParams)
      },
      query(opr, queryStr) {
        //设置调整表格高度
        if(this.dialogTableVisible) this.$refs.quickSearchTable.doLayout()
        let selectURL = "/pss/member/quicksearch/quicksearchConfig/listByFormCondition";
        this.initState = true;
        this.isConditionChanged = false;
        this.queryForm = {};
        if (opr == "enter") {
          //来自于enter事件，先清空form绑定的值，再重新赋值
          this.setQueryParams()
          this.queryTotal = -1;
          this.queryParam.pageNum = 1;  // 重置为1
          this.viewIndex = 1;
        } else {
          if (opr == 'getCount') {  // 查总数
            selectURL = "/pss/member/quicksearch/quicksearchConfig/countPopupWindowInfo";
            this.setQueryParams()
          } else if ((this.showSelect && this.filterQueryArr && this.filterQueryArr[0])) {
            //下拉查询条件过滤条件----//展开下拉选择
            selectURL = "/pss/member/quicksearch/quicksearchConfig/listInputInfo";
            this.queryForm[this.filterQueryArr[0].name] = queryStr;
            this.queryParam.pageNum = 1;  // 重置为1
          } else {
            this.setQueryParams()
          }
        }
        if (this.preQueryData) {
          //添加前置查询条件
          this.queryForm = Object.assign({}, this.preQueryData, this.queryForm);
        }
        let formData = JSON.stringify({
          query: JSON.stringify(this.queryForm),
          extendQuery: JSON.stringify(this.setExtendQueryData())
        });

        //是否是下拉查询
        if (this.showSelect) {
          formData = JSON.stringify({
            query: JSON.stringify(this.queryForm),
            key: this.name,
            value: queryStr,
            isSetValue: JSON.stringify(this.isSetValue),
            extendQuery: JSON.stringify(this.setExtendQueryData())
          });
        }
        let paramData = Object.assign({}, { params: formData }, this.queryParam);

        return this.$http({
          //获取数据---展示在table页面上的数据
          url: selectURL,
          method: "POST",
          loading: this.showSelect ? false:true,
          data: paramData
        })
          .then(data => {
            if (this.showSelect) {
              this.selectGridData = data.data.slice(0);
              if (data.length === 0 && !this.autocomplete) {
                this.inputName = "";
                this.setValue();
                this.$emit("close-quicksearch", null, this.scopeData);
              }
              return;
            } else if(opr == 'getCount') { // 总数
              this.queryTotal = data.data;
              return;
            }else {
              this.gridData = data.data.data.slice(0);
              this.queryTotal = data.data.totalCount;
            }
            //设置显示总条数
            // this.queryTotal = data.pagecount;
            this.dataCount = this.gridData.length;
            if (opr) {
              //改变相应的页码展示数
              switch (opr) {
                case "":
                  this.viewIndex = 1;
                  break;
                case "prev":
                  this.viewIndex -= 1;
                  break;
                case "next":
                  this.viewIndex += 1;
                  break;
              }
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      // 重置
      reset(type) {
        this.form = {};

        if (type != 'form') {
          this.gridData = [];
          this.selectGridData = [];
          this.labelObj = [];
          this.fields = [];
          this.resetObj = [];
          this.viewIndex = 1;
          this.dataCount = 0;
          this.queryTotal = -1;
        }

        // Object.assign(this.form, this.formData);
      },
      // 空值默认显示值
      setNullValue(value, defaultValue = "") {
        return isNull(value) ? defaultValue : value;
      },
      // 获取行上对应属性的值
      getPropValue(row, key) {
        return isObject(row) ? (row[key] || null) : row
      },
      // 设置属性值
      setValue(row = {}) {
        row = row ? row:{};

        try {
          if (this.scopeData) {
            [this.displayKey, this.valueKey].forEach((item, index) => {
              if (isArray(item)) {
                let [key, mapKey] = item;
                const value = this.setNullValue(this.getPropValue(row, key));
                if (key && mapKey) {
                  this.$set(this.scopeData,mapKey,value)
                  //this.scopeData[mapKey] = this.setNullValue(this.getPropValue(row, key));
                } else if (key) {
                  this.$set(this.scopeData,key,value)
                  //this.scopeData[key] = this.setNullValue(this.getPropValue(row, key));
                }
              } else if (item) {
                const value = this.setNullValue(this.getPropValue(row, item));
                this.$set(this.scopeData,item,value)
                //this.scopeData[item] = this.setNullValue(this.getPropValue(row, item));
              }
            });

            // map 值
            if (isArray(this.mapValue)) {
              for (let item of this.mapValue) {
                let [key, mapKey] = trim(item).split(",");
                if (key && mapKey) {
                  const value = this.setNullValue(this.getPropValue(row, key));
                  this.$set(this.scopeData,mapKey,value)
                  //this.scopeData[mapKey] = this.setNullValue(this.getPropValue(row, key));
                } else if (key) {
                  const value = this.setNullValue(this.getPropValue(row, key));
                  this.$set(this.scopeData,key,value)
                  //this.scopeData[key] = this.setNullValue(this.getPropValue(row, key));
                }
              }
            }
          }
        } catch (e) {
          console.log(e);
        }
        // 设置选择后的显示值
        this.inputName = isObject(row) ? (row[this.idColumn] || null) : row
      },
      // 设置 ExtendQuery
      setExtendQueryData() {
        let params = {
          _quickKey: this.name,
          entityId: 10,
        };
        //如果传入companySort--就加上作为查询条件
        if(this.companySort){
          params.companySort = this.companySort;
        }
        let data = {};
        for (let i in this.extendQueryData) {
          data[i] = this.setNullValue(this.extendQueryData[i], '').toString();
        }
        return Object.assign({}, data, params);
      },
      // 焦点事件
      focus() {
        // this.isConditionChanged && this.clearOptions()
        this.clearOptions()
      },
      visibleChange(val) {
        if (val) {
          let $quickSelectSelect = this.$refs.quickSelectSelect
          $quickSelectSelect.selectedLabel = $quickSelectSelect.currentPlaceholder
        }
      },
      // 禁用判断
      isDisable(colName) {
        return this.formData && this.formData.hasOwnProperty(colName) && ! this.enableFormItem.includes(colName)
      },
      // input 远程搜索
      async querySearchAsync(query, cb) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.$emit("update:showInput", query)
          if (query) {
            this.showSelect = true;
            this.selectGridData = [];
            //顺序执行 防止未获取 到Config 就去查询query导致查询接口错误
            Promise.all([this.getConfigration()]).then(() => {
              Promise.all([this.query('', query)]).then(() => {
                let head = { isHead: true }
                for(let filed of this.showfields) {
                  head[filed.name] = filed.label
                }
                this.selectGridData.unshift(head)
                cb(this.selectGridData)
              })
            })
          }
        }, 1000);
      },
      // input 远程搜索 下拉选择
      inputSelect(item) {
        if (! item.isHead) {
          this.getSelectData(item)
        }
      }
    },
    watch: {
      name: function(n, o) {  // 同个组件实例，不同name的情况（页面通过v-if控制 ）
        if (n != o) {
          this.reset()
        }
      },
      showInput: {
        immediate: true,
        handler: function(val) {
          this.inputName = isObject(val) ? val[this.showKey || this.idColumn] : val
        }
      },
      preQueryData:function(n, o) {
        this.isConditionChanged = true;
        // this.clearOptions();
      },
      extendQueryData:function(n, o) {
        this.isConditionChanged = true;
        // this.clearOptions();
      }
    },
    created() {
    }
  };
</script>

<style scoped lang="scss">
  .the_quick_search /deep/ {
    white-space: normal;
    position: relative;
    .el-input-group__append {
      padding-right: 8px;
    }
    .the_quick_select {
      display: block;
      padding: 0;
    }
    .the_quick_select .el-input__suffix {
      right: 30px;
    }
    .the_quick_select .el-input__suffix .el-input__icon {
      width: 16px;
    }
    .el-form-item {
      margin-bottom: 0;
    }
    .quick-search-btn {
      position: absolute;
      top: 2px;
      bottom: 2px;
      right: 2px;
      padding: 6px !important;
      border: none;
      min-width: 20px;
    }
  }
  .the_quick_search_dialog /deep/{
    .el-dialog__header {
      border-bottom: 1px solid #eee;
    }
    .el-dialog__body {
      padding-top: 0 !important;
      padding-bottom: 10px !important;
    }
    .el-table th>.cell{
      padding-left: 4px; padding-right: 4px;
    }
    .el-table th div {
      line-height: 16px;
      .el-input--small{
        padding: 0;
      }
      .el-input__inner {
        border-radius: 4px !important;
        height: 26px !important;
        line-height: 26px !important;
        min-height: 26px !important;
      }
    }
    // 隐藏图标，为何会显示该图标？
    .el-input__validateIcon {
      display: none;
    }
    .el-table .el-table__body tr>td {
      height: 30px;
      line-height: 30px; padding: 0;
    }
    .el-table__header tr>th{
      background: #f8f8f8 !important;
      padding: 0;
      padding-top: 2px;
    }
  }

  .option-item {
    border-bottom: 1px solid #ddd;
    padding: 0;
    font-weight: bold;
    .el-col {
      padding: 0 5px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .select-row {
      .border{
        border-right: 1px solid #ddd;
        &:last-child {
          border-right: none;
        }
      }
    }
    &.el-select-dropdown__item.is-disabled {  /*受portal样式的影响，重新定义 */
      display: inherit;
      visibility: inherit;
    }
  }
  .page-bar {
    height: auto!important;
  }
</style>
