import Vue from 'vue';
import Vuex from 'vuex';
import MAVueJsPlugin from './MAVueJsPlugin.js';
import i18next from 'i18next';

class Frontend {
  constructor(options) {
    this.options = options;
  }
  setup() {
    Vue.use(Vuex);

    let store = new Vuex.Store();
    const maVueJsPlugin = new MAVueJsPlugin(this.options);
    Vue.use(maVueJsPlugin, {store});

    window.Vue = Vue;
    window.i18next = i18next;
  }
}

export default Frontend;
