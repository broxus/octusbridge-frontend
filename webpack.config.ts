import CopyWebpackPlugin from 'copy-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import webpack from 'webpack'
import { Configuration as DevServerConfiguration } from 'webpack-dev-server'


type WebpackConfig = webpack.Configuration & { devServer?: DevServerConfiguration }


export default (_: any, options: any): WebpackConfig => {
    const host = process.env.HOST ?? '0.0.0.0'
    const port = parseInt(process.env.PORT ?? '3000', 10)
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
        assetModuleFilename: 'assets/[hash][ext]',
        filename: 'js/[name]-[contenthash:6].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        clean: true,
    }

    if (isDevelopment) {
        config.output.pathinfo = false
    }

    /*
     * -------------------------------------------------------------
     * Optimization
     * -------------------------------------------------------------
     */

    config.optimization = isDevelopment ? {
        removeAvailableModules: false,
        removeEmptyChunks: false,
        runtimeChunk: true,
        splitChunks: false,
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
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser',
        }),
    ]

    if (isDevelopment && showErrors) {
        config.plugins.push(new ForkTsCheckerWebpackPlugin({
            typescript: {
                configFile: path.resolve('tsconfig.json')
            }
        }))
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
                        from: 'favicon.{ico,svg}',
                    },
                    {
                        context: 'public',
                        from: 'meta-image.png',
                        to: 'assets/meta-image.png'
                    },
                    {
                        context: 'public',
                        from: 'assets/currencies.json',
                        to: 'assets/currencies.json'
                    },
                    {
                        context: 'public',
                        from: 'assets/icons',
                        to: 'assets/icons'
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
                exclude: [/node_modules/],
                test: /\.([jt]sx?)?$/,
                use: isProduction ? 'babel-loader' : 'swc-loader',
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
                test: /\.(png|jpe?g|gif|webp|svg?)$/,
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
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

        extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss', '.css'],

        fallback: {
            assert: require.resolve('assert'),
            buffer: require.resolve('buffer'),
            crypto: require.resolve('crypto-browserify'),
            http: require.resolve('stream-http'),
            https: require.resolve('https-browserify'),
            os: require.resolve('os-browserify/browser'),
            process: require.resolve('process/browser'),
            stream: require.resolve('stream-browserify'),
            url: require.resolve('url'),
            util: require.resolve('util'),
        },

        modules: [
            path.resolve(__dirname, 'src'),
            'node_modules',
        ],

        symlinks: false,
    }

    /*
     * -------------------------------------------------------------
     * Devtool
     * -------------------------------------------------------------
     */

    if (isDevelopment) {
        config.devtool = 'eval-source-map'
    }

    /*
     * -------------------------------------------------------------
     * Dev Server
     * -------------------------------------------------------------
     */

    if (isDevelopment) {
        config.devServer = {
            host,
            port,
            historyApiFallback: true,
            liveReload: false,
            hot: false,
            client: {
                overlay: {
                    errors: true,
                    warnings: false,
                },
                reconnect: 10,
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
            aggregateTimeout: 500,
            ignored: /node_modules/,
            poll: 180,
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
