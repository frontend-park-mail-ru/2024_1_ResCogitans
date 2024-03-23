const path = require('path');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const lightningcss = require('lightningcss');
const browserslist = require('browserslist');
const Dotenv = require('dotenv-webpack');

module.exports = (env, argv) => {
 const isProduction = argv.mode === 'production';

 return {
    mode: isProduction ? 'production' : 'development',
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'public'),
    },
    module: {
      rules: [
        {
          test: /\.hbs$/,
          loader: 'handlebars-loader',
        },
      ],
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
      new Dotenv({
        path: isProduction ? '.env.production' : '.env.development',
      }),
    ],
 };
};
