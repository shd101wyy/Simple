/*
let Demo = Simple.Component(function(message) {
  return this.div(message)
})

Simple.render(Demo('Hello World'), document.getElementById('app'))
*/

/*
let Greetings = Simple.Component(function(name) {
  return this.div(`Hello ${name}!`)
})

Simple.render(Greetings('Sexy Aaron'), document.body)
*/

/*
let EventComponent = Simple.Component({
  init: function() {
    this.state = {count: 1}
  },
  render: function() {
    return this.div(
              this.p(this.state.count + ' seconds 🐸'),
              this.button({'click': this.onClick.bind(this)}, '+1s'))
  },
  onClick: function() {
    let count = this.state.count
    this.setState({'count': count+1})   // setState function will render the element again
  }
})

Simple.render(EventComponent(), document.getElementById('app'))
*/

/*
let TodoItem = Simple.Component(function(todo) {
  return this.div({style: {width: '400px', height: '16px', marginBottom: '6px'}},
            todo)
})

let TodoList = Simple.Component({
  getDefaultProps: function() {
    return {title: 'No title defined',
						data: ['Too young too simple', 'Sometimes native']}
  },
  render: function() {
    return this.div({class: 'todo-list'},
              this.h2(this.props.title),
              this.props.data.map(todo => TodoItem( todo )))
  }
})

let todoList = TodoList({title: 'My TODO List. (I don\'t like the default one)'})
Simple.render(todoList, document.getElementById('app'))
*/

let emitter = Simple.createEmitter({
		todos: ['TODO Item 1', 'TODO Item 2']  // initial state
})

emitter.on('delete-todo', function(offset, component) {
  let todos = this.state.todos
  todos.splice(offset, 1)
  component.setProps({todos})
})

emitter.on('add-todo', function(todo, component) {
  let todos = this.state.todos
  todos.push(todo)
  component.setProps({todos})
})

let TodoItem = Simple.Component({
  render: function() {
    return this.div({style: 'clear: both; padding: 12px;', key: this.props.key},
              this.p({style: 'float: left; margin: 0 24px 0 0; margin-right: 24px;' }, this.props.text),
              this.button({click: this.deleteTodoItem.bind(this)}, 'x'))
  },
	componentWillUnmount: function() {
		console.log('componentWillUnmount', this.props.text)
	},
  componentDidUpdate: function() {
    console.log('did update')
    console.log(this.props.text)
  },
  deleteTodoItem: function() {
    this.props.remove(this.props.key)
  }
})

let Todo = Simple.Component({
  emitter: emitter,
  getDefaultProps: function() {
    return {todos: this.emitter.state.todos}
  },
  render: function() {
    return this.div({class: 'todo'},
              this.h2({class: 'todo-title'}, this.props.title),
              this.div({class: 'add-item-container'},
                this.input({placeholder: 'add new item here', ref: 'inputBox'}),
                this.button({click: this.clickAddItem.bind(this)}, 'Add Item')),
              this.props.todos.map((d, i) => TodoItem({text: d, 'key': i, remove: this.removeItem.bind(this) })))
  },
  clickAddItem: function() {
    this.emit('add-todo', this.refs.inputBox.value)
  },
  removeItem: function(offset) {
    this.emit('delete-todo', offset)
  }
})

let todo = Todo({title: 'This is TODO'})
Simple.render(todo, document.getElementById('app'))
