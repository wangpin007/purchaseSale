// 配置编译环境和线上环境之间的切换
const config = {
  baseUrl: '', // 服务器地址
  idmUrl: '',
  apiRoot: '',
  singlePointLogin: '',
  modAuthCas: '',
  renew: '',
  logoutUrl: '',
  qualityCloudUrl: ''
}
switch (process.env.VUE_APP_ENV) { // 判断环境类型
  case 'PROD':
    config.baseUrl = process.env.VUE_APP_BASE_URL
    config.apiRoot = process.env.API_ROOT
    config.modAuthCas = process.env.VUE_APP_MOD_AUTH_CAS
    config.singlePointLogin = process.env.VUE_APP_IDM_URL + '/login?service='
    config.logoutUrl = process.env.VUE_APP_IDM_URL + '/logout?service='
    config.signUpUrl = process.env.VUE_APP_REGISTER_URL
    config.idmUrl = process.env.VUE_APP_IDM_URL
    config.authInfoUrl = process.env.VUE_APP_AUTH_INFO_URL
    config.renew = process.env.VUE_APP_RENEW_URL
    config.qualityCloudUrl = process.env.VUE_APP_QUALITY_CLOUD_URL
    break
  case 'SIT':
    config.baseUrl = process.env.VUE_APP_BASE_URL
    config.apiRoot = process.env.API_ROOT
    config.modAuthCas = process.env.VUE_APP_MOD_AUTH_CAS
    config.singlePointLogin = process.env.VUE_APP_IDM_URL + '/login?service='
    config.logoutUrl = process.env.VUE_APP_IDM_URL + '/logout?service='
    config.signUpUrl = process.env.VUE_APP_REGISTER_URL
    config.idmUrl = process.env.VUE_APP_IDM_URL
    config.authInfoUrl = process.env.VUE_APP_AUTH_INFO_URL
    config.renew = process.env.VUE_APP_RENEW_URL
    config.qualityCloudUrl = process.env.VUE_APP_QUALITY_CLOUD_URL
    break
  case 'UAT':
    config.baseUrl = process.env.VUE_APP_BASE_URL
    config.apiRoot = process.env.API_ROOT
    config.modAuthCas = process.env.VUE_APP_MOD_AUTH_CAS
    config.singlePointLogin = process.env.VUE_APP_IDM_URL + '/login?service='
    config.logoutUrl = process.env.VUE_APP_IDM_URL + '/logout?service='
    config.signUpUrl = process.env.VUE_APP_REGISTER_URL
    config.idmUrl = process.env.VUE_APP_IDM_URL
    config.authInfoUrl = process.env.VUE_APP_AUTH_INFO_URL
    config.renew = process.env.VUE_APP_RENEW_URL
    config.qualityCloudUrl = process.env.VUE_APP_QUALITY_CLOUD_URL
    break
  case 'DEV':
    config.baseUrl = process.env.VUE_APP_BASE_URL
    config.defaultPage = process.env.VUE_APP_DEFAULT_PAGE
    config.apiRoot = process.env.API_ROOT
    config.modAuthCas = process.env.VUE_APP_MOD_AUTH_CAS
    config.singlePointLogin = process.env.VUE_APP_IDM_URL + '/login?service='
    config.logoutUrl = process.env.VUE_APP_IDM_URL + '/logout?service='
    config.signUpUrl = process.env.VUE_APP_REGISTER_URL
    config.idmUrl = process.env.VUE_APP_IDM_URL
    config.authInfoUrl = process.env.VUE_APP_AUTH_INFO_URL
    config.renew = process.env.VUE_APP_RENEW_URL
    config.qualityCloudUrl = process.env.VUE_APP_QUALITY_CLOUD_URL
    break
  default:
    config.baseUrl = 'http://sccdev.meicloud.com:10010'
    config.defaultPage = '/index.html'
    config.apiRoot = 'http://sccdev.meicloud.com:10010/sourcing'
    config.singlePointLogin = 'http://idaassit.meicloud.com/login?service='
    config.modAuthCas = 'MOD_AUTH_CAS'
    config.logoutUrl = 'http://idaassit.meicloud.com/logout?service='
    config.idmUrl = 'http://idaassit.meicloud.com'
    config.signUpUrl = 'http://clouduat.meicloud.com/loginPage/#/register?host='
    config.authInfoUrl = 'http://clouduat.meicloud.com/#eyJtcG9kX3Jvb3RfY29udGVudCI6InByb3h5L2NvbnRlbnQvY29udHJvbGJvYXJkL2VudGVycHJpc2VJbmZvcm1hdGlvbi9pbmRleC5odG1sIy9jZXJ0aWZpY2F0aW9uP2NvcmVyYW5kb209MTU3ODUzNjI0NTAzNS45NDU4In0='
    config.renew = 'http://cloudsit.meicloud.com/#eyJtcG9kX3Jvb3RfY29udGVudCI6ImFwcGxpY2F0aW9uLW1hbmFnZXIvaW5kZXguaHRtbD9jb3JlcmFuZG9tPTE1ODc2NDE0NDM3MDYuMjYyNSIsInNlbGZOb1JlbG9hZCI6ZmFsc2UsIm5vcmVsb2FkIjoibXBvZF9yb290X2NvbnRlbnQifQ=='
    config.qualityCloudUrl = 'http://10.17.149.191:8002/portal/';
    break
}
export default config
