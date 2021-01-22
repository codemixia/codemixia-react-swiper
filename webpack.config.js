const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: 'index.js',
    library: 'codemixia-react-swiper',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: path.join(__dirname),
        exclude: /(node_modules)|(build)/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
