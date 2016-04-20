'use strict'
/*
let Greetings = Simple(function(name) {
  return this.div(`Hello ${name}!`)
})

Greetings('Sexy Aaron').appendTo(document.body)
*/
/*
let Demo = Simple({
  props: {message: 'default message'},
  render: function() {
    return  this.div({class: 'sample-div'}, this.props.message)
  }
})

Demo({message: 'Hello World'}).appendTo(document.getElementById('app'))
*/
/*
let emitter = Simple.Emitter({count: 1})
emitter.on('request-seconds', function(component) {
  component.updateProps({count: this.state.count})
})
emitter.on('add-1', function(component) {
  this.state.count += 1
  component.updateProps({count: this.state.count})
})

let EventComponent = Simple.Component({
  emitter: emitter,
  init: function() {
    this.emit('request-seconds')
  },
  render: function() {
    return this.div(
              this.p(this.props.count + ' seconds 🐸'),
              this.button({'click': ()=>{ this.emit('add-1')} },
                '+1s'))
  }
})

EventComponent().appendTo(document.body)
*/

/*
let TodoItem = Simple({
  render: function() {
    return this.div({style: {width: '400px', height: '16px', marginBottom: '6px'}},
              this.props.todo)
  }
})

let TodoList = Simple({
  props: {title: 'No title defined'},
  state: {data: ['Too young too simple', 'Sometimes native']},  // initial state
  render: function() {
    return this.div({class: 'todo-list'},
              this.h2(this.props.title),
              this.state.data.map(d => TodoItem({'todo': d})))
  }
})

let todoList = TodoList({title: 'My TODO List. (I don\'t like the default one)'})
todoList.appendTo(document.getElementById('app'))
*/

/*
let Demo = Simple({
  state: {count: 1},
  init: function() {
    this.onClick = this.onClick.bind(this)
  },
  render: function() {
    return this.div(
              this.p(this.state.count),
              this.button({click: this.onClick}, '+1'))
  },
  onClick: function() {
    let count = this.state.count + 1
    this.setState({count: count})
  }
})

Demo().appendTo(document.getElementById('app'))
*/
/*
let Demo = Simple({
  state: {count: 1},
  init: function() {
    this.onClick = this.onClick.bind(this)
  },
  render: function() {
    if (this.state.count % 2 === 0) {
      return this.div(
                this.h1(this.state.count),
                this.button({click: this.onClick.bind(this)}, '+1')
      )
    } else {
      return this.div(
                this.p(this.state.count),
                this.button({click: this.onClick.bind(this) }, '+1'))
    }
  },
  onClick: function() {
    let count = this.state.count
    this.setState({count: count + 1})
  }
})

Demo().appendTo(document.getElementById('app'))
*/
/*
let emitter = Simple.Emitter({
  inputText: ''
})

emitter.on('input', function(component, val) {
  this.state.inputText = val
  component.updateProps({text: val})
})

let Demo = Simple.Component({
  emitter: emitter,
  getDefaultProps: function() {
    return {title: 'default titile', text: ''}
  },
  render: function() {
    return  this.div(
              this.h4(this.props.title),
              this.input({input: (e)=> {this.emit('input', e.target.value)},
                          placeholder: 'enter your text here',
                          value: this.props.text}),
              this.p(this.props.text))
  }
})

Demo({title: 'This is a demo'}).appendTo(document.getElementById('app'))
*/

let emitter = Simple.Emitter({
  todos: ['TODO Item 1', 'TODO Item 2']
})

emitter.on('delete-todo', function(component, offset) {
  let todos = this.state.todos
  todos.splice(offset, 1)
  component.updateProps({todos})
})

emitter.on('add-todo', function(component, todo) {
  let todos = this.state.todos
  todos.push(todo)
  component.updateProps({todos})
})

let TodoItem = Simple.Component({
  render: function() {
    return this.div({style: 'clear: both; padding: 12px;', key: this.props.key},
              this.p({style: 'float: left; margin: 0 24px 0 0; margin-right: 24px;' }, this.props.text),
              this.button({click: this.deleteTodoItem.bind(this)}, 'x'))
  },
  deleteTodoItem: function() {
    this.props.remove(this.props.key)
  },
  componentWillUnmount: function() {
    let x = this.props.text
    console.log(x)
  }
})

let Todo = Simple.Component({
  emitter: emitter,
  getDefaultProps: function() {
    return {todos: this.emitter.getState().todos}
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

let todo = Todo({title: 'This is TODO'}).appendTo(document.getElementById('app'))

/*
let TodoList = Simple({
  render: function() {
    let createItem = (item)=> {
      return this.li( item.text)
    }
    return this.ul(this.props.items.map(createItem))
  }
})

let TodoApp = Simple({
  state: {items: [], text: ''},
  onInput: function(e) {
    this.setState({text: e.target.value})
  },
  handleSubmit: function(e) {
    e.preventDefault()
    let nextItems = this.state.items.concat([{text: this.state.text, id: Date.now()}]);
    let nextText = '';
    this.setState({items: nextItems, text: nextText});
  },
  render: function() {
    return this.div(
            this.h3('TODO '),
            TodoList({items: this.state.items}),
            this.form({submit: this.handleSubmit.bind(this)},
              this.input({input: this.onInput.bind(this), value: this.state.text}),
              this.button(`Add #${this.state.items.length + 1}`)))
  }
})

TodoApp().appendTo(document.getElementById('app'))
*/

/*
let PressureTest = Simple({
  init: function() {
    this.state = {count: 1000}
  },
  render: function() {
    let divs = []
    for (let i = 0; i < this.state.count; i++) {
      divs.push(this.div(i))
    }
    return this.div(
              divs)
  }
})


let pressureTest = PressureTest().appendTo(document.getElementById('app'))
pressureTest.setState({count: 20000})

pressureTest.setState({count: 100})
pressureTest.setState({count: 30000})
pressureTest.setState({count: 500})
*/

/*
let emitter = Simple.Emitter({count: 1})

emitter.on('add', function(count) {
  this.state.count += count
  return {count: count}
})

emitter.emit('add', 3)
emitter.emit('add', 5)
console.log(emitter.getState())
*/
