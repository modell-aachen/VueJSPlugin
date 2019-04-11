require('./sass/flatskin_wrapped.scss');
import "@babel/polyfill";
import Vue from 'vue';
import Frontend from './Frontend';
import AlertPlugin from './alert/AlertPlugin';
import debounce from 'lodash/debounce';
import VueSlideUpDown from 'vue-slide-up-down';
import VueTimers from 'vue-timers';
import { VTooltip } from 'v-tooltip';
import * as Sentry from '@sentry/browser';

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

if(process.env.NODE_ENV === 'production' && Vue.Store.state.Qwiki.sentryEnabled) {
    Sentry.init({
        dsn: 'https://d6949e25bfe04f5b965ac8304eef2f09@sentry.io/1411026',
        integrations: [new Sentry.Integrations.Vue({
            Vue,
        })],
        environment: Vue.Store.state.Qwiki.environment,
        beforeSend: (event, hint) => {
            window.console.error(hint.originalException || hint.syntheticException);
            return event;
        }
    });

    Sentry.configureScope((scope) => {
        scope.setUser({id: Vue.Store.state.Qwiki.userId});
        scope.setExtra("qwiki_version", Vue.Store.state.Qwiki.version);
        scope.setExtra("customer", Vue.Store.state.Qwiki.customer);
    });
}

