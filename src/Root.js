import React, { Component } from 'react'
import { render } from 'react-dom'
import { Provider as AlertProvider } from 'react-alert'
import App from './App'
import ErrorBoundary from './ErrorBoundary'
import AlertTemplateCustom from './AlertTemplateCustom'

// optional cofiguration
const options = {
  position: 'bottom center',
  timeout: 0,//5000,
  offset: '30px',
  transition: 'scale'
}

class Root extends Component  {
  render () {
    return (
      <AlertProvider template={AlertTemplateCustom} {...options}>
          <ErrorBoundary>
          <App />
          </ErrorBoundary>
      </AlertProvider>
    )
  }
}

export default Root