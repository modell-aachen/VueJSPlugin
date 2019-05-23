export default {
    namespaced: true,
    state: {
        showLoader: false,
    },
    mutations: {
        setShowLoader (state, status) {
            state.showLoader = status;
        },
    },
};
