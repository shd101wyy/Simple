'use strict'

/*
let Demo = Simple({
  render: function() {
    return  this.div({class: 'sample-div'}, this.props.message)
  }
})

Demo({message: 'Hello World'}).appendTo(document.getElementById('app'))
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


let Demo = Simple({
  state: {count: 1},
  render: function() {
    return this.div(
              this.p(this.state.count),
              this.button({click: this.onClick.bind(this)}, '+1'))
  },
  onClick: ()=> {
    let count = this.state.count + 1
    this.setState({count: count})
  }
})

Demo().appendTo(document.getElementById('app'))

/*
let Demo = Simple({
  state: {text: ''},
  render: function() {
    return  this.div(
              this.h4(this.props.title),
              this.input({input: this.onChangeInput,
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

/*
let TodoItem = Simple({
  render: function() {
    return this.div({class: 'todo-item', key: this.props.key},
              this.p(this.props.text),
              this.button({click: this.deleteTodoItem}, 'x'))
  },
  deleteTodoItem: function() {
    this.props.remove(this.props.key)
  }
})

let Todo = Simple({
  state: {data: ['TODO Item 1', 'TODO Item 2']},
  init: function() {
  },
  render: function() {
    return this.div({class: 'todo'},
              this.div({class: 'todo-title'}, this.props.title),
              this.div({class: 'add-item-container'},
                this.input({placeholder: 'add new item here', ref: 'inputBox'}),
                this.button({click: this.clickAddItem}, 'Add Item')),
              this.state.data.map((d, i) => TodoItem({text: d, 'key': i, remove: this.removeItem.bind(this) })))
  },
  clickAddItem: function() {
    this.addItem(this.refs.inputBox.value)
  },
  addItem: function(item) {
    this.state.data.push(item)
    this.setState(this.state) // or this.forceUpdate
    console.log(this.state.data)
  },
  removeItem: function(offset) {
    let data = this.state.data
    data.splice(offset, 1)
    this.forceUpdate()
  }
})

let todo = Todo({title: 'This is TODO'}).appendTo(document.getElementById('app'))
*/
