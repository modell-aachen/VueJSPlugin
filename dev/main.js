require('./sass/flatskin_wrapped.scss');
import "@babel/polyfill";
import Vue from 'vue';
import Frontend from './Frontend';
import AlertPlugin from './alert/AlertPlugin';
import debounce from 'lodash/debounce';
import VueSlideUpDown from 'vue-slide-up-down';
import VueTimers from 'vue-timers';
import { VTooltip } from 'v-tooltip';


const frontend = new Frontend({
    vue: Vue,
    foswiki: window.foswiki,
    moment: window.moment,
    jquery: window.$,
    alertPlugin: AlertPlugin,
    debounce: debounce,
    slideUpDown: VueSlideUpDown,
    vueTimers: VueTimers,
    tooltip: VTooltip,
});

frontend.setup();
