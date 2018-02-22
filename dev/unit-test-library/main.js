import Frontend from '../Frontend';
import FoswikiMock from './FoswikiMock.js';
import moment from 'moment';
import jquery from 'jquery';

const frontend = new Frontend({
  foswiki: FoswikiMock,
  moment: moment,
  jquery: jquery
});

frontend.setup();

export default {
  createVueComponent(componentDefinition, constructionOptions) {
    const Ctor = Vue.extend(componentDefinition);
    return new Ctor(constructionOptions);
  }
};
