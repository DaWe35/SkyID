const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	entry: {
		main: '/src/main.js',
		connect: '/src/connect.js',
		skyid_client: '/src/skyid_client.js'
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].js'
	},
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				extractComments: false,
			}),
		],
	}
}