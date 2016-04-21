module.exports =
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

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var Component = __webpack_require__(1);
	var Emitter = __webpack_require__(4);

	var Simple = {
	  Component: Component,
	  Emitter: Emitter
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

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var SimpleBase = __webpack_require__(2);

	function createSimpleComponent(methods) {
	  var SimpleComponent = function SimpleComponent(props) {
	    if (!this || !(this instanceof SimpleComponent)) {
	      return new SimpleComponent(props);
	    }
	    SimpleBase.call(this);

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
	    this.forceUpdate(); // render element
	    this.componentDidMount();
	  };

	  SimpleComponent.prototype = Object.create(SimpleBase.prototype);

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
	    SimpleBase.call(this);

	    this.toDOM(func.call(this, props)); // render element
	  };
	  SimpleComponent.prototype = Object.create(SimpleBase.prototype);

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
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var SimpleDOM = __webpack_require__(3);

	var validTags = 'a abbr address area article aside audio b base bdi bdo big blockquote body br button canvas caption cite code col colgroup data datalist dd del details dfn dialog div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd keygen label legend li link main map mark menu menuitem meta meter nav noscript object ol optgroup option output p param picture pre progress q rp rt ruby s samp script section  select small source span strong style sub summary sup table tbody td textarea tfoot th thead time title tr track u ul var video wbr'.split(' ');

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
	  SimpleDOM.call(this);
	  this.props = this.getDefaultProps();
	  this.refs = {};
	}

	SimpleBase.prototype = Object.create(SimpleDOM.prototype);

	SimpleBase.prototype.getDefaultProps = function () {
	  return {};
	};

	SimpleBase.prototype.emit = function (name) {
	  var data = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

	  if (this.emitter) {
	    this.emitter.emit(name, data, this);
	  }
	};

	SimpleBase.prototype.render = function () {
	  throw "Render function is not implemented";
	};

	SimpleBase.prototype.remove = function () {
	  this.componentWillUnmount();

	  Object.getPrototypeOf(SimpleBase.prototype).remove.call(this);

	  this.componentDidUnmount();
	};

	SimpleBase.prototype.init = function () {};

	SimpleBase.prototype.componentDidMount = function () {};

	SimpleBase.prototype.componentWillUpdate = function () {};

	SimpleBase.prototype.componentDidUpdate = function () {};

	SimpleBase.prototype.componentWillUnmount = function () {};

	SimpleBase.prototype.componentDidUnmount = function () {};

	SimpleBase.prototype.setState = function (newState) {
	  if (this.state) {
	    Object.assign(this.state, newState);
	  }
	  this.forceUpdate();
	};

	SimpleBase.prototype.setProps = function (newProps) {
	  Object.assign(this.props, newProps);
	  this.forceUpdate();
	};

	SimpleBase.prototype.forceUpdate = function () {
	  this.componentWillUpdate();

	  this.toDOM(this.render()); // render element

	  this.componentDidUpdate();
	};

	SimpleBase.prototype.appendTo = function (obj) {
	  if (obj instanceof SimpleDOM) {
	    obj.appendChild(this);
	  } else {
	    obj.appendChild(this.element);
	  }
	  return this;
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

	    if (typeof arguments[offset] !== 'undefined' && (arguments[offset].constructor === String || arguments[offset].constructor === Number)) {
	      content = arguments[offset];
	      offset += 1;
	    }

	    children = [];
	    function appendChildren(args) {
	      for (var _i = 0; _i < args.length; _i++) {
	        if (args[_i]) {
	          if (args[_i].constructor === Array) {
	            appendChildren(args[_i]);
	          } else {
	            children.push(args[_i]);
	          }
	        }
	      }
	    }
	    for (var _i2 = offset; _i2 < arguments.length; _i2++) {
	      if (arguments[_i2]) {
	        if (arguments[_i2].constructor === Array) {
	          appendChildren(arguments[_i2]);
	        } else {
	          children.push(arguments[_i2]);
	        }
	      }
	    }
	    /*
	    if (offset < arguments.length) {
	      children = Array.prototype.slice.call(arguments, offset)
	      children = [].concat.apply([], children)
	    }
	    */

	    return new SimpleDOM(validTags[i], attributes, content, children, this);
	  };
	};

	for (var i = 0; i < validTags.length; i++) {
	  _loop(i);
	}

	SimpleBase.prototype.constructor = SimpleBase;

	module.exports = SimpleBase;

/***/ },
/* 3 */
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
	  if (el.removeEventListener) {
	    // DOM Level 2 browsers
	    el.removeEventListener(eventType, handler, false);
	  } else if (el.attachEvent) {
	    // IE <= 8
	    el.detachEvent('on' + eventType, handler);
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
	  this.tagName = tagName || null;
	  this.attributes = attributes || {};
	  this.content = content || null;
	  this.children = children || [];
	  this.owner = owner || null;

	  this.element = null; // DOM element

	  this._eventListeners = {};
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
	SimpleDOM.prototype.appendChildrenDOMElements = function (children) {
	  var _this = this;

	  if (!children.length) return;

	  children.forEach(function (child) {
	    if (child.constructor === Array) {
	      _this.appendChildrenDOMElements.apply(_this, [child]);
	    } else if (child instanceof SimpleDOM) {
	      if (!child.element) {
	        child.toDOM();
	      }
	      _this.element.appendChild(child.element);
	    } else {
	      throw 'Invalid SimpleDOM';
	    }
	  });
	};

	/**
	 * Differentiate with simpleDOM (new one) to generate DOM element
	 * @param  {[SimpleDOM]} simpleDOM [description]
	 * @return {[DOMElement]}           [description]
	 */
	SimpleDOM.prototype.toDOM = function (simpleDOM) {
	  if (!this.element || simpleDOM.tagName !== this.tagName) {
	    // element not existed [OR] different tagName, need to create DOM element again
	    var newTagName = simpleDOM ? simpleDOM.tagName : this.tagName,
	        newAttributes = simpleDOM ? simpleDOM.attributes : this.attributes,
	        newContent = simpleDOM ? simpleDOM.content : this.content,
	        newChildren = simpleDOM ? simpleDOM.children : this.children,
	        newOwner = simpleDOM ? simpleDOM.owner : this.owner;

	    var newElement = document.createElement(newTagName);

	    // set content
	    if (newContent) {
	      newElement.appendChild(document.createTextNode(newContent));
	    }

	    // set attributes
	    if (newAttributes) {
	      for (var key in newAttributes) {
	        var val = newAttributes[key];
	        if (isNativeEvent(key)) {
	          addEvent(newElement, key, val /*.bind(this.owner)*/);
	          this._eventListeners[key] = val; // save to _eventListeners
	        } else if (key === 'ref') {
	            newOwner.refs[val] = newElement;
	          } else if (key === 'style' && val.constructor === Object) {
	            for (var styleKey in val) {
	              newElement.style[styleKey] = val[styleKey];
	            }
	          } else {
	            newElement.setAttribute(key, val);
	          }
	      }
	    }

	    if (this.element && simpleDOM) {
	      // replace this.element with newElement
	      var parentNode = this.element.parentNode; // this should/must exist
	      parentNode.insertBefore(newElement, this.element);
	      this.remove();

	      this.element = newElement;

	      if (this.props && simpleDOM.props) {
	        this.props = simpleDOM.props;
	        // this.state = simpleDOM.state
	      }
	    } else {
	        this.element = newElement;
	      }

	    this.tagName = newTagName;
	    this.attributes = newAttributes;
	    this.content = newContent;
	    this.children = newChildren;
	    this.owner = newOwner;

	    // append children
	    this.appendChildrenDOMElements(this.children);

	    return this.element;
	  } else {
	    var oldAttributes = this.attributes,
	        oldContent = this.content,
	        oldElement = this.element,
	        oldChildren = this.children,
	        oldOwner = this.owner;

	    var attributes = simpleDOM.attributes,
	        content = simpleDOM.content,
	        element = simpleDOM.element,
	        children = simpleDOM.children,
	        owner = simpleDOM.owner;

	    // update Content
	    if (oldContent) {
	      if (content) {
	        var textNode = oldElement.childNodes[0];
	        textNode.nodeValue = content;
	      } else {
	        var _textNode = oldElement.childNodes[0];
	        oldElement.removeChild(_textNode);
	      }
	    } else if (content) {
	      var _textNode2 = document.createTextNode(content);
	      if (oldElement.childNodes.length) {
	        oldElement.insertBefore(_textNode2, oldElement.childNodes[0]);
	      } else {
	        oldElement.appendChild(_textNode2);
	      }
	    }

	    // update Attribute
	    if (attributes) {
	      for (var _key in attributes) {
	        var _val = attributes[_key];
	        if (isNativeEvent(_key)) {
	          if (this.attributes.hasOwnProperty(_key)) {
	            if (this.attributes[_key] === _val) {
	              // same event
	              continue;
	            } else {
	              // replace event
	              removeEvent(this.element, _key, this._eventListeners[_key]);
	              addEvent(this.element, _key, _val /*.bind(owner)*/);
	              this._eventListeners[_key] = _val;
	            }
	          } else {
	            addEvent(this.element, _key, _val /*.bind(owner)*/);
	            this._eventListeners[_key] = _val;
	          }
	        } else if (_key === 'ref') {
	          owner.refs[_val] = this.element;
	        } else if (_key === 'style' && _val.constructor === Object) {
	          // remove old inline style
	          this.element.setAttribute('style', ''); // here might be wrong
	          for (var _styleKey in _val) {
	            this.element.style[_styleKey] = _val[_styleKey];
	          }
	        } else {
	          this.element.setAttribute(_key, _val);
	        }
	      }
	    } else if (this.attributes) {
	      // remove all attributes in this.attributes
	      for (var _key2 in this.attributes) {
	        var _val2 = this.attributes[_key2];
	        if (isNativeEvent(_key2)) {
	          removeEvent(this.element, _key2, _val2); // TODO: val here is wrong. as it is not binded to this
	        } else {
	            this.element.removeAttribute(_key2);
	          }
	      }
	    }

	    // remove old attributes that are existed in the new one
	    if (attributes && this.attributes) {
	      for (var _key3 in this.attributes) {
	        if (!attributes.hasOwnProperty(_key3)) {
	          if (isNativeEvent(_key3)) {
	            removeEvent(this.element, _key3, this.attributes[_key3]);
	          } else {
	            this.element.removeAttribute(_key3);
	          }
	        }
	      }
	    }

	    // update Children
	    if (children.length === oldChildren.length) {
	      for (var i = 0; i < children.length; i++) {
	        oldChildren[i].toDOM(children[i]);
	      }
	    } else if (children.length > oldChildren.length) {
	      var _i = 0;
	      for (_i = 0; _i < oldChildren.length; _i++) {
	        oldChildren[_i].toDOM(children[_i]);
	      }

	      var j = _i;
	      for (; _i < children.length; _i++) {
	        oldChildren.push(children[_i]);
	      }

	      this.appendChildrenDOMElements(children.slice(j));
	    } else {
	      // if (children.length < oldChildren.length) {
	      var oldLength = oldChildren.length;
	      for (var _i2 = children.length; _i2 < oldLength; _i2++) {
	        oldChildren.pop().remove();
	      }

	      for (var _i3 = 0; _i3 < children.length; _i3++) {
	        oldChildren[_i3].toDOM(children[_i3]);
	      }
	    }

	    this.attributes = attributes;
	    this.content = content;
	    // this.children = children // This is wrong. Should assign like this as this.children already changed.
	    this.owner = owner;

	    if (this.props && simpleDOM.props) {
	      this.props = simpleDOM.props;
	      // this.state = simpleDOM.state
	    }

	    // update element
	    return this.element;
	  }
	};

	module.exports = SimpleDOM;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	/*
	 * Event emitter class
	 */

	var emitters = {};

	function Emitter() {
	  var initialState = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	  if (!(this instanceof Emitter)) {
	    return new Emitter(initialState);
	  }
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

	Emitter.prototype.getState = function () {
	  return this.state;
	};

	module.exports = Emitter;

/***/ }
/******/ ]);