const path = require('path');
const zip = require('compression-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const babelOpts = {
  presets: ['latest'],
  plugins: ['transform-object-rest-spread']
};
const devDir = path.join(__dirname, 'dev');
const testDir = path.join(__dirname, 'tests');
const destDir = path.join(__dirname, 'pub/System/FlatSkin');

module.exports = [{
    devtool: 'source-map',
    entry: {
      "flatskin_wrapped": path.join(devDir, 'sass', 'flatskin_wrapped.scss'),
    },
    output: {
      path: path.join(destDir, 'css'),
      filename: '[name].min.css',
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
      new ExtractTextPlugin('[name].min.css'),
      new ProgressBarPlugin()
    ],
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [{
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
                      require('autoprefixer')({
                        browsers: ['last 2 version']
                      })
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
          test: /\.(woff|woff2|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: '../fonts/opensans',
              useRelativePath: false,
              publicPath: '../fonts/opensans'
            }
          }]
        },
        {
          test: /\.(png|gif)(\?v=\d+\.\d+\.\d+)?$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: '../images',
              useRelativePath: false,
              publicPath: '../images'
            }
          }]
        }
      ]
    }
  },
]
