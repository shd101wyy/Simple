'use strict'
// A kind of Virtual DOM written by Yiyi Wang (shd101wyy)

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

function removeEvent(el, eventType, handler) {
  el.removeEventListener(eventType, handler, false);
}



/**
 * [SimpleDOM description]
 * @param {[String]} tagName    [description]
 * @param {[Object]} attributes [description]
 * @param {[String]} content    [description]
 * @param {[Array of SimpleDOM]} children   [description]
 * @param {SimpleClass} owner
 */
function SimpleDOM(tagName, attributes, content, children, owner) {
  this.tagName = tagName || null
  this.attributes = attributes || {}
  this.content = content || null
  this.children = children || []
  this.owner = owner || null

  this.element = null // DOM element
}

/**
 * Remove itself
 */
SimpleDOM.prototype.remove = function() {
  if (this.element && this.element.parentNode) {
    this.element.parentNode.removeChild(this.element)
    this.element = null
  }
}

/**
 * Append SimpleDOM simpleDOM as child
 * @param  {[SimpleDOM]} simpleDOM [description]
 */
SimpleDOM.prototype.appendChild = function(simpleDOM) {
  this.children.push(simpleDOM)
  this.element.appendChild(simpleDOM.element)
}

/**
 * Create children DOM elements and append them to this.element
 * @param  {[Array of SimpleDOM]} children [description]
 * @return {[NULL]}          [description]
 */
SimpleDOM.prototype.appendNewChildren = function(children) {
  if (!children.length) return

  this.children.forEach(child => {
    if (child.constructor === Array) {
      this.appendChildren.apply(this, child)
    } else {
      if (child instanceof SimpleDOM) {
        this.element.appendChild(child.toDOM(null))
      } else {
        this.element.appendChild(child)
      }
    }
  })
}

/**
 * Differentiate with simpleDOM (old one) to generate DOM element
 * Assume they have the same owner
 * @param  {[SimpleDOM]} simpleDOM [description]
 * @return {[DOMElement]}           [description]
 */
SimpleDOM.prototype.toDOM = function(simpleDOM) {
  if (!simpleDOM || simpleDOM.tagName !== this.tagName) { // different tagName, need to create DOM element again
    this.element = document.createElement(this.tagName)

    // set content
    if (this.content) {
      this.element.appendChild(document.createTextNode(this.content))
    }

    // set attributes
    if (this.attributes) {
      for (let key in this.attributes) {
        let val = this.attributes[key]
        if (isNativeEvent(key)) {
          addEvent(this.element, key, val.bind(this.owner))
        } else if (key === 'ref') {
          this.owner.refs[val] = this.element
        } else if (key === 'style' && val.constructor === Object) {
          for (let styleKey in val) {
            this.element.style[styleKey] = val[styleKey]
          }
        } else {
          this.element.setAttribute(key, val)
        }
      }
    }

    // append children
    this.appendNewChildren(this.children)

    return this.element
  } else {
    let attributes = simpleDOM.attributes,
        content = simpleDOM.content,
        element = simpleDOM.element,
        children = simpleDOM.children

    // update Content
    if (content) {
      if (this.content) {
        let textNode = element.childNodes[0]
        textNode.nodeValue = this.content
      } else {
        let textNode = element.childNodes[0]
        element.removeChild(textNode)
      }
    } else if (this.content) {
      let textNode = document.createTextNode(this.content)
      if (element.childNodes.length) {
        element.insertBefore(textNode, element.childNodes[0])
      } else {
        element.appendChild(textNode)
      }
    }

    // update Attribute
    if (this.attributes) {
      for (let key in this.attributes) {
        let val = this.attributes[key]
        if (isNativeEvent(key)) {
          if (attributes.hasOwnProperty(key)) {
            if (attributes[key] === val) { // same event
              continue
            } else {  // replace event
              removeEvent(element, key, attributes[key])
              addEvent(element, key, val.bind(this.owner))
            }
          } else {
            addEvent(element, key, val.bind(this.owner))
          }
        } else if (key === 'ref') {
          this.owner.refs[val] = element
        } else if (key === 'style' && val.constructor === Object) {
          // remove old inline style
          element.setAttribute('style', '') // here might be wrong
          for (let styleKey in val) {
            element.style[styleKey] = val[styleKey]
          }
        } else {
          element.setAttribute(key, val)
        }
      }
    }

    // remove old attributes that are existed in the new one
    if (attributes && this.attributes) {
      for (let key in attributes) {
        if (!this.attributes.hasOwnProperty(key)) {
          element.removeAttribute(key)
        }
      }
    }

    // update Children
    if (this.children.length === children.length) {
      for (let i = 0; i < children.length; i++) {
        this.children[i].toDOM(children[i])
      }
    } else if (this.children.length > children.length) {
      let i = 0
      for (i = 0; i < children.length; i++) {
        this.children[i].toDOM(children[i])
      }

      this.appendNewChildren(this.children.slice(i))
    } else {// if (this.children.length < children.length) {
      let i = 0
      for (i = 0; i < this.children.length; i++) {
        this.children[i].toDOM(children[i])
      }

      // remove self from element
      for (; i < children.length; i++) {
        childre[i].remove()
      }
    }

    // update element
    this.element = element
    return this.element
  }
}

module.exports = SimpleDOM
