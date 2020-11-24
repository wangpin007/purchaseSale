<template>
  <c-exception
    type="401"
    title="401"
    sub-title="抱歉，您没有权限访问该页面"
  />
</template>

<script>
import CException from 'lib@/components/c-exception'

export default {
  name: 'Exception401',
  components: {
    CException
  }
}
</script>