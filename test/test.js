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
