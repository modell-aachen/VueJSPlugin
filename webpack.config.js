const path = require('path');
const webpack = require('webpack');
const zip = require('compression-webpack-plugin');
const CssEntryPlugin = require("css-entry-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin')

const babelOpts = {
    presets: ['latest'],
    plugins: ['transform-object-rest-spread']
};
const devDir = path.join(__dirname, 'dev');
const testDir = path.join(__dirname, 'tests');
const destDir = path.join(__dirname, 'pub/System/FlatSkin');
const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

module.exports = {
  devtool: 'source-map',
  entry: {
    "flatskin": path.join(devDir, 'sass', 'flatskin.scss'),
    "flatskin_wrapped": path.join(devDir, 'sass', 'flatskin_wrapped.scss'),
    "flatskin": path.join(devDir, 'js', 'flatskin.js'),
  },
  output: {
    path: path.join(destDir, 'css'),
    filename: '[name].css',
  },
  watchOptions: {
    aggregateTimeout: 250,
    ignored: '/node_modules/',
    poll: 1000
  },
  plugins: [
    new zip({
      minRation: 1,
      include: [/\.(?:js|css)$/]
    }),
    new ExtractTextPlugin('[name].css'),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [devDir, testDir],
        options: babelOpts
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
                loader: 'css-loader',
                options: {
                    url: true,
                    minimize: true,
                    sourceMap: true,
                    importLoaders: 1,
                }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => {
                  return [
                    require('postcss-discard-duplicates'),
                    require('postcss-discard-empty'),
                    require('postcss-zindex'),
                    require('autoprefixer')({browsers: ['last 2 version']})
                  ];
                },
                sourceMap: true
              }
            },
            {
                loader: 'sass-loader',
                options: {
                    sourceMap: true
                }
            }
          ]
        })
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
            loader: 'file-loader',
            options: {
                name: '[name].[ext]',
                outputPath: '../fonts/opensans',
                useRelativePath: false,
                publicPath: '../fonts/opensans'
            }
        }]
    }
    ]
  }
}
