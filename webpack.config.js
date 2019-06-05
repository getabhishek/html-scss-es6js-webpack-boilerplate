const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = env => {
    return {
        mode: (env === 'dev') ? "development" : "production",
        entry: {
            main: './src/index.js'
        },
        output: (env === 'dev') ?
            {
                filename: "[name].bundle.js",
                path: path.resolve(__dirname, 'dist')
            } : {
                filename: "[name].[contentHash].bundle.js",
                path: path.resolve(__dirname, 'build')
            },
        module: {
            rules: [
                {
                    test: /\.html$/,
                    use: ["html-loader"]
                },
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                },
                {
                    test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[path][name].[ext]',
                            },
                        },
                    ],
                },
                (env === 'dev') ?
                    {
                        test: /\.scss$/,
                        use: [
                            "style-loader",
                            {
                                loader: 'css-loader',
                                options: {
                                    importLoaders: 1,
                                }
                            },
                            {
                                loader: 'postcss-loader'
                            },
                            {
                                loader: "sass-loader",
                                options: {
                                    implementation: require("sass")
                                }
                            }
                        ]
                    } :
                    {
                        test: /\.scss$/,
                        use: [
                            MiniCssExtractPlugin.loader,
                            {
                                loader: 'css-loader',
                                options: {
                                    importLoaders: 1,
                                }
                            },
                            {
                                loader: 'postcss-loader'
                            },
                            {
                                loader: "sass-loader",
                                options: {
                                    implementation: require("sass")
                                }
                            }
                        ]
                    }
            ]
        },
        plugins: (env === 'dev') ?
            [
                new HtmlWebpackPlugin({
                    filename: 'index.html',
                    favicon: 'src/favicon.ico',
                    template: 'src/index.html'
                })
            ] : [
                new HtmlWebpackPlugin({
                    filename: 'index.html',
                    favicon: 'src/favicon.ico',
                    template: 'src/index.html',
                    minify: {
                        removeAttributeQuotes: true,
                        collapseWhitespace: true,
                        removeComments: true
                    }
                }),
                new MiniCssExtractPlugin({ filename: "[name].[contentHash].css" }),
                new CleanWebpackPlugin()
            ],
        devServer: {
            contentBase: [path.join(__dirname, 'dist')],
            port: 4040,
            hot: true
        }
    };
};