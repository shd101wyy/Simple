(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Simple"] = factory();
	else
		root["Simple"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var Component = __webpack_require__(1);
	var Emitter = __webpack_require__(3);

	var render = function render(component, domElement) {
	  var element = component._initialRender();
	  if (element) {
	    domElement.appendChild(element);
	  }
	};

	var createEmitter = function createEmitter(initialState) {
	  return new Emitter(initialState);
	};

	var Simple = {
	  Component: Component,
	  createEmitter: createEmitter,
	  render: render
	};

	if (typeof window !== 'undefined') {
	  window.Simple = Simple;
	}

	if (true) {
	  module.exports = Simple;
	}

	exports.default = Simple;
	exports.Component = Component;
	exports.createEmitter = createEmitter;
	exports.render = render;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var SimpleDOM = __webpack_require__(4);

	function createSimpleComponent(methods) {
	  var SimpleComponent = function SimpleComponent(props) {
	    if (!this || !(this instanceof SimpleComponent)) {
	      return new SimpleComponent(props);
	    }
	    SimpleDOM.call(this);

	    for (var _len = arguments.length, children = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      children[_key - 1] = arguments[_key];
	    }

	    if (children) {
	      this.children = children;
	    }

	    if (props) {
	      Object.assign(this.props, props);
	    }

	    this.init();
	    //this.forceUpdate()      // render element
	    //this.componentDidMount()
	  };

	  SimpleComponent.prototype = Object.create(SimpleDOM.prototype);

	  for (var key in methods) {
	    SimpleComponent.prototype[key] = methods[key];
	  }

	  SimpleComponent.prototype.constructor = SimpleComponent;

	  return SimpleComponent;
	}

	function createStatelessSimpleComponent(func) {
	  var SimpleComponent = function SimpleComponent(props) {
	    if (!this || !this instanceof SimpleComponent) {
	      return new SimpleComponent(props);
	    }
	    SimpleDOM.call(this);

	    this.render = func.bind(this, props);
	    // this.toDOM(func.call(this, props)) // render element
	  };
	  SimpleComponent.prototype = Object.create(SimpleDOM.prototype);

	  return SimpleComponent;
	}

	function Component(arg) {
	  if (arg.constructor === Function) {
	    return createStatelessSimpleComponent(arg);
	  } else {
	    return createSimpleComponent(arg);
	  }
	}

	module.exports = Component;

/***/ },
/* 2 */,
/* 3 */
/***/ function(module, exports) {

	'use strict';
	/*
	 * Event emitter class
	 */

	var emitters = {};

	function Emitter() {
	  var initialState = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	  this.subscriptions = {};
	  this.id = null;

	  if (initialState.constructor === Function) {
	    var initFunc = initialState;
	    this.state = initialState;
	    initFunc.call(this);
	  } else {
	    this.state = initialState;
	  }
	}

	Emitter.prototype.constructor = Emitter;

	Emitter.prototype.registerId = function (id) {
	  if (emitters[id]) {
	    throw 'Error: ' + id + ' is already registered in Emitters';
	  } else {
	    this.id = id;
	    emitters[id] = this;
	  }
	};

	Emitter.getEmitterById = function (id) {
	  return emitters[id];
	};

	// emitter.emit()
	Emitter.prototype.emit = function (name) {
	  var data = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
	  var sender = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

	  if (this.subscriptions[name]) {
	    this.subscriptions[name].call(this, data, sender);
	  }
	};

	// emitter.on()
	// callback should be
	// - function(data, component) {
	//   }
	Emitter.prototype.on = function () {
	  if (arguments.length === 2) {
	    var name = arguments[0],
	        callback = arguments[1];
	    if (this.subscriptions[name]) {
	      throw 'Error: ' + name + ' is already registered in Emitter object';
	    } else {
	      this.subscriptions[name] = callback;
	    }
	  } else {
	    var obj = arguments[0];
	    for (var _name in obj) {
	      this.on(_name, obj[_name]);
	    }
	  }
	};

	// unsubscript the event
	Emitter.prototype.off = function (name) {
	  this.subscriptions[name] = null;
	};

	Emitter.prototype.destroy = function () {
	  this.state = {};
	  this.subscriptions = {};
	};

	/*
	Emitter.prototype.getState = function() {
	  return this.state
	}
	*/

	module.exports = Emitter;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

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
	  if (el.removeEventListener) {
	    // DOM Level 2 browsers
	    el.removeEventListener(eventType, handler, false);
	  } else if (el.attachEvent) {
	    // IE <= 8
	    el.detachEvent('on' + eventType, handler);
	  }
	}

	var validTags = 'a abbr address area article aside audio b base bdi bdo big blockquote body br button canvas caption cite code col colgroup data datalist dd del details dfn dialog div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd keygen label legend li link main map mark menu menuitem meta meter nav noscript object ol optgroup option output p param picture pre progress q rp rt ruby s samp script section  select small source span strong style sub summary sup table tbody td textarea tfoot th thead time title tr track u ul var video wbr'.split(' ');

	// http://stackoverflow.com/questions/10865025/merge-flatten-a-multidimensional-array-in-javascript
	function flatten(arr) {
	  return arr.reduce(function (flat, toFlatten) {
	    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
	  }, []);
	}

	/**
	 */
	function SimpleDOM() {
	  this.props = this.getDefaultProps();
	  this.refs = {};
	}

	SimpleDOM.prototype = Object.create(SimpleDOM.prototype);

	SimpleDOM.prototype.getDefaultProps = function () {
	  return {};
	};

	SimpleDOM.prototype.emit = function (name) {
	  var data = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

	  if (this.emitter) {
	    this.emitter.emit(name, data, this);
	  }
	};

	SimpleDOM.prototype.render = function () {
	  throw "Render function is not implemented";
	};

	SimpleDOM.prototype.init = function () {};

	SimpleDOM.prototype.componentDidMount = function () {};

	SimpleDOM.prototype.componentWillUpdate = function () {};

	SimpleDOM.prototype.componentDidUpdate = function () {};

	SimpleDOM.prototype.componentWillUnmount = function () {};

	SimpleDOM.prototype.componentDidUnmount = function () {};

	SimpleDOM.prototype.setState = function (newState) {
	  if (this.state) {
	    Object.assign(this.state, newState);
	  }
	  this.forceUpdate();
	};

	SimpleDOM.prototype.setProps = function (newProps) {
	  Object.assign(this.props, newProps);
	  this.forceUpdate();
	};

	SimpleDOM.prototype.forceUpdate = function () {
	  this.componentWillUpdate();

	  this._render(this.element); // render element

	  this.componentDidUpdate();
	};

	SimpleDOM.prototype._render = function (oldElement) {
	  var sameLevel = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

	  var d = this.render();
	  if (!d.tagName) {
	    this.element = d._render(oldElement);
	    if (sameLevel) {
	      this.componentWillUpdate();
	      this.props = d.props; // 'react' only changes props
	      this.componentDidUpdate();
	    }
	  } else if (d) {
	    this.element = this.diff(oldElement, d);
	  }
	  return this.element;
	};

	SimpleDOM.prototype.diff = function (element, d) {
	  if (element.tagName !== d.tagName) {
	    // different tag
	    var el = d._initialRender();
	    element.parentNode.replaceChild(el, element);
	    return el;
	  } else {
	    // set content
	    if (d.content) {
	      element.textContent = d.content;
	    } else {
	      element.textContent = null;
	    }

	    // set attributes
	    for (var i = 0; i < element.attributes.length; i++) {
	      element.removeAttribute(element.attributes[i].name);
	    }
	    if (d.attributes) {
	      for (var key in d.attributes) {
	        var val = d.attributes[key];
	        if (isNativeEvent(key)) {
	          addEvent(element, key, val);
	        } else if (key === 'ref') {
	          this.owner.refs[val] = element;
	        } else if (key === 'style' && val.constructor === Object) {
	          for (var styleKey in val) {
	            element.style[styleKey] = val[styleKey];
	          }
	        } else {
	          element.setAttribute(key, val);
	        }
	      }
	    }

	    // diff children
	    if (element.children.length === d.children.length) {
	      for (var _i = 0; _i < element.children.length; _i++) {
	        d.children[_i]._render(element.children[_i], true);
	      }
	    } else if (element.children.length > d.children.length) {
	      var _i2 = 0;
	      for (; _i2 < d.children.length; _i2++) {
	        d.children[_i2]._render(element.children[_i2], true);
	      }
	      while (element.children.length !== d.children.length) {
	        element.removeChild(element.children[_i2]);
	      }
	    } else {
	      // if (element.children.length < d.children.length) {
	      var _i3 = 0;
	      for (; _i3 < element.children.length; _i3++) {
	        d.children[_i3]._render(element.children[_i3], true);
	      }
	      for (; _i3 < d.children.length; _i3++) {
	        element.appendChild(d.children[_i3]._initialRender());
	      }
	    }
	    return element;
	  }
	};

	SimpleDOM.prototype.appendChildrenDOMElements = function (children) {
	  var _this = this;

	  if (!children.length) return;

	  children.forEach(function (child) {
	    if (child.constructor === Array) {
	      _this.appendChildrenDOMElements(child);
	    } else {
	      _this.element.appendChild(child._initialRender());
	    }
	  });
	};

	SimpleDOM.prototype.generateDOM = function () {
	  this.element = document.createElement(this.tagName);

	  if (this.content) {
	    this.element.appendChild(document.createTextNode(this.content));
	  }

	  if (this.attributes) {
	    for (var key in this.attributes) {
	      var val = this.attributes[key];
	      if (isNativeEvent(key)) {
	        addEvent(this.element, key, val);
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

	  this.appendChildrenDOMElements(this.children);

	  return this.element;
	};

	SimpleDOM.prototype._initialRender = function () {
	  if (this.tagName) {
	    // div ...
	    this.generateDOM();
	  } else {
	    var d = this.render();
	    if (d) {
	      this.element = d._initialRender();
	    }
	    this.componentDidMount();
	  }
	  return this.element;
	};

	// add tags

	var _loop = function _loop(i) {
	  SimpleDOM.prototype[validTags[i]] = function () {
	    var attributes = {},
	        content = null,
	        children = [];

	    var offset = 0;
	    if (typeof arguments[offset] !== 'undefined' && arguments[offset].constructor === Object) {
	      attributes = arguments[offset];
	      offset += 1;
	    }

	    if (typeof arguments[offset] !== 'undefined' && (arguments[offset].constructor === String || arguments[offset].constructor === Number)) {
	      content = arguments[offset];
	      offset += 1;
	    }

	    children = [];
	    function appendChildren(args) {
	      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

	      for (var _i4 = offset; _i4 < args.length; _i4++) {
	        if (args[_i4]) {
	          if (args[_i4].constructor === Array) {
	            appendChildren(args[_i4]);
	          } else {
	            children.push(args[_i4]);
	          }
	        }
	      }
	    }

	    appendChildren(arguments, offset);
	    /*
	    if (offset < arguments.length) {
	      children = Array.prototype.slice.call(arguments, offset)
	      children = [].concat.apply([], children)
	    }
	    */
	    var d = new SimpleDOM();
	    d.tagName = validTags[i].toUpperCase();
	    d.attributes = attributes;
	    d.content = content;
	    d.children = children;
	    d.owner = this;
	    return d;
	  };
	};

	for (var i = 0; i < validTags.length; i++) {
	  _loop(i);
	}

	SimpleDOM.prototype.constructor = SimpleDOM;

	module.exports = SimpleDOM;

/***/ }
/******/ ])
});
;