'use strict'

import Component from './Component.js'
import Emitter from './Emitter.js'

let Simple = {
  Component,
  Emitter
}

if (window) {
  window.Simple = Simple
}

export default Simple
export {Emitter, Component}
