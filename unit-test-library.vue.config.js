const outputDir = 'unit-test-dist';

const pages = {
    'frontend-unit-test-library': {
        entry: 'dev/unit-test-library/main.js',
    },
};

module.exports = {
    outputDir,
    publicPath: `/${outputDir}/`,
    configureWebpack: {
        optimization: {
            splitChunks: false,
        },
        output: {
            libraryTarget: 'umd',
            filename: '[name].js',
        },
        module: {
            noParse: [/vue-params|vue-i18next/],
        },
    },
    css: {
        extract: {
            filename: 'VueJSPlugin.min.css',
        },
    },
    pages,
    chainWebpack: config => {
        config.plugins.delete('hmr');
        for (const page in pages) {
            config.plugins.delete(`html-${page}`);
            config.plugins.delete(`preload-${page}`);
            config.plugins.delete(`prefetch-${page}`);
        }
    },
    productionSourceMap: false,
};
