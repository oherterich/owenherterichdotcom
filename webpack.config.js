const webpack = require('webpack');
const path = require('path');
const dotenv = require('dotenv');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

const PATH_BUILD = path.join(__dirname, './public');
const PATH_SOURCE = path.join(__dirname, './source');
const PATH_SCRIPTS = path.join(PATH_SOURCE, 'js');
const PATH_STYLES = path.join(PATH_SOURCE, 'css');
const PATH_ENTRY = path.join(PATH_SCRIPTS, 'index.js');

const FILE_SIZE_INLINE_LIMIT = 2480; // in bytes
const LOCAL_IDENT_NAME = `${ !isProduction ? '[folder]_[local]_' : '' }[hash:base64:6]`;

dotenv.config();

// Common plugins
const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(nodeEnv),
    },
  }),
  new webpack.NamedModulesPlugin(),
  new ExtractTextPlugin({
    allChunks: true,
    ignoreOrder: true,
    filename: 'styles-[hash].css',
  }),
];

if (isProduction) {
  // Production plugins
  plugins.push(
    new webpack.LoaderOptionsPlugin({
      debug: false,
      minimize: isProduction,
      options: {
        context: __dirname,
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        comparisons: true,
        conditionals: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
        screw_ie8: true,
        sequences: true,
        unused: true,
        warnings: false,
      },
      sourceMap: false,
      output: {
        comments: false,
      },
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: `${ PATH_SOURCE }/index.html`,
      title: 'Owen Herterich',
      filename: 'index.html',
    })
  );
} else {
  // Non-production plugins
  plugins.push(
    new HtmlWebpackPlugin({
      inject: true,
      template: `${ PATH_SOURCE }/index.html`,
      title: 'Owen Herterich',
      filename: 'index.html',
    })
  );
}

// Common rules
const rules = [
  {
    enforce: 'pre',
    test: /\.(js|jsx)$/,
    include: PATH_SCRIPTS,
    loader: 'eslint-loader',
  },
  {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        cacheDirectory: !isProduction,
      },
    },
  },
  {
    test: /routeCodes\.json$/,
    use: 'json-loader',
  },
  {
    test: /\.(png|gif|jpg|svg)$/,
    use: {
      loader: `url-loader?limit=${ FILE_SIZE_INLINE_LIMIT }&name=[name].[ext]`,
    },
  },
  {
    test: /\.(eot|ttf|woff|woff2)$/,
    loader: `file-loader?limit=${ FILE_SIZE_INLINE_LIMIT }&name=[name].[ext]`,
  },
  {
    test: /\.css$/,
    loader: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        {
          loader: 'css-loader',
          options: {
            localIdentName: LOCAL_IDENT_NAME,
            import: true,
            importLoaders: 1,
            modules: true,
            sourceMap: !isProduction,
            url: true,
          },
        },
        'postcss-loader',
      ],
    }),
  },
];

module.exports = {
  entry: {
    main: PATH_ENTRY,
  },
  output: {
    filename: 'app-[hash].js',
    path: PATH_BUILD,
    publicPath: '/',
    libraryTarget: 'umd',
  },
  module: {
    rules,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      'node_modules',
      PATH_SCRIPTS,
      PATH_STYLES,
      PATH_SOURCE,
    ],
  },
  plugins,
  devtool: isProduction ? 'cheap-module-source-map' : 'source-map',
  context: PATH_SOURCE,
  devServer: {
    compress: isProduction,
    contentBase: './src',
    disableHostCheck: true,
    historyApiFallback: true,
    host: '0.0.0.0',
    inline: !isProduction,
    port: 3000,
    stats: {
      assets: true,
      assetsSort: 'field',
      children: true,
      chunks: false,
      chunksSort: 'field',
      colors: true,
      errorDetails: true,
      errors: true,
      hash: false,
      modules: false,
      modulesSort: 'field',
      publicPath: false,
      timings: true,
      version: false,
      warnings: true,
    },
  },
};
