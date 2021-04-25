import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import Axios from "axios";

Vue.config.productionTip = false;

Vue.prototype.$http = Axios;
Axios.defaults.baseURL = "https://sipgri-backend.herokuapp.com/api";

const token = localStorage.getItem("token");
if (token) {
  Vue.prototype.$http.defaults.headers.common["Authorization"] = token;
}

Vue.prototype.$http.defaults.headers.common = {
  Accept: "application/json",
  "Content-Type": "application/json"
};

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App)
}).$mount("#app");
