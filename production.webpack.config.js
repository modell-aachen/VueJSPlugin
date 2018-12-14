let baseConfig = require('./base.webpack.config.js');
let webpack = require('webpack');
let merge = require('webpack-merge');

module.exports = merge.smart(baseConfig, {
  resolve: {
	    alias: {
	      vue: 'vue/dist/vue.min.js'
	    }
  },
  output: {
    filename: 'VueJSPlugin.min.js',
  },
  plugins: [
    new webpack.optimize.AggressiveMergingPlugin()
  ]
});
