## Simple
*under development. API might change*

#### Introduction
**Simple** is a very **Simple** front-end library created by Yiyi Wang (shd101wyy)
The idea of this library is from [React](https://facebook.github.io/react/) and Atom Editor [space-pen](https://github.com/atom-archive/space-pen)

```javascript
let Demo = Simple({
  render: function() {
    return  this.div(this.props.message)
  }
})

Demo({message: 'Hello World'}).appendTo(document.getElementById('app'))
```

#### How *Simple* Works
Core of **Simple** mainly consists of 3 parts:
```
SimpleComponent <= SimpleBase <= SimpleDOM
```
* **SimpleDOM**
Low level prototype for DOM manipulation.  
You can regard **SimpleDOM** as a kind of Virtual DOM, which improves DOM rendering speed.  
Many native DOM element such as `div, button, p` are already wrapped by **SimpleDOM** for you

* **SimpleBase**  
Inherited from **SimpleDOM**, **SimpleBase** is a higher level abstraction.  
It offers many basic prototype functions such as `getInitialState`, `getDefaultProps`, etc.  

* **SimpleComponent**  
Inherited from **SimpleBase**, **SimpleComponent** is highly user-defined and flexible.  

#### SimpleComponent Lifecycle  
1. `init()`  
Called only once before the element is rendered. You should put all your initialization here  

2. `componentDidMount`  
Called only once immediately after the element is rendered  

3. `componentWillUpdate`  
Called every time when `state` is updated by `setState`. This is not called for the initial render  

4. `componentDidUpdate`  
Called immediately after the element is done with updating rendering. This is not called for the initial render  

5. `componentWillUnmount`  
Called right before the element is removed  

6. `componentDidUnmount`  
Called after the element is removed  

#### Create a SimpleComponent  
```javascript
let MyComponent = Simple({            
    render: function() {               // render function has to be defined.
      return this.div({class: 'my-component'}, 'Hello World')
    }
})

MyComponent().appendTo(document.body)
```

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

#### Bind Event for Component
**Simple** supports all native browser events such as `click`, `input`, and so on  
The example below shows how to bind `click` event to our `button`, so that each time we click the button, the `p` will update its content
```javascript
let EventComponent = Simple({
  state: {'count': 1},
  render: function() {
    return this.div(
              this.p('The count is: ' + this.state.count),
              this.button({'click': this.onClick.bind(this)}, '+1s'))
  },
  onClick: function() {
    let count = this.state.count
    this.setState({'count': count+1})   // setState function will render the element again
  }
})
```
