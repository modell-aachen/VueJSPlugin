const module = {
    namespaced: true,
    state: {
        version: '',
        customer: '',
    },
    mutations: {
        setVersion(state, version) {
            state.version = version;
        },
        setCustomer(state, customer) {
            state.customer = customer;
        },
    },
};

export {
    module,
};
