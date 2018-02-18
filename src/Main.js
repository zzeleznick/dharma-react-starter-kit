import React, {Component} from 'react'
import { Switch, Route } from 'react-router-dom'
import App from './App'
import Header from './Header'
import OrderBook from './components/OrderBook'

import { Provider as AlertProvider } from 'react-alert'
import AlertTemplateCustom from './AlertTemplateCustom'

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"

// optional cofiguration
const options = {
  position: 'bottom center',
  timeout: 0,//5000,
  offset: '30px',
  transition: 'scale'
}
class WrappedApp extends Component  {
    render() {
        return (
          <AlertProvider template={AlertTemplateCustom} {...options}>
           <App />
         </AlertProvider>
    )
  }
}

const Main = () => (
  <main>
  <Header />
    <Switch>
      <Route exact path='/' component={WrappedApp}/>
      <Route path='/orders' component={OrderBook}/>
    </Switch>
  </main>
)

export default Main
