## Simple
*under development*

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
