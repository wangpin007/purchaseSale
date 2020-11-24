<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import userDashboard from './user'

export default {
  name: 'Dashboard',
  components: { adminDashboard, userDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      // 'roles'
    ])
  },
  created() {
    this.currentRole = 'userDashboard'
  }
}
</script>

<style lang="scss" scoped>
  .dashboard-container.app-main-container {
    background-color: #edf0f2;
    margin: 0;
  }
</style>
