const path = require('path');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const lightningcss = require('lightningcss');
const browserslist = require('browserslist');
const Dotenv = require('dotenv-webpack');
const ESLintPlugin = require('eslint-webpack-plugin');

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
      '@router': path.resolve(__dirname, 'src/router'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@types': path.resolve(__dirname, 'src/types'),
      '@static': path.resolve(__dirname, 'static/'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@templates': path.resolve(__dirname, 'src/templates'),
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
    new ESLintPlugin({
      extensions: ['js', 'jsx', 'ts', 'tsx'],
    }),
 ],
};
