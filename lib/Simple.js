'use strict'

let SimpleBase = require('./SimpleBase.js')
let Emitter = require('./Emitter.js')

function createSimpleComponent(methods) {
  let SimpleComponent = function(props) {
    if (!this || !(this instanceof SimpleComponent)) {
      return new SimpleComponent(props)
    }
    SimpleBase.call(this)

    if (props) {
      Object.assign(this.props, props)
    }

    this.init()
    this.forceUpdate()      // render element
    this.componentDidMount()
  }

  SimpleComponent.prototype = Object.create(SimpleBase.prototype)

  for (let key in methods) {
    SimpleComponent.prototype[key] = methods[key]
  }

  SimpleComponent.prototype.constructor = SimpleComponent

  return SimpleComponent
}

function createStatelessSimpleComponent(func) {
  let SimpleComponent = function(props) {
    if (!this || (!this instanceof SimpleComponent)) {
      return new SimpleComponent(props)
    }
    SimpleBase.call(this)

    this.toDOM(func.call(this, props)) // render element
  }
  SimpleComponent.prototype = Object.create(SimpleBase.prototype)

  return SimpleComponent
}

function Simple(arg) {
  if (arg.constructor === Function) {
    return createStatelessSimpleComponent(arg)
  } else {
    return createSimpleComponent(arg)
  }
}


module.exports = {
  Simple: Simple,
  Emitter: Emitter
}

window.Simple = Simple
window.Emitter = Emitter
