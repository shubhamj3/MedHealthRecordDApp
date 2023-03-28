import React, { Component } from 'react';
import logo from '../logo.png'

class Navbar extends Component {

  render() {
    return (
      <nav className="navbar navbar-dark bg-dark p-0 text-monospace">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0 ml-1"
          href="#"
        >
          <img src={logo} width="30" height="30" className="align-top" alt="" />
          Medical Health Records Management DApp
        </a>
        <button type="button" class="btn btn-outline-info" onClick={this.props.switchUI}>{this.props.ui}</button>
        {/* <button type="button" class="btn btn-success">Success</button> */}
        </nav>
    );
  }
}

export default Navbar;