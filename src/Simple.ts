import Component from "./Component"
import Emitter from "./Emitter"

function render(component, domElement) {
  let element = component._initialRender()
  if (element) {
    domElement.appendChild(element)
  }
}

function createEmitter(initialState) {
  return new Emitter(initialState)
}

let Simple = {
  Component,
  Emitter,
  createEmitter,
  render
}

if (typeof(window) !== 'undefined') {
  window['Simple'] = Simple
}

if (typeof(module) !== 'undefined') {
  module.exports = Simple
}

export default Simple
export {Component, Emitter, createEmitter, render}
