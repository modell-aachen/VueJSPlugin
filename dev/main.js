import Frontend from './Frontend';

const frontend = new Frontend({
  foswiki: window.foswiki,
  moment: window.moment,
  jquery: window.$
});

frontend.setup();
