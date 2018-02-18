import React, { Component } from 'react'
import { render } from 'react-dom'
import Main from './Main'
import App from './App'
import ErrorBoundary from './ErrorBoundary'


class Root extends Component  {
  render () {
    return (
      <ErrorBoundary>
        <Main />
      </ErrorBoundary>
    )
  }
}

export default Root