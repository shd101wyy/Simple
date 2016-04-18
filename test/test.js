'use strict'

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
let EventComponent = Simple({
  state: {'count': 1},
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

EventComponent().appendTo(document.getElementById('app'))
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
  state: {message: 'hello'},
  render: function() {
    return  this.div({class: 'sample-div'}, this.state.message)
  }
})

let demo = Demo().appendTo(document.getElementById('app'))
demo.setState({message: 'world'})
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
let Demo = Simple({
  state: {text: ''},
  render: function() {
    return  this.div(
              this.h4(this.props.title),
              this.input({input: this.onChangeInput.bind(this),
                          placeholder: 'enter your text here',
                          value: this.state.text}),
              this.p(this.state.text))
  },
  onChangeInput: function(e) {
    let text = e.target.value
    this.setState({text: text})
  }
})

Demo({title: 'This is a demo'}).appendTo(document.getElementById('app'))
*/


let TodoItem = Simple({
  render: function() {
    return this.div({class: 'todo-item', style: 'clear: both; padding: 12px;', key: this.props.key},
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

let Todo = Simple({
  state: {data: ['TODO Item 1', 'TODO Item 2']},
  render: function() {
    return this.div({class: 'todo'},
              this.h2({class: 'todo-title'}, this.props.title),
              this.div({class: 'add-item-container'},
                this.input({placeholder: 'add new item here', ref: 'inputBox'}),
                this.button({click: this.clickAddItem.bind(this)}, 'Add Item')),
              this.state.data.map((d, i) => TodoItem({text: d, 'key': i, remove: this.removeItem.bind(this) })))
  },
  clickAddItem: function() {
    this.addItem(this.refs.inputBox.value)
  },
  addItem: function(item) {
    this.state.data.push(item)
    this.setState(this.state) // or this.forceUpdate
  },
  removeItem: function(offset) {
    let data = this.state.data
    data.splice(offset, 1)
    this.forceUpdate()
  }
})

let todo = Todo({title: 'This is TODO'}).appendTo(document.getElementById('app'))
