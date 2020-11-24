<template>
  <c-exception
    type="404"
    title="404"
    sub-title="抱歉，您的页面找不到了！"
  />
</template>

<script>
import CException from 'lib@/components/c-exception'

export default {
  name: 'Exception404',
  components: {
    CException
  }
}
</script>