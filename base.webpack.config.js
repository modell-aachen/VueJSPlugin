let path = require('path');
let projectRoot = path.resolve(__dirname);

let includeDirs = [
  projectRoot + '/dev',
  projectRoot + '/tests'
];

let babelLoaderOptions = {
  presets: [['env', {"modules": false}]]
};

module.exports = {
  resolve: {
    extensions: ['.vue', '.js'],
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
        include: includeDirs,
        use: ['style-loader','css-loader', 'sass-loader']
      }
    ]
  }
};
