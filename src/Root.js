import React, { Component } from 'react'
import { render } from 'react-dom'
import { Provider as AlertProvider } from 'react-alert'
// import Main from './Main'
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
      <ErrorBoundary>
        <AlertProvider template={AlertTemplateCustom} {...options}>
          <App />
        </AlertProvider>
      </ErrorBoundary>
    )
  }
}

export default Root