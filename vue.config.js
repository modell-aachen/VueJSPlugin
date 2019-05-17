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
    },
    css: {
        extract: {
            filename: '[name].css',
        },
    },
    chainWebpack: config => {
        config.module
            .rule('fonts')
            .use('url-loader')
            .tap(options => {
                options.fallback.options.name = 'fonts/[name].[ext]';
                return options;
            });

        config.module
            .rule('images')
            .use('url-loader')
            .tap(options => {
                options.fallback.options.name = 'images/[name].[ext]';
                return options;
            });

        config.module
            .rule('images')
            .use('file-loader')
            .loader('file-loader')
            .tap(options => ({ name: 'images/[name].[ext]' }))
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
