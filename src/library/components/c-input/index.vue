<template>
  <el-input
    ref="input"
    :value="value"
    v-bind="$attrs"
    v-on="$listeners"
    @input="handleInput"
    @blur="handleBlur"
  />
</template>

<script>
export default {
  name: 'CInput',
  inject: {
    cQueryTable: {
      default: ''
    }
  },
  props: {
    value: {
      type: String
    },
    name: {
      type: String
    }
  },
  methods: {
    handleInput (value) {
      if (this.cQueryTable) {
        this.cQueryTable.updateFormModel(this.name, value)
      }
      this.$emit('input', value)
    },
    handleBlur () {
      this.$emit('blur')
    },
    blur () {
      this.$refs.input.blur()
    }
  }
}
</script>
