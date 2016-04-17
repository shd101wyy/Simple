## Simple
Simple is a very Simple front-end library by Yiyi Wang (shd101wyy)

*under development*

```javascript

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

Simple.render(Todo(), document.getElementById('app'))

```
