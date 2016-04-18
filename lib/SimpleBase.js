'use strict'

let SimpleDOM = require('./SimpleDOM.js')

let validTags = 'a abbr address area article aside audio b base bdi bdo big blockquote body br button canvas caption cite code col colgroup data datalist dd del details dfn dialog div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd keygen label legend li link main map mark menu menuitem meta meter nav noscript object ol optgroup option output p param picture pre progress q rp rt ruby s samp script section  select small source span strong style sub summary sup table tbody td textarea tfoot th thead time title tr track u ul var video wbr'.split(' ')


function SimpleBase() {
  this.simpleDOM = null
  this.emitter = null
  this.state = this.getInitialState()
  this.props = {}
  this.refs = {}
}

SimpleBase.prototype = {
    constructor: SimpleBase,
    getInitialState: function() {return {}},
    render: function() {throw "Render function is not implemented"},

    init: function() {

    },

    setState: function(newState) {
      // copy state and then rerender dom element
      for (let key in newState) {
        this.state[key] = newState[key]
      }

      this.forceUpdate()
    },

    forceUpdate: function() {
      let simpleDOM = this.render()
      if (this.simpleDOM) {
        // diff and update dom element
        simpleDOM.toDOM(this.simpleDOM)
      }
      this.simpleDOM = simpleDOM
    },

    remove: function() {
      if (this.simpleDOM) {
        this.simpleDOM.remove()
        this.simpleDOM = null
      }
    },

    appendTo(obj) {
      if (!this.simpleDOM) {
        this.simpleDOM = this.render()
        this.simpleDOM.toDOM(null)
      }

      if (obj instanceof SimpleBase) {
        if (obj.simpleDOM) {
          obj.simpleDOM.appendChild(this.simpleDOM)
        }
      } else {
        obj.appendChild(this.simpleDOM.element)
      }
      return this
    }
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

    if (typeof(arguments[offset]) !== 'undefined' && arguments[offset].constructor === String) {
      content = arguments[offset]
      offset += 1
    }

    if (offset < arguments.length)
      children = Array.prototype.slice.call(arguments, offset)

    console.log('tag: ', validTags[i])
    console.log('attributes: ', attributes)
    console.log('content: ', content)
    console.log('children: ', children)

    return new SimpleDOM(validTags[i], attributes, content, children, this)
  }
}

module.exports = SimpleBase
