'use strict'

let Component = require('./Component.js')
let Emitter = require('./Emitter.js')

let Simple = {
  Component,
  Emitter
}

if (typeof(window) !== 'undefined') {
  window.Simple = Simple
}

if (typeof(module) !== 'undefined') {
  module.exports = Simple
}

export default Simple
export {Component, Emitter}
