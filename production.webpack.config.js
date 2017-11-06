var baseConfig = require('./base.webpack.config.js');
var webpack = require('webpack');
var merge = require('webpack-merge');

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
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: true
		}),
		new webpack.optimize.AggressiveMergingPlugin()
	]
});