'use strict'

let SimpleClass = require('./SimpleClass.js')

function Simple(methods) {
  let SimpleObject = function(props) {
    if (!this || !(this instanceof SimpleObject)) {
      return new SimpleObject(props)
    }
    SimpleClass.call(this)
    this.props = props || {}

    this.init()
  }

  SimpleObject.prototype = Object.create(SimpleClass.prototype)

  for (let key in methods) {
    // if (methods.hasOwnProperty(key)) {
    if (key === 'state') {
      SimpleObject.prototype.getInitialState = function() {
        return Object.assign({}, methods.state)
      }
    } else {
      SimpleObject.prototype[key] = methods[key]
    }
    // }
  }

  SimpleObject.prototype.constructor = SimpleObject

  return SimpleObject
}

if (module) {
  module.exports = Simple
}

window.Simple = Simple
