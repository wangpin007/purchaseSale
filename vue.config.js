const path = require('path')
const resolve = dir => { return path.join(__dirname, dir) }

console.log(' 代理地址：', process.env.VUE_APP_DEVSERVE_PROXY)
console.log('NODE_ENV', process.env.NODE_ENV)

function addStyleResource(rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, 'src/styles/mixins/common.less'),
        path.resolve(__dirname, 'src/styles/vars.less')
      ]
    })
}

module.exports = {
  // productionSourceMap: false,
  // configureWebpack: {
  //   devtool: true
  // },
  // 参考配置https://cli.vuejs.org/config/#devserver-proxy
  // https://github.com/chimurai/http-proxy-middleware#proxycontext-config
  devServer: {
    disableHostCheck: true,
    host: "localhost",
    port: "8080",
    open: false,
    proxy: {
      "/pss": {
        // target: process.env.VUE_APP_SERVE_PROXY,
        //
        // target: 'http://10.17.145.116:8000',//寻源云的代理
        target: "http://10.17.149.191:8003",
        // target: "http://psiuat.meicloud.com",
        changeOrigin: true,
        debuger: "log"
      }
    }
  },
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  chainWebpack: config => {
    // 自动化导入主题变量, 全局共享
    const types = ["vue-modules", "vue", "normal-modules", "normal"];
    types.forEach(type =>
      addStyleResource(config.module.rule("less").oneOf(type))
    );

    // 添加路径别名
    config.resolve.alias
      .set("@", resolve("src"))
      .set("mod@", resolve("src/modules"))
      .set("assets@", resolve("src/assets"))
      .set("comps@", resolve("src/components"))
      .set("lib@", resolve("src/library"));

    // 添加svg-sprite-loader
    config.module
      .rule("svg")
      .exclude.add(resolve("src/icons"))
      .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
      .end();

    if (
      process.env.NODE_ENV === "production" &&
      process.env.npm_config_report
    ) {
      config
        .plugin("webpack-bundle-analyzer")
        .use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin)
        .end();
    }
  },
  css: {
    loaderOptions: {
      sass: {
        data: `
        @import "@/styles/index.scss";
        `
      }
    }
  },
  lintOnSave: false
};
