import React from "react";
import {  Navbar, NavLink } from "react-bootstrap";

const Navigation = () => {
    return (
  <Navbar id="topnav">
      <Navbar.Brand id="brand" href="#">Web3 WavePortal</Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse className="justify-content-end"><Navbar.Text id="navtext">
     <NavLink href="https://asialakay.net" id="brand">asialakay.net</NavLink>
     <NavLink href="https://buildspace.so/" id="brand">buildSpace.so</NavLink>
      </Navbar.Text></Navbar.Collapse>
  </Navbar>
    )}
    
export default Navigation;