import Vue from 'vue';
import Frontend from './Frontend';
import AlertPlugin from './alert/AlertPlugin';

const frontend = new Frontend({
    vue: Vue,
    foswiki: window.foswiki,
    moment: window.moment,
    jquery: window.$,
    alertPlugin: AlertPlugin,
});

frontend.setup();

jQuery(function ($) {
    Vue.instantiateEach('.vue-container');
});
