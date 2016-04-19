
<!-- toc -->

- [Simple](#simple)
	- [Introduction](#introduction)
	- [How *Simple* Works](#how-simple-works)
	- [SimpleComponent Lifecycle](#simplecomponent-lifecycle)
	- [Use wrapped native DOM elements](#use-wrapped-native-dom-elements)
	- [Create your own SimpleComponent](#create-your-own-simplecomponent)
	- [Create Stateless Component](#create-stateless-component)
	- [Bind Event for Component](#bind-event-for-component)
	- [Embed Component inside another Component](#embed-component-inside-another-component)
	- [Todo List Example](#todo-list-example)
	- [Emitter (not implemented experimental feature)](#emitter-not-implemented-experimental-feature)
	- [How to use this library](#how-to-use-this-library)
	- [Thanks](#thanks)

<!-- tocstop -->


### Simple
*under development. API might change*

#### Introduction
**Simple** is a very **Simple** front-end library created by Yiyi Wang (shd101wyy)  
It is extremely small and blazingly fast (*maybe*).  
The idea of this library is from [React](https://facebook.github.io/react/) and Atom Editor [space-pen](https://github.com/atom-archive/space-pen)

```javascript
let Demo = Simple(function(message) {
  return this.div(message)
})

Demo('Hello World').appendTo(document.getElementById('app'))
```

#### How *Simple* Works
Core of **Simple** mainly consists of 3 parts:
```
SimpleComponent <= SimpleBase <= SimpleDOM
```
* **SimpleDOM**  
Low level abstraction for fast DOM manipulation.  
You can regard **SimpleDOM** as a kind of Virtual DOM, which helps improve DOM rendering speed.  
Many native DOM element such as `div, button, p` are already wrapped by **SimpleDOM** for you.

* **SimpleBase**  
Inherited from **SimpleDOM**, **SimpleBase** is a higher level abstraction.  
It offers many basic prototype functions such as `getDefaultProps`, etc.  

* **SimpleComponent**  
Inherited from **SimpleBase**, **SimpleComponent** is user-defined and highly flexible.  

#### SimpleComponent Lifecycle  
1. `init()`  
Called only once before the element is rendered. You should put all your initialization here.  

2. `componentDidMount`  
Called only once immediately after the element is rendered.  

3. `componentWillUpdate`  
Called every time when `state` is updated by `setState` or `forceUpdate` is called.   
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

#### Create your own SimpleComponent  
```javascript
let MyComponent = Simple({            
    render: function() {               // render function has to be defined.
      return this.div({class: 'my-component'}, 'Hello World')
    }
})

MyComponent().appendTo(document.body)
```

#### Create Stateless Component
```javascript
let Greetings = Simple(function(name) {
  return this.div(`Hello ${name}!`)
})

Greetings('Sexy Aaron').appendTo(document.body)
```

#### Bind Event for Component
**Simple** supports all native browser events such as `click`, `input`, and so on  
The example below shows how to bind `click` event to our `button`, so that each time we click the button, the `p` will update its content
```javascript
let EventComponent = Simple({
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
We can use our defined **SimpleComponent** inside another **SimpleComponent**  
For example:
```javascript
let TodoItem = Simple(function(todo) {
  return this.div({style: {width: '400px', height: '16px', marginBottom: '6px'}},
            todo)
})

let TodoList = Simple({
  getDefaultProps: function() {
    return {title: 'No title defined'}
  },
  init: function() {
    this.state = {data: ['Too young too simple', 'Sometimes native']}  // initial state
  },
  render: function() {
    return this.div({class: 'todo-list'},
              this.h2(this.props.title),
              this.state.data.map(todo => TodoItem( todo )))
  }
})

let todoList = TodoList({title: 'My TODO List. (I don\'t like the default one)'})
todoList.appendTo(document.getElementById('app'))
```

The rendered result is like below   
![screen shot 2016-04-18 at 4 15 23 pm](https://cloud.githubusercontent.com/assets/1908863/14620133/cd886b12-0580-11e6-9dee-039e966591ec.png)


#### Todo List Example
The **Todo List** code sample is referred from [React](https://facebook.github.io/react/) website but written by **Simple** library.
```javascript
// Todo List example written by Simple
let TodoList = Simple({
  render: function() {
    let createItem = (item)=> {
      return this.li(item.text)
    }
    return this.ul(this.props.items.map(createItem))
  }
})

let TodoApp = Simple({
  init: function() {
    this.state = {items: [], text: ''}
  },
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
```

#### Emitter (not implemented experimental feature)
```javascript
let App = Simple({
  getDefaultProps: function() {
    return {name: 'Steve',
            emitter: new Emitter()} // create emitter
  },
  render: function() {
    return this.div(`My name is ${this.props.name}`)
  },
  changeName: function(newName) {
    this.props.name = newName
    this.props.emitter.emit('name-did-change')
  },
  onDidChangeName: function(callback) {
    this.props.emitter.on('name-did-change', callback)
  }
})
```

#### How to use this library
I haven't published this library on `npmjs` yet since this library is still under development.  
The only way to use this library right now is to download it and include the `Simple.js` file in `html` file.  

```html
<head>
  <script src="blablabla/Simple.js"> </script>
</head>
```

#### Thanks

> MIT License  
仅以此库祭奠我逝去的青春 eru pusai kongguruu
