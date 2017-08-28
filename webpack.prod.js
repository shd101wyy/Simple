const webpack = require('webpack')
const path = require('path')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, './src/Simple.ts'),
  output: {
    path: path.resolve(__dirname, './out'),
    filename: 'Simple.js',
    library: 'Simple',
    libraryTarget: 'umd'
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js'] // note if using webpack 1 you'd also need a '' in the array as well
  },
  module: {
    loaders: [ // loaders will work with webpack 1 or 2; but will be renamed "rules" in future
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      // run `babel-loader` after `ts-loader`
      { test: /\.tsx?$/, loader: 'babel-loader!ts-loader' }    
    ]
  },
  devtool: 'cheap-module-source-map',  
  plugins: [
    new UglifyJSPlugin(),
    new webpack.DefinePlugin({
          'process.env': {
            'NODE_ENV': JSON.stringify('production')
          }
        })
  ]
}
