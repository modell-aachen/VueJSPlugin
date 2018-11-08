let baseConfig = require('./base.webpack.config.js');
let merge = require('webpack-merge');

let path = require('path');
let projectRoot = path.resolve(__dirname);
let includeDirs = [
  projectRoot + '/dev',
  projectRoot + '/tests'
];
module.exports = merge.smart(baseConfig, {
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    }
  },
  output: {
    filename: 'VueJSPlugin.js',
  },
  module: {
    rules: [
    ]
  }
});
