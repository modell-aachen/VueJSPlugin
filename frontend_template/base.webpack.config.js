let OUT_PATH = "pub/System/MyPlugin";
let OUT_FILE = "myplugin.js";

let path = require('path')
let projectRoot = path.resolve(__dirname);

let includeDirs = [
  projectRoot + '/dev',
  projectRoot + '/tests'
];

let babelLoaderOptions = {
  presets: [['env', {"modules": false}]]
}

module.exports = {
  resolve: {
    extensions: ['.vue', '.js']
  },
  entry: {
    app: ['./dev/main.js']
  },
  output: {
    path: path.join(__dirname, OUT_PATH),
    filename: OUT_FILE
  },
  devtool: "source-map",
  module: {
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
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        loader: 'url-loader',
        include: includeDirs
      }
    ]
  }
}
