const module = {
    namespaced: true,
    state: {
        version: '',
        customer: '',
        userId: '',
    },
    mutations: {
        setVersion(state, version) {
            state.version = version;
        },
        setCustomer(state, customer) {
            state.customer = customer;
        },
        setUserId(state, userId) {
            state.userId = userId;
        },
    },
};

export {
    module,
};
