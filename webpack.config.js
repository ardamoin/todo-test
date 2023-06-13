const path = require('path');

module.exports = {
  entry: {
    index: './src/index.js',
    nav: './src/nav.js',
    items: './src/items.js',
    events: './src/events.js',
    pages: './src/pages.js',
    storage: './src/storage.js',
},
devtool: 'inline-source-map',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'docs'),
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },

  mode: 'production',
};