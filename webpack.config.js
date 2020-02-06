const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
require("babel-polyfill");

module.exports = {
  entry: 
  {
    main: ["babel-polyfill", "./src/index.js"],
  },
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "[name].bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,  // исключаем из обработки папку node_modules
        loader: "babel-loader",     // определяем загрузчик
        options: {
            cacheDirectory: true,
            presets:["@babel/preset-env", "@babel/preset-react"]    // используемые плагины
        }
      },
      // {
      //   test: /\.css$/,
      //   use: ["style-loader", "css-loader"]
      // },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('style.css'),
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    })
  ]
};
