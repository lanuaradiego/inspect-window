const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: './src/index.ts',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'inspect-window.js',
		libraryTarget: 'var',
		library: 'inspectWindow'
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	plugins: [
		new webpack.BannerPlugin({
			banner: () => {
				const licenseContent = require('fs').readFileSync('./LICENSE', 'utf8');
				return "/**\n@license\n" + licenseContent + "*/";
			},
			raw: true,
			entryOnly: true,
			stage: webpack.Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
		})
	],
};