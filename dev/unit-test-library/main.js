import "@babel/polyfill";
import { mount, shallowMount, createLocalVue, config } from '@vue/test-utils';
import Frontend from '../Frontend';
import FoswikiMock from './FoswikiMock.js';
import AlertPluginMock from './AlertPluginMock.js';
import DebounceMock from './DebounceMock.js';
import SlideUpDownMock from './SlideUpDownMock.vue';
import VueTimersMock from './VueTimersMock.js';
import visualMethods from './VisualMethodsMocker.js';
import moment from 'moment';

import jquery from 'jquery';

config.logModifiedComponents = false;

const localVue = createLocalVue();
const frontend = new Frontend({
    vue: localVue,
    foswiki: FoswikiMock,
    moment: moment,
    jquery: jquery,
    alertPlugin: AlertPluginMock,
    debounce: DebounceMock,
    slideUpDown: SlideUpDownMock,
    vueTimers: VueTimersMock,
});

frontend.setup();
visualMethods.mock();

export default {
    createVueComponent(componentDefinition, constructionOptions) {
        const Ctor = localVue.extend(componentDefinition);
        return new Ctor(constructionOptions);
    },
    mount(component, options = {}) {
        options.localVue = localVue;
        return mount(component, options);
    },
    shallowMount(component, options = {}) {
        options.localVue = localVue;
        return shallowMount(component, options);
    },
    wrapAsync(runAsync) {
        return (done) => {
            runAsync().then(done, e => {
                fail(e); done();
            });
        };
    },
    registerStoreModule(name, module) {
        window.Vue.registerStoreModule(name, module);
    },
    vue: localVue
};
