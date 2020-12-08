import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { Container, Col, Form, Row, FormGroup, Label, Input, Button } from 'reactstrap';

import { Collapse, Navbar, Nav, NavItem, NavLink, NavbarToggler, NavbarBrand } from 'reactstrap';
// import Main from './components/HomeComponent.js'
import Main from './components/mainComponent/MainComponent';

function App() {
  return (
    <div>
      <Main />
    </div >
  );
}
export default App;
