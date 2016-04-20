'use strict'
let SimpleBase = require('./SimpleBase.js')

function createSimpleComponent(methods) {
  let SimpleComponent = function(props, ...children) {
    if (!this || !(this instanceof SimpleComponent)) {
      return new SimpleComponent(props)
    }
    SimpleBase.call(this)

    if (children) {
      this.children = children
    }

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

function Component(arg) {
  if (arg.constructor === Function) {
    return createStatelessSimpleComponent(arg)
  } else {
    return createSimpleComponent(arg)
  }
}

module.exports = Component
