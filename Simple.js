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

	/* WEBPACK VAR INJECTION */(function(module) {'use strict';

	var SimpleClass = __webpack_require__(2);

	function Simple(methods) {
	  var SimpleObject = function SimpleObject(props) {
	    if (!this || !(this instanceof SimpleObject)) {
	      return new SimpleObject(props);
	    }
	    SimpleClass.call(this);
	    this.props = props || {};

	    this.init();
	  };

	  SimpleObject.prototype = Object.create(SimpleClass.prototype);

	  for (var key in methods) {
	    // if (methods.hasOwnProperty(key)) {
	    if (key === 'state') {
	      SimpleObject.prototype.getInitialState = function () {
	        return Object.assign({}, methods.state);
	      };
	    } else {
	      SimpleObject.prototype[key] = methods[key];
	    }
	    // }
	  }

	  SimpleObject.prototype.constructor = SimpleObject;

	  return SimpleObject;
	}

	if (module) {
	  module.exports = Simple;
	}

	window.Simple = Simple;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {'use strict';

	var validTags = 'a abbr address area article aside audio b base bdi bdo big blockquote body br button canvas caption cite code col colgroup data datalist dd del details dfn dialog div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd keygen label legend li link main map mark menu menuitem meta meter nav noscript object ol optgroup option output p param picture pre progress q rp rt ruby s samp script section  select small source span strong style sub summary sup table tbody td textarea tfoot th thead time title tr track u ul var video wbr'.split(' ');

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

	function appendChildren(element, children) {
	  if (!children.length) return;

	  children.forEach(function (child) {
	    if (child.constructor === Array) {
	      appendChildren(element, child);
	    } else {
	      if (child instanceof SimpleClass) {
	        if (!child.element) {
	          child.element = child.render();
	        }
	        element.appendChild(child.element);
	      } else {
	        element.appendChild(child);
	      }
	    }
	  });
	}

	/**
	 * [createDOMElement]
	 * @param tagName
	 *        attributes
	 *        content
	 *        children
	 * @return {[type]} [description]
	 */
	function createDOMElement(tagName, args, obj) {
	  var attributes = null,
	      content = null,
	      children = [];

	  var offset = 0;
	  if (typeof args[offset] !== 'undefined' && args[offset].constructor === Object) {
	    attributes = args[offset];
	    offset += 1;
	  }

	  if (typeof args[offset] !== 'undefined' && args[offset].constructor === String) {
	    content = args[offset];
	    offset += 1;
	  }

	  if (offset < args.length) children = Array.prototype.slice.call(args, offset);

	  /*
	  console.log('tagName', tagName)
	  console.log('attributes', attributes)
	  console.log('content', content)
	  console.log('children', children)
	  console.log('args', args)
	  */

	  // create DOM
	  var dom = document.createElement(tagName);

	  // set innerText
	  if (content) {
	    dom.innerText = content;
	  }

	  // set attributes
	  if (attributes) {
	    for (var key in attributes) {
	      var val = attributes[key];
	      if (isNativeEvent(key)) {
	        addEvent(dom, key, val.bind(obj));
	      } else if (key === 'ref') {
	        obj.refs[val] = dom;
	      } else {
	        dom.setAttribute(key, val);
	      }
	    }
	  }

	  // append children
	  appendChildren(dom, children);

	  return dom;
	}

	function SimpleClass() {
	  this.element = null;
	  this.emitter = null;
	  this.state = this.getInitialState();
	  this.props = {};
	  this.refs = {};
	}

	SimpleClass.prototype = {
	  constructor: SimpleClass,
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
	    var element = this.render();
	    if (this.element) {
	      this.element.parentNode.replaceChild(element, this.element);
	    }
	    this.element = element;
	  },

	  remove: function remove() {
	    if (this.element) {
	      this.element.parentNode.removeChild(this.element);
	      this.element = null;
	    }
	  },

	  appendTo: function appendTo(obj) {
	    if (!this.element) {
	      this.element = this.render();
	    }

	    if (obj instanceof SimpleClass) {
	      if (obj.element) {
	        obj.element.appendChild(this.element);
	      }
	    } else {
	      obj.appendChild(this.element);
	    }
	    return this;
	  }
	};

	// add tags

	var _loop = function _loop(i) {
	  SimpleClass.prototype[validTags[i]] = function () {
	    var args = arguments;
	    return createDOMElement(validTags[i], args, this);
	  };
	};

	for (var i = 0; i < validTags.length; i++) {
	  _loop(i);
	}

	if (module) {
	  module.exports = SimpleClass;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ }
/******/ ]);