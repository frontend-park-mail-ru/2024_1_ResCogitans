const path = require('path');
const webpack = require('webpack');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const lightningcss = require('lightningcss');
const browserslist = require('browserslist');
const Dotenv = require('dotenv-webpack');

module.exports = {
 mode: 'development',
 entry: './src/index.ts',
 output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
 },
 module: {
    rules: [
      {
        test: /\.hbs/,
        loader: 'handlebars-loader',
      },
      {
        test: /\.tsx?$/,
        use: 'babel-loader', 
        exclude: /node_modules/,
      },
    ],
 },
 resolve: {
    extensions: ['.hbs', '.ts', '.tsx', '.js'], 
    alias: {
      templates: path.resolve(__dirname, 'src/templates'),
    },    
 },
 optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin({
        minify: CssMinimizerPlugin.lightningCssMinify,
        minimizerOptions: {
          targets: lightningcss.browserslistToTargets(browserslist('>= 0.25%')),
        },
      }),
    ],
 },
 plugins: [
    new Dotenv(),
 ],
};
