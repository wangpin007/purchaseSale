<template>
  <el-row type="flex" class="m-query" :style="{height: collapse ? collapseHeight : 'auto'}">
    <el-col :style="leftPartStyle">
      <el-form :ref="name" :model="defaultFormData" :label-width="labelWidth" :label-position="labelPosition">
        <el-row>
          <el-col v-for="(item, index) in formData" :key="index"
                  v-if="!item.hide"
                  :span="item.span || 8">
            <el-form-item :label="item.label" :style="item.formItemStyle === undefined ? formItemStyle : item.formItemStyle" :label-width="item.labelWidth" :prop="item.prop" :rules="item.rules">
              <template v-if="item.type === 'text' || item.type === undefined">
                <template v-if="!item.isDouble">
                  <el-input :row="item.row"
                            :value="item.value"
                            :clearable="item.clearable === undefined ? true : item.clearable"
                            :disabled="typeof item.disabled === 'function'? item.disabled() : item.disabled"
                            :readonly="item.readonly"
                            v-model="item.value"
                            :rows="item.rows || 1"
                            :type="(item.rows === undefined || item.rows === 1) ? 'text':'textarea'"
                            :style="item.style"
                            :suffix-icon="item.suffixIcon"
                            :prefix-icon="item.prefixIcon"
                            :class="{'hasIcon': item.hasOwnProperty('renderIcon') && typeof item.renderIcon === 'function'}"
                            @blur="(event) => { if (item.blur !== undefined) { item.blur(event); }}"
                            @change="(value) => { if (item.change !== undefined) { item.change(value); }}">
                    <template v-if="item.hasOwnProperty('renderPrepend') && typeof item.renderPrepend === 'function'" #prepend>
                      <template  v-if="item.renderPrepend().component === 'button'"  >
                        <el-button :disabled="typeof item.disabled === 'function'? item.disabled() : item.disabled"
                                   :style="item.renderPrepend().style"
                                   :loading="item.renderPrepend().loading"
                                   :type="item.renderPrepend().type"
                                   :size="item.renderPrepend().size ? item.renderPrepend().size: 'mini'"
                                   :icon="item.renderPrepend().icon"
                                   @click="() => {if (item.renderPrepend().click !== undefined) {item.renderPrepend().click()}}">{{item.renderPrepend().text}}
                        </el-button>
                      </template>
                      <template  v-else-if="item.renderPrepend().component === 'slot'"  >
                        <slot name="formItemInputPrepend"></slot>
                      </template>
                      <!--<template v-else-if="item.renderPrepend().component === 'select'">-->
                        <!--<el-select v-model="item.renderPrepend().value"-->
                                   <!--:clearable="item.renderPrepend().clearable === undefined ? true : item.renderPrepend().clearable"-->
                                   <!--:filterable="item.renderPrepend().filterable === undefined ? true : item.renderPrepend().filterable"-->
                                   <!--:disabled="item.renderPrepend().disabled === undefined ? false : item.renderPrepend().disabled"-->
                                   <!--:style="item.renderPrepend().style"-->
                                   <!--:placeholder="item.renderPrepend().placeholder"-->
                                   <!--@change="(val) => {if (item.renderPrepend().change !== undefined) { item.renderPrepend().change(val); }}"-->
                                   <!--@blur="(e) => {if (item.renderPrepend().blur !== undefined) { item.renderPrepend().blur(e); }}">-->
                          <!--<el-option v-for="(option, k) in item.renderPrepend().options" :key="k"-->
                                     <!--:label="option.label" :value="option.value">{{option.label}}-->
                          <!--</el-option>-->
                        <!--</el-select>-->
                      <!--</template>-->
                      <template  v-else>
                        <span v-html="item.renderPrepend()"></span>
                      </template>
                    </template>
                    <template v-if="item.hasOwnProperty('renderAppend') && typeof item.renderAppend === 'function'" #append>
                      <template  v-if="item.renderAppend().component === 'button'"  >
                        <el-button :disabled="typeof item.disabled === 'function'? item.disabled() : item.disabled"
                                   :style="item.renderAppend().style"
                                   :loading="item.renderAppend().loading"
                                   :type="item.renderAppend().type"
                                   :size="item.renderAppend().size ? item.renderAppend().size: 'mini'"
                                   :icon="item.renderAppend().icon"
                                   @click="() => {if (item.renderAppend().click !== undefined) {item.renderAppend().click()}}">{{item.renderAppend().text}}
                        </el-button>
                      </template>
                      <template  v-if="item.renderAppend().component === 'text'"  >
                        <span :style="item.renderAppend().style">{{item.renderAppend().text}}</span>
                      </template>
                      <template  v-else-if="item.renderAppend().component === 'slot'"  >
                        <slot name="formItemInputPrepend"></slot>
                      </template>
                      <template  v-else>
                        <span v-html="item.renderAppend()"></span>
                      </template>
                    </template>
                  </el-input>
                  <template v-if="item.hasOwnProperty('renderIcon') && typeof item.renderIcon === 'function'">
                    <template  v-if="item.renderIcon().component === undefined || item.renderIcon().component === 'icon'"  >
                      <el-button
                        :type="item.renderIcon().type"
                        :disabled="typeof item.disabled === 'function'? item.disabled() : item.disabled"
                        :icon="item.renderIcon().icon === undefined ? 'el-icon-search' : item.renderIcon().icon"
                        @click="() => {if (item.renderIcon().click !== undefined) {item.renderIcon().click(item.value)}}"
                        :style="item.renderIcon().style"
                      ></el-button>
                    </template>
                  </template>
                </template>
                <template v-else>
                  <el-row :gutter="0">
                    <el-col :span="11">
                      <el-form-item :prop="item.prop" :rules="item.rules">
                        <el-input :row="item.row"
                                  v-model="item.value"
                                  :disabled="typeof item.disabled === 'function'? item.disabled() : item.disabled"
                                  :readonly="item.readonly"
                                  :clearable="item.clearable === undefined ? true : item.clearable"
                                  :rows="item.rows"
                                  :type="(item.rows === undefined || item.rows === 1) ? 'text':'textarea'"
                                  :style="item.style"
                                  @blur="(event) => { if (item.blur !== undefined) { item.blur(event); }}"
                                  @change="(value) => { if (item.change !== undefined) { item.change(value); }}"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2" style="text-align: center">-</el-col>
                    <el-col :span="11">
                      <el-form-item :prop="formData[index+1].prop"
                                    :rules="formData[index+1].rules">
                        <el-input v-model="formData[index+1].value"
                                  :disabled="typeof formData[index+1].disabled === 'function'? formData[index+1].disabled() : formData[index+1].disabled"
                                  :readonly="formData[index+1].readonly"
                                  :clearable="formData[index+1].clearable === undefined ? true : formData[index+1].clearable"
                                  :rows="formData[index+1].rows"
                                  :type="(formData[index+1].rows === undefined || formData[index+1].rows === 1) ? 'text':'textarea'"
                                  :style="formData[index+1].style"
                                  @blur="(event) => { if (formData[index+1].blur !== undefined) { formData[index+1].blur(event); }}"
                                  @change="(value) => { if (formData[index+1].change !== undefined) { formData[index+1].change(value); }}"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </template>
              </template>
              <template v-else-if="item.type === 'inputNumber'">
                <el-input-number v-model="item.value"
                                 :max="item.max === undefined ? Infinity : item.max"
                                 :min="item.min === undefined ? -Infinity : item.min"
                                 :step="item.step === undefined ? 1 : item.step"
                                 :step-strictly="item.stepStrictly"
                                 :precision="item.precision"
                                 :size="item.size"
                                 :controls="item.controls === undefined ? true : item.controls"
                                 :controls-position="item.controlsPosition"
                                 :name="item.name"
                                 :label="item.label"
                                 :placeholder="item.placeholder"
                                 :disabled="typeof item.disabled === 'function'? item.disabled() : item.disabled"
                                 :style="item.style"
                                 @blur="(event) => { if (item.blur !== undefined) { item.blur(event); }}"
                                 @focus="(event) => { if (item.focus !== undefined) { item.focus(event); }}"
                                 @change="(currentValue, oldValue) => { if (item.change !== undefined) { item.change(currentValue, oldValue); }}">
                </el-input-number>
              </template>
              <template v-else-if="item.type === 'select'">
                <el-select v-model="item.value"
                           :clearable="item.clearable === undefined ? true : item.clearable"
                           :filterable="item.filterable === undefined ? true : item.filterable"
                           :disabled="(typeof item.disabled === 'function'? item.disabled() : item.disabled)|| (!(typeof item.options === 'function'? item.options().length : item.options.length) && !item.remote)"
                           :style="item.style"
                           :placeholder="item.placeholder"
                           @change="(val) => {if (item.change !== undefined) { item.change(val); }}"
                           @blur="(e) => {if (item.blur !== undefined) { item.blur(e); }}"
                           :remote="item.remote" :remote-method="(val) => {item.remoteMethod(val)}"
                           :loading="item.loading">
                  <template v-if="item.hasOwnProperty('options')">
                    <template v-if="typeof item.options === 'object'">
                      <el-option v-for="(option, k) in item.options" :key="k"
                                 :label="option.label" :value="option.value">{{option.label}}
                      </el-option>
                    </template>
                    <template v-if="typeof item.options === 'function'">
                      <el-option v-for="(option, k) in item.options()" :key="k"
                                 :label="option.label" :value="option.value" :disabled="option.disabled">{{option.label}}
                      </el-option>
                    </template>
                  </template>

                </el-select>
              </template>
              <template v-else-if="item.type === 'datePicker'">
                <template v-if="!item.isDouble">
                  <el-date-picker
                    v-model="item.value"
                    :clearable="item.clearable === undefined ? true : item.clearable"
                    :type="item.dateType || 'date'"
                    :placeholder="item.placeholder"
                    :disabled="typeof item.disabled === 'function'? item.disabled() : item.disabled"
                    :readonly="item.readonly"
                    :format="item.format"
                    :default-value="item.defaultValue"
                    :value-format="item.valueFormat"
                    :align="item.align === undefined ? 'left' : item.align"
                    :unlink-panels="item.unlinkPanels"
                    :range-separator="item.rangeSeparator === undefined ? '~' : item.rangeSeparator"
                    :start-placeholder="item.startPlaceholder"
                    :end-placeholder="item.endPlaceholder"
                    :picker-options="item.pickerOptions"
                    :style="item.style"
                    @change="(val) => { if (item.change !== undefined) { item.change(val); }}">
                  </el-date-picker>
                </template>
                <template v-else>
                  <el-row :gutter="0">
                    <el-col :span="11">
                      <el-form-item :prop="item.prop" :rules="item.rules">
                        <el-date-picker
                          v-model="item.value"
                          :clearable="item.clearable === undefined ? true : item.clearable"
                          :type="item.dateType || 'date'"
                          :placeholder="item.placeholder"
                          :disabled="typeof item.disabled === 'function'? item.disabled() : item.disabled"
                          :readonly="item.readonly"
                          :format="item.format"
                          :value-format="item.valueFormat"
                          :style="item.style"
                          @change="(val) => { if (item.change !== undefined) { item.change(val); }}">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2" style="text-align: center">-</el-col>
                    <el-col :span="11">
                      <el-form-item :prop="formData[index+1].prop"
                                    :rules="formData[index+1].rules">
                        <el-date-picker
                          v-model="formData[index+1].value"
                          :clearable="formData[index+1].clearable === undefined ? true : formData[index+1].clearable"
                          :type="formData[index+1].dateType || 'date'"
                          :placeholder="formData[index+1].placeholder"
                          :disabled="typeof formData[index+1].disabled === 'function'? formData[index+1].disabled() : formData[index+1].disabled"
                          :readonly="formData[index+1].readonly"
                          :format="formData[index+1].format"
                          :value-format="formData[index+1].valueFormat"
                          :style="formData[index+1].style"
                          @change="(val) => { if (item.change !== undefined) { item.change(val); }}">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </template>
              </template>
              <template v-else-if="item.type==='timePicker'">
                <el-time-picker
                  v-if="item.timeType === 'picker'"
                  v-model="item.value"
                  :picker-options="item.pickerOptions"
                  :default-value="item.defaultValue"
                  :value-format="item.valueFormat"
                  :placeholder="item.placeholder"
                  :style="item.style"
                  :readonly="item.readonly"
                  :disabled="typeof item.disabled === 'function'? item.disabled() : item.disabled"
                  :clearable="item.clearable === undefined ? true : item.clearable"
                  @change="(val) => { if (item.change !== undefined) { item.change(val); }}">
                </el-time-picker>
                <el-time-select
                  v-else
                  v-model="item.value"
                  :picker-options="item.pickerOptions"
                  :default-value="item.defaultValue"
                  :value-format="item.valueFormat"
                  :clearable="item.clearable === undefined ? true : item.clearable"
                  :disabled="typeof item.disabled === 'function'? item.disabled() : item.disabled"
                  :readonly="item.readonly"
                  :style="item.style"
                  :placeholder="item.placeholder"
                  @change="(val) => { if (item.change !== undefined) { item.change(val); }}">
                </el-time-select>
              </template>
              <template v-else-if="item.type === 'quickSearch'">
                <QuickSearch
                  ref="quickSearch"
                  :show-key="item.showKey"
                  :scope-data="item"
                  :name="item.name"
                  :disabled="typeof item.disabled === 'function'? item.disabled() : item.disabled"
                  :companySort="item.companySort"
                  :showInput="item.showInput"
                  :allowInput="item.allowInput"
                  :isSetValue="item.isSetValue"
                  :displayKey="item.displayKey"
                  :valueKey="item.valueKey"
                  :mapValue="item.mapValue"
                  :multiSelect="item.multiSelect"
                  :preQueryData="item.preQueryData"
                  :extendQueryData="item.extendQueryData"
                  :enableFormItem="item.enableFormItem"
                  :autoQuery="item.autoQuery"
                  :forceRefresh="item.forceRefresh"
                  :placeholder="item.placeholder"
                  :popperClass="item.popperClass"
                  :selectFields="item.selectFields"
                  :autocomplete="item.autocomplete"
                  @close-quicksearch="(selection, scope) =>{if(item.callback !== undefined) item.callback(selection, scope)}"
                />
              </template>
              <template v-else-if="item.type === 'radio'">
                <el-radio-group v-model="item.value"
                                :disabled="typeof item.disabled === 'function'? item.disabled() : item.disabled"
                                @change="(value) => { if (item.change !== undefined) { item.change(value); }}">
                  <el-radio v-for="(option, key) in item.options" :key="key"
                            :value="option.value"
                            :label="option.label"
                            :style="item.style"
                  >{{option.label}}
                  </el-radio>
                </el-radio-group>
              </template>
              <template v-else-if="item.type === 'checkboxGroup'">
                <el-checkbox-group v-model="item.value" :style="item.style"
                                   :min="item.min"
                                   :max="item.max"
                                   :disabled="typeof item.disabled === 'function'? item.disabled() : item.disabled"
                                   @change="(val) => {if (item.change !== undefined) { item.change(val); }}">
                  <el-checkbox v-for="(option, key) in item.options" :key="key" :value="option.value"
                               :label="option.label"
                               :disabled="(typeof item.disabled === 'function'? item.disabled() : item.disabled) || option.disabled"
                               :style="item.style">{{option.label}}
                  </el-checkbox>
                </el-checkbox-group>
              </template>
              <template v-else-if="item.type === 'checkbox'">
                <el-checkbox v-model="item.value"
                             :disabled="typeof item.disabled === 'function'? item.disabled() : item.disabled"
                             :style="item.style"
                             :checked="item.checked"
                             :true-label="item.trueLabel"
                             :false-label="item.falseLabel"
                             @change="(val) => {if (item.change !== undefined) { item.change(val); }}">
                  {{item.cLabel ? item.cLabel : ''}}
                </el-checkbox>
              </template>
              <template v-else-if="item.type === 'switch'">
                <el-switch
                  v-model="item.value"
                  :active-color="item.activeColor || '#13ce66'"
                  :inactive-color="item.activeColor || '#ff4949'"
                  :disabled="typeof item.disabled === 'function'? item.disabled() : item.disabled"
                  :width="item.width || 40"
                  :active-text="item.activeText"
                  :inactive-text="item.inactiveText"
                  :active-value="item.activeValue === undefined ? true : item.activeValue"
                  :inactive-value="item.inactiveValue === undefined ? false : item.inactiveValue"
                  :name="item.name"
                  :validate-event="item.alidateEvent"
                  @change="(value) => { if (item.change !== undefined) { item.change(value); }}"
                >
                </el-switch>
              </template>
              <template v-else-if="item.type === 'button'">
                <el-button :disabled="typeof item.disabled === 'function'? item.disabled() : item.disabled"
                           :style="item.style"
                           :loading="item.loading"
                           :type="item.btnType" :size="item.size? item.size: 'mini'"
                           @click="() => {if (item.click !== undefined) {item.click()}}">{{item.text}}
                </el-button>
              </template>
              <template v-else-if="item.type === 'buttons'">
                <el-button v-for="(option, key) in item.options"
                           :key="key"
                           :disabled="typeof option.disabled === 'function'? option.disabled() : option.disabled"
                           :style="option.style"
                           :class="option.class"
                           :loading="option.loading"
                           :type="option.type" :size="option.size? option.size: 'mini'"
                           @click="() => {if (option.click !== undefined) {option.click(this)}}">{{option.text}}
                </el-button>
              </template>
              <template v-else-if="item.type === 'span'">
                <span :style="item.style" class="elFormItemSpan" :title="item.value">{{item.value}}</span>
              </template>
              <template v-else-if="item.type === 'slot'">
                <slot name="formItem" :formItem="item"></slot>
              </template>
            </el-form-item>
          </el-col>
          <slot name="formCol"></slot>
        </el-row>
      </el-form>
    </el-col>
    <div v-if="needRightPart"
         :style="rightPartStyle"
         class="buttons">
      <div class="buttons-top">
        <el-button v-if="needSubmitBtn" type="primary" size="mini" :loading="loading" @click="handleSubmit">
          {{submitBtnText || $t('common.search')}}
        </el-button>
        <el-button v-if="needRestBtn" size="mini" @click="handleConfirmReset">{{$t('common.reset')}}</el-button>
        <el-button
          v-if="needCollapseBtn"
          type="text"
          :class="['iconBtn', { expend: !collapse }]"
          size="mini"
          @click="onCollapse">
          {{ collapse ? '展开' : '折叠' }}
          <i class="el-icon-arrow-down"/>
        </el-button>
      </div>
      <slot name="formRight"></slot>
    </div>
  </el-row>
</template>

<script>
  import QuickSearch from "lib@/components/QuickSearch";
  import ElCheckboxGroup from "element-ui/packages/checkbox/src/checkbox-group";
  import ElButton from "element-ui/packages/button/src/button";

  export default {
    components: {
      ElButton,
      ElCheckboxGroup,
      QuickSearch
    },
    name: "mQuery",
    props: {
      // 表单数据
      formData: {
        type: Array,
        default: function () {
          return []
        }
      },
      // 是否需要右边部分， 默认true
      needRightPart: {
        type: Boolean,
        default: true
      },
      // 是否需要重置按钮， 默认true
      needRestBtn: {
        type: Boolean,
        default: true
      },
      // 是否需要查询按钮， 默认true
      needSubmitBtn: {
        type: Boolean,
        default: true
      },
      // 是否需要【折叠/展开】按钮， 默认true
      needCollapseBtn: {
        type: Boolean,
        default: true
      },
      // el-form 组件的labelWidth属性，默认 120px
      labelWidth: {
        type: String,
        default: '120px',
      },
      // el-form 组件的labelPosition属性，默认 left
      labelPosition: {
        type: String,
        default: 'left',
      },
      // 是否折叠 默认true
      isCollapse: {
        type: Boolean,
        default: true
      },
      // 查询按钮的loading状态，默认false
      loading: {
        type: Boolean,
        default: false
      },
      // 折叠后的高度，默认 42px
      collapseHeight: {
        type: String,
        default: '42px'
      },
      // 右边按钮组的样式
      rightPartStyle: {
        type: Object,
        default: function () {
          return {}
        }
      },
      // 查询按钮文字 默认 '查询'
      submitBtnText: {
        type: String,
        default: ''
      },
      // 左边部分样式
      leftPartStyle: {
        type: Object,
        default: function () {
          return {}
        }
      },
      // form-item组件样式
      formItemStyle: {
        type: Object,
        default: function () {
          return {}
        }
      },
      // disabled为true的输入框是否清空，默认false
      clearDisabledValue: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        name: 'form',
        collapse: (this.needCollapseBtn && this.needRightPart) ? this.isCollapse : false,// 不需要【展开】按钮时，默认展开
      }
    },
    computed: {
      // el-form组件的v-model的默认值
      defaultFormData() {
        return this.getCondition();
      }
    },
    methods: {
      // 重置
      handleConfirmReset() {
        this.handleReset();
        this.$emit('resetData');
      },
      // 重置校验，情况el-form的数据，如果有disabled的不清除
      handleReset() {
        this.resetFields();
        try {
          if(this.clearDisabledValue) {
            this.reset();
          }else {
            this.formData.map((item) => {
              if (typeof item.disabled === 'function' ? !item.disabled() : !item.disabled) {
                if (item.type === 'inputNumber') {
                  item.value = null;
                } else if (item.type === 'checkbox') {
                  item.value = item.falseLabel;
                } else if (item.type === 'checkboxGroup') {
                  item.value = [];
                } else {
                  item.value = '';
                }
              }
            });
          }

          const refNodes = Array.from([].concat(this.$refs.quickSearch));
          refNodes.forEach(node => {
            node && node.clearInput();
          });
        } catch (err) {
        }
      },
      // 清空所有值
      reset() {
        this.formData.map((item) => {
          if (item.type === 'inputNumber') {
            item.value = null;
          } else if (item.type === 'checkbox') {
            item.value = item.falseLabel;
          } else if (item.type === 'checkboxGroup') {
            item.value = [];
          } else {
            item.value = '';
          }
        });
      },
      // 重置校验
      resetFields() {
        this.$refs[this.name].resetFields();
      },
      // 查询 返回查询条件
      handleSubmit() {
        if (this.validateForm()) {
          // 组装查询条件
          const condition = this.getCondition();
          // 把查询条件通过提交事件发布出去
          this.$emit('onSubmit', condition);
        }
      },
      // 折叠/展开
      onCollapse() {
        this.collapse = !this.collapse;
        this.$emit('onCollapse', this.collapse);
      },
      // 校验表单
      validateForm() {
        let validate = true;
        this.$refs[this.name].validate(res => {
          validate = res;
        });
        return validate;
      },
      // 获取el-form 的值
      getCondition() {
        let _con = {};
        this.formData.map(item => {
          _con[item.prop] = this.iGetInnerText(item.value);
        });
        return _con;
      },
      /**去掉空格，换行，回车符**/
      iGetInnerText(testStr) {
        // let resultStr = testStr || '';
        let resultStr;
        if (typeof testStr == 'string') {
          resultStr = testStr.replace(/(^\s*)|(\s*$)/g, "");    //首尾部去掉空格
          resultStr = resultStr.replace(/[\	]/g, ""); //去掉回车换行
          resultStr = resultStr.replace(/[\r\n]/g, ""); //去掉回车换行
        } else {
          resultStr = testStr;
        }
        return resultStr;
      },
      // 获取表单里面的全部快查组件数组
      getQuickSearchs() {
        return this.$refs['quickSearch'];
      },
      // 通过quickSearch组件的name属性获取表单里面的快查组件
      getQuickSearchByName(name) {
        return this.$refs['quickSearch'].find(item => item.name === name);
      },
      // 通过quickSearch组件的name属性清除指定快查组件的showInput
      clearInputByName(name) {
        this.getQuickSearchByName(name).clearInput();
      },
      // 通过quickSearch组件的name属性清除指定快查组件的showInput
      setInputByName(name, value) {
        this.getQuickSearchByName(name).setInput(value);
      },
      // form设置默认值
      setFormDefaultValue(values = {}) {
        this.formData.forEach(item => {
          if(values[item.prop] !== undefined){
            item.value = values[item.prop];
          }
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .m-query {
    overflow: hidden;
    .iconBtn /deep/ {
      padding: 0;
      min-width: auto;
    }
    .expend i {
      transform: rotate(180deg);
    }
    .el-form .el-row .el-form-item {
      margin: 0;
    }
    .el-form > .el-row > .el-col > .el-form-item {
      margin-bottom: 10px;
    }
    .el-form > .el-row > .el-col > .el-form-item /deep/ .el-form-item__error {
      padding-top: 0;
      /*top: 31px;*/
    }
    /*& /deep/ .el-form > .el-row > .el-col > .el-form-item > .el-form-item__content {*/
      /*height: 32px*/
    /*}*/
    .buttons {
      flex: 0 0 240px;
      .buttons-top {
        text-align: right;
        padding-left: 10px;
      }
    }
    .elFormItemSpan{
      position: absolute;
      width: 100%;
      padding:0 8px;
      height: 100%;
      border-radius: 2px;
      color: #606266;
      border: 1px solid #dcdfe6;
      background: #f5f7fa;
      @include ellipsis(100%);
    }
    .hasIcon/deep/{
      .el-input__suffix{
        right: 25px;
      }
      .el-input__inner{
        padding-right: 46px;
      }
    }
    .hasIcon/deep/ ~ .el-button {
      position: absolute;
      top: 2px;
      bottom: 2px;
      right: 2px;
      padding: 6px;
      border: none;
      min-width: 20px;
    }
  }
</style>