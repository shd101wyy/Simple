/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var SimpleBase = __webpack_require__(5);

	function Simple(methods) {
	  var SimpleComponent = function SimpleComponent(props) {
	    if (!this || !(this instanceof SimpleComponent)) {
	      return new SimpleComponent(props);
	    }
	    SimpleBase.call(this);
	    this.props = props || {};

	    this.init();
	  };

	  SimpleComponent.prototype = Object.create(SimpleBase.prototype);

	  for (var key in methods) {
	    // if (methods.hasOwnProperty(key)) {
	    if (key === 'state') {
	      SimpleComponent.prototype.getInitialState = function () {
	        return Object.assign({}, methods.state);
	      };
	    } else {
	      SimpleComponent.prototype[key] = methods[key];
	    }
	    // }
	  }

	  SimpleComponent.prototype.constructor = SimpleComponent;

	  return SimpleComponent;
	}

	module.exports = Simple;

	window.Simple = Simple;

/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */
/***/ function(module, exports) {

	'use strict';
	// A kind of Virtual DOM written by Yiyi Wang (shd101wyy)

	function isNativeEvent(eventname) {
	  return typeof document.body["on" + eventname] !== "undefined";
	}

	// http://stackoverflow.com/questions/3076679/javascript-event-registering-without-using-jquery
	function addEvent(el, eventType, handler) {
	  if (el.addEventListener) {
	    // DOM Level 2 browsers
	    el.addEventListener(eventType, handler, false);
	  } else if (el.attachEvent) {
	    // IE <= 8
	    el.attachEvent('on' + eventType, handler);
	  } else {
	    // ancient browsers
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
	  this.tagName = tagName || null;
	  this.attributes = attributes || {};
	  this.content = content || null;
	  this.children = children || [];
	  this.owner = owner || null;

	  this.element = null; // DOM element
	}

	/**
	 * Remove itself
	 */
	SimpleDOM.prototype.remove = function () {
	  if (this.element && this.element.parentNode) {
	    this.element.parentNode.removeChild(this.element);
	    this.element = null;
	  }
	};

	/**
	 * Append SimpleDOM simpleDOM as child
	 * @param  {[SimpleDOM]} simpleDOM [description]
	 */
	SimpleDOM.prototype.appendChild = function (simpleDOM) {
	  this.children.push(simpleDOM);
	  this.element.appendChild(simpleDOM.element);
	};

	/**
	 * Create children DOM elements and append them to this.element
	 * @param  {[Array of SimpleDOM]} children [description]
	 * @return {[NULL]}          [description]
	 */
	SimpleDOM.prototype.appendNewChildren = function (children) {
	  var _this = this;

	  if (!children.length) return;

	  this.children.forEach(function (child) {
	    if (child.constructor === Array) {
	      _this.appendChildren.apply(_this, child);
	    } else {
	      if (child instanceof SimpleDOM) {
	        _this.element.appendChild(child.toDOM(null));
	      } else {
	        _this.element.appendChild(child);
	      }
	    }
	  });
	};

	/**
	 * Differentiate with simpleDOM (old one) to generate DOM element
	 * Assume they have the same owner
	 * @param  {[SimpleDOM]} simpleDOM [description]
	 * @return {[DOMElement]}           [description]
	 */
	SimpleDOM.prototype.toDOM = function (simpleDOM) {
	  if (!simpleDOM || simpleDOM.tagName !== this.tagName) {
	    // different tagName, need to create DOM element again
	    this.element = document.createElement(this.tagName);

	    // set content
	    if (this.content) {
	      this.element.appendChild(document.createTextNode(this.content));
	    }

	    // set attributes
	    if (this.attributes) {
	      for (var key in this.attributes) {
	        var val = this.attributes[key];
	        if (isNativeEvent(key)) {
	          addEvent(this.element, key, val.bind(this.owner));
	        } else if (key === 'ref') {
	          this.owner.refs[val] = this.element;
	        } else if (key === 'style' && val.constructor === Object) {
	          for (var styleKey in val) {
	            this.element.style[styleKey] = val[styleKey];
	          }
	        } else {
	          this.element.setAttribute(key, val);
	        }
	      }
	    }

	    // append children
	    this.appendNewChildren(this.children);

	    return this.element;
	  } else {
	    var attributes = simpleDOM.attributes,
	        content = simpleDOM.content,
	        element = simpleDOM.element,
	        children = simpleDOM.children;

	    // update Content
	    if (content) {
	      var textNode = element.childNodes[0];
	      textNode.innerText = this.content;
	    } else {
	      var _textNode = document.createTextNode(this.content);
	      if (element.childNodes.length) {
	        element.insertBefore(_textNode, element.childNodes[0]);
	      } else {
	        element.appendChild(_textNode);
	      }
	    }

	    // update Attribute
	    if (this.attributes) {
	      for (var _key in this.attributes) {
	        var _val = this.attributes[_key];
	        if (isNativeEvent(_key)) {
	          if (attributes.hasOwnProperty(_key)) {
	            if (attributes[_key] === _val) {
	              // same event
	              continue;
	            } else {
	              // replace event
	              removeEvent(element, _key, attributes[_key]);
	              addEvent(element, _key, _val.bind(this.owner));
	            }
	          } else {
	            addEvent(element, _key, _val.bind(this.owner));
	          }
	        } else if (_key === 'ref') {
	          this.owner.refs[_val] = element;
	        } else if (_key === 'style' && _val.constructor === Object) {
	          // remove old inline style
	          element.setAttribute('style', ''); // here might be wrong
	          for (var _styleKey in _val) {
	            element.style[_styleKey] = _val[_styleKey];
	          }
	        } else {
	          element.setAttribute(_key, _val);
	        }
	      }
	    }

	    // update Children
	    if (this.children.length === children.length) {
	      for (var i = 0; i < children.length; i++) {
	        this.children[i].toDOM(children[i]);
	      }
	    } else if (this.children.length > children.length) {
	      var _i = 0;
	      for (_i = 0; _i < children.length; _i++) {
	        this.children[_i].toDOM(children[_i]);
	      }

	      this.appendNewChildren(this.children.slice(_i));
	    } else {
	      // if (this.children.length < children.length) {
	      var _i2 = 0;
	      for (_i2 = 0; _i2 < this.children.length; _i2++) {
	        this.children[_i2].toDOM(children[_i2]);
	      }

	      // remove self from element
	      for (; _i2 < children.length; _i2++) {
	        childre[_i2].remove();
	      }
	    }

	    // update element
	    this.element = element;
	    return this.element;
	  }
	};

	module.exports = SimpleDOM;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var SimpleDOM = __webpack_require__(4);

	var validTags = 'a abbr address area article aside audio b base bdi bdo big blockquote body br button canvas caption cite code col colgroup data datalist dd del details dfn dialog div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd keygen label legend li link main map mark menu menuitem meta meter nav noscript object ol optgroup option output p param picture pre progress q rp rt ruby s samp script section  select small source span strong style sub summary sup table tbody td textarea tfoot th thead time title tr track u ul var video wbr'.split(' ');

	function SimpleBase() {
	  this.simpleDOM = null;
	  this.emitter = null;
	  this.state = this.getInitialState();
	  this.props = {};
	  this.refs = {};
	}

	SimpleBase.prototype = {
	  constructor: SimpleBase,
	  getInitialState: function getInitialState() {
	    return {};
	  },
	  render: function render() {
	    throw "Render function is not implemented";
	  },

	  init: function init() {},

	  setState: function setState(newState) {
	    // copy state and then rerender dom element
	    for (var key in newState) {
	      this.state[key] = newState[key];
	    }

	    this.forceUpdate();
	  },

	  forceUpdate: function forceUpdate() {
	    var simpleDOM = this.render();
	    if (this.simpleDOM) {
	      // diff and update dom element
	      simpleDOM.toDOM(this.simpleDOM);
	    }
	    this.simpleDOM = simpleDOM;
	  },

	  remove: function remove() {
	    if (this.simpleDOM) {
	      this.simpleDOM.remove();
	      this.simpleDOM = null;
	    }
	  },

	  appendTo: function appendTo(obj) {
	    if (!this.simpleDOM) {
	      this.simpleDOM = this.render();
	      this.simpleDOM.toDOM(null);
	    }

	    if (obj instanceof SimpleBase) {
	      if (obj.simpleDOM) {
	        obj.simpleDOM.appendChild(this.simpleDOM);
	      }
	    } else {
	      obj.appendChild(this.simpleDOM.element);
	    }
	    return this;
	  }
	};

	// add tags

	var _loop = function _loop(i) {
	  SimpleBase.prototype[validTags[i]] = function () {
	    var attributes = {},
	        content = null,
	        children = [];

	    var offset = 0;
	    if (typeof arguments[offset] !== 'undefined' && arguments[offset].constructor === Object) {
	      attributes = arguments[offset];
	      offset += 1;
	    }

	    if (typeof arguments[offset] !== 'undefined' && arguments[offset].constructor === String) {
	      content = arguments[offset];
	      offset += 1;
	    }

	    if (offset < arguments.length) children = Array.prototype.slice.call(arguments, offset);

	    console.log('tag: ', validTags[i]);
	    console.log('attributes: ', attributes);
	    console.log('content: ', content);
	    console.log('children: ', children);

	    return new SimpleDOM(validTags[i], attributes, content, children, this);
	  };
	};

	for (var i = 0; i < validTags.length; i++) {
	  _loop(i);
	}

	module.exports = SimpleBase;

/***/ }
/******/ ]);