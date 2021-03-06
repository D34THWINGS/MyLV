const {
  ContextReplacementPlugin,
  DefinePlugin,
  IgnorePlugin,
  NamedModulesPlugin,
  EnvironmentPlugin,
} = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const SentryCliPlugin = require('@sentry/webpack-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const OfflinePlugin = require('offline-plugin')
const path = require('path')

const { version } = require('./package')

module.exports = (env = {}) => ({
  entry: './index.jsx',
  context: path.resolve(__dirname, './packages/app'),
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.mjs'],
  },
  output: {
    filename: '[name]-[hash].js',
    publicPath: '/',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    minimizer: [new TerserPlugin({
      cache: true,
      parallel: true,
    })],
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: true,
  },
  module: {
    strictExportPresence: true,
    rules: [
      { parser: { requireEnsure: false } },
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            cacheCompression: false,
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(woff2?|otf|ttf)$/,
        use: { loader: 'file-loader', options: { name: 'fonts/[name]-[hash].[ext]' } },
      },
      {
        test: /\.(svg|png|jpg|jpeg|gif)$/,
        use: { loader: 'url-loader', options: { limit: 1, name: '[path][name]-[hash].[ext]' } },
      },
    ],
  },
  mode: env.production ? 'production' : 'development',
  devtool: env.production ? 'source-map' : 'cheap-module-source-map',
  devServer: {
    contentBase: './dist',
    hot: true,
    port: 3000,
    historyApiFallback: true,
    proxy: {
      '/api/*': 'http://localhost:8001',
    },
  },
  plugins: [
    ...(env.production ? [
      new SentryCliPlugin({
        include: path.resolve(__dirname, './dist'),
        release: version,
        configFile: path.resolve(__dirname, './.sentryclirc'),
      }),
    ] : [
      new NamedModulesPlugin(),
    ]),
    new CleanWebpackPlugin(['dist']),
    new ContextReplacementPlugin(/moment[/\\]locale$/, /fr/),
    new IgnorePlugin(/node-fetch/),
    new FaviconsWebpackPlugin('./assets/images/logo-my-lv-icon.png'),
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    new WebpackPwaManifest({
      name: 'MyLV',
      short_name: 'MyLV',
      description: 'Application de gestion des CRA/Congés.',
      background_color: '#2196f3',
      theme_color: '#2196f3',
      icons: [
        {
          src: path.resolve('packages/app/assets/images/logo-my-lv-icon.png'),
          sizes: [96, 128, 192, 256, 384, 512],
        },
      ],
    }),
    new OfflinePlugin({
      autoUpdate: true,
      ServiceWorker: {
        events: true,
        entry: './modules/serviceWorker/sw.js',
      },
    }),
    new EnvironmentPlugin(['LVCONNECT_APP_ID', 'WEB_PUSH_PUBLIC_KEY']),
    new DefinePlugin({
      'process.env.APP_ENV': JSON.stringify(process.env.APP_ENV || process.env.NODE_ENV),
      'process.env.APP_VERSION': `"${version}"`,
    }),
  ],
})
