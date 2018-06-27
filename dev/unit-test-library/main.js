import Frontend from '../Frontend';
import FoswikiMock from './FoswikiMock.js';
import AlertPluginMock from './AlertPluginMock.js';
import moment from 'moment';
import jquery from 'jquery';
import { mount, shallowMount, createLocalVue } from '@vue/test-utils';

const localVue = createLocalVue();
const frontend = new Frontend({
    vue: localVue,
    foswiki: FoswikiMock,
    moment: moment,
    jquery: jquery,
    alertPlugin: AlertPluginMock,
});

frontend.setup();

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
