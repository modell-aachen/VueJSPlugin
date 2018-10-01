let path = require('path');
let projectRoot = path.resolve(__dirname);

const VueLoaderPlugin = require('vue-loader/lib/plugin');

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
    extensions: ['.vue', '.js', '.ts'],
    alias: {
      vue: 'vue/dist/vue.js'
    }
  },
  entry: {
    app: ['babel-polyfill', './dev/main.js']
  },
  output: {
    path: path.join(__dirname, 'pub/System/VueJSPlugin/')
  },
  devtool: "source-map",
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
        test: /\.ts$/,
        loader: 'ts-loader',
        options: { 
          appendTsSuffixTo: [/\.vue$/]
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
          "vue-style-loader",
          "css-loader"
        ]
      },
      {
        test: /\.s(a|c)ss$/,
        include: includeDirs,
        use: ['vue-style-loader','css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
};
