const callbacks = [];

export default {
    _hook(store) {
        store.subscribe((mutation, state) => {
            for(const callback of callbacks) {
                // eslint-disable-next-line callback-return
                callback(store, mutation, state);
            }
        });
    },
    register(callback) {
        callbacks.push(callback);
    },
};
