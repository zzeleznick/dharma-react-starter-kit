import React from 'react'
import { Link } from 'react-router-dom'

// The Header creates links that can be used to navigate
// between routes.
const Header = () => (
  <header>
    <nav>
      <ul>
        <ul><Link to='/'>Home</Link></ul>
        <ul><Link to='/orders'>Orders</Link></ul>
      </ul>
    </nav>
  </header>
)

export default Header