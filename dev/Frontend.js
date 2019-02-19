import Vuex from "vuex";
import MAVueJsPlugin from "./MAVueJsPlugin.js";
import i18next from "i18next";
import VuexProxyPlugin from "./VuexProxyPlugin.js";
import VueFullscreenLoader from './components/vue-fullscreen-loader/VueFullscreenLoader.vue';

class Frontend {
    constructor(options) {
        this.options = options;
    }
    setup() {
        this.options.vue.use(Vuex);

        let store = new Vuex.Store({
            plugins: [VuexProxyPlugin._hook]
        });
        this.options.vue.VuexProxyPlugin = VuexProxyPlugin;
        this.options.vue.Store = store;

        const maVueJsPlugin = new MAVueJsPlugin(this.options);
        this.options.vue.use(maVueJsPlugin, {store});

        window.Vue = this.options.vue;
        window.i18next = i18next;
        this.options.jquery(function () {
            Vue.instantiateEach('.vue-container');
            const VueFullscreenLoaderClass = Vue.extend(VueFullscreenLoader);
            new VueFullscreenLoaderClass();
        });
    }
}

export default Frontend;
