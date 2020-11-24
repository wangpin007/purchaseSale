<template>
  <el-table
    ref="table"
    :data="data"
    :height="height"
    :max-height="maxHeight"
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.3)"
    :stripe="stripe"
    :border="border"
    :size="size"
    :fit="fit"
    :show-header="showHeader"
    :highlight-current-row="highlightCurrentRow"
    :span-method="spanMethod"
    :row-key="rowKey"
    :expand-row-keys="expandRowKeys"
    :load="load"
    :default-expand-all="defaultExpandAll"
    :tree-props="treeProps"
    :show-summary="showSummary"
    :summary-method="summaryMethod"
    :cell-class-name="cellClassName"
    @select="select"
    @select-all="selectAll"
    @selection-change="selectionChange"
    @cell-mouseenter="cellMouseEnter"
    @cell-mouse-leave="cellMouseLeave"
    @cell-click="cellClick"
    @cell-dblclick="cellDblclick"
    @row-click="rowClick"
    @row-contextmenu="rowContextmenu"
    @row-dblclick="rowDblclick"
    @header-click="headerClick"
    @header-contextmenu="headerContextmenu"
    @sort-change="sortChange"
    @filter-change="filterChange"
    @current-change="currentChange"
    @header-dragend="headerDragend"
    @expand-change="expandChange"
  >
    <el-table-column
      v-for="(col, index) in columns"
      :type="col.type"
      v-if="!col.hide"
      :key="index"
      :label="col.label"
      :align="col.align || 'center'"
      :headerAlign="col.headerAlign"
      :sortable="col.sortable"
      :prop="col.prop"
      :width="col.width"
      :minWidth="col.minWidth"
      :fixed="col.fixed"
      :show-overflow-tooltip="col.tooltip === undefined ? tooltip : col.tooltip"
      :class-name="col.className"
      :label-class-name="col.labelClassName"
      :formatter="col.formatter"
      :render-header="col.renderHeader">
      <template  v-if="col.hasOwnProperty('renderLabel') && typeof col.renderLabel === 'function'"  #header="{column, $index, store, _self}">
        <template  v-if="col.renderLabel({column, $index, store, _self, col}).component === 'text'"  >
          <span>
            <span :style="col.renderLabel({column, $index, store, _self, col}).beforeStyle || {color: 'red'}">{{col.renderLabel({column, $index, store, _self, col}).beforeText || '*'}}</span>
            <label :style="col.renderLabel({column, $index, store, _self, col}).style || {}">{{col.label}}</label>
            <span :style="col.renderLabel({column, $index, store, _self, col}).afterStyle || {}">{{col.renderLabel({column, $index, store, _self, col}).afterText || ''}}</span>
          </span>
        </template>
        <template  v-else-if="col.renderLabel({column, $index, store, _self, col}).component === 'slot'"  >
          <slot name="tableHeader"
                :column="column"
                :$index="$index"
                :store="store"
                :_self="_self"
                :col="col">
          </slot>
        </template>
        <template  v-else>
          <span v-html="col.renderLabel({column, $index, store, _self, col}) || col.label"></span>
        </template>
      </template>
      <template v-if="col.hasOwnProperty('render') && typeof col.render === 'function'"  #default="{ row, $index, column, store, _self}">
        <template v-if="col.render({row, $index, column, store, _self, col}).component === 'input'">
          <el-input v-model="row[col.prop]"
                    :row="col.render({row, $index, column, store, _self, col}).row === undefined ? 1 : col.render({row, $index, column, store, _self, col}).row"
                    :clearable="col.render({row, $index, column, store, _self, col}).clearable === undefined ? true : col.render({row, $index, column, store, _self, col}).clearable"
                    :disabled="col.render({row, $index, column, store, _self, col}).disabled === undefined ? false : col.render({row, $index, column, store, _self, col}).disabled"
                    :readonly="col.render({row, $index, column, store, _self, col}).readonly === undefined ? false : col.render({row, $index, column, store, _self, col}).readonly"
                    :rows="col.render({row, $index, column, store, _self, col}).rows || 1"
                    :type="(col.render({row, $index, column, store, _self, col}).rows === undefined || col.render({row, $index, column, store, _self, col}).rows === 1) ? 'text':'textarea'"
                    :style="col.render({row, $index, column, store, _self, col}).style"
                    @blur="(event) => { if (col.render({row, $index, column, store, _self, col}).blur !== undefined) { col.render({row, $index, column, store, _self, col}).blur(event); }}"
                    @change="(value) => { if (col.render({row, $index, column, store, _self, col}).change !== undefined) { col.render({row, $index, column, store, _self, col}).change(value); }}">
          </el-input>
        </template>
        <template v-else-if="col.render({row, $index, column, store, _self, col}).component === 'inputNumber'">
          <el-input-number v-model="row[col.prop]"
                           :max="col.render({row, $index, column, store, _self, col}).max === undefined ? Infinity : col.render({row, $index, column, store, _self, col}).max"
                           :min="col.render({row, $index, column, store, _self, col}).min === undefined ? -Infinity : col.render({row, $index, column, store, _self, col}).min"
                           :step="col.render({row, $index, column, store, _self, col}).step === undefined ? 1 : col.render({row, $index, column, store, _self, col}).step"
                           :step-strictly="col.render({row, $index, column, store, _self, col}).stepStrictly"
                           :precision="col.render({row, $index, column, store, _self, col}).precision"
                           :size="col.render({row, $index, column, store, _self, col}).size"
                           :controls="col.render({row, $index, column, store, _self, col}).controls === undefined ? true : col.render({row, $index, column, store, _self, col}).controls"
                           :controls-position="col.render({row, $index, column, store, _self, col}).controlsPosition"
                           :name="col.render({row, $index, column, store, _self, col}).name"
                           :placeholder="col.render({row, $index, column, store, _self, col}).placeholder"
                           :disabled="col.render({row, $index, column, store, _self, col}).disabled"
                           :style="col.render({row, $index, column, store, _self, col}).style"
                           @blur="(event) => { if (col.render({row, $index, column, store, _self, col}).blur !== undefined) { col.render({row, $index, column, store, _self, col}).blur(event); }}"
                           @focus="(event) => { if (col.render({row, $index, column, store, _self, col}).focus !== undefined) { col.render({row, $index, column, store, _self, col}).focus(event); }}"
                           @change="(currentValue, oldValue) => { if (col.render({row, $index, column, store, _self, col}).change !== undefined) { col.render({row, $index, column, store, _self, col}).change(currentValue, oldValue); }}">
          </el-input-number>
        </template>
        <template v-else-if="col.render({row, $index, column, store, _self, col}).component === 'select'">
          <el-select v-model="row[col.prop]"
                     :clearable="col.render({row, $index, column, store, _self, col}).clearable === undefined ? true : col.render({row, $index, column, store, _self, col}).clearable"
                     :filterable="col.render({row, $index, column, store, _self, col}).filterable === undefined ? true : col.render({row, $index, column, store, _self, col}).filterable"
                     :disabled="col.render({row, $index, column, store, _self, col}).disabled || (!col.render({row, $index, column, store, _self, col}).options.length && !col.render({row, $index, column, store, _self, col}).remote)"
                     :style="col.render({row, $index, column, store, _self, col}).style"
                     :placeholder="col.render({row, $index, column, store, _self, col}).placeholder"
                     @change="(val) => {if (col.render({row, $index, column, store, _self, col}).change !== undefined) { col.render({row, $index, column, store, _self, col}).change(val); }}"
                     @blur="(e) => {if (col.render({row, $index, column, store, _self, col}).blur !== undefined) { col.render({row, $index, column, store, _self, col}).blur(e); }}"
                     :remote="col.render({row, $index, column, store, _self, col}).remote" :remote-method="(val) => {col.render({row, $index, column, store, _self, col}).remoteMethod(val)}"
                     :loading="col.render({row, $index, column, store, _self, col}).loading">
            <el-option v-for="(option, k) in col.render({row, $index, column, store, _self, col}).options" :key="k"
                       :label="option.label" :value="option.value">{{option.label}}
            </el-option>
          </el-select>
        </template>
        <template v-else-if="col.render({row, $index, column, store, _self, col}).component === 'quickSearch'">
          <quick-search
            ref="quickSearch"
            :show-key="col.render({row, $index, column, store, _self, col}).showKey"
            :scope-data="row"
            :name="col.render({row, $index, column, store, _self, col}).name"
            :disabled="col.render({row, $index, column, store, _self, col}).disabled"
            :companySort="col.render({row, $index, column, store, _self, col}).companySort"
            :showInput="col.render({row, $index, column, store, _self, col}).showInput"
            :allowInput="col.render({row, $index, column, store, _self, col}).allowInput"
            :isSetValue="col.render({row, $index, column, store, _self, col}).isSetValue"
            :displayKey="col.render({row, $index, column, store, _self, col}).displayKey"
            :valueKey="col.render({row, $index, column, store, _self, col}).valueKey"
            :mapValue="col.render({row, $index, column, store, _self, col}).mapValue"
            :multiSelect="col.render({row, $index, column, store, _self, col}).multiSelect"
            :preQueryData="col.render({row, $index, column, store, _self, col}).preQueryData"
            :extendQueryData="col.render({row, $index, column, store, _self, col}).extendQueryData"
            :enableFormItem="col.render({row, $index, column, store, _self, col}).enableFormItem"
            :autoQuery="col.render({row, $index, column, store, _self, col}).autoQuery"
            :forceRefresh="col.render({row, $index, column, store, _self, col}).forceRefresh"
            :placeholder="col.render({row, $index, column, store, _self, col}).placeholder"
            :popperClass="col.render({row, $index, column, store, _self, col}).popperClass"
            :selectFields="col.render({row, $index, column, store, _self, col}).selectFields"
            :autocomplete="col.render({row, $index, column, store, _self, col}).autocomplete"
            @close-quicksearch="(selection, scope) =>{if(col.render({row, $index, column, store, _self, col}).callback !== undefined) col.render({row, $index, column, store, _self, col}).callback(selection, scope)}"
          />
        </template>
        <template v-else-if="col.render({row, $index, column, store, _self, col}).component === 'switch'">
          <el-switch
            v-model="row[col.prop]"
            :active-color="col.render({row, $index, column, store, _self, col}).activeColor || '#13ce66'"
            :inactive-color="col.render({row, $index, column, store, _self, col}).activeColor || '#ff4949'"
            :disabled="col.render({row, $index, column, store, _self, col}).disabled"
            :width="col.render({row, $index, column, store, _self, col}).width || 40"
            :active-text="col.render({row, $index, column, store, _self, col}).activeText"
            :inactive-text="col.render({row, $index, column, store, _self, col}).inactiveText"
            :active-value="col.render({row, $index, column, store, _self, col}).activeValue === undefined ? true : col.render({row, $index, column, store, _self, col}).activeValue"
            :inactive-value="col.render({row, $index, column, store, _self, col}).inactiveValue === undefined ? false : col.render({row, $index, column, store, _self, col}).inactiveValue"
            :name="col.render({row, $index, column, store, _self, col}).name"
            :validate-event="col.render({row, $index, column, store, _self, col}).alidateEvent"
            @change="(value) => { if (col.render({row, $index, column, store, _self, col}).change !== undefined) { col.render({row, $index, column, store, _self, col}).change(value); }}"
          >
          </el-switch>
        </template>
        <template v-else-if="col.render({row, $index, column, store, _self, col}).component === 'radio'">
          <el-radio-group v-model="row[col.prop]"
                          :disabled="col.render({row, $index, column, store, _self, col}).disabled"
                          @change="(value) => { if (col.render({row, $index, column, store, _self, col}).change !== undefined) { col.render({row, $index, column, store, _self, col}).change(value); }}">
            <el-radio v-for="(option, key) in col.render({row, $index, column, store, _self, col}).options" :key="key"
                      :value="option.value"
                      :label="option.label"
                      :style="col.render({row, $index, column, store, _self, col}).style"
            >{{option.label}}
            </el-radio>
          </el-radio-group>
        </template>
        <template v-else-if="col.render({row, $index, column, store, _self, col}).component === 'checkboxGroup'">
          <el-checkbox-group v-model="row[col.prop]"
                             :style="col.render({row, $index, column, store, _self, col}).style"
                             :min="col.render({row, $index, column, store, _self, col}).min"
                             :max="col.render({row, $index, column, store, _self, col}).max"
                             :disabled="col.render({row, $index, column, store, _self, col}).disabled"
                             @change="(val) => {if (col.render({row, $index, column, store, _self, col}).change !== undefined) { col.render({row, $index, column, store, _self, col}).change(val); }}">
            <el-checkbox v-for="(option, key) in col.render({row, $index, column, store, _self, col}).options" :key="key"
                         :value="option.value"
                         :label="option.label"
                         :disabled="col.render({row, $index, column, store, _self, col}).disabled"
                         :style="col.render({row, $index, column, store, _self, col}).style">{{option.label}}
            </el-checkbox>
          </el-checkbox-group>
        </template>
        <template v-else-if="col.render({row, $index, column, store, _self, col}).component === 'checkbox'">
          <el-checkbox v-model="row[col.prop]"
                       :disabled="col.render({row, $index, column, store, _self, col}).disabled"
                       :style="col.render({row, $index, column, store, _self, col}).style"
                       :checked="col.render({row, $index, column, store, _self, col}).checked"
                       :true-label="col.render({row, $index, column, store, _self, col}).trueLabel"
                       :false-label="col.render({row, $index, column, store, _self, col}).falseLabel"
                       @change="(val) => {if (col.render({row, $index, column, store, _self, col}).change !== undefined) { col.render({row, $index, column, store, _self, col}).change(val); }}">
            {{col.render({row, $index, column, store, _self, col}).text ? col.render({row, $index, column, store, _self, col}).text : ''}}
          </el-checkbox>
        </template>
        <template v-else-if="col.render({row, $index, column, store, _self, col}).component === 'datePicker'">
          <el-date-picker
            v-model="row[col.prop]"
            :clearable="col.render({row, $index, column, store, _self, col}).clearable === undefined ? true : col.render({row, $index, column, store, _self, col}).clearable"
            :type="col.render({row, $index, column, store, _self, col}).dateType || 'date'"
            :placeholder="col.render({row, $index, column, store, _self, col}).placeholder"
            :disabled="col.render({row, $index, column, store, _self, col}).disabled"
            :readonly="col.render({row, $index, column, store, _self, col}).readonly"
            :format="col.render({row, $index, column, store, _self, col}).format"
            :value-format="col.render({row, $index, column, store, _self, col}).valueFormat"
            :align="col.render({row, $index, column, store, _self, col}).align === undefined ? 'left' : col.render({row, $index, column, store, _self, col}).align"
            :unlink-panels="col.render({row, $index, column, store, _self, col}).unlinkPanels"
            :range-separator="col.render({row, $index, column, store, _self, col}).rangeSeparator === undefined ? '~' : col.render({row, $index, column, store, _self, col}).rangeSeparator"
            :start-placeholder="col.render({row, $index, column, store, _self, col}).startPlaceholder"
            :end-placeholder="col.render({row, $index, column, store, _self, col}).endPlaceholder"
            :picker-options="col.render({row, $index, column, store, _self, col}).pickerOptions"
            :style="col.render({row, $index, column, store, _self, col}).style"
            @change="(val) => { if (col.render({row, $index, column, store, _self, col}).change !== undefined) { col.render({row, $index, column, store, _self, col}).change(val); }}">
          </el-date-picker>
        </template>
        <template v-else-if="col.render({row, $index, column, store, _self, col}).component==='timePicker'">
          <el-time-select
            v-model="row[col.prop]"
            :picker-options="col.render({row, $index, column, store, _self, col}).pickerOptions"
            :clearable="col.render({row, $index, column, store, _self, col}).clearable === undefined ? true : col.render({row, $index, column, store, _self, col}).clearable"
            :disabled="col.render({row, $index, column, store, _self, col}).disabled"
            :readonly="col.render({row, $index, column, store, _self, col}).readonly"
            :style="col.render({row, $index, column, store, _self, col}).style"
            :placeholder="col.render({row, $index, column, store, _self, col}).placeholder"
            @change="(val) => { if (col.render({row, $index, column, store, _self, col}).change !== undefined) { col.render({row, $index, column, store, _self, col}).change(val); }}">
          </el-time-select>
        </template>
        <template v-else-if="col.render({row, $index, column, store, _self, col}).component === 'buttons'">
          <el-button v-for="(option, key) in col.render({row, $index, column, store, _self, col}).options" :key="key"
                     v-if="!option.hide"
                     :disabled="option.disabled"
                     :style="option.style"
                     :loading="option.loading"
                     :type="option.type || 'primary'"
                     :size="option.size? option.size: 'mini'"
                     @click="() => {if (option.click !== undefined) {option.click({row, $index, column, store, _self, col})}}">{{option.text}}
          </el-button>
        </template>
        <template v-else-if="col.render({row, $index, column, store, _self, col}).component === 'button'">
          <el-button :disabled="col.render({row, $index, column, store, _self, col}).disabled"
                     :style="col.render({row, $index, column, store, _self, col}).style"
                     :loading="col.render({row, $index, column, store, _self, col}).loading"
                     :type="col.render({row, $index, column, store, _self, col}).type || 'primary'"
                     :size="col.render({row, $index, column, store, _self, col}).size? col.render({row, $index, column, store, _self, col}).size: 'mini'"
                     @click="() => {if (col.render({row, $index, column, store, _self, col}).click !== undefined) {col.render({row, $index, column, store, _self, col}).click()}}">{{col.render({row, $index, column, store, _self, col}).text}}
          </el-button>
        </template>
        <template v-else-if="col.render({row, $index, column, store, _self, col}).component === 'tag'">
          <el-tag :type="col.render({row, $index, column, store, _self, col}).type"
                  :closable="col.render({row, $index, column, store, _self, col}).closable"
                  :disable-transitions="col.render({row, $index, column, store, _self, col}).disableTransitions"
                  :hit="col.render({row, $index, column, store, _self, col}).hit"
                  :color="col.render({row, $index, column, store, _self, col}).color"
                  :size="col.render({row, $index, column, store, _self, col}).size"
                  :effect="col.render({row, $index, column, store, _self, col}).effect || 'light'"
                  @click="() => {if (col.render({row, $index, column, store, _self, col}).click !== undefined) {col.render({row, $index, column, store, _self, col}).click()}}"
                  @close="() => {if (col.render({row, $index, column, store, _self, col}).close !== undefined) {col.render({row, $index, column, store, _self, col}).close()}}">
            {{col.render({row, $index, column, store, _self, col}).text}}
          </el-tag>
        </template>
        <template v-else-if="col.render({row, $index, column, store, _self, col}).component === 'slot'">
          <slot name="tableBody"
                :row="row"
                :$index="$index"
                :column="column"
                :store="store"
                :_self="_self"
                :col="col" >
          </slot>
        </template>
        <template v-else>
          <span v-html="col.render({row, $index, column, store, _self, col})"></span>
        </template>
      </template>
      <el-table-column
        v-if="col.children"
        v-for="(col1, index1) in col.children"
        :key="index1"
        :label="col1.label"
        :align="col1.align"
        :headerAlign="col1.headerAlign"
        :sortable="col1.sortable"
        :prop="col1.prop"
        :width="col1.width"
        :minWidth="col1.minWidth"
        :fixed="col1.fixed"
        :show-overflow-tooltip="col1.tooltip === undefined ? tooltip : col1.tooltip"
        :class-name="col1.className"
        :label-class-name="col1.labelClassName"
        :formatter="col1.formatter">
        <template  v-if="col1.hasOwnProperty('renderLabel') && typeof col1.renderLabel === 'function'"  #header="{column, $index, store, _self}">
          <template  v-if="col1.renderLabel({column, $index, store, _self, col: col1}).component === 'text'"  >
            <span>
              <span :style="col1.renderLabel({column, $index, store, _self, col: col1}).beforeStyle || {color: 'red'}">{{col1.renderLabel({column, $index, store, _self, col: col1}).beforeText || '*'}}</span>
              <label :style="col1.renderLabel({column, $index, store, _self, col: col1}).style || {}">{{col1.label}}</label>
              <span :style="col1.renderLabel({column, $index, store, _self, col: col1}).afterStyle || {}">{{col1.renderLabel({column, $index, store, _self, col: col1}).afterText || ''}}</span>
            </span>
          </template>
          <template  v-else-if="col1.renderLabel({column, $index, store, _self, col: col1}).component === 'slot'"  >
            <slot name="tableHeader"
                  :column="column"
                  :$index="$index"
                  :store="store"
                  :_self="_self"
                  :col="col1">
            </slot>
          </template>
          <template  v-else>
            <span v-html="col1.renderLabel({column, $index, store, _self, col: col1}) || col1.label"></span>
          </template>
        </template>
        <template v-if="col1.hasOwnProperty('render') && typeof col1.render === 'function'"  #default="{ row, $index, column, store, _self}">
          <template v-if="col1.render({row, $index, column, store, _self, col: col1}).component === 'input'">
            <el-input v-model="row[col1.prop]"
                      :row="col1.render({row, $index, column, store, _self, col: col1}).row === undefined ? 1 : col1.render({row, $index, column, store, _self, col: col1}).row"
                      :clearable="col1.render({row, $index, column, store, _self, col: col1}).clearable === undefined ? true : col1.render({row, $index, column, store, _self, col: col1}).clearable"
                      :disabled="col1.render({row, $index, column, store, _self, col: col1}).disabled === undefined ? false : col1.render({row, $index, column, store, _self, col: col1}).disabled"
                      :readonly="col1.render({row, $index, column, store, _self, col: col1}).readonly === undefined ? false : col1.render({row, $index, column, store, _self, col: col1}).readonly"
                      :rows="col1.render({row, $index, column, store, _self, col: col1}).rows || 1"
                      :type="(col1.render({row, $index, column, store, _self, col: col1}).rows === undefined || col1.render({row, $index, column, store, _self, col: col1}).rows === 1) ? 'text':'textarea'"
                      :style="col1.render({row, $index, column, store, _self, col: col1}).style"
                      @blur="(event) => { if (col1.render({row, $index, column, store, _self, col: col1}).blur !== undefined) { col1.render({row, $index, column, store, _self, col: col1}).blur(event); }}"
                      @change="(value) => { if (col1.render({row, $index, column, store, _self, col: col1}).change !== undefined) { col1.render({row, $index, column, store, _self, col: col1}).change(value); }}">
            </el-input>
          </template>
          <template v-else-if="col1.render({row, $index, column, store, _self, col: col1}).component === 'inputNumber'">
            <el-input-number v-model="row[col1.prop]"
                             :max="col1.render({row, $index, column, store, _self, col: col1}).max === undefined ? Infinity : col1.render({row, $index, column, store, _self, col: col1}).max"
                             :min="col1.render({row, $index, column, store, _self, col: col1}).min === undefined ? -Infinity : col1.render({row, $index, column, store, _self, col: col1}).min"
                             :step="col1.render({row, $index, column, store, _self, col: col1}).step === undefined ? 1 : col1.render({row, $index, column, store, _self, col: col1}).step"
                             :step-strictly="col1.render({row, $index, column, store, _self, col: col1}).stepStrictly"
                             :precision="col1.render({row, $index, column, store, _self, col: col1}).precision"
                             :size="col1.render({row, $index, column, store, _self, col: col1}).size"
                             :controls="col1.render({row, $index, column, store, _self, col: col1}).controls === undefined ? true : col1.render({row, $index, column, store, _self, col: col1}).controls"
                             :controls-position="col1.render({row, $index, column, store, _self, col: col1}).controlsPosition"
                             :name="col1.render({row, $index, column, store, _self, col: col1}).name"
                             :placeholder="col1.render({row, $index, column, store, _self, col: col1}).placeholder"
                             :disabled="col1.render({row, $index, column, store, _self, col: col1}).disabled"
                             :style="col1.render({row, $index, column, store, _self, col: col1}).style"
                             @blur="(event) => { if (col1.render({row, $index, column, store, _self, col: col1}).blur !== undefined) { col1.render({row, $index, column, store, _self, col: col1}).blur(event); }}"
                             @focus="(event) => { if (col1.render({row, $index, column, store, _self, col: col1}).focus !== undefined) { col1.render({row, $index, column, store, _self, col: col1}).focus(event); }}"
                             @change="(currentValue, oldValue) => { if (col1.render({row, $index, column, store, _self, col: col1}).change !== undefined) { col1.render({row, $index, column, store, _self, col: col1}).change(currentValue, oldValue); }}">
            </el-input-number>
          </template>
          <template v-else-if="col1.render({row, $index, column, store, _self, col: col1}).component === 'select'">
            <el-select v-model="row[col1.prop]"
                       :clearable="col1.render({row, $index, column, store, _self, col: col1}).clearable === undefined ? true : col1.render({row, $index, column, store, _self, col: col1}).clearable"
                       :filterable="col1.render({row, $index, column, store, _self, col: col1}).filterable === undefined ? true : col1.render({row, $index, column, store, _self, col: col1}).filterable"
                       :disabled="col1.render({row, $index, column, store, _self, col: col1}).disabled || (!col1.render({row, $index, column, store, _self, col: col1}).options.length && !col1.render({row, $index, column, store, _self, col: col1}).remote)"
                       :style="col1.render({row, $index, column, store, _self, col: col1}).style"
                       :placeholder="col1.render({row, $index, column, store, _self, col: col1}).placeholder"
                       @change="(val) => {if (col1.render({row, $index, column, store, _self, col: col1}).change !== undefined) { col1.render({row, $index, column, store, _self, col: col1}).change(val); }}"
                       @blur="(e) => {if (col1.render({row, $index, column, store, _self, col: col1}).blur !== undefined) { col1.render({row, $index, column, store, _self, col: col1}).blur(e); }}"
                       :remote="col1.render({row, $index, column, store, _self, col: col1}).remote" :remote-method="(val) => {col1.render({row, $index, column, store, _self, col: col1}).remoteMethod(val)}"
                       :loading="col1.render({row, $index, column, store, _self, col: col1}).loading">
              <el-option v-for="(option, k) in col1.render({row, $index, column, store, _self, col: col1}).options" :key="k"
                         :label="option.label" :value="option.value">{{option.label}}
              </el-option>
            </el-select>
          </template>
          <template v-else-if="col1.render({row, $index, column, store, _self, col: col1}).component === 'quickSearch'">
            <quick-search
              ref="quickSearch"
              :show-key="col1.render({row, $index, column, store, _self, col: col1}).showKey"
              :scope-data="row"
              :name="col1.render({row, $index, column, store, _self, col: col1}).name"
              :disabled="col1.render({row, $index, column, store, _self, col: col1}).disabled"
              :companySort="col1.render({row, $index, column, store, _self, col: col1}).companySort"
              :showInput="col1.render({row, $index, column, store, _self, col: col1}).showInput"
              :allowInput="col1.render({row, $index, column, store, _self, col: col1}).allowInput"
              :isSetValue="col1.render({row, $index, column, store, _self, col: col1}).isSetValue"
              :displayKey="col1.render({row, $index, column, store, _self, col: col1}).displayKey"
              :valueKey="col1.render({row, $index, column, store, _self, col: col1}).valueKey"
              :mapValue="col1.render({row, $index, column, store, _self, col: col1}).mapValue"
              :multiSelect="col1.render({row, $index, column, store, _self, col: col1}).multiSelect"
              :preQueryData="col1.render({row, $index, column, store, _self, col: col1}).preQueryData"
              :extendQueryData="col1.render({row, $index, column, store, _self, col: col1}).extendQueryData"
              :enableFormItem="col1.render({row, $index, column, store, _self, col: col1}).enableFormItem"
              :autoQuery="col1.render({row, $index, column, store, _self, col: col1}).autoQuery"
              :forceRefresh="col1.render({row, $index, column, store, _self, col: col1}).forceRefresh"
              :placeholder="col1.render({row, $index, column, store, _self, col: col1}).placeholder"
              :popperClass="col1.render({row, $index, column, store, _self, col: col1}).popperClass"
              :selectFields="col1.render({row, $index, column, store, _self, col: col1}).selectFields"
              :autocomplete="col1.render({row, $index, column, store, _self, col: col1}).autocomplete"
              @close-quicksearch="(selection, scope) =>{if(col1.render({row, $index, column, store, _self, col: col1}).callback !== undefined) col1.render({row, $index, column, store, _self, col: col1}).callback(selection, scope)}"
            />
          </template>
          <template v-else-if="col1.render({row, $index, column, store, _self, col: col1}).component === 'switch'">
            <el-switch
              v-model="row[col1.prop]"
              :active-color="col1.render({row, $index, column, store, _self, col: col1}).activeColor || '#13ce66'"
              :inactive-color="col1.render({row, $index, column, store, _self, col: col1}).activeColor || '#ff4949'"
              :disabled="col1.render({row, $index, column, store, _self, col: col1}).disabled"
              :width="col1.render({row, $index, column, store, _self, col: col1}).width || 40"
              :active-text="col1.render({row, $index, column, store, _self, col: col1}).activeText"
              :inactive-text="col1.render({row, $index, column, store, _self, col: col1}).inactiveText"
              :active-value="col1.render({row, $index, column, store, _self, col: col1}).activeValue === undefined ? true : col1.render({row, $index, column, store, _self, col: col1}).activeValue"
              :inactive-value="col1.render({row, $index, column, store, _self, col: col1}).inactiveValue === undefined ? false : col1.render({row, $index, column, store, _self, col: col1}).inactiveValue"
              :name="col1.render({row, $index, column, store, _self, col: col1}).name"
              :validate-event="col1.render({row, $index, column, store, _self, col: col1}).alidateEvent"
              @change="(value) => { if (col1.render({row, $index, column, store, _self, col: col1}).change !== undefined) { col1.render({row, $index, column, store, _self, col: col1}).change(value); }}"
            >
            </el-switch>
          </template>
          <template v-else-if="col1.render({row, $index, column, store, _self, col: col1}).component === 'radio'">
            <el-radio-group v-model="row[col1.prop]"
                            :disabled="col1.render({row, $index, column, store, _self, col: col1}).disabled"
                            @change="(value) => { if (col1.render({row, $index, column, store, _self, col: col1}).change !== undefined) { col1.render({row, $index, column, store, _self, col: col1}).change(value); }}">
              <el-radio v-for="(option, key) in col1.render({row, $index, column, store, _self, col: col1}).options" :key="key"
                        :value="option.value"
                        :label="option.label"
                        :style="col1.render({row, $index, column, store, _self, col: col1}).style"
              >{{option.label}}
              </el-radio>
            </el-radio-group>
          </template>
          <template v-else-if="col1.render({row, $index, column, store, _self, col: col1}).component === 'checkboxGroup'">
            <el-checkbox-group v-model="row[col1.prop]"
                               :style="col1.render({row, $index, column, store, _self, col: col1}).style"
                               :min="col1.render({row, $index, column, store, _self, col: col1}).min"
                               :max="col1.render({row, $index, column, store, _self, col: col1}).max"
                               :disabled="col1.render({row, $index, column, store, _self, col: col1}).disabled"
                               @change="(val) => {if (col1.render({row, $index, column, store, _self, col: col1}).change !== undefined) { col1.render({row, $index, column, store, _self, col: col1}).change(val); }}">
              <el-checkbox v-for="(option, key) in col1.render({row, $index, column, store, _self, col: col1}).options" :key="key"
                           :value="option.value"
                           :label="option.label"
                           :disabled="col1.render({row, $index, column, store, _self, col: col1}).disabled"
                           :style="col1.render({row, $index, column, store, _self, col: col1}).style">{{option.label}}
              </el-checkbox>
            </el-checkbox-group>
          </template>
          <template v-else-if="col1.render({row, $index, column, store, _self, col: col1}).component === 'checkbox'">
            <el-checkbox v-model="row[col1.prop]"
                         :disabled="col1.render({row, $index, column, store, _self, col: col1}).disabled"
                         :style="col1.render({row, $index, column, store, _self, col: col1}).style"
                         :checked="col1.render({row, $index, column, store, _self, col: col1}).checked"
                         :true-label="col1.render({row, $index, column, store, _self, col: col1}).trueLabel"
                         :false-label="col1.render({row, $index, column, store, _self, col: col1}).falseLabel"
                         @change="(val) => {if (col1.render({row, $index, column, store, _self, col: col1}).change !== undefined) { col1.render({row, $index, column, store, _self, col: col1}).change(val); }}">
              {{col1.render({row, $index, column, store, _self, col: col1}).text ? col1.render({row, $index, column, store, _self, col: col1}).text : ''}}
            </el-checkbox>
          </template>
          <template v-else-if="col1.render({row, $index, column, store, _self, col: col1}).component === 'datePicker'">
            <el-date-picker
              v-model="row[col1.prop]"
              :clearable="col1.render({row, $index, column, store, _self, col: col1}).clearable === undefined ? true : col1.render({row, $index, column, store, _self, col: col1}).clearable"
              :type="col1.render({row, $index, column, store, _self, col: col1}).dateType || 'date'"
              :placeholder="col1.render({row, $index, column, store, _self, col: col1}).placeholder"
              :disabled="col1.render({row, $index, column, store, _self, col: col1}).disabled"
              :readonly="col1.render({row, $index, column, store, _self, col: col1}).readonly"
              :format="col1.render({row, $index, column, store, _self, col: col1}).format"
              :value-format="col1.render({row, $index, column, store, _self, col: col1}).valueFormat"
              :align="col1.render({row, $index, column, store, _self, col: col1}).align === undefined ? 'left' : col1.render({row, $index, column, store, _self, col: col1}).align"
              :unlink-panels="col1.render({row, $index, column, store, _self, col: col1}).unlinkPanels"
              :range-separator="col1.render({row, $index, column, store, _self, col: col1}).rangeSeparator === undefined ? '~' : col1.render({row, $index, column, store, _self, col: col1}).rangeSeparator"
              :start-placeholder="col1.render({row, $index, column, store, _self, col: col1}).startPlaceholder"
              :end-placeholder="col1.render({row, $index, column, store, _self, col: col1}).endPlaceholder"
              :picker-options="col1.render({row, $index, column, store, _self, col: col1}).pickerOptions"
              :style="col1.render({row, $index, column, store, _self, col: col1}).style"
              @change="(val) => { if (col1.render({row, $index, column, store, _self, col: col1}).change !== undefined) { col1.render({row, $index, column, store, _self, col: col1}).change(val); }}">
            </el-date-picker>
          </template>
          <template v-else-if="col1.render({row, $index, column, store, _self, col: col1}).component==='timePicker'">
            <el-time-select
              v-model="row[col1.prop]"
              :picker-options="col1.render({row, $index, column, store, _self, col: col1}).pickerOptions"
              :clearable="col1.render({row, $index, column, store, _self, col: col1}).clearable === undefined ? true : col1.render({row, $index, column, store, _self, col: col1}).clearable"
              :disabled="col1.render({row, $index, column, store, _self, col: col1}).disabled"
              :readonly="col1.render({row, $index, column, store, _self, col: col1}).readonly"
              :style="col1.render({row, $index, column, store, _self, col: col1}).style"
              :placeholder="col1.render({row, $index, column, store, _self, col: col1}).placeholder"
              @change="(val) => { if (col1.render({row, $index, column, store, _self, col: col1}).change !== undefined) { col1.render({row, $index, column, store, _self, col: col1}).change(val); }}">
            </el-time-select>
          </template>
          <template v-else-if="col1.render({row, $index, column, store, _self, col: col1}).component === 'buttons'">
            <el-button v-for="(option, key) in col1.render({row, $index, column, store, _self, col: col1}).options" :key="key"
                       v-if="!option.hide"
                       :disabled="option.disabled"
                       :style="option.style"
                       :loading="option.loading"
                       :type="option.type || 'primary'"
                       :size="option.size? option.size: 'mini'"
                       @click="() => {if (option.click !== undefined) {option.click({row, $index, column, store, _self, col1})}}">{{option.text}}
            </el-button>
          </template>
          <template v-else-if="col1.render({row, $index, column, store, _self, col: col1}).component === 'button'">
            <el-button :disabled="col1.render({row, $index, column, store, _self, col: col1}).disabled"
                       :style="col1.render({row, $index, column, store, _self, col: col1}).style"
                       :loading="col1.render({row, $index, column, store, _self, col: col1}).loading"
                       :type="col1.render({row, $index, column, store, _self, col: col1}).type || 'primary'"
                       :size="col1.render({row, $index, column, store, _self, col: col1}).size? col1.render({row, $index, column, store, _self, col: col1}).size: 'mini'"
                       @click="() => {if (col1.render({row, $index, column, store, _self, col: col1}).click !== undefined) {col1.render({row, $index, column, store, _self, col: col1}).click()}}">{{col1.render({row, $index, column, store, _self, col: col1}).text}}
            </el-button>
          </template>
          <template v-else-if="col1.render({row, $index, column, store, _self, col: col1}).component === 'tag'">
            <el-tag :type="col1.render({row, $index, column, store, _self, col: col1}).type"
                    :closable="col1.render({row, $index, column, store, _self, col: col1}).closable"
                    :disable-transitions="col1.render({row, $index, column, store, _self, col: col1}).disableTransitions"
                    :hit="col1.render({row, $index, column, store, _self, col: col1}).hit"
                    :color="col1.render({row, $index, column, store, _self, col: col1}).color"
                    :size="col1.render({row, $index, column, store, _self, col: col1}).size"
                    :effect="col1.render({row, $index, column, store, _self, col: col1}).effect || 'light'"
                    @click="() => {if (col1.render({row, $index, column, store, _self, col: col1}).click !== undefined) {col1.render({row, $index, column, store, _self, col: col1}).click()}}"
                    @close="() => {if (col1.render({row, $index, column, store, _self, col: col1}).close !== undefined) {col1.render({row, $index, column, store, _self, col: col1}).close()}}">
              {{col1.render({row, $index, column, store, _self, col: col1}).text}}
            </el-tag>
          </template>
          <template v-else-if="col1.render({row, $index, column, store, _self, col: col1}).component === 'slot'">
            <slot name="tableBody"
                  :row="row"
                  :$index="$index"
                  :column="column"
                  :store="store"
                  :_self="_self"
                  :col="col1" >
            </slot>
          </template>
          <template v-else>
            <span v-html="col1.render({row, $index, column, store, _self, col: col1})"></span>
          </template>
        </template>
        <el-table-column
          v-if="col1.children"
          v-for="(col2, index2) in col1.children"
          :key="index2"
          :label="col2.label"
          :align="col2.align"
          :headerAlign="col2.headerAlign"
          :sortable="col2.sortable"
          :prop="col2.prop"
          :width="col2.width"
          :minWidth="col2.minWidth"
          :fixed="col2.fixed"
          :show-overflow-tooltip="col2.tooltip === undefined ? tooltip : col2.tooltip"
          :class-name="col2.className"
          :label-class-name="col2.labelClassName"
          :formatter="col2.formatter">
          <template  v-if="col2.hasOwnProperty('renderLabel') && typeof col2.renderLabel === 'function'"  #header="{column, $index, store, _self}">
            <template  v-if="col2.renderLabel({column, $index, store, _self, col: col2}).component === 'text'"  >
          <span>
            <span :style="col2.renderLabel({column, $index, store, _self, col: col2}).beforeStyle || {color: 'red'}">{{col2.renderLabel({column, $index, store, _self, col: col2}).beforeText || '*'}}</span>
            <label :style="col2.renderLabel({column, $index, store, _self, col: col2}).style || {}">{{col2.label}}</label>
            <span :style="col2.renderLabel({column, $index, store, _self, col: col2}).afterStyle || {}">{{col2.renderLabel({column, $index, store, _self, col: col2}).afterText || ''}}</span>
          </span>
            </template>
            <template  v-else-if="col2.renderLabel({column, $index, store, _self, col: col2}).component === 'slot'"  >
              <slot name="tableHeader"
                    :column="column"
                    :$index="$index"
                    :store="store"
                    :_self="_self"
                    :col="col2">
              </slot>
            </template>
            <template  v-else>
              <span v-html="col2.renderLabel({column, $index, store, _self, col: col2}) || col2.label"></span>
            </template>
          </template>
          <template v-if="col2.hasOwnProperty('render') && typeof col2.render === 'function'"  #default="{ row, $index, column, store, _self}">
            <template v-if="col2.render({row, $index, column, store, _self, col: col2}).component === 'input'">
              <el-input v-model="row[col2.prop]"
                        :row="col2.render({row, $index, column, store, _self, col: col2}).row === undefined ? 1 : col2.render({row, $index, column, store, _self, col: col2}).row"
                        :clearable="col2.render({row, $index, column, store, _self, col: col2}).clearable === undefined ? true : col2.render({row, $index, column, store, _self, col: col2}).clearable"
                        :disabled="col2.render({row, $index, column, store, _self, col: col2}).disabled === undefined ? false : col2.render({row, $index, column, store, _self, col: col2}).disabled"
                        :readonly="col2.render({row, $index, column, store, _self, col: col2}).readonly === undefined ? false : col2.render({row, $index, column, store, _self, col: col2}).readonly"
                        :rows="col2.render({row, $index, column, store, _self, col: col2}).rows || 1"
                        :type="(col2.render({row, $index, column, store, _self, col: col2}).rows === undefined || col2.render({row, $index, column, store, _self, col: col2}).rows === 1) ? 'text':'textarea'"
                        :style="col2.render({row, $index, column, store, _self, col: col2}).style"
                        @blur="(event) => { if (col2.render({row, $index, column, store, _self, col: col2}).blur !== undefined) { col2.render({row, $index, column, store, _self, col: col2}).blur(event); }}"
                        @change="(value) => { if (col2.render({row, $index, column, store, _self, col: col2}).change !== undefined) { col2.render({row, $index, column, store, _self, col: col2}).change(value); }}">
              </el-input>
            </template>
            <template v-else-if="col2.render({row, $index, column, store, _self, col: col2}).component === 'inputNumber'">
              <el-input-number v-model="row[col2.prop]"
                               :max="col2.render({row, $index, column, store, _self, col: col2}).max === undefined ? Infinity : col2.render({row, $index, column, store, _self, col: col2}).max"
                               :min="col2.render({row, $index, column, store, _self, col: col2}).min === undefined ? -Infinity : col2.render({row, $index, column, store, _self, col: col2}).min"
                               :step="col2.render({row, $index, column, store, _self, col: col2}).step === undefined ? 1 : col2.render({row, $index, column, store, _self, col: col2}).step"
                               :step-strictly="col2.render({row, $index, column, store, _self, col: col2}).stepStrictly"
                               :precision="col2.render({row, $index, column, store, _self, col: col2}).precision"
                               :size="col2.render({row, $index, column, store, _self, col: col2}).size"
                               :controls="col2.render({row, $index, column, store, _self, col: col2}).controls === undefined ? true : col2.render({row, $index, column, store, _self, col: col2}).controls"
                               :controls-position="col2.render({row, $index, column, store, _self, col: col2}).controlsPosition"
                               :name="col2.render({row, $index, column, store, _self, col: col2}).name"
                               :placeholder="col2.render({row, $index, column, store, _self, col: col2}).placeholder"
                               :disabled="col2.render({row, $index, column, store, _self, col: col2}).disabled"
                               :style="col2.render({row, $index, column, store, _self, col: col2}).style"
                               @blur="(event) => { if (col2.render({row, $index, column, store, _self, col: col2}).blur !== undefined) { col2.render({row, $index, column, store, _self, col: col2}).blur(event); }}"
                               @focus="(event) => { if (col2.render({row, $index, column, store, _self, col: col2}).focus !== undefined) { col2.render({row, $index, column, store, _self, col: col2}).focus(event); }}"
                               @change="(currentValue, oldValue) => { if (col2.render({row, $index, column, store, _self, col: col2}).change !== undefined) { col2.render({row, $index, column, store, _self, col: col2}).change(currentValue, oldValue); }}">
              </el-input-number>
            </template>
            <template v-else-if="col2.render({row, $index, column, store, _self, col: col2}).component === 'select'">
              <el-select v-model="row[col2.prop]"
                         :clearable="col2.render({row, $index, column, store, _self, col: col2}).clearable === undefined ? true : col2.render({row, $index, column, store, _self, col: col2}).clearable"
                         :filterable="col2.render({row, $index, column, store, _self, col: col2}).filterable === undefined ? true : col2.render({row, $index, column, store, _self, col: col2}).filterable"
                         :disabled="col2.render({row, $index, column, store, _self, col: col2}).disabled || (!col2.render({row, $index, column, store, _self, col: col2}).options.length && !col2.render({row, $index, column, store, _self, col: col2}).remote)"
                         :style="col2.render({row, $index, column, store, _self, col: col2}).style"
                         :placeholder="col2.render({row, $index, column, store, _self, col: col2}).placeholder"
                         @change="(val) => {if (col2.render({row, $index, column, store, _self, col: col2}).change !== undefined) { col2.render({row, $index, column, store, _self, col: col2}).change(val); }}"
                         @blur="(e) => {if (col2.render({row, $index, column, store, _self, col: col2}).blur !== undefined) { col2.render({row, $index, column, store, _self, col: col2}).blur(e); }}"
                         :remote="col2.render({row, $index, column, store, _self, col: col2}).remote" :remote-method="(val) => {col2.render({row, $index, column, store, _self, col: col2}).remoteMethod(val)}"
                         :loading="col2.render({row, $index, column, store, _self, col: col2}).loading">
                <el-option v-for="(option, k) in col2.render({row, $index, column, store, _self, col: col2}).options" :key="k"
                           :label="option.label" :value="option.value">{{option.label}}
                </el-option>
              </el-select>
            </template>
            <template v-else-if="col2.render({row, $index, column, store, _self, col: col2}).component === 'quickSearch'">
              <quick-search
                ref="quickSearch"
                :show-key="col2.render({row, $index, column, store, _self, col: col2}).showKey"
                :scope-data="row"
                :name="col2.render({row, $index, column, store, _self, col: col2}).name"
                :disabled="col2.render({row, $index, column, store, _self, col: col2}).disabled"
                :companySort="col2.render({row, $index, column, store, _self, col: col2}).companySort"
                :showInput="col2.render({row, $index, column, store, _self, col: col2}).showInput"
                :allowInput="col2.render({row, $index, column, store, _self, col: col2}).allowInput"
                :isSetValue="col2.render({row, $index, column, store, _self, col: col2}).isSetValue"
                :displayKey="col2.render({row, $index, column, store, _self, col: col2}).displayKey"
                :valueKey="col2.render({row, $index, column, store, _self, col: col2}).valueKey"
                :mapValue="col2.render({row, $index, column, store, _self, col: col2}).mapValue"
                :multiSelect="col2.render({row, $index, column, store, _self, col: col2}).multiSelect"
                :preQueryData="col2.render({row, $index, column, store, _self, col: col2}).preQueryData"
                :extendQueryData="col2.render({row, $index, column, store, _self, col: col2}).extendQueryData"
                :enableFormItem="col2.render({row, $index, column, store, _self, col: col2}).enableFormItem"
                :autoQuery="col2.render({row, $index, column, store, _self, col: col2}).autoQuery"
                :forceRefresh="col2.render({row, $index, column, store, _self, col: col2}).forceRefresh"
                :placeholder="col2.render({row, $index, column, store, _self, col: col2}).placeholder"
                :popperClass="col2.render({row, $index, column, store, _self, col: col2}).popperClass"
                :selectFields="col2.render({row, $index, column, store, _self, col: col2}).selectFields"
                :autocomplete="col2.render({row, $index, column, store, _self, col: col2}).autocomplete"
                @close-quicksearch="(selection, scope) =>{if(col2.render({row, $index, column, store, _self, col: col2}).callback !== undefined) col2.render({row, $index, column, store, _self, col: col2}).callback(selection, scope)}"
              />
            </template>
            <template v-else-if="col2.render({row, $index, column, store, _self, col: col2}).component === 'switch'">
              <el-switch
                v-model="row[col2.prop]"
                :active-color="col2.render({row, $index, column, store, _self, col: col2}).activeColor || '#13ce66'"
                :inactive-color="col2.render({row, $index, column, store, _self, col: col2}).activeColor || '#ff4949'"
                :disabled="col2.render({row, $index, column, store, _self, col: col2}).disabled"
                :width="col2.render({row, $index, column, store, _self, col: col2}).width || 40"
                :active-text="col2.render({row, $index, column, store, _self, col: col2}).activeText"
                :inactive-text="col2.render({row, $index, column, store, _self, col: col2}).inactiveText"
                :active-value="col2.render({row, $index, column, store, _self, col: col2}).activeValue === undefined ? true : col2.render({row, $index, column, store, _self, col: col2}).activeValue"
                :inactive-value="col2.render({row, $index, column, store, _self, col: col2}).inactiveValue === undefined ? false : col2.render({row, $index, column, store, _self, col: col2}).inactiveValue"
                :name="col2.render({row, $index, column, store, _self, col: col2}).name"
                :validate-event="col2.render({row, $index, column, store, _self, col: col2}).alidateEvent"
                @change="(value) => { if (col2.render({row, $index, column, store, _self, col: col2}).change !== undefined) { col2.render({row, $index, column, store, _self, col: col2}).change(value); }}"
              >
              </el-switch>
            </template>
            <template v-else-if="col2.render({row, $index, column, store, _self, col: col2}).component === 'radio'">
              <el-radio-group v-model="row[col2.prop]"
                              :disabled="col2.render({row, $index, column, store, _self, col: col2}).disabled"
                              @change="(value) => { if (col2.render({row, $index, column, store, _self, col: col2}).change !== undefined) { col2.render({row, $index, column, store, _self, col: col2}).change(value); }}">
                <el-radio v-for="(option, key) in col2.render({row, $index, column, store, _self, col: col2}).options" :key="key"
                          :value="option.value"
                          :label="option.label"
                          :style="col2.render({row, $index, column, store, _self, col: col2}).style"
                >{{option.label}}
                </el-radio>
              </el-radio-group>
            </template>
            <template v-else-if="col2.render({row, $index, column, store, _self, col: col2}).component === 'checkboxGroup'">
              <el-checkbox-group v-model="row[col2.prop]"
                                 :style="col2.render({row, $index, column, store, _self, col: col2}).style"
                                 :min="col2.render({row, $index, column, store, _self, col: col2}).min"
                                 :max="col2.render({row, $index, column, store, _self, col: col2}).max"
                                 :disabled="col2.render({row, $index, column, store, _self, col: col2}).disabled"
                                 @change="(val) => {if (col2.render({row, $index, column, store, _self, col: col2}).change !== undefined) { col2.render({row, $index, column, store, _self, col: col2}).change(val); }}">
                <el-checkbox v-for="(option, key) in col2.render({row, $index, column, store, _self, col: col2}).options" :key="key"
                             :value="option.value"
                             :label="option.label"
                             :disabled="col2.render({row, $index, column, store, _self, col: col2}).disabled"
                             :style="col2.render({row, $index, column, store, _self, col: col2}).style">{{option.label}}
                </el-checkbox>
              </el-checkbox-group>
            </template>
            <template v-else-if="col2.render({row, $index, column, store, _self, col: col2}).component === 'checkbox'">
              <el-checkbox v-model="row[col2.prop]"
                           :disabled="col2.render({row, $index, column, store, _self, col: col2}).disabled"
                           :style="col2.render({row, $index, column, store, _self, col: col2}).style"
                           :checked="col2.render({row, $index, column, store, _self, col: col2}).checked"
                           :true-label="col2.render({row, $index, column, store, _self, col: col2}).trueLabel"
                           :false-label="col2.render({row, $index, column, store, _self, col: col2}).falseLabel"
                           @change="(val) => {if (col2.render({row, $index, column, store, _self, col: col2}).change !== undefined) { col2.render({row, $index, column, store, _self, col: col2}).change(val); }}">
                {{col2.render({row, $index, column, store, _self, col: col2}).text ? col2.render({row, $index, column, store, _self, col: col2}).text : ''}}
              </el-checkbox>
            </template>
            <template v-else-if="col2.render({row, $index, column, store, _self, col: col2}).component === 'datePicker'">
              <el-date-picker
                v-model="row[col2.prop]"
                :clearable="col2.render({row, $index, column, store, _self, col: col2}).clearable === undefined ? true : col2.render({row, $index, column, store, _self, col: col2}).clearable"
                :type="col2.render({row, $index, column, store, _self, col: col2}).dateType || 'date'"
                :placeholder="col2.render({row, $index, column, store, _self, col: col2}).placeholder"
                :disabled="col2.render({row, $index, column, store, _self, col: col2}).disabled"
                :readonly="col2.render({row, $index, column, store, _self, col: col2}).readonly"
                :format="col2.render({row, $index, column, store, _self, col: col2}).format"
                :value-format="col2.render({row, $index, column, store, _self, col: col2}).valueFormat"
                :align="col2.render({row, $index, column, store, _self, col: col2}).align === undefined ? 'left' : col2.render({row, $index, column, store, _self, col: col2}).align"
                :unlink-panels="col2.render({row, $index, column, store, _self, col: col2}).unlinkPanels"
                :range-separator="col2.render({row, $index, column, store, _self, col: col2}).rangeSeparator === undefined ? '~' : col2.render({row, $index, column, store, _self, col: col2}).rangeSeparator"
                :start-placeholder="col2.render({row, $index, column, store, _self, col: col2}).startPlaceholder"
                :end-placeholder="col2.render({row, $index, column, store, _self, col: col2}).endPlaceholder"
                :picker-options="col2.render({row, $index, column, store, _self, col: col2}).pickerOptions"
                :style="col2.render({row, $index, column, store, _self, col: col2}).style"
                @change="(val) => { if (col2.render({row, $index, column, store, _self, col: col2}).change !== undefined) { col2.render({row, $index, column, store, _self, col: col2}).change(val); }}">
              </el-date-picker>
            </template>
            <template v-else-if="col2.render({row, $index, column, store, _self, col: col2}).component==='timePicker'">
              <el-time-select
                v-model="row[col2.prop]"
                :picker-options="col2.render({row, $index, column, store, _self, col: col2}).pickerOptions"
                :clearable="col2.render({row, $index, column, store, _self, col: col2}).clearable === undefined ? true : col2.render({row, $index, column, store, _self, col: col2}).clearable"
                :disabled="col2.render({row, $index, column, store, _self, col: col2}).disabled"
                :readonly="col2.render({row, $index, column, store, _self, col: col2}).readonly"
                :style="col2.render({row, $index, column, store, _self, col: col2}).style"
                :placeholder="col2.render({row, $index, column, store, _self, col: col2}).placeholder"
                @change="(val) => { if (col2.render({row, $index, column, store, _self, col: col2}).change !== undefined) { col2.render({row, $index, column, store, _self, col: col2}).change(val); }}">
              </el-time-select>
            </template>
            <template v-else-if="col2.render({row, $index, column, store, _self, col: col2}).component === 'buttons'">
              <el-button v-for="(option, key) in col2.render({row, $index, column, store, _self, col: col2}).options" :key="key"
                         v-if="!option.hide"
                         :disabled="option.disabled"
                         :style="option.style"
                         :loading="option.loading"
                         :type="option.type || 'primary'"
                         :size="option.size? option.size: 'mini'"
                         @click="() => {if (option.click !== undefined) {option.click({row, $index, column, store, _self, col2})}}">{{option.text}}
              </el-button>
            </template>
            <template v-else-if="col2.render({row, $index, column, store, _self, col: col2}).component === 'button'">
              <el-button :disabled="col2.render({row, $index, column, store, _self, col: col2}).disabled"
                         :style="col2.render({row, $index, column, store, _self, col: col2}).style"
                         :loading="col2.render({row, $index, column, store, _self, col: col2}).loading"
                         :type="col2.render({row, $index, column, store, _self, col: col2}).type || 'primary'"
                         :size="col2.render({row, $index, column, store, _self, col: col2}).size? col2.render({row, $index, column, store, _self, col: col2}).size: 'mini'"
                         @click="() => {if (col2.render({row, $index, column, store, _self, col: col2}).click !== undefined) {col2.render({row, $index, column, store, _self, col: col2}).click()}}">{{col2.render({row, $index, column, store, _self, col: col2}).text}}
              </el-button>
            </template>
            <template v-else-if="col2.render({row, $index, column, store, _self, col: col2}).component === 'tag'">
              <el-tag :type="col2.render({row, $index, column, store, _self, col: col2}).type"
                      :closable="col2.render({row, $index, column, store, _self, col: col2}).closable"
                      :disable-transitions="col2.render({row, $index, column, store, _self, col: col2}).disableTransitions"
                      :hit="col2.render({row, $index, column, store, _self, col: col2}).hit"
                      :color="col2.render({row, $index, column, store, _self, col: col2}).color"
                      :size="col2.render({row, $index, column, store, _self, col: col2}).size"
                      :effect="col2.render({row, $index, column, store, _self, col: col2}).effect || 'light'"
                      @click="() => {if (col2.render({row, $index, column, store, _self, col: col2}).click !== undefined) {col2.render({row, $index, column, store, _self, col: col2}).click()}}"
                      @close="() => {if (col2.render({row, $index, column, store, _self, col: col2}).close !== undefined) {col2.render({row, $index, column, store, _self, col: col2}).close()}}">
                {{col2.render({row, $index, column, store, _self, col: col2}).text}}
              </el-tag>
            </template>
            <template v-else-if="col2.render({row, $index, column, store, _self, col: col2}).component === 'slot'">
              <slot name="tableBody"
                    :row="row"
                    :$index="$index"
                    :column="column"
                    :store="store"
                    :_self="_self"
                    :col="col2" >
              </slot>
            </template>
            <template v-else>
              <span v-html="col2.render({row, $index, column, store, _self, col: col2})"></span>
            </template>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table-column>
  </el-table>
</template>

<script>
  import quickSearch from "lib@/components/QuickSearch";
  export default {
    name: "mTable",
    components: {
      quickSearch
    },
    props: {
      /**
       * 下面属性参考官网api
       **/
      // 表格数据
      data: {
        type: Array,
        default() {
          return [];
        }
      },
      height: {
        type: Number|String,
        default: null
      },
      maxHeight: {
        type: Number|String,
        default: null
      },
      loading: {
        type: Boolean,
        default: false
      },
      stripe: {
        type: Boolean,
        default: false
      },
      border: {
        type: Boolean,
        default: false
      },
      columns: {
        type: Array,
        default: []
      }, // 数据列定义
      size: {
        type: String,
        default: 'mini'
      },
      fit: {
        type: Boolean,
        default: true
      },
      showHeader: {
        type: Boolean,
        default: true
      },
      highlightCurrentRow: {
        type: Boolean,
        default: false
      },
      spanMethod: {
        type: Function,
      },
      rowKey: {
        type: Function | String,
      },
      expandRowKeys: {
        type: Array,
        default: []
      },
      load: {
        type: Function,
      },
      treeProps: {
        type: Object,
      },
      showSummary: {
        type: Boolean,
      },
      defaultExpandAll: {
        type: Boolean,
        default: false
      },
      summaryMethod: {
        type: Function
      },
      tooltip: {
        type: Boolean,
        default: true
      },
      cellClassName: {
        type: Function | String,
      }
    },
    methods: {
      /**
       * 下面方法参考官网api
       **/
      select(selection, row){
        this.$emit('select', selection, row);
      },
      selectAll(selection){
        this.$emit('selectAll', selection);
      },
      selectionChange(selection){
        this.$emit('selectionChange', selection);
      },
      cellMouseEnter(row, column, cell, event){
        this.$emit('cellMouseEnter', row, column, cell, event);
      },
      cellMouseLeave(row, column, cell, event){
        this.$emit('cellMouseLeave', row, column, cell, event);
      },
      cellClick(row, column, cell, event){
        this.$emit('cellClick', row, column, cell, event);
      },
      cellDblclick(row, column, cell, event){
        this.$emit('cellDblclick', row, column, cell, event);
      },
      rowClick(row, column, event){
        this.$emit('rowClick', row, column, event);
      },
      rowContextmenu(row, column, event){
        this.$emit('rowContextmenu', row, column, event);
      },
      rowDblclick(row, column, event){
        this.$emit('rowDblclick', row, column, event);
      },
      headerClick(column, event){
        this.$emit('headerClick', column, event);
      },
      headerContextmenu(column, event){
        this.$emit('headerContextmenu', column, event);
      },
      sortChange({ column, prop, order }){
        this.$emit('sortChange', column, prop, order);
      },
      filterChange(filters){
        this.$emit('filterChange', filters);
      },
      currentChange(currentRow, oldCurrentRow){
        this.$emit('currentChange', currentRow, oldCurrentRow);
      },
      headerDragend(newWidth, oldWidth, column, event){
        this.$emit('headerDragend', newWidth, oldWidth, column, event);
      },
      expandChange(row, expandedRows){
        this.$emit('expandChange', row, expandedRows);
      },
      /***
       * 设置选中
       * @param _checked
       * 标识选中状态的字段，默认‘_checked’
       */
      setSelection(_checked = '_checked', flag = true){
        let rows = this.data.filter(item => item[_checked]);
        rows.forEach(row => {
          this.$refs['table'].toggleRowSelection(row, flag);
        });
      },
      // 获取选中行数据
      getSelection(){
        return this.$refs['table'].selection;
      },
      /***
       * 清除选中
       */
      clearSelection() {
        this.$refs['table'].clearSelection();
      },
      /***
       * 切换选中状态
       * @param row selected
       * row行数据, selected 行选中状态
       */
      toggleRowSelection(row, selected) {
        if(selected !== undefined){
          this.$refs['table'].toggleRowSelection(row, selected);
        }else {
          this.$refs['table'].toggleRowSelection(row);
        }
      },
      /***
       * 切换选中状态
       */
      toggleAllSelection(){
        this.$refs['table'].toggleAllSelection();
      },
      // 设置单选选中
      setCurrentRow(row){
        this.$refs['table'].setCurrentRow(row);
      },
      // 切换某一行的展开状态
      toggleRowExpansion(row, expanded) {
        this.$refs['table'].toggleRowExpansion(row, expanded);
      }
    }
  }
</script>

<style scoped>

</style>