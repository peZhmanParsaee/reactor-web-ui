const webpack = require('webpack');
const path = require('path');
require('dotenv').config();

module.exports = (env) => {
  const isProduction = env === 'production';

  return {
    "mode": "development",
    entry: ["babel-polyfill", './src/app.js'],
    output: {
      path: path.join(__dirname, 'public', 'dist'),
      filename: 'bundle.js'
    },
    module: {
      rules: [{
        loader: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/
      }, {
        test: /\.s?css$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }, 
    ]
    },
    devtool: isProduction ? 'source-map' : 'inline-source-map',
    devServer: {
      contentBase: path.join(__dirname, 'public'),
      historyApiFallback: true,
      publicPath: '/dist/'
    },
    plugins: [
      new webpack.DefinePlugin({
        API_ENDPOINT: JSON.stringify(process.env.API_ENDPOINT)
      })
    ]
  };

}
