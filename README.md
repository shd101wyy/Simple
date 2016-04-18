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

* **SimpleBase**
Inherited from **SimpleDOM**, **SimpleBase** is a higher level abstraction.
It offers many basic prototype functions such as `getInitialState`, `getDefaultProps`, etc.

* **SimpleComponent**
Inherited from **SimpleBase**, **SimpleComponent** is highly user-defined and flexible.

#### SimpleComponent Lifecycle
1. `init()`
Called only once before the element is rendered

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
