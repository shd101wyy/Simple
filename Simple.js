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
	  Emitter: Emitter,
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
	exports.Emitter = Emitter;
	exports.createEmitter = createEmitter;
	exports.render = render;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var SimpleDOM = __webpack_require__(2);

	function createSimpleComponent(methods) {
	  var SimpleComponent = function SimpleComponent(props) {
	    if (!this || !(this instanceof SimpleComponent)) {
	      return new SimpleComponent(props);
	    }

	    for (var _len = arguments.length, children = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      children[_key - 1] = arguments[_key];
	    }

	    SimpleDOM.call(this, props, children);
	  };

	  SimpleComponent.prototype = Object.create(SimpleDOM.prototype);

	  for (var key in methods) {
	    SimpleComponent.prototype[key] = methods[key];
	  }

	  SimpleComponent.prototype.constructor = SimpleComponent;

	  return SimpleComponent;
	}

	function createStatelessSimpleComponent(func) {
	  var SimpleComponent = function SimpleComponent() {
	    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	      args[_key2] = arguments[_key2];
	    }

	    if (!this || !this instanceof SimpleComponent) {
	      return new (Function.prototype.bind.apply(SimpleComponent, [null].concat(args)))();
	    }
	    this.render = func.bind(this, args);
	    SimpleDOM.call(this, null, []);
	  };
	  SimpleComponent.prototype = Object.create(SimpleDOM.prototype);
	  SimpleComponent.prototype.render = func;
	  SimpleComponent.prototype.constructor = SimpleComponent;

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
/* 2 */
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

	/**
	 * Simple Element
	 * It should be stateless and immutable.
	 */
	function SimpleElement(tagName) {
	  var attributes = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
	  var children = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
	  var owner = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

	  this.tagName = tagName;
	  if (attributes) this.attributes = attributes;
	  if (children) this.children = children;
	  if (owner) this.owner = owner;
	}
	SimpleElement.prototype = Object.create(SimpleElement.prototype);
	SimpleElement.prototype.constructor = SimpleElement;
	SimpleElement.prototype._initialRender = function () {
	  if (this.tagName === '#text') {
	    this.element = document.createTextNode(this.children);
	    return this.element;
	  }
	  var _eventListeners = {};

	  this.element = document.createElement(this.tagName);

	  if (this.attributes) {
	    for (var key in this.attributes) {
	      var val = this.attributes[key];
	      if (isNativeEvent(key)) {
	        addEvent(this.element, key, val);
	        _eventListeners[key] = val;
	      } else if (key === 'ref') {
	        this.owner.refs[val] = this.element;
	      } else if (key === 'style' && val.constructor === Object) {
	        for (var styleKey in val) {
	          this.element.style[styleKey] = val[styleKey];
	        }
	      } else if (key === 'html') {
	        this.element.innerHTML = val;
	      } else {
	        this.element.setAttribute(key, val);
	      }
	    }
	  }

	  this._eventListeners = _eventListeners;
	  this._appendChildrenDOMElements(this.children);
	  return this.element;
	};

	SimpleElement.prototype._appendChildrenDOMElements = function (children) {
	  var _this = this;

	  if (!children.length) return;

	  children.forEach(function (child) {
	    if (child.constructor === Array) {
	      _this._appendChildrenDOMElements(child);
	    } else {
	      // SimpleDOM or SimpleElement
	      _this.element.appendChild(child._initialRender());
	    }
	  });
	};

	SimpleElement.prototype.removeSelf = function () {
	  if (this.element && this.element.parentElement) {
	    this.element.parentElement.removeChild(this.element);
	    this.element = null;
	  }
	};

	SimpleElement.prototype.getDOMElement = function () {
	  return this.element;
	};
	SimpleElement.prototype.getSimpleElement = function () {
	  return this;
	};

	/**
	 * Simple DOM
	 */
	function SimpleDOM(props) {
	  var children = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

	  this.props = this.getDefaultProps();
	  this.refs = {};
	  if (children.length) this.children = children;

	  if (props) {
	    Object.assign(this.props, props);
	  }

	  if (this.init) {
	    this.init();
	  }

	  this.element = this.render();
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
	  throw "Render function is not implemented.";
	};

	SimpleDOM.prototype.init = function () {};
	SimpleDOM.prototype.mount = function () {};
	SimpleDOM.prototype.update = function () {};
	SimpleDOM.prototype.unmount = function () {};

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
	  var oldVD = this.element;
	  this.element = this.render();
	  diff(oldVD, this.element);

	  this.update();
	};

	SimpleDOM.prototype._initialRender = function () {
	  var outputElement = null;
	  if (this.element) {
	    outputElement = this.element._initialRender();
	  }
	  this.mount();
	  return outputElement;
	};

	/**
	 * diff element and d, return a new element
	 * @param  {[type]} vd1     [old virtual dom]
	 * @param  {[type]} vd2     [new virtual dom]
	 */
	function diff(vd1, vd2) {
	  var simpleElement_1 = vd1.getSimpleElement();
	  var simpleElement_2 = vd2.getSimpleElement();
	  if (!simpleElement_2) return;
	  if (simpleElement_1.tagName !== simpleElement_2.tagName) {
	    // different tag
	    var element_2 = vd2._initialRender();
	    var element_1 = simpleElement_1.element;
	    element_1.parentNode.replaceChild(element_2, element_1);
	    return element_2;
	  } else if (simpleElement_1.tagName === '#text') {
	    simpleElement_1.element.nodeValue = simpleElement_2.children;
	    simpleElement_2.element = simpleElement_1.element;
	    return simpleElement_1.element;
	  } else {
	    var element = simpleElement_1.element;

	    // set attributes
	    while (element.attributes.length > 0) {
	      element.removeAttribute(element.attributes[0].name);
	    }

	    var eventsLength = 0,
	        _eventListeners = simpleElement_1._eventListeners || {},
	        events = {},
	        attributes = simpleElement_2.attributes;

	    for (var key in attributes) {
	      var val = attributes[key];
	      if (isNativeEvent(key)) {
	        if (_eventListeners[key] !== val) {
	          removeEvent(element, key, _eventListeners[key]);
	          addEvent(element, key, val);
	          events[key] = val;
	        }
	      } else if (key === 'ref') {
	        if (vd1.owner) {
	          vd1.owner.refs[val] = element;
	        }
	      } else if (key === 'style' && val.constructor === Object) {
	        for (var styleKey in val) {
	          element.style[styleKey] = val[styleKey];
	        }
	      } else if (key === 'html') {
	        element.innerHTML = val;
	      } else {
	        element.setAttribute(key, val);
	      }
	    }

	    for (var _key in _eventListeners) {
	      if (!events[_key]) {
	        removeEvent(element, _key, _eventListeners[_key]);
	      }
	    }
	    simpleElement_2._eventListeners = events; // append _eventListeners

	    // diff children
	    if (simpleElement_1.children.length === simpleElement_2.children.length) {
	      for (var i = 0; i < simpleElement_1.children.length; i++) {
	        diff(simpleElement_1.children[i], simpleElement_2.children[i]);
	      }
	    } else if (simpleElement_1.children.length > simpleElement_2.children.length) {
	      var _i = 0;
	      for (; _i < simpleElement_2.children.length; _i++) {
	        diff(simpleElement_1.children[_i], simpleElement_2.children[_i]);
	      }
	      for (; _i < simpleElement_1.children.length; _i++) {
	        simpleElement_1.children[_i].removeSelf();
	      }
	    } else {
	      // if (simpleElement_1.children.length < simpleElement_2.children.length) {
	      var _i2 = 0;
	      for (; _i2 < simpleElement_1.children.length; _i2++) {
	        diff(simpleElement_1.children[_i2], simpleElement_2.children[_i2]);
	      }
	      for (; _i2 < simpleElement_2.children.length; _i2++) {
	        element.appendChild(simpleElement_2.children[_i2]._initialRender());
	      }
	    }

	    simpleElement_2.element = element;
	    return element;
	  }
	}

	SimpleDOM.prototype.removeSelf = function () {
	  this.element.removeSelf();
	  this.unmount();
	};

	SimpleDOM.prototype.getDOMElement = function () {
	  if (this.element) return this.element.getDOMElement();
	};

	SimpleDOM.prototype.getSimpleElement = function () {
	  if (this.element) return this.element.getSimpleElement();else return null;
	};

	// add tags

	var _loop = function _loop(i) {
	  SimpleDOM.prototype[validTags[i]] = function () {
	    var attributes = null;
	    var offset = 0;
	    if (arguments[offset] !== null && typeof arguments[offset] !== 'undefined' && arguments[offset].constructor === Object) {
	      attributes = arguments[offset];
	      offset += 1;
	    }

	    var children = [];
	    function appendChildren(args) {
	      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

	      for (var _i3 = offset; _i3 < args.length; _i3++) {
	        if (args[_i3]) {
	          if (args[_i3].constructor === Array) {
	            appendChildren(args[_i3]);
	          } else if (args[_i3].constructor === SimpleDOM && !args.element) {
	            continue;
	          } else if (args[_i3].constructor === Number) {
	            children.push(new SimpleElement('#text', null, args[_i3].toString()));
	          } else if (args[_i3].constructor === String) {
	            children.push(new SimpleElement('#text', null, args[_i3]));
	          } else {
	            children.push(args[_i3]);
	          }
	        }
	      }
	    }

	    appendChildren(arguments, offset);

	    return new SimpleElement(validTags[i].toUpperCase(), attributes, children, this);
	  };
	};

	for (var i = 0; i < validTags.length; i++) {
	  _loop(i);
	}

	SimpleDOM.prototype.constructor = SimpleDOM;

	module.exports = SimpleDOM;

/***/ },
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
	    this.state = {};
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

	// setState
	Emitter.prototype.setState = function () {
	  var states = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	  Object.assign(this.state, states);
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

/***/ }
/******/ ])
});
;