Dispatcher = require('flux').Dispatcher
React = require('react')
ReactHome = require('views/home')
$ = require('jquery')

$(document).ready ->
  element = document.querySelector('#component')
  React.renderComponent ReactHome(), element
