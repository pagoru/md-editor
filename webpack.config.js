var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: "./src/entry.js",
  output: {
    path: __dirname,
    filename: "app/js/bundle.js"
  },
  "target": "atom",
  plugins: [
    new webpack.ProvidePlugin({
      hljs: "hightlightjs",
      markdownit: "markdownit",
      CodeMirror: "codemirrorjs"
    }),
/*
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      mangle: false,
      minimize: false,
      compress: {
        drop_debugger: false,
        warnings: false,
        drop_console: false,
        warnings: false,
        dead_code: false,
        unused: false,
        booleans: false,
        evaluate: false
      }
    }),
*/
    new ExtractTextPlugin("./app/css/style.css", {
      allChunks: true
    })
  ],
  module: {
    preLoaders: [
      { test: /\.json$/, loader: 'json'},
    ],
    loaders: [
      { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")//loader: "style!css"
      }
    ]
  },
  resolve: {
    modulesDirectories: ["node_modules"],
    alias: {
      hightlightjs: "highlight.js/lib/highlight.js",
      markdownit: "markdown-it/index.js",
      codemirrorjs: "codemirror/lib/codemirror.js",
      codemirrorjs_overlay: "codemirror/addon/mode/overlay.js",
      codemirrorjs_javascript: "codemirror/mode/javascript/javascript.js",
      codemirrorjs_gfm: "codemirror/mode/gfm/gfm.js",
      codemirrorjs_markdown: "codemirror/mode/markdown/markdown.js"
    }
  }
}