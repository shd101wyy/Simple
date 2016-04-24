let Demo = Simple.Component(function(message) {
  return this.div(message)
})

Simple.render(Demo('Hello World'), document.getElementById('app'))
