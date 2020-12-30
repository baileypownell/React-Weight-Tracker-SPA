const webpack = require('webpack');
const path = require('path'); // to get the current path
var dotenv = require('dotenv').config({path: __dirname + '/.env.development'});


module.exports = (env) => {
  return {
    entry: './src/index.js',
    output: {
      path: __dirname + '/dist',
      publicPath: '/',
      filename: 'bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            // Creates `style` nodes from JS strings
            'style-loader',
            // Translates CSS into CommonJS
            'css-loader',
            // Compiles Sass to CSS
            'sass-loader',
          ],
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        PRODUCTION: JSON.stringify(true),
        'process.env': {
          FIREBASE_API_KEY: JSON.stringify(process.env.FIREBASE_API_KEY)
        }
      }),
    ],
    devServer: {
      contentBase: __dirname,
      hot: true,
      historyApiFallback: true
  }
}
};
