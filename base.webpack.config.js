const ExtractTextPlugin = require("extract-text-webpack-plugin");
let path = require('path');
let projectRoot = path.resolve(__dirname);

let includeDirs = [
  projectRoot + '/dev',
  projectRoot + '/node_modules/nprogress/',
  projectRoot + '/frontend-tests'
];

let babelLoaderOptions = {
  presets: [['env', {"modules": false}]],
  plugins: ["transform-es2017-object-entries"]
};

module.exports = {
  resolve: {
    extensions: ['.vue', '.js'],
    alias: {
      vue: 'vue/dist/vue.js'
    }
  },
  entry: {
    app: ['babel-polyfill', './dev/main.js'],
  },
  output: {
    path: path.join(__dirname, 'pub/System/VueJSPlugin/'),
  },
  devtool: "source-map",
  plugins: [
    new ExtractTextPlugin('VueJSPlugin.min.css'),
  ],
  module: {
    //See https://github.com/rse/vue-i18next/issues/2 why this is needed.
    noParse: [/vue-params|vue-i18next/],
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        include: includeDirs,
        options: {
          loaders: {
            js:'babel-loader?' + JSON.stringify(babelLoaderOptions)
          },
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: includeDirs,
        options: babelLoaderOptions
      },
      {
        test: /\.css$/,
        include: includeDirs,
        use: [
          "style-loader",
          "css-loader"
        ]
      },
      {
        test: /\.s(a|c)ss$/,
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
            outputPath: './fonts/opensans/',
            useRelativePath: false,
            publicPath: './'
          }
        }]
      },
      {
        test: /\.(png|gif)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: './images/',
            useRelativePath: false,
            publicPath: './'
          }
        }]
      },
    ]
  }
};
