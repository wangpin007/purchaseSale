<template>
  <el-dropdown
    trigger="click"
    class="international"
    @command="handleSetLanguage"
  >
    <!-- <div>
      <svg-icon
        class-name="international-icon"
        icon-class="language"
      />
    </div> -->
    <div class="lang">
      <!-- <svg-icon
        class-name="international-icon"
        icon-class="language"
      /> -->
      <!-- <i class="iconfont iconyuyan"></i> -->
      <span class="lang-text">{{ langShow }}</span>
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        :disabled="language==='zh'"
        command="zh"
      >
        中文
      </el-dropdown-item>
      <el-dropdown-item
        :disabled="language==='en'"
        command="en"
      >
        English
      </el-dropdown-item>
      <!--<el-dropdown-item
        :disabled="language==='es'"
        command="es"
      >
        Español
      </el-dropdown-item>-->
      <el-dropdown-item
        :disabled="language==='ja'"
        command="ja"
      >
        日本語
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  computed: {
    language () {
      return this.$store.getters.language
    },
    langShow() {
      let lang = this.$store.getters.language.substring(0, 2);
      return lang.toLocaleUpperCase();
    }
  },
  methods: {
    handleSetLanguage (lang) {
      this.$i18n.locale = lang
      this.$store.dispatch('app/setLanguage', lang)
      this.$message({
        message: 'Switch Language Success',
        type: 'success'
      })
    }
  }
}
</script>
<style scoped lang="scss">
.international {
  height: 100%;
  .lang {
    height: 100%;
    i {
      margin-right: 2px;
    }
    span {
      font-size: 14px;
    }
  }
}
</style>