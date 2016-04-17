'use strict'


let validTags = 'a abbr address area article aside audio b base bdi bdo big blockquote body br button canvas caption cite code col colgroup data datalist dd del details dfn dialog div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd keygen label legend li link main map mark menu menuitem meta meter nav noscript object ol optgroup option output p param picture pre progress q rp rt ruby s samp script section  select small source span strong style sub summary sup table tbody td textarea tfoot th thead time title tr track u ul var video wbr'.split(' ')

function isNativeEvent(eventname) {
    return typeof(document.body["on" + eventname]) !== "undefined";
}

// http://stackoverflow.com/questions/3076679/javascript-event-registering-without-using-jquery
function addEvent(el, eventType, handler) {
  if (el.addEventListener) { // DOM Level 2 browsers
    el.addEventListener(eventType, handler, false);
  } else if (el.attachEvent) { // IE <= 8
    el.attachEvent('on' + eventType, handler);
  } else { // ancient browsers
    el['on' + eventType] = handler;
  }
}

function appendChildren(element, children) {
  if (!children.length) return

  for (let i = 0; i < children.length; i++) {
    let child = children[i]
    if (child.constructor === Array) {
      appendChildren(element, child)
    } else {
      if (child instanceof SimpleClass) {
        element.appendChild(child.element)
      } else {
        element.appendChild(child)
      }
    }
  }
}

/**
 * [createDOMElement]
 * @param tagName
 *        attributes
 *        content
 *        children
 * @return {[type]} [description]
 */
function createDOMElement(tagName, args) {
  let attributes = null,
      content = null,
      children = []

  let offset = 0
  if (args[offset] && args[offset].constructor === Object) {
    attributes = args[offset]
    offset += 1
  }

  if (args[offset] && args[offset].constructor === String) {
    content = args[offset]
    offset += 1
  }

  children = Array.prototype.slice.call(args, offset)

  /*
  console.log('tagName', tagName)
  console.log('attributes', attributes)
  console.log('content', content)
  console.log('children', children)
  */

  // create DOM
  let dom = document.createElement(tagName)

  // set innerText
  if (content) {
    dom.innerText = content
  }

  // set attributes
  if (attributes) {
    for (let key in attributes) {
      let val = attributes[key]
      if (isNativeEvent(key)) {
        addEvent(dom, key, val)
      } else {
        dom.setAttribute(key, val)
      }
    }
  }

  // append children
  appendChildren(dom, children)

  return dom
}

function SimpleClass() {
  this.element = null
  this.emitter = null
  this.state = this.getInitialState()
  this.props = null
}

SimpleClass.prototype = {
    constructor: SimpleClass,
    getInitialState: function() {return {}},
    render: function() {throw "Render function is not implemented"},

    setState: function(newState) {
      // copy state and then rerender dom element
      for (let key in newState) {
        this.state[key] = newState[key]
      }

      this.forceUpdate()
    },

    forceUpdate: function() {
      let element = this.render()
      if (this.element) {
        this.element.parentNode.replaceChild(this.element, element)
      }
      this.element = element
    },

    remove: function() {
      if (this.element) {
        this.element.parentElement.removeChild(this.element)
        this.element = null
      }
    },

    appendTo(obj) {
      if (!this.element) {
        this.element = this.render()
      }

      if (obj instanceof SimpleClass) {
        if (obj.element) {
          obj.element.appendChild(this.element)
        }
      } else {
        obj.appendChild(this.element)
      }
    }
}

// add tags
for (let i = 0; i < validTags.length; i++) {
  SimpleClass.prototype[validTags[i]] = function() {
    return createDOMElement(validTags[i], arguments)
  }
}




if (module) {
  module.exports = SimpleClass
}
