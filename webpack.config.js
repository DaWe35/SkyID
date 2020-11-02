const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	entry: {
		skyid: '/src/skyid.js',
		test: '/src/test.js',
		connect: '/src/connect.js'
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].js'
	},
	optimization: {
		// minimize: true,
		minimize: false,
		minimizer: [
			new TerserPlugin({
				extractComments: false,
			}),
		],
	}
}