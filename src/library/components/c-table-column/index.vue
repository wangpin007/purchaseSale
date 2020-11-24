<script>
export default {
  name: 'CTableColumn',
  props: {
    showOverflowTooltip: {
      type: Boolean,
      default: true
    },
    resizable: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    cTableContext () {
      return this.$parent && this.$parent.$parent
    }
  },
  render (h) {
    const scopedSlots = {}
    if (this.$scopedSlots.default) {
      scopedSlots.default = (scope) => {
        const { uid } = scope.row._store
        const newScope = Object.assign({}, scope, {
          uid,
          row: this.cTableContext.treeMapper[uid]
        })
        return this.$scopedSlots.default(newScope)
      }
    }

    if (this.$scopedSlots.header) {
      scopedSlots.header = (scope) => this.$scopedSlots.header(scope)
    }

    if (Object.keys(scopedSlots).length > 0) {
      return (
        <ElTableColumn
          showOverflowTooltip={ this.showOverflowTooltip }
          resizable={this.resizable}
          { ...{
            props: this.$attrs,
            scopedSlots
          }}
        />
      )
    } else {
      return (
        <ElTableColumn
          showOverflowTooltip={ this.showOverflowTooltip }
          resizable={this.resizable}
          { ...{ props: this.$attrs } }
        />
      )
    }
  }
}
</script>
