const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = env => {
    const mode = env.dev  ? 'development' :
                 env.prod ? 'production'  :
                            ''
    
    if (mode === '') {
        throw 'must specify --env.dev or --env.prod'
    }

    return {
        mode: mode,
        entry: './src/main.ts',
        output: {
            path: path.resolve(__dirname, `./dist/${mode}/`),
            publicPath: '',
            filename: 'vision-clock.js'
        },
        resolve: {
            extensions: ['.js', '.ts', '.json'],
            alias: {
                '@': path.resolve(__dirname, './src/')
            }
        },
        devServer: {
            contentBase: './dist/development/'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.ts$/,
                    loaders: [
                        'babel-loader',
                        'ts-loader'
                    ]
                },
                {
                    test: /\.css$/,
                    loaders: [
                        'style-loader?sourceMap',
                        'css-loader?sourceMap'
                    ]
                },
                {
                    test: /\.styl(us)?$/,
                    loaders: [
                        'style-loader?sourceMap',
                        'css-loader?sourceMap',
                        'stylus-loader?sourceMap'
                    ]
                },
                {
                    test: /\.(txt|vert|frag)$/,
                    loader: 'raw-loader'
                },
                {
                    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'img/[name].[hash:7].[ext]'
                    }
                },
                {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'fonts/[name].[hash:7].[ext]'
                    }
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './public/index.html'
            }),
            new CopyWebpackPlugin([
                {
                    from: './public/static/*',
                    to: './static/[name].[ext]'
                },
                {
                    from: './public/css/*',
                    to: './css/[name].[ext]'
                },
                {
                    from: './public/js/*',
                    to: './js/[name].[ext]'
                }
            ])
        ]
    }
}
