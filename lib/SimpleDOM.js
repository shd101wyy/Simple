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
  if (el.removeEventListener) { // DOM Level 2 browsers
    el.removeEventListener(eventType, handler, false)
  } else if (el.attachEvent) { // IE <= 8
    el.detachEvent('on' + eventType, handler)
  }
}



/**
 * [SimpleDOM description]
 * @param {[String]} tagName    [description]
 * @param {[Object]} attributes [description]
 * @param {[String]} content    [description]
 * @param {[Array of (SimpleDOM|SimpleBase)]} children   [description]
 */
function SimpleDOM(tagName, attributes, content, children, owner) {
  this.tagName = tagName || null
  this.attributes = attributes || {}
  this.content = content || null
  this.children = children || []
  this.owner = owner || null

  this.element = null // DOM element

  this._eventListeners = {}
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
SimpleDOM.prototype.appendChildrenDOMElements = function(children) {
  if (!children.length) return

  children.forEach(child => {
    if (child.constructor === Array) {
      this.appendChildrenDOMElements.apply(this, [child])
    } else if (child instanceof SimpleDOM) {
      if (!child.element) {
        child.toDOM()
      }
      this.element.appendChild(child.element)
    } else {
      throw 'Invalid SimpleDOM'
    }
  })
}

/**
 * Differentiate with simpleDOM (new one) to generate DOM element
 * @param  {[SimpleDOM]} simpleDOM [description]
 * @return {[DOMElement]}           [description]
 */
SimpleDOM.prototype.toDOM = function(simpleDOM) {
  if (!this.element || simpleDOM.tagName !== this.tagName) { // element not existed [OR] different tagName, need to create DOM element again
    let newTagName = simpleDOM ? simpleDOM.tagName : this.tagName,
        newAttributes = simpleDOM ? simpleDOM.attributes : this.attributes,
        newContent = simpleDOM ? simpleDOM.content : this.content,
        newChildren = simpleDOM ? simpleDOM.children: this.children,
        newOwner = simpleDOM ? simpleDOM.owner : this.owner

    let newElement = document.createElement(newTagName)

    // set content
    if (newContent) {
      newElement.appendChild(document.createTextNode(newContent))
    }

    // set attributes
    if (newAttributes) {
      for (let key in newAttributes) {
        let val = newAttributes[key]
        if (isNativeEvent(key)) {
          addEvent(newElement, key, val/*.bind(this.owner)*/)
          this._eventListeners[key] = val // save to _eventListeners
        } else if (key === 'ref') {
          newOwner.refs[val] = newElement
        } else if (key === 'style' && val.constructor === Object) {
          for (let styleKey in val) {
            newElement.style[styleKey] = val[styleKey]
          }
        } else {
          newElement.setAttribute(key, val)
        }
      }
    }

    if (this.element && simpleDOM) { // replace this.element with newElement
      let parentNode = this.element.parentNode // this should/must exist
      parentNode.insertBefore(newElement, this.element)
      this.remove()

      this.element = newElement

      if (this.props && simpleDOM.props) {
        this.props = simpleDOM.props
        this.state = simpleDOM.state
      }
    } else {
      this.element = newElement
    }

    this.tagName = newTagName
    this.attributes = newAttributes
    this.content = newContent
    this.children = newChildren
    this.owner = newOwner

    // append children
    this.appendChildrenDOMElements(this.children)

    return this.element
  } else {
    let oldAttributes = this.attributes,
        oldContent = this.content,
        oldElement = this.element,
        oldChildren = this.children,
        oldOwner = this.owner

    let attributes = simpleDOM.attributes,
        content = simpleDOM.content,
        element = simpleDOM.element,
        children = simpleDOM.children,
        owner = simpleDOM.owner

    // update Content
    if (oldContent) {
      if (content) {
        let textNode = oldElement.childNodes[0]
        textNode.nodeValue = content
      } else {
        let textNode = oldElement.childNodes[0]
        oldElement.removeChild(textNode)
      }
    } else if (content) {
      let textNode = document.createTextNode(content)
      if (oldElement.childNodes.length) {
        oldElement.insertBefore(textNode, oldElement.childNodes[0])
      } else {
        oldElement.appendChild(textNode)
      }
    }

    // update Attribute
    if (attributes) {
      for (let key in attributes) {
        let val = attributes[key]
        if (isNativeEvent(key)) {
          if (this.attributes.hasOwnProperty(key)) {
            if (this.attributes[key] === val) { // same event
              continue
            } else {  // replace event
              removeEvent(this.element, key, this._eventListeners[key])
              addEvent(this.element, key, val/*.bind(owner)*/)
              this._eventListeners[key] = val
            }
          } else {
            addEvent(this.element, key, val/*.bind(owner)*/)
            this._eventListeners[key] = val
          }
        } else if (key === 'ref') {
          owner.refs[val] = this.element
        } else if (key === 'style' && val.constructor === Object) {
          // remove old inline style
          this.element.setAttribute('style', '') // here might be wrong
          for (let styleKey in val) {
            this.element.style[styleKey] = val[styleKey]
          }
        } else {
          this.element.setAttribute(key, val)
        }
      }
    } else if (this.attributes) { // remove all attributes in this.attributes
      for (let key in this.attributes) {
        let val = this.attributes[key]
        if (isNativeEvent(key)) {
          removeEvent(this.element, key, val) // TODO: val here is wrong. as it is not binded to this
        } else {
          this.element.removeAttribute(key)
        }
      }
    }

    // remove old attributes that are existed in the new one
    if (attributes && this.attributes) {
      for (let key in this.attributes) {
        if (!attributes.hasOwnProperty(key)) {
          if (isNativeEvent(key)) {
            removeEvent(this.element, key, this.attributes[key])
          } else {
            this.element.removeAttribute(key)
          }
        }
      }
    }


    // update Children
    if (children.length === oldChildren.length) {
      for (let i = 0; i < children.length; i++) {
        oldChildren[i].toDOM(children[i])
      }
    } else if (children.length > oldChildren.length) {
      let i = 0
      for (i = 0; i < oldChildren.length; i++) {
        oldChildren[i].toDOM(children[i])
      }

      let j = i
      for(; i < children.length; i++) {
        oldChildren.push(children[i])
      }

      this.appendChildrenDOMElements(children.slice(j))
    } else {// if (children.length < oldChildren.length) {
      let oldLength = oldChildren.length
      for (let i = children.length; i < oldLength; i++) {
        oldChildren.pop().remove()
      }

      for (let i = 0; i < children.length; i++) {
        oldChildren[i].toDOM(children[i])
      }
    }

    this.attributes = attributes
    this.content = content
    // this.children = children // This is wrong. Should assign like this as this.children already changed.
    this.owner = owner

    if (this.props && simpleDOM.props) {
      this.props = simpleDOM.props
      this.state = simpleDOM.state
    }

    // update element
    return this.element
  }
}


module.exports = SimpleDOM
