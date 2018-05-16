import Vuex from 'vuex';
import MAVueJsPlugin from './MAVueJsPlugin.js';
import i18next from 'i18next';

class Frontend {
    constructor(options) {
        this.options = options;
    }
    setup() {
        this.options.vue.use(Vuex);

        let store = new Vuex.Store();
        const maVueJsPlugin = new MAVueJsPlugin(this.options);
        this.options.vue.use(maVueJsPlugin, {store});

        window.Vue = this.options.vue;
        window.i18next = i18next;
    }
}

export default Frontend;
