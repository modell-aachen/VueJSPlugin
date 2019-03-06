import "@babel/polyfill";
import { mount, shallowMount, createLocalVue, config } from '@vue/test-utils';
import visualMethods from './VisualMethodsMocker.js';
import {buildVue} from './localVueBuilder';

config.logModifiedComponents = false;

const localVue = buildVue();

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
export {buildVue, mount};
