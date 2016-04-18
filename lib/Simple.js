'use strict'

let SimpleBase = require('./SimpleBase.js')

function Simple(methods) {

  let SimpleComponent = function(props) {
    if (!this || !(this instanceof SimpleComponent)) {
      return new SimpleComponent(props)
    }
    SimpleBase.call(this)

    this.props = Object.assign(this.props, props) || {}

    this.init = this.init.bind(this) // bind self

    /*
    for (let key in this.__proto__) { // autobind
      if (this.__proto__.hasOwnProperty(key) && !this.__proto__.__proto__[key]) {
        this[key] = this.__proto__[key].bind(this)
      }
    }*/

    this.init()
    this.forceUpdate()      // render element
    this.componentDidMount()
  }

  SimpleComponent.prototype = Object.create(SimpleBase.prototype)

  for (let key in methods) {
    // if (methods.hasOwnProperty(key)) {
    if (key === 'state') {
      SimpleComponent.prototype.getInitialState = function() {
        return Object.assign({}, methods.state)
      }
    } else if (key === 'props') {
      SimpleComponent.prototype.getDefaultProps = function() {
        return Object.assign({}, methods.props)
      }
    } else {
      SimpleComponent.prototype[key] = methods[key]
    }
    // }
  }

  SimpleComponent.prototype.constructor = SimpleComponent

  return SimpleComponent
}


module.exports = Simple

window.Simple = Simple
