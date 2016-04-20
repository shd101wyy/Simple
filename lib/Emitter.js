'use strict'
/*
 * Event emitter class
 */
function Emitter(initialState = {}) {
  if (!(this instanceof Emitter)) {
    return new Emitter(initialState)
  }
  this.state = initialState
  this.subscriptions = {}
}
Emitter.prototype.constructor = Emitter

// emitter.emit()
Emitter.prototype.emit = function(name, data=null, sender=null) {
  if (this.subscriptions[name]) {
    if (!sender) {
      this.subscriptions[name].call(this, data)
    } else {
      this.subscriptions[name].call(this, sender, data)
    }
  }
}

// emitter.on()
// callback should be
// - function(data, component) {
//   }
Emitter.prototype.on = function() {
  if (arguments.length === 2) {
    let name = arguments[0],
        callback = arguments[1]
    if (this.subscriptions[name]) {
      throw `Error: ${name} is already registered in Emitter object`
    } else {
      this.subscriptions[name] = callback
    }
  } else {
    let obj = arguments[0]
    for (let name in obj) {
      this.on(name, obj[name])
    }
  }
}


Emitter.prototype.destroy = function() {
  this.state = {}
  this.subscriptions = {}
}

Emitter.prototype.getState = function() {
  return this.state
}

export default Emitter
