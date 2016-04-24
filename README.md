
<!-- toc -->

- [Simple](#simple)
	- [Introduction](#introduction)
	- [Component](#component)
		- [How *Simple* View Layer Works](#how-simple-view-layer-works)
		- [Component Lifecycle](#component-lifecycle)
		- [Use wrapped native DOM elements](#use-wrapped-native-dom-elements)
		- [Create your own Component](#create-your-own-component)
		- [Create Stateless Component](#create-stateless-component)
		- [Bind Event for Component](#bind-event-for-component)
		- [Embed Component inside another Component](#embed-component-inside-another-component)
	- [Emitter](#emitter)
		- [How to use Emitter](#how-to-use-emitter)
	- [Combine Component with Emitter](#combine-component-with-emitter)
		- [TODO Example using Component and Emitter](#todo-example-using-component-and-emitter)
	- [How to use this library](#how-to-use-this-library)
	- [Thanks](#thanks)

<!-- tocstop -->

## Simple
*Under Development. Fast Release Cycle on NPM. API might change*  
created by Yiyi Wang (shd101wyy)  

### Introduction
**Simple** is a very **Simple** front-end library  without any extra dependencies.  
It is extremely small and blazingly fast (*maybe*).  
The idea of this library is from [React](https://facebook.github.io/react/) and Atom Editor [space-pen](https://github.com/atom-archive/space-pen)

```javascript
let Demo = Simple.Component(function(message) {
  return this.div(message)
})

Simple.render(Demo('Hello World'), document.getElementById('app'))
```
### Component
**View** contains many **Components**
#### How *Simple* View Layer Works
Core of **Simple** mainly consists of 3 parts:
```
Component <= SimpleDOM
```
* **SimpleDOM**  
Low level abstraction for fast DOM manipulation.   
You can regard **SimpleDOM** as a kind of Virtual DOM, which helps improve DOM rendering speed.   
Many native DOM element such as `div, button, p` are already wrapped by **SimpleDOM** for you.  
It also offers many basic prototype functions such as `getDefaultProps`, etc.

* **Component**  
Inherited from **SimpleDOM**, **Component** is user-defined and highly flexible.  

#### Component Lifecycle  
1. `init()`  
Called only once before the element is rendered. You should put all your initialization here.  

2. `componentDidMount`  
Called only once immediately after the element is rendered.  

3. `componentWillUpdate`  
Called every time when `state` or `props` is updated or `forceUpdate` is called.   
This is not called for the initial render.  

4. `componentDidUpdate`  
Called immediately after the element is done with updating rendering.  
This is not called for the initial render.  

5. `componentWillUnmount`  
Called right before the element is removed.  

6. `componentDidUnmount`  
Called after the element is removed.  

#### Use wrapped native DOM elements
```html
<div> Hello World </div>

<div class="my-div"> This is my div </div>

<div style="background-color: #454545">
  <h1 style="font-size: 48px;"> This is a Heading </h1>
  <p> Very Cool </p>
</div>
```
Using **Simple**, we can rewrite that as
```javascript

this.div('Hello World')

this.div({class: 'my-div'}, 'This is my div')

this.div({style: 'background-color: #454545'},
  this.h1({style: {fontSize: '48px'}}, 'This is a Heading')  // you can also define style as Object
  this.p('Very Cool'))
```

Basically, it is in the format of
```javascript
this.tagName([attributes], [content], [children]) // attributes, content, children can be omitted
```

#### Create your own Component  
```javascript
let MyComponent = Simple.Component({            
    render: function() {               // render function has to be defined.
      return this.div({class: 'my-component'}, 'Hello World')
    }
})

Simple.render(MyComponent(), document.body)
```

#### Create Stateless Component
```javascript
let Greetings = Simple.Component(function(name) {
  return this.div(`Hello ${name}!`)
})

Simple.render(Greetings('Sexy Aaron'), document.body)
```

#### Bind Event for Component
**Simple** supports all native browser events such as `click`, `input`, and so on  
The example below shows how to bind `click` event to our `button`, so that each time we click the button, the `p` will update its content
```javascript
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
```
<img src="https://cloud.githubusercontent.com/assets/1908863/14619875/5093c6ac-057f-11e6-8f80-67f90a614115.gif" width=500>

#### Embed Component inside another Component
We can use our defined **Component** inside another **Component**  
For example:
```javascript
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
```

The rendered result is like below   
![screen shot 2016-04-18 at 4 15 23 pm](https://cloud.githubusercontent.com/assets/1908863/14620133/cd886b12-0580-11e6-9dee-039e966591ec.png)

### Emitter
**Emitter** is the **Simple** library event layer.  
Each **emitter** object should contain a **state** that is used to store your application data.  
#### How to use Emitter
```javascript
let emitter = Simple.createEmitter({count: 1})  // define a emitter with initial state

emitter.on('add', function(num) {
	let count = this.state.count // get count that is stored in state
	this.state.count += num      // update count
})

emitter.emit('add', 2)         // emit 'add' event with data '2'
emitter.emit('add', 3)         // ...

emitter.state						 //  => {count: 6}
```

### Combine Component with Emitter
For the most of time, it is not recommended that a **Component** has state.  
Instead, we use a **Emitter** to store the state and control the **Component**.

#### TODO Example using Component and Emitter
```javascript
let emitter = Simple.createEmitter(function() {
	this.state = {
		todos: ['TODO Item 1', 'TODO Item 2']  // initial state
	}
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

emitter.emit('add-todo', 'This is new TODO item', todo)  // emitter.emit([name], [data], [component])
// or
todo.emit('add-todo', 'This is another ner TODO item')
```

With **Component** and **Emitter**, we can build well-structured web applications ;)

### How to use this library
I haven't published this library on `npmjs` yet since this library is still under development.  
The only way to use this library right now is to download it and include the `Simple.js` file in `html` file.  

```html
<head>
  <script src="blablabla/Simple.js"> </script>
</head>
```

### Thanks

> MIT License  
仅以此库祭奠我逝去的青春 eru pusai kongguruu
