<template>
  <el-cascader
    class="c-cascade-address"
    :size="size"
    :disabled="disabled"
    :options="districtAddress"
    :value="value"
    :props="defaultProps"
    @change="handleChange"
  />
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'CCascadeAddress',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    size: {
      type: String,
      default: 'mini'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data: () => {
    return {
      defaultProps: {
        children: 'areaDtos',
        label: 'areaName',
        value: 'areaCode'
      }
    }
  },
  computed: {
    ...mapState({
      districtAddress: state => state.app.districtAddress
    })
  },
  methods: {
    handleChange (value) {
      this.$emit('change', value)
    }
  }
}
</script>
