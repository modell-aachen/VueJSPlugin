var baseConfig = require('./base.webpack.config.js');
var path = require('path');
var projectRoot = path.resolve(__dirname);
var webpack = require('webpack');
var merge = require('webpack-merge');


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
				loader: 'eslint-loader',
				exclude: /node_modules/
			}
		]
	}
});
