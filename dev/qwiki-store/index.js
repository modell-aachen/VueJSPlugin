const module = {
    namespaced: true,
    state: {
        version: '',
        customer: '',
        userId: '',
        environment: '',
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
        setEnvironment(state, environment) {
            state.environment = environment;
        },
    },
};

export {
    module,
};
