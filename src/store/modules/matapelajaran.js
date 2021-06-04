import axios from "axios"

const matapelajaran = {
    namespace: true,
    state : {
        mataPelajaran : []
        // isLoading
    },
    mutations: {
        SET_MATAPELAJARAN(state, mata_pelajaran) {
            state.mataPelajaran = mata_pelajaran
        }
    },
    actions: {
        getAllMataPelajaran({commint, state}, )
    }
}