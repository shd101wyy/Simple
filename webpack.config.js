'use strict'

let path = require('path')
module.exports = {
  entry: path.resolve(__dirname, './lib/Simple.js'),
  output: {
    path: path.resolve(__dirname, './'),
    filename: 'Simple.js',
    library: 'Simple',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
       {
         test: /\.js$/,
         include: [path.resolve(__dirname, './lib')],
         exclude: [/node_modules/],
         loader: 'babel',
         query: {
           presets: ['es2015']
         }
       },
    ]
  }
}
