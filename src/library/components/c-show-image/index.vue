<template>
  <c-form-dialog
    v-model="dialogVisible"
    class="c-show-image"
    width="50%"
    :show-cancel-btn="false"
    title="图片预览"
    @on-save="handleDialogSaveClick"
    @on-close="onClose"
  >
    <div class="img-wrap">
      <img
        width="100%"
        :src="imgUrl"
        :alt="alt"
      >
    </div>
  </c-form-dialog>
</template>

<script>
import CFormDialog from 'lib@/components/c-form-dialog'

export default {
  name: 'CShowImage',
  components: {
    CFormDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    imgUrl: {
      type: String,
      default: ''
    },
    alt: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogVisible: false
    }
  },
  watch: {
    visible (e) {
      this.dialogVisible = e
    }
  },
  methods: {
    handleDialogSaveClick () {
      this.$emit('update:visible', false)
    },
    onClose () {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss">
.c-show-image {
  .img-wrap {
    display: flex;
    min-height: 50vh;
    justify-content: center;
    align-items: center;
  }
}
</style>
