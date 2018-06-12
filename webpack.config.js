var webpack = require("webpack");
var path = require("path");

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

var DIST_DIR = path.resolve(__dirname, "dist");
var SRC_DIR = path.resolve(__dirname, "src");

var config = {
	entry : SRC_DIR + '/app/index.js', 
	output : {
		path: DIST_DIR+'/app',
		filename: 'bundle.js', 
		publicPath: '/app'
	},
	module: {
		loaders : [
			{
				test: /\.js/,
				include: SRC_DIR,
				loader: "babel-loader",
				query: {
					presets: ["env", "react", "stage-2"]
				}
			},
			{
				test: /\.css/,
				include: SRC_DIR,
				loader: "style-loader!css-loader"
			},
			{
				test: /\.css/,
				include: /node_module/,
				loader: "style-loader!css-loader"
			},
			{
				test: /\.scss$/,
				use: [
					{
						loader: "style-loader"
					},
				  	{
						loader: "css-loader",
						options: {
						alias: {
							"../fonts/bootstrap": "bootstrap-sass/assets/fonts/bootstrap"
						}
						}
					}
				]
			},
			{
		        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
		        include: SRC_DIR,
		        loader: 'url-loader'
			},
			{
		        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
		        include: /node_module/,
		        loader: 'url-loader'
		    },
		    {
				test: /\.html/,
				include: SRC_DIR,
				exclude: SRC_DIR+'/app/fonts/fontawesome/',
				loader: 'html-loader'
			  },
			  {
				test: /\.html/,
				include: SRC_DIR,
				exclude: SRC_DIR+'/app/fonts/material-design-iconic-font/',
				loader: 'html-loader'
			  },
			  {
				test: /\.html/,
				include: SRC_DIR,
				exclude: SRC_DIR+'/app/fonts/simple-line-icons/',
				loader: 'html-loader'
			  },
			  {
				test: /\.html/,
				include: SRC_DIR+'/app/fonts/fontawesome/',
				loader: 'url-loader'
			  },
			  {
				test: /\.html/,
				include: SRC_DIR+'/app/fonts/material-design-iconic-font/',
				loader: 'url-loader'
			  },
			  {
				test: /\.html/,
				include: SRC_DIR+'/app/fonts/simple-line-icons/',
				loader: 'url-loader'
			  },
		]
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			"window.jQuery": "jquery", 
			moment: 'moment'
		}),
		new webpack.optimize.UglifyJsPlugin({
			test: /\.js?$/,
			include: DIST_DIR,
			uglifyOptions: {
			  ecma: 5
			},
		}),
		new webpack.DefinePlugin({
			'process.env': {
			'NODE_ENV': JSON.stringify("production")
		}})
	]
};

module.exports = config;