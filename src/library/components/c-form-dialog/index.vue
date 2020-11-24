<template>
  <el-dialog
    class="c-form-dialog"
    :class="{ 'c-form-dialog-show-scroll-bar': showScrollBar }"
    :title="title"
    :width="width"
    :visible="value"
    :append-to-body="true"
    @close="closeDialog"
  >
    <!-- dialog内容 -->
    <slot v-if="value" />
    <!-- dialog底部 -->
    <div
      v-if="showFooter"
      slot="footer"
      class="footer-btn-wrap"
      :class="{ 'wrap-space-between': $slots.footerLeft }"
    >
      <slot
        name="footerLeft"
      />
      <div class="footer-right">
        <template v-if="editable">
          <el-button
            v-if="showCancelBtn"
            class="cancel-btn"
            @click="handleCancelClick"
          >
            {{ cancelButtonText }}
          </el-button>
          <el-button
            v-if="showSaveBtn"
            type="primary"
            class="save-btn"
            :loading="loading"
            :disabled="savenBtnDisabled"
            @click="handleSaveClick"
          >
            {{ saveButtonText }}
          </el-button>
        </template>
        <template
          v-else
        >
          <el-button
            v-if="showDeleteBtn"
            class="delete-btn"
            :loading="deleteBtnLoading"
            :disabled="deleteButtonDisabled"
            @click="handleDeleteClick"
          >
            {{ deleteButtonText }}
          </el-button>
          <el-button
            v-if="showEditBtn"
            type="primary"
            class="edit-btn"
            :disabled="editButtonDisabled"
            @click="handleEditClick"
          >
            {{ editButtonText }}
          </el-button>
        </template>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'CFormDialog',
  provide () {
    return {
      cFormDialog: this
    }
  },
  props: {
    // 弹窗显隐
    value: {
      type: Boolean,
      default: false
    },
    // 弹窗标题
    title: {
      type: String,
      default: ''
    },
    // 弹窗宽度
    width: {
      type: String,
      default: '600px'
    },
    // 弹窗是否内置滚动条
    showScrollBar: {
      type: Boolean,
      default: false
    },
    // 点击编辑按钮后是否切换为编辑状态
    isChangeEditable: {
      type: Boolean,
      default: true
    },
    // 确定按钮加载状态
    loading: {
      type: Boolean,
      default: false
    },
    // 删除按钮加载状态
    deleteBtnLoading: {
      type: Boolean,
      default: false
    },
    // 删除按钮的禁用状态
    savenBtnDisabled: {
      type: Boolean,
      default: false
    },
    // 弹窗是否为可编辑状态
    editable: {
      type: Boolean,
      default: true
    },
    // 是否显示弹窗底部
    showFooter: {
      type: Boolean,
      default: true
    },
    // 点击确定按钮后关闭弹窗
    savedClose: {
      type: Boolean,
      default: true
    },
    editButtonText: {
      type: String,
      default: '编辑'
    },
    saveButtonText: {
      type: String,
      default: '保存'
    },
    cancelButtonText: {
      type: String,
      default: '取消'
    },
    deleteButtonText: {
      type: String,
      default: '删除'
    },
    // 删除按钮是否不可点击
    deleteButtonDisabled: {
      type: Boolean,
      default: false
    },
    // 编辑按钮是否不可点击
    editButtonDisabled: {
      type: Boolean,
      default: false
    },
    // 是否显示取消按钮
    showCancelBtn: {
      type: Boolean,
      default: true
    },
    // 是否显示确定按钮
    showSaveBtn: {
      type: Boolean,
      default: true
    },
    // 是否显示删除按钮
    showDeleteBtn: {
      type: Boolean,
      default: true
    },
    // 是否显示编辑按钮
    showEditBtn: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      form: null
    }
  },
  methods: {
    /**
     * 获取表单实例
     * @returns
     */
    getFormInstance (formInstance) {
      this.form = formInstance
    },
    /**
     * 取消按钮点击事件
     * @returns
     */
    handleCancelClick () {
      this.closeDialog()
    },
    /**
     * 保存按钮点击事件
     * @returns
     */
    handleSaveClick () {
      let closeFlag = true

      if (this.form && typeof this.form.validate === 'function') {
        this.form.validate(valid => {
          if (valid) {
            this.$emit('on-save', Object.assign({}, this.form.model))
          } else {
            closeFlag = false
            this.$message.warning('请补充完整所有必填字段')
          }
        })
      } else {
        this.$emit('on-save')
      }

      if (this.savedClose && closeFlag) {
        this.$emit('input', false)
      }
    },
    /**
     * 编辑按钮点击事件
     * @returns
     */
    handleEditClick () {
      if (this.isChangeEditable) {
        this.$emit('update:editable', true)
      }

      this.$emit('on-edit')
    },
    onClose () {
      this.closeDialog()
    },
    handleDeleteClick () {
      this.$emit('on-delete')
    },
    /**
     * 关闭 dialog
     * @returns
     */
    closeDialog () {
      if (this.form && typeof this.form.resetFields === 'function') {
        this.form.resetFields()
      }
      this.$emit('input', false)
      this.$emit('on-close')
    }
  }
}
</script>

<style lang="scss">
.c-form-dialog {
  &.c-form-dialog-show-scroll-bar {
    .el-dialog__body {
      overflow: auto;
      height: 60vh;
    }
  }

  .el-dialog__header {
    display: flex;
    align-items: center;
    height: 38px;
    padding: 0 16px 0;
    border-color: #EAECF1;

    .el-dialog__title {
      font-size: 14px;
      font-weight: bold;
      color: #3F4243;
    }

    .el-dialog__headerbtn {
      top: 10px;
      right: 16px;
    }
  }

  .el-dialog__body {
    padding: 14px 14px 32px;
  }

  .el-dialog__footer {
    width: 100%;
    height: 46px;
    padding: 8px 16px;
    border-top: 1px solid #EAECF1;

    .footer-btn-wrap {
      display: flex;
      justify-content: flex-end;
      align-items: center;

      &.wrap-space-between {
        justify-content: space-between;
      }

      .el-button + .el-button {
        margin-left: 16px;
      }

      .cancel-btn,
      .delete-btn,
      .save-btn,
      .edit-btn {
        font-size: 12px;
        transition: all .3s;
      }

      .cancel-btn {
        background: #FFFFFF;

        &:hover {
          border-color: $primary-color;
          color: $primary-color;
        }
      }

      .delete-btn {
        background: #FFFFFF;

        &:hover {
          border-color: $danger-color;
          color: $danger-color;
        }
      }

      .save-btn,
      .edit-btn {
        font-size: 12px;
        color: #FFFFFF;
        background: #60ADFF;
        border-color: #60ADFF;

        &:hover {
          background: #80bdff;
          border-color: #80bdff;
        }
      }
    }
  }
}
</style>
