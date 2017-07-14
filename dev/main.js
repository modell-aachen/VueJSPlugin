import 'es6-object-assign/auto'; //Needed for IE
import 'es6-promise/auto'; //Needed for IE

import Vue from 'vue';
import Vuex from 'vuex';
import MAVueJsPlugin from './MAVueJsPlugin.js';

Vue.use(Vuex);

let store = new Vuex.Store();
Vue.use(MAVueJsPlugin, {store});

window.Vue = Vue;