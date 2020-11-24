<template>
  <div
    class="c-textarea-input"
    :class="{ 'show-num': showNum }"
  >
    <el-input
      :value="value"
      class="input-item"
      type="textarea"
      :maxlength="maxlength"
      :autosize="autosize"
      v-bind="$attrs"
      v-on="eventListeners"
    />
    <span
      v-if="showNum"
      class="remnant-word-num"
    >
      {{ remnantWordNum }}/{{ maxlength }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'CTextareaInput',
  props: {
    value: {
      type: [Number, String]
    },
    // 最大长度
    maxlength: {
      type: Number,
      default: 1024
    },
    // 自适应内容高度
    autosize: {
      type: Object,
      default: () => {
        return {
          minRows: 3
        }
      }
    },
    showNum: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    eventListeners () {
      return Object.assign({}, this.$listeners, {
        input: this.handleInput,
        focus: this.handleFocus,
        blur: this.handleBlur
      })
    },
    // 剩余字数
    remnantWordNum () {
      return this.value ? this.value.length : 0
    }
  },
  methods: {
    handleInput (value) {
      this.$emit('input', value)
    },
    handleFocus () {
      this.$emit('focus')
    },
    handleBlur () {
      this.$emit('blur')
    }
  }
}
</script>

<style lang="scss">
.c-textarea-input {
  position: relative;

  .el-textarea__inner {
    resize: none;
  }

  &.show-num .input-item {
    padding-bottom: 20px;
  }

  .remnant-word-num {
    position: absolute;
    right: 0;
    bottom: -5px;
    font-size: 12px;
    line-height: 28px;
    color: #bbbbbb;
  }
}
</style>
