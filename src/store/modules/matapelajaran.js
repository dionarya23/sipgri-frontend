import axios from "axios"

const matapelajaran = {
    namespace: true,
    state : {
        mataPelajaran : []
    },
    mutations: {
        SET_MATAPELAJARAN(state, mata_pelajaran) {
            state.mataPelajaran = mata_pelajaran
        }
    },
    actions: {
        
    }
}