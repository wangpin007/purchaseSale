import CSelect from 'lib@/components/c-select'
import CInput from 'lib@/components/c-input'
import CDatePicker from 'lib@/components/c-date-picker'

import _isFunction from 'lodash/isFunction'

import { transformValueType } from './utils'

export default {
  name: 'CQueryFormItem',
  componentName: 'CQueryFormItem',
  props: {
    // 表单标题
    label: {
      type: String
    },
    // 表单字段
    name: {
      type: [String, Array],
      required: true
    },
    // 表单类型
    formType: {
      type: String
    },
    // 表单字段值类型
    valueType: {
      type: String,
      default: 'string',
      validator (value) {
        return ['string', 'number', 'array', 'boolean', 'null'].indexOf(value) !== -1
      }
    },
    // 选择项列表
    options: {
      type: Array,
      default () {
        return []
      }
    },
    // 渲染函数
    render: {
      type: Function
    },
    // 查询对象
    // queryParams: {
    //   type: Object,
    //   default () {
    //     return {}
    //   }
    // },
    formModel: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      value: null
    }
  },
  created () {
    this.$on('resetValue', this.handleResetValue)
  },
  watch: {
    formModel: {
      immediate: true,
      handler (value) {
        this.initValue(value)
      }
    }
  },
  mounted () {
    // this.initValue(this.queryParams)
  },
  methods: {
    initValue (formModel) {
      if (Array.isArray(this.name)) {
        let isNullCount = 0
        this.name.forEach((nameItem, index) => {
          const value = formModel[nameItem] || undefined
          if (!this.value) {
            this.value = []
          }
          if (!value) {
            isNullCount++
          }

          this.value[index] = transformValueType(value, this.valueType)
        })
        if (isNullCount === this.name.length) {
          this.value = null
        }
      } else if (typeof this.name === 'string') {
        const value = formModel[this.name]
        this.value = transformValueType(value, this.valueType)
      }
    },
    handleResetValue (initValue) {
      this.value = typeof initValue === 'undefined' || '' ? null : initValue
    },
    handleKeyup (e) {
      if (e.keyCode === 13) {
        this.$refs.cInput.blur()
        this.$nextTick(() => {
          this.$emit('inputEnter')
        })
      }
    }
  },
  render (h) {
    let dynamicForm

    switch (this.formType) {
      case 'select':
        dynamicForm = (
          <CSelect
            vModel={ this.value }
            name={ this.name }
            options={ this.options }
            { ...{ attrs: this.$attrs, listeners: this.$listeners } }
          />
        )
        break
      case 'input':
        dynamicForm = (
          <CInput
            ref="cInput"
            vModel={ this.value }
            name={ this.name }
            nativeOn={
              {
                keyup: this.handleKeyup
              }
            }
            { ...{ attrs: this.$attrs, listeners: this.$listeners } }
          />
        )
        break
      case 'datepicker':
        dynamicForm = (
          <CDatePicker
            vModel={ this.value }
            name={ this.name }
            { ...{ attrs: this.$attrs, listeners: this.$listeners } }
          />
        )
        break
      default:
        dynamicForm = ''
        break
    }

    return (
      <div class="c-query-form-item">
        <label class="label">{ this.label }</label>
        { this.render && _isFunction(this.render) ? this.render(h, this.name) : dynamicForm }
      </div>
    )
  }
}
