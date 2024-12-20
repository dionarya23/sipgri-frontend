import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import Axios from "axios";

import endpoint from './config/endpoint';

Vue.config.productionTip = false;

Vue.prototype.$http = Axios;
Vue.prototype.$http.defaults.headers.common = {
  Accept: "application/json",
  "Content-Type": "application/json"
};
Axios.defaults.baseURL = endpoint;
const token = localStorage.getItem("token");
if (token) {
  Vue.prototype.$http.defaults.headers.common["Authorization"] = token;
}

new Vue({
  router,
  store,
  vuetify,
  print,
  render: (h) => h(App)
}).$mount("#app");
