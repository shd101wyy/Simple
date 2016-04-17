'use strict'

let SimpleClass = require('./SimpleClass.js')

function Simple(methods) {
  let SimpleObject = function(props) {
    if (!this || !(this instanceof SimpleObject)) {
      return new SimpleObject(props)
    }
    SimpleClass.call(this)
    this.props = props || {}
  }

  SimpleObject.prototype = Object.assign(SimpleClass.prototype, methods)

  SimpleObject.prototype.constructor = SimpleObject

  return SimpleObject
}

Simple.render = function(simpleObject, parent) {
  if (simpleObject && simpleObject.element) {
    parent.appendChild(simpleObject)
  }
}

if (module) {
  module.exports = Simple
}

window.Simple = Simple
