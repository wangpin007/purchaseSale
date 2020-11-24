<template>
  <el-date-picker
    ref="datePicker"
    :value="value"
    :type="type"
    :placeholder="placeholder"
    :start-placeholder="startPlaceholder"
    :end-placeholder="endPlaceholder"
    v-bind="$attrs"
    v-on="$listeners"
    @input="handleInput"
  />
</template>

<script>
const PLACEHOLDER_MAP = {
  'datetimerange': '时间',
  'daterange': '日期',
  'monthrange': '月份'
}

export default {
  name: 'CDatePicker',
  inject: {
    cQueryTable: {
      default: ''
    }
  },
  props: {
    value: {
      type: [Date, Array, String]
    },
    type: {
      type: String
    },
    name: {
      type: [String, Array]
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    startPlaceholder: {
      type: String,
      default () {
        return `开始${PLACEHOLDER_MAP[this.type]}`
      }
    },
    endPlaceholder: {
      type: String,
      default () {
        return `结束${PLACEHOLDER_MAP[this.type]}`
      }
    }
  },
  methods: {
    handleInput (value) {
      this.updateQueryTableParams(value)
      this.$emit('input', value)
    },
    updateQueryTableParams (value) {
      if (this.cQueryTable) {
        if (this.type.indexOf('range') > -1 && this.name && Array.isArray(this.name)) {
          this.name.forEach((nameItem, index) => {
            this.cQueryTable.updateFormModel(nameItem, value ? value[index] : '')
          })
        } else {
          this.cQueryTable.updateFormModel(this.name, value)
        }
      }
    },
    focus () {
      this.$refs.datePicker.focus()
    }
  }
}
</script>
