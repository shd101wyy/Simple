'use strict'

let Test = Simple({
  render: function() {
    return this.div({'this-is-div': true, click: this.myClick }, this.props.text,
              this.div('hello world'),
              this.div('until i die'),
              this.div('but this is not possible'),
              this.div('I am here with you'))
  },
  myClick: function(event) {
    console.log('clicked me')
  }
})

let t = Test({text: 'hello'})
t.appendTo(document.getElementById('app'))
