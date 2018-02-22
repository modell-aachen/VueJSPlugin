let baseConfig = require('./development.webpack.config.js');
let webpack = require('webpack');
let merge = require('webpack-merge');

module.exports = merge(baseConfig, {
  devtool: "inline-source-map",
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      moment: "moment"
    })
  ]
});
