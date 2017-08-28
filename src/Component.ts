import SimpleDOM from "./SimpleDOM"

function createSimpleComponent(methods:object) {
  let SimpleComponent = function(props, ...children):void {
    if (!this || !(this instanceof SimpleComponent)) {
      return new SimpleComponent(props)
    }
    SimpleDOM.call(this, props, children)
  }

  SimpleComponent.prototype = Object.create(SimpleDOM.prototype)

  for (let key in methods) {
    SimpleComponent.prototype[key] = methods[key]
  }

  SimpleComponent.prototype.constructor = SimpleComponent

  return SimpleComponent
}

function createStatelessSimpleComponent(func:Function) {
  function SimpleComponent(...args):void {
    if (!this || !(this instanceof SimpleComponent)) {
      return new SimpleComponent(...args)
    }
    this.render = func.bind(this, args)
    SimpleDOM.call(this, null, [])
  }
  SimpleComponent.prototype = Object.create(SimpleDOM.prototype)
  SimpleComponent.prototype.render = func
  SimpleComponent.prototype.constructor = SimpleComponent

  return SimpleComponent
}

/**
 * Create Component
 */
function Component(arg:Function|object) {
  if (arg.constructor === Function) {
    return createStatelessSimpleComponent(arg as Function)
  } else {
    return createSimpleComponent(arg as object)
  }
}

export default Component
