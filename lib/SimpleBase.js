'use strict'

import SimpleDOM from './SimpleDOM.js'

let validTags = 'a abbr address area article aside audio b base bdi bdo big blockquote body br button canvas caption cite code col colgroup data datalist dd del details dfn dialog div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd keygen label legend li link main map mark menu menuitem meta meter nav noscript object ol optgroup option output p param picture pre progress q rp rt ruby s samp script section  select small source span strong style sub summary sup table tbody td textarea tfoot th thead time title tr track u ul var video wbr'.split(' ')

// http://stackoverflow.com/questions/10865025/merge-flatten-a-multidimensional-array-in-javascript
function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

/**
 * Derive from SimpleDOM class
 */
function SimpleBase() {
  SimpleDOM.call(this)
  this.props = this.getDefaultProps()
  this.refs = {}
}

SimpleBase.prototype = Object.create(SimpleDOM.prototype)

SimpleBase.prototype.getDefaultProps = function() {
  return {}
}

SimpleBase.prototype.emit = function(name, data=null) {
  if (this.emitter) {
    this.emitter.emit(name, data, this)
  }
}

SimpleBase.prototype.render = function() {
  throw "Render function is not implemented"
}

SimpleBase.prototype.remove = function() {
  this.componentWillUnmount()

  Object.getPrototypeOf(SimpleBase.prototype).remove.call(this)

  this.componentDidUnmount()
}

SimpleBase.prototype.init = function() {
}

SimpleBase.prototype.componentDidMount = function() {

}

SimpleBase.prototype.componentWillUpdate = function() {
}

SimpleBase.prototype.componentDidUpdate = function() {
}

SimpleBase.prototype.componentWillUnmount = function() {

}

SimpleBase.prototype.componentDidUnmount = function() {

}

/*
SimpleBase.prototype.setState = function(newState) {
  for (let key in newState) {
    this.state[key] = newState[key]
  }

  this.forceUpdate()
}
*/

SimpleBase.prototype.updateProps = function(newProps) {
  Object.assign(this.props, newProps)
  this.forceUpdate()
}

SimpleBase.prototype.forceUpdate = function() {
  // warning to prohabit 'this.state'
  if (this.state) {
    throw 'Error: state is not allowed in Simple.Component'
  }

  this.componentWillUpdate()

  this.toDOM(this.render()) // render element

  this.componentDidUpdate()
}

SimpleBase.prototype.appendTo = function(obj) {
  if (obj instanceof SimpleDOM) {
    obj.appendChild(this)
  } else {
    obj.appendChild(this.element)
  }
  return this
}

// add tags
for (let i = 0; i < validTags.length; i++) {
  SimpleBase.prototype[validTags[i]] = function() {
    let attributes = {},
        content = null,
        children = []

    let offset = 0
    if (typeof(arguments[offset]) !== 'undefined' && arguments[offset].constructor === Object) {
      attributes = arguments[offset]
      offset += 1
    }

    if (typeof(arguments[offset]) !== 'undefined' && (arguments[offset].constructor === String || arguments[offset].constructor === Number)) {
      content = arguments[offset]
      offset += 1
    }

    children = []
    function appendChildren(args) {
      for (let i = 0; i < args.length; i++) {
        if (args[i]) {
          if (args[i].constructor === Array) {
            appendChildren(args[i])
          } else {
            children.push(args[i])
          }
        }
      }
    }
    for (let i = offset; i < arguments.length; i++) {
      if (arguments[i]) {
        if (arguments[i].constructor === Array) {
          appendChildren(arguments[i])
        } else {
          children.push(arguments[i])
        }
      }
    }
    /*
    if (offset < arguments.length) {
      children = Array.prototype.slice.call(arguments, offset)
      children = [].concat.apply([], children)
    }
    */

    return new SimpleDOM(validTags[i], attributes, content, children, this)
  }
}

SimpleBase.prototype.constructor = SimpleBase


export default SimpleBase
