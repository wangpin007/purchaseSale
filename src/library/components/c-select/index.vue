<template>
  <el-select
    v-bind="$attrs"
    :value="value"
    v-on="eventListeners"
  >
    <slot>
      <el-option
        v-for="option in allOptions"
        :key="option.value"
        v-bind="option"
      />
      <template v-if="pagination">
        <p
          v-if="noMore"
          class="c-select-no-more"
        >
          没有更多
        </p>
        <el-button
          v-else
          class="c-select-load-more"
          type="text"
          :loading="loading"
          @click="handleLoadMore"
        >
          加载更多
        </el-button>
      </template>
    </slot>
  </el-select>
</template>

<script>
export default {
  name: 'CSelect',
  inject: {
    cQueryTable: {
      default: ''
    }
  },
  props: {
    value: {
      type: [String, Number, Boolean]
    },
    name: {
      type: [String]
    },
    options: {
      type: Array,
      default: () => {
        return []
      }
    },
    hasAll: {
      type: Boolean,
      default: true
    },
    allLabel: {
      type: String,
      default: '全部'
    },
    allValue: {
      type: [String, Number]
    },
    allDisabled: {
      type: Boolean,
      default: false
    },
    pagination: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    noMore: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    allOptions () {
      let all = []
      if (this.hasAll) {
        all = [{
          label: this.allLabel,
          value: this.allValue,
          disabled: this.allDisabled
        }]
      }

      return all.concat(this.options)
    },
    eventListeners () {
      return Object.assign({}, this.$listeners, {
        input: this.handleInput,
        change: this.handleChange
      })
    }
  },
  methods: {
    handleInput (value) {
      this.$emit('input', value)
    },
    handleChange (value) {
      if (this.cQueryTable) {
        this.cQueryTable.updateFormModel(this.name, value)
      }
      this.$emit('change', value)
    },
    handleLoadMore () {
      this.$emit('load-more')
    }
  }
}
</script>

<style lang="scss">
.c-select-load-more {
  width: 100%;
  padding: 0 8px;

  .el-button {
    margin-left: 0;
  }
}

.c-select-no-more {
  padding: 8px 0;
  text-align: center;
  color: #cccccc;
}
</style>
