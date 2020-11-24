export default {
  name: 'CQueryFormButton',
  props: {
    showExpand: {
      type: Boolean,
      default: true
    },
    showQueryBtn: {
      type: Boolean,
      default: true
    },
    showResetBtn: {
      type: Boolean,
      default: true
    },
    expand: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick (eventName) {
      this.$emit(eventName)
    }
  },
  render (h) {
    let queryBtn = ''
    let resetBtn = ''
    let expandBtn = ''

    if (this.showQueryBtn) {
      queryBtn = (
        <ElButton
          type="primary"
          onClick={ () => this.handleClick('query') }
        >
          查询
        </ElButton>
      )
    }

    if (this.showResetBtn) {
      resetBtn = <ElButton onClick={ () => this.handleClick('reset') }>重置</ElButton>
    }

    if (this.showExpand) {
      expandBtn = (
        <ElButton
          type="text"
          onClick={ () => this.handleClick('expand') }
        >
          { this.expand ? '收起' : '展开' }
        </ElButton>
      )
    }

    return (
      <div class="c-query-form-btn">
        { queryBtn }
        { resetBtn }
        { expandBtn }
      </div>
    )
  }
}
