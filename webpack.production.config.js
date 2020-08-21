var path = require('path');
const HtmlWebpackPlugin =  require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const zlib = require('zlib');
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = {
    entry : './app/index.js',
    output : {
        path : path.resolve(__dirname , 'dist'),
        filename: '[name].[chunkhash:4].js',
        publicPath: '/'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module : {
        rules : [
            {test : /\.(js)$/, use:'babel-loader'},
            {test : /\.css$/, 
                use: [
                    { loader: MiniCssExtractPlugin.loader, },
                    "css-loader"
                    ]
            },
        ]
    },
    mode:'production',
    plugins : [
        new MiniCssExtractPlugin({filename: `components/[name].css`}),
        new HtmlWebpackPlugin ({
            template : 'app/index.html'
        }),
        new CompressionPlugin({
            filename: '[path].gz',
            algorithm: 'gzip',
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.8,
        }),
        new CompressionPlugin({
            filename: '[path].br',
            algorithm: 'brotliCompress',
            test: /\.(js|css|html|svg)$/,
            compressionOptions: {
                level: 11,
            },
            threshold: 10240,
            minRatio: 0.8,
        })
    ],
    resolve: {
        alias: {
          react: path.resolve(__dirname, 'node_modules/react')
        }
    }
}
