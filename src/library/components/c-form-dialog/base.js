// 注入dialog中的form表单实例，用于表单较检
export default {
  name: 'c-form-dialog-base',
  inject: {
    cFormDialog: {
      default: () => {}
    }
  },
  methods: {
    initFormDialog (form) {
      this.$nextTick(() => {
        this.cFormDialog.getFormInstance(form)
      })
    }
  }
}
