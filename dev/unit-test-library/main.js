import Frontend from '../Frontend';
import FoswikiMock from './FoswikiMock.js';
import AlertPluginMock from './AlertPluginMock.js';
import moment from 'moment';
import jquery from 'jquery';
import { mount, shallow, createLocalVue } from '@vue/test-utils';

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
    shallow(component, options = {}) {
        options.localVue = localVue;
        return shallow(component, options);
    },
    vue: localVue
};
