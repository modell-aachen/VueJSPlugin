let baseConfig = require('./base.webpack.config.js');
let path = require('path');
let merge = require('webpack-merge');


let unitTestLibraryConfig = merge.smart(baseConfig, {
});

unitTestLibraryConfig.entry = {
  app: ['babel-polyfill', './dev/unit-test-library/main.js']
};

unitTestLibraryConfig.output = {
  path: path.join(__dirname, 'unit-test-dist'),
  filename: 'frontend-unit-test-library.js',
  libraryTarget: "umd"
};

module.exports = unitTestLibraryConfig;
