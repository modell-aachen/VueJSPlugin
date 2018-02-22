let baseConfig = require('./base.webpack.config.js');
let merge = require('webpack-merge');


module.exports = merge.smart(baseConfig, {
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
