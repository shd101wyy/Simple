let emitter = Simple.Emitter({count: 0})

emitter.on('init-app', function() {
  return {count: this.state.count}
})

emitter.on('click-button', function() {
  this.state.count += 1
  return {count: this.state.count}
})

let App = Simple.Component(
  init(): function() {
    this.emitter = emitter
    this.emit('init-app')
  },
  render: function() {
    return this.div(
            this.p(this.props.count),
            this.button({click: ()=> {this.emit('click-button')}}, '+1s')
    )
  }
)

App().appendTo(document.getElementById('app'))

/**
 * ============================================
 * ============================================
 * ============================================
 * ============================================
 */

let emitter = new Simple.Emitter({
  todos: ['Todo1', 'Todo2']
})

let TodoItem = Simple.Component({
  render: function() {
    return this.div({class: 'todo-item'},
              this.p(this.props.todo))
  }
})


emitter.on('request-todos', function() {
  return this.state.todos
})

let Todo = Simple.Component({
  init: function() {
    this.emitter = emitter
    this.emit('request-todos')
  },
  render: function() {
    return this.div({class: 'todo'},
      this.div(
        this.input({ref: 'inputBox'}),
        this.button({click: this.addTodo.bind(this)}, Add Todo)
      )
      this.props.todos.map(todo => TodoItem({todo}))
    )
  },

  addTodo: function() {
    let inputBox = this.refs.inputBox
  }
})

Todo().appendTo(document.body)
/*
// ===========================================

let emitter = Simple.Emitter({text: 'This is my text'})

emitter.on('new-text', function(text) {
  this.updateState({text: text})
})

emitter.on('get-data', function() {
  $
    .ajax('post')
    .done(()=> {
      this.updateState({text: text})
    })
})

emitter.emit('new-text', 'Hello World')
emitter.getState() // => {'new-text', 'Hello World'}

emitter.destroy()
*/
