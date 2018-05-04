const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const NODE_ENV = process.env.NODE_ENV;
const IS_PRODUCTION = NODE_ENV === "production";

module.exports = {
	entry: ['./src/js/init.js', './src/style/index.scss'],
	output :{
		path: __dirname + '/dist/js',
        filename: 'bundle.js',
	},
	module: {
		rules: [
			{
                test: /\.js?$/,
                exclude: /\/node_modules\//,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015','stage-0','env','react']
                    }
                }
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: '../fonts/'
                    }
                }]
            },
            {
                test: /\.scss$/,
                exclude: /\/node_modules\//,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize:  IS_PRODUCTION,
                                sourceMap: !IS_PRODUCTION
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: { sourceMap: !IS_PRODUCTION }
                        }
                    ]
                })
            },
            {
                test: /\.(png|jp(e*)g|svg)$/,
                exclude: /\/node_modules\//,
                use: [{
                    loader: 'url-loader',
                }]
            },
		]
	},
    devtool: !IS_PRODUCTION ? 'source-map' : 'null',
    resolve: {
        extensions: [' ', '.js', '.scss'],
    },
	plugins: [
        new ExtractTextPlugin('../css/main.css'),
        new webpack.DefinePlugin ({
            'process.env.NODE_ENV': JSON.stringify( NODE_ENV )
        }),
    ],
	watch: !IS_PRODUCTION,
};

if( IS_PRODUCTION ) {
    module.exports.plugins.push(
        new UglifyJsPlugin({
            uglifyOptions:{
                minimize: true
            }
        })
    )
}