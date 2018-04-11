import Vue from 'vue';
import Frontend from './Frontend';

const frontend = new Frontend({
  vue: Vue,
  foswiki: window.foswiki,
  moment: window.moment,
  jquery: window.$
});

frontend.setup();
