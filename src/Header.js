import React from 'react'
import { Link } from 'react-router-dom'
import { Nav, Navbar, NavItem} from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap';

// The Header creates links that can be used to navigate
// between routes.
const Header = () => (
  <Navbar inverse
    style={{height: '80px'}}
  >
  <Navbar.Header>
    <Navbar.Brand>
      <Link to='/'>Home</Link>
    </Navbar.Brand>
  </Navbar.Header>
  <Nav>
    <LinkContainer to="/orders">
        <NavItem eventKey={1}> Orders </NavItem>
    </LinkContainer>
  </Nav>
</Navbar>
)

export default Header