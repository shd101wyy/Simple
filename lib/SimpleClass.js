'use strict'

function SimpleClass() {
}

SimpleClass.prototype.hello = function() {
  console.log('hello')
}

SimpleClass.prototype.constructor = SimpleClass


function Simple(methods) {
  let simpleObject = function(props) {
    if (!this || !(this instanceof simpleObject)) {
      return new simpleObject(props)
    }
    SimpleClass.call(this)
    this.props = props || {}
  }

  simpleObject.prototype = Object.assign(SimpleClass.prototype, methods)

  simpleObject.prototype.constructor = simpleObject

  return simpleObject
}

/*
TodoItem = Simple({
  getInitialState: ()=> {},
  render: ()=> {
    return this.div({class: 'todo-item'}, this.props.text)
  }
})

Todo = Simple({
  getInitialState: ()=> {data: ['Hello', 'World']},
  render: ()=> {
    return this.div({class: 'todo'},
              this.div({class: 'todo-title'}, 'TODO'),
              this.state.data.map(d => TodoItem({text: d}))
    )
  }
})
*/

let Test = Simple({
  getInitialState: function() {
    return {hello: 'world'}
  },
  render: function() {
    console.log('render')
  }
})

let t = Test({text: 'hello'})
console.log(t.hello())
