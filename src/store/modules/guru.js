import axios from "axios";

const guru = {
  namespaced: true,
  state: {
    guru: [],
    isLoading: false
  },
  mutations: {},
  actions: {
    getAllGuru({ commit, state, rootState }) {
      state.isLoading = true;
      return new Promise((resolve, reject) => {
        axios({
          url: "guru",
          method: "GET",
          headers: { Authorization: rootState.token }
        })
          .then((res) => {
            console.log(res.data);
            //   commit("set_users", res.data.data);
            //   state.base_url_avatar = res.data.base_url_image;
            //   state.isLoading = false;
            resolve(res);
          })
          .catch((err) => {
            console.error(err);
            //   state.isLoading = false;
            //   commit("error_alert", "Failed to display users data");
            reject(err);
          });
      });
    }
  }
};

export default guru;
