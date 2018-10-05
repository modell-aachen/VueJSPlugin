import Vue from 'vue';
import Frontend from './Frontend';
import AlertPlugin from './alert/AlertPlugin';
import debounce from 'lodash/debounce';
import VueSlideUpDown from 'vue-slide-up-down';
require('./sass/flatskin_wrapped.scss');

const frontend = new Frontend({
    vue: Vue,
    foswiki: window.foswiki,
    moment: window.moment,
    jquery: window.$,
    alertPlugin: AlertPlugin,
    debounce: debounce,
    slideUpDown: VueSlideUpDown,
});

frontend.setup();

jQuery(function () {
    Vue.instantiateEach('.vue-container');
});
