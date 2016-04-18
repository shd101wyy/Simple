'use strict'

let Demo = Simple({
  render: function() {
    return  this.div(this.props.message)
  }
})

Demo({message: 'Hello World'}).appendTo(document.getElementById('app'))

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
    return this.div({class: 'todo-item'}, this.props.text)
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
                this.button({click: this.clickAddItem.bind(this)}, 'Add Item')),

              this.state.data.map(d => TodoItem({text: d}) ) )
  },
  onChange: function(e) {
    console.log('change')
    console.log(e.target.value)
  },
  clickAddItem: function() {
    this.addItem(this.refs.inputBox.value)
  },
  addItem: function(item) {
    this.state.data.push(item)
    this.setState(this.state) // or this.forceUpdate
  }
})

let todo = Todo({title: 'This is TODO'}).appendTo(document.getElementById('app'))
*/
