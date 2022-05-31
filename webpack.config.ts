import CopyWebpackPlugin from 'copy-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import webpack from 'webpack'
import { Configuration as DevServerConfiguration } from 'webpack-dev-server'


type WebpackConfig = webpack.Configuration & { devServer?: DevServerConfiguration }


export default (_: any, options: any): WebpackConfig => {
    const HOST = process.env.HOST ?? '0.0.0.0'
    const PORT = parseInt(process.env.PORT ?? '3000', 10)
    const showErrors = process.env.ERRORS

    const isProduction = options.mode === 'production'
    const isDevelopment = options.mode === 'development'

    const config: WebpackConfig = {}

    /*
     * -------------------------------------------------------------
     * Entry points
     * -------------------------------------------------------------
     */

    config.entry = {
        index: path.resolve(__dirname, 'src/index'),
    }

    /*
     * -------------------------------------------------------------
     * Output
     * -------------------------------------------------------------
     */

    config.output = {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name]-[contenthash:6].js',
        publicPath: '/',
        clean: true,
    }

    /*
     * -------------------------------------------------------------
     * Optimization
     * -------------------------------------------------------------
     */

    config.optimization = isDevelopment ? {
        splitChunks: {
            cacheGroups: {
                default: false,
                vendors: false,
            },
        },
    } : {
        splitChunks: {
            chunks: (chunk) => !/^(polyfills|pages|modules)$/.test(chunk.name),
            cacheGroups: {
                vendor: {
                    chunks: 'all',
                    name: 'vendors',
                    test: /(?<!node_modules.*)[\\/]node_modules[\\/]/,
                    priority: 40,
                    enforce: true,
                },
                common: {
                    name: 'commons',
                    test: /(common|layout|hooks|misc)/,
                    minChunks: 1,
                    priority: 30,
                    reuseExistingChunk: true,
                },
                default: false,
                vendors: false,
            },
            maxInitialRequests: 10,
            minSize: 30000,
        },
    }

    /*
     * -------------------------------------------------------------
     * Plugins
     * -------------------------------------------------------------
     */

    config.plugins = [
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
    ]

    if (isDevelopment && showErrors) {
        config.plugins.push(new ForkTsCheckerWebpackPlugin())
    }

    config.plugins.push(
        new HtmlWebpackPlugin({
            title: 'Cross-Chain Transactions | Octus Bridge',
            favicon: 'public/favicon.svg',
            filename: path.resolve(__dirname, 'dist/index.html'),
            template: 'public/index.html',
            inject: false,
        }),
    )

    if (isProduction) {
        config.plugins.push(
            new MiniCssExtractPlugin({
                filename: 'css/[name]-[contenthash:6].css',
                ignoreOrder: true,
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        context: 'public',
                        from: 'favicon.ico',
                    },
                    {
                        context: 'public',
                        from: 'favicon.svg',
                    },
                    {
                        context: 'public',
                        from: 'meta-image.png',
                        to: 'assets/meta-image.png'
                    },
                ],
            }),
        )
    }

    /*
     * -------------------------------------------------------------
     * Module
     * -------------------------------------------------------------
     */

    config.module = {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.s[ac]ss$/i,
                exclude: /\.module.(s[ac]ss)$/,
                use: [
                    isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.module\.s[ac]ss$/,
                use: [
                    isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: isProduction
                                    ? "[hash:base64:15]"
                                    : "[path][name]__[local]--[hash:base64:5]",
                            },
                        },
                    },
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|jpe?g|gif|webp|svg|woff2?)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        publicPath: '/assets/',
                        outputPath: 'assets/',
                        esModule: false,
                        name: '[hash:16].[ext]',
                    },
                },
            },
        ],
    }

    /*
     * -------------------------------------------------------------
     * Resolve
     * -------------------------------------------------------------
     */

    config.resolve = {
        alias: {
            '@': path.resolve(__dirname, 'src')
        },

        extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts', '.scss', '.css'],

        fallback: {
            assert: require.resolve('assert'),
            buffer: require.resolve('buffer'),
            // console: require.resolve('console-browserify'),
            // constants: require.resolve('constants-browserify'),
            crypto: require.resolve('crypto-browserify'),
            // domain: require.resolve('domain-browser'),
            // events: require.resolve('events'),
            http: require.resolve('stream-http'),
            https: require.resolve('https-browserify'),
            os: require.resolve('os-browserify/browser'),
            // path: require.resolve('path-browserify'),
            // punycode: require.resolve('punycode'),
            process: require.resolve('process/browser'),
            // querystring: require.resolve('querystring-es3'),
            stream: require.resolve('stream-browserify'),
            // string_decoder: require.resolve('string_decoder'),
            // sys: require.resolve('util'),
            // timers: require.resolve('timers-browserify'),
            // tty: require.resolve('tty-browserify'),
            url: require.resolve('url'),
            util: require.resolve('util'),
            // vm: require.resolve('vm-browserify'),
            // zlib: require.resolve('browserify-zlib'),
        },

        modules: [
            path.resolve(__dirname, 'src'),
            'node_modules',
        ],
    }

    /*
     * -------------------------------------------------------------
     * Devtool
     * -------------------------------------------------------------
     */

    if (isDevelopment) {
        config.devtool = 'inline-source-map'
    }

    /*
     * -------------------------------------------------------------
     * Dev Server
     * -------------------------------------------------------------
     */

    if (isDevelopment) {
        config.devServer = {
            host: HOST,
            port: PORT,
            historyApiFallback: true,
            liveReload: false,
            hot: false,
            client: {
                overlay: false,
            },
        }
    }

    /*
     * -------------------------------------------------------------
     * Watch
     * -------------------------------------------------------------
     */

    if (isDevelopment) {
        config.watchOptions = {
            aggregateTimeout: 100,
            ignored: /node_modules/,
        }
    }

    /*
     * -------------------------------------------------------------
     * Stats
     * -------------------------------------------------------------
     */

    config.stats = 'errors-warnings'

    return config
}
