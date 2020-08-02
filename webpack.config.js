const webpack = require('webpack');
const path = require('path');
require('dotenv').config();

module.exports = (env) => {
  const isProduction = env === 'production';

  return {
    mode: 'development',
    entry: ['babel-polyfill', './src/app.js'],
    output: {
      path: path.join(__dirname, 'public', 'dist'),
      filename: 'bundle.js'
    },
    module: {
      rules: [
        {
          loader: 'babel-loader',
          test: /\.js$/,
          exclude: /node_modules/
        },
        {
          test: /\.s?css$/,
          use: ['style-loader', 'css-loader', 'sass-loader']
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          loader: 'file-loader',
          options: {
            publicPath: 'dist',
            // outputPath: 'images',
            name: 'assets/images/[name]_[md5:hash:base64:10].[ext]'
          }
        },
        {
          test: /\.(woff|woff2|ttf|otf|eot)$/,
          loader: 'file-loader',
          options: {
            publicPath: 'dist',
            name: 'assets/fonts/[name]_[md5:hash:base64:10].[ext]'
          }
        }
      ]
    },
    devtool: isProduction ? 'source-map' : 'inline-source-map',
    devServer: {
      contentBase: path.join(__dirname, 'public'),
      historyApiFallback: true,
      publicPath: '/dist/',
      open: false
    },
    plugins: [
      new webpack.DefinePlugin({
        API_ENDPOINT: JSON.stringify(process.env.API_ENDPOINT)
      })
    ]
  };
};
