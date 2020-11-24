<template>
  <c-exception
    type="401"
    title="402"
    sub-title="抱歉，系统未找到您的组织单位，请联系管理员。"
  />
</template>

<script>
import CException from 'lib@/components/c-exception'

export default {
  name: 'Exception402',
  components: {
    CException
  }
}
</script>
