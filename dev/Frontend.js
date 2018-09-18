import Vuex from "vuex";
import MAVueJsPlugin from "./MAVueJsPlugin.js";
import i18next from "i18next";
import VuexProxyPlugin from "./VuexProxyPlugin.js";

class Frontend {
    constructor(options) {
        this.options = options;
    }
    setup() {
        this.options.vue.use(Vuex);

        let store = new Vuex.Store({
            plugins: [VuexProxyPlugin._hook]
        });
        const maVueJsPlugin = new MAVueJsPlugin(this.options);
        this.options.vue.use(maVueJsPlugin, {store});

        this.options.vue.VuexProxyPlugin = VuexProxyPlugin;
        window.Vue = this.options.vue;
        window.i18next = i18next;
    }
}

export default Frontend;
