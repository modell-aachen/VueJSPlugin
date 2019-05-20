const CompressionPlugin = require('compression-webpack-plugin');

const isProduction = () => process.env.NODE_ENV === 'production';

const outputDir = 'pub/System/VueJSPlugin';

const plugins = [];
if (isProduction()) {
    plugins.push(new CompressionPlugin({
        include: [/\.(?:js|css)$/],
    }));
}
const pages = {
    'VueJSPlugin': {
        entry: 'dev/main.js',
    },
};

module.exports = {
    configureWebpack: {
        plugins: plugins,
        optimization: {
            splitChunks: false,
        },
        output: {
            filename: '[name].js',
        },
        module: {
            noParse: [/vue-params|vue-i18next/],
        },
    },
    css: {
        extract: {
            filename: '[name].css',
        },
    },
    runtimeCompiler: true,
    chainWebpack: config => {
        config.module
            .rule('fonts')
            .use('url-loader')
            .tap(options => {
                opensansDir = `fonts/opensans/`;
                options.fallback.options = {
                    name: '[name].[ext]',
                    outputPath: `./${opensansDir}`,
                    publicPath: `/${outputDir}/${opensansDir}`,
                    useRelativePath: false,
                };
                return options;
            });

        config.module
            .rule('images')
            .uses
            .delete('url-loader');

        config.module
            .rule('images')
            .use('file-loader')
            .loader('file-loader')
            .tap(() => ({
                name: '[name].[ext]',
                outputPath: `./images/`,
                publicPath: `/${outputDir}/images/`,
                useRelativePath: false,
            }))
            .end();

        config.plugins.delete('hmr');
        for (const page in pages) {
            config.plugins.delete(`html-${page}`);
            config.plugins.delete(`preload-${page}`);
            config.plugins.delete(`prefetch-${page}`);
        }
    },
    productionSourceMap: true,
    outputDir: outputDir,
    publicPath: `/${outputDir}/`,
    pages,
};
