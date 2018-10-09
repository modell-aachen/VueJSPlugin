let baseConfig = require('./base.webpack.config.js');
let webpack = require('webpack');
let merge = require('webpack-merge');

module.exports = merge.smart(baseConfig, {
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: true
		}),
		new webpack.optimize.AggressiveMergingPlugin()
	]
});