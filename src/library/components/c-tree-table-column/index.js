export default {
  name: 'CTreeTableColumn',
  methods: {
    getScope (scope) {
      const { row, $index, column } = scope
      const { _store } = row
      const { _source, _level, _hasChild, _orderNumber, _parent, _expanded, _deleted } = _store
      return {
        source: _source,
        level: _level,
        hasChild: _hasChild,
        orderNumber: _orderNumber,
        parent: _parent,
        expanded: _expanded,
        deleted: _deleted,
        $index: $index,
        row: row,
        column: column
      }
    }
  },
  render (h) {
    const scopedSlots = {}
    if (this.$scopedSlots.default) {
      scopedSlots.default = (scope) => this.$scopedSlots.default(this.getScope(scope))
    }

    if (this.$scopedSlots.header) {
      scopedSlots.header = (scope) => this.$scopedSlots.header(scope)
    }

    if (Object.keys(scopedSlots).length > 0) {
      return (
        <ElTableColumn
          { ...{
            props: this.$attrs,
            scopedSlots
          }}
        />
      )
    } else {
      return (
        <ElTableColumn
          { ...{ props: this.$attrs } }
        />
      )
    }
  }
}
