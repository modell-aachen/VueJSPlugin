import "babel-polyfill";

import Vue from 'vue';
import Vuex from 'vuex';
import MAVueJsPlugin from './MAVueJsPlugin.js';
import i18next from 'i18next';

Vue.use(Vuex);

let store = new Vuex.Store();
Vue.use(MAVueJsPlugin, {store});

window.Vue = Vue;
window.i18next = i18next;
