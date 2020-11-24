<template>
  <div class="pdf-wrapper">
    <pdf
      v-for="i in numPages"
      :key="i"
      :src="src"
      :page="i"
      class="paper"
    ></pdf>
  </div>
</template>
<script>
import pdf from "vue-pdf";
// import { getToken } from "@/utils/auth";

export default {
  name: "PdfPreview",
  components: { pdf },
  props: {
    url: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      headers: {
        // Authorization: `Bearer ${getToken()}`
      },
      src: null,
      numPages: null
    };
  },
  watch: {
    url:{
      immediate: true,
      handler (url) {
          if (url) {
            this.createSrc();  
            this.$nextTick(() => {
            this.src.promise.then(pdf => {
              this.numPages = pdf.numPages;
            });
          });
        } 
      }
    }
  },
  mounted() {
    // this.createSrc();
    // this.$nextTick(() => {
    //   this.src.promise.then(pdf => {
    //     this.numPages = pdf.numPages;
    //   });
    // });
  },
  methods: {
    createSrc() {
      this.src = pdf.createLoadingTask({
        url: this.url,
        httpHeaders: this.headers
      });
    }
  }
};
</script>
<style scoped>
.pdf-wrapper {
  display: flex;
  flex-direction: column;
}
.paper {
  position: relative;
  padding: 0 40px 100px 40px;
  background: #fff;
  border: 1px solid #eee;
  float: left;
  margin: 10px;
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04);
}
.paper::after,
.paper::before {
  content: "";
  position: absolute;
  bottom: 6px;
  width: 100px;
  height: 1px;
  z-index: -1;
  box-shadow: 0 2px 12px 5px rgba(0, 0, 0, 0.3);
}
.paper::after {
  left: 4px;
  transform: rotate(-6deg);
}
.paper::before {
  right: 4px;
  transform: rotate(6deg);
}
</style>
