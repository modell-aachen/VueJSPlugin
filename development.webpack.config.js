let baseConfig = require('./base.webpack.config.js');
let merge = require('webpack-merge');


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
      {
        enforce: 'pre',
        test: /.(vue|js)$/,
        use: 'eslint-loader',
        exclude: /node_modules/
      }
    ]
  }
});
