import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './vuex/store'
import vuetify from './plugins/vuetify'
import VueFriendlyIframe from 'vue-friendly-iframe'
import './base-components/base-components'
import './registerServiceWorker'
import VueTheMask from 'vue-the-mask'
import SCSDPPlugin from 'scsdp-plugin'
import DPMGStyle from 'dpmg-style'
import services from './api/service'

Vue.prototype.$services = services
Vue.config.productionTip = false
Vue.use(VueTheMask)


Vue.use(VueFriendlyIframe)
Vue.use(SCSDPPlugin, { router: router, store: store })
Vue.use(DPMGStyle)

window.addEventListener('message', (evt) => {
  if (evt.data.enable) {
    store.dispatch('setMessage', {
      data: true,
      text: evt.data.message,
      type: evt.data.type
    })
  }
})

new Vue({
  beforeMount () {
    Vue.configAxiosBaseURLServices({
      appBaseURL: process.env.VUE_APP_API_BASE_URL,
      securityBaseURL: process.env.VUE_APP_SCSDP_URL,
      defaultAuthRoutePath: process.env.VUE_APP_DEFAULT_AUTH_ROUTE
    })
  },
  router: router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
