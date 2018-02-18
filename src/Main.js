import React from 'react'
import { Switch, Route } from 'react-router-dom'
import App from './App'
import Header from './Header'
import OrderBook from './components/OrderBook'

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"

const Main = () => (
  <main>
  <Header />
    <Switch>
      <Route exact path='/' component={App}/>
      <Route path='/orders' component={OrderBook}/>
    </Switch>
  </main>
)

export default Main
