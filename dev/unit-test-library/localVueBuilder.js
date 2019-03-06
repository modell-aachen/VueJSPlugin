import { createLocalVue } from '@vue/test-utils';
import Frontend from '../Frontend';
import FoswikiMock from './FoswikiMock.js';
import AlertPluginMock from './AlertPluginMock.js';
import DebounceMock from './DebounceMock.js';
import SlideUpDownMock from './SlideUpDownMock.vue';
import VueTimersMock from './VueTimersMock.js';
import TooltipMock from './TooltipMock.js';
import moment from 'moment';
import jquery from 'jquery';

const buildVue = () => {
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
        tooltip: TooltipMock,
    });

    frontend.setup();
    return localVue;
};

export {buildVue};
