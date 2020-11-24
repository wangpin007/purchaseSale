<template>
  <div class="form-container list-page-query" :class="{ formExpand: isActive }">
    <div class="btnGroup">
      <el-button type="primary" size="mini" @click="query">
        {{$t('common.search')}}
      </el-button>
      <el-button size="mini" @click="reset">
        {{$t('common.reset')}}
      </el-button>
      <el-button
        type="text"
        :class="['toggleBtn', { btnExpand: isActive }]"
        size="mini"
        @click="handleClick"
      >
        {{ taggleTex }}
        <i class="el-icon-arrow-down" />
      </el-button>
    </div>
    <el-form ref="formData" :model="formData" :label-width="formLabelWidth">
      <el-row :gutter="8">
        <el-col v-for="(item, k) in formArray" :key="k" :span="colNum">
          <!-- :label="item.label" -->
          <el-form-item
            :label="typeof item.label === 'function' ? item.label() : item.label"
            :label-width="formLabelWidth">
            <el-select
              v-if="item.type === 'select' && item.options"
              v-model="formData[item.prop]"
              :disabled="item.disabled"
              clearable
            >
              <el-option
                v-for="subitem in item.options"
                :key="subitem.value + '.' + Math.random()"
                :value="subitem.value"
                :label="subitem.label"
              />
            </el-select>
            <el-select
              v-else-if="item.type === 'select' && !item.options"
              v-model="formData[item.prop]"
              :disabled="item.disabled"
              clearable
            >
              <el-option
                v-for="subitem in selectDictionary[item.prop]"
                :key="subitem.value + '.' + Math.random()"
                :value="subitem.value"
                :label="subitem.label"
              />
            </el-select>
            <el-date-picker
              v-else-if="item.type === 'date'"
              v-model="formData[item.prop]"
              :disabled="item.disabled"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            />
            <el-date-picker
              v-else-if="item.type === 'daterange'"
              v-model="formData[item.prop]"
              :disabled="item.disabled"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
            <el-date-picker
              v-else-if="item.type === 'datetime'"
              v-model="formData[item.prop]"
              :disabled="item.disabled"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"/>
            <el-date-picker
              v-else-if="item.type === 'month'"
              v-model="formData[item.prop]"
              :disabled="item.disabled"
              type="month"
              value-format="yyyy-MM"
              placeholder="选择月"
            />
            <el-input
              v-else-if="item.type === 'number'"
              v-model="formData[item.prop]"
              :disabled="item.disabled"
              type="number"
              @keyup.enter.native="onQuery"
            />
            <template v-else-if="item.type === 'quicksearch'">
              <span ref="bindKey" style="display: none">
                {{ item.showKey }}
              </span>
              <QuickSearch
                ref="quickSearchTool"
                :show-key="item.showKey"
                :scope-data="item"
                :name="item.name"
                @close-quicksearch="getObj"
              />
            </template>
            <template v-else-if="item.type === 'checkbox'">
              <el-checkbox v-model="formData[item.prop]"
                           :disabled="item.disabled"
                           :style="item.style"
                           :checked="item.checked"
                           :true-label="item.trueLabel"
                           :false-label="item.falseLabel"
                           @change="(val) => {if (item.change !== undefined) { item.change(val); }}">
                {{item.cLabel ? item.cLabel : ''}}
              </el-checkbox>
            </template>
            <el-input
              v-else
              v-model="formData[item.prop]"
              :disabled="item.disabled"
              clearable
              @keyup.enter.native="onQuery"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import QuickSearch from "lib@/components/QuickSearch";
export default {
  name: "FormWrapper",
  props: {
    // 初始化展开或者收缩form的状态
    initActive: {
      type: Boolean,
      default: false
    },
    // 父页面传值--->配置项
    formLabelWidth: {
      type: String,
      default: "100px"
    },
    // 当前form绑定的 data 对象
    formArray: {
      type: Array,
      default: null
    },
    colLength: {
      type: Number,
      default: 3
    },
    preFormObj: {
      type: Object,
      default: null
    },
  },
  components: { QuickSearch },
  data() {
    return {
      isActive: false,
      taggleTex: '展开',
      formData: {},
      // formLabelWidth: '100px',
      colNum: 24 / this.colLength
    };
  },
  created(){
    this.isActive = this.initActive ? true : false;
    this.formArray.forEach(item => {
      if(item.default) {
        this.$set(this.formData, item.prop, item.default)
      }
    })
  },
  methods: {
    query() {
      // 查询
      for (let i in this.formData) {
        if (!this.formData[i]) delete this.formData[i];
      }
      this.$emit("getFormData", this.formData);
    },
    onQuery() {
      // 查询
      for (let i in this.formData) {
        if (!this.formData[i]) delete this.formData[i];
      }
      this.$emit("getFormData", this.formData);
    },
    reset() {
      // 重置所有过滤条件
      for (let i in this.formData) {
        this.formData[i] = null;
      }
      const refNodes = Array.from([].concat(this.$refs.quickSearchTool));
      refNodes.forEach(node => {
        node && node.clearInput();
      });
      const refCatNodes = Array.from([].concat(this.$refs.categorySelect));
      refCatNodes.forEach(node => {
        node && node.clearInput();
      });
    },
    // 切换开合
    handleClick() {
      this.isActive = !this.isActive;
      this.taggleTex = this.isActive ? '收缩' : '展开';
    },
    getObj(val, scope) {
      this.formData[scope.prop] = val ? val[scope.showKey] : "";
      if(scope.propExt) {
        this.$set(this.formData, [scope.propExt], val ? val[scope.propExt] : "");
      }
    }
  }
};
</script>
<style>
.vue-treeselect__label {
  font-size: 12px;
  font-weight: 400;
}
.list-page-query .el-form-item--small .el-form-item__content {
  height: 32px !important;
  line-height: 32px !important;
}
.list-page-query .el-form-item__label {
  padding-right: 8px;
  white-space: normal;
  line-height: 16px !important;
  vertical-align: middle;
  max-height: 32px;
  float: none !important;
  display: inline-block !important;
  width: 35% !important;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.list-page-query .el-form-item__content {
  vertical-align: middle;
  display: inline-block;
  margin-left: 0 !important;
  width: 65% !important;
  box-sizing: border-box;
}
</style>
<style scoped lang="scss">
.form-container {
  height: 53px;
  position: relative;
  .el-form {
    padding-right: 240px;
  }
  .btnGroup {
    position: absolute;
    top: 10px;
    right: 5px;
    z-index: 999;
    .toggleBtn {
      font-size: 12px;
      min-width: 50px;
      padding-left: 0;
      padding-right: 0;
    }
  }
  .el-form .el-row .el-form-item:first-child {
    margin-bottom: 10px;
  }
  &.list-page-query {
    padding-left: 5px;
    padding-right: 5px;
    border-right: 0;
    border-left: 0;
    // margin-bottom: 10px;
    border-top: 0;
  }
}
.formExpand {
  height: auto;
}
.btnExpand i {
  transform: rotate(180deg);
}
</style>
