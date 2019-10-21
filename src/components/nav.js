import React from 'react';

import CreateAccount from './CreateAccount';
import Home from './Home';
import LogIn from './LogIn';

import {
  Switch,
  Route,
  Link
} from "react-router-dom";


class Nav extends React.Component {
  render() {
    return (
      <div>
        <nav>
          <Link to="/"><h1>Weight Tracker 2.0</h1></Link>
          <div>
            <Link to="/createAccount"><button>CREATE ACCOUNT</button></Link>
            <Link to="/logIn"><button>LOG IN</button></Link>
          </div>
        </nav>
          <Route exact={true} path="/" component={Home}/>
          <Route path="/createAccount" component={CreateAccount}/>
          <Route path="/logIn" component={LogIn}/>
      </div>
    )
  }
}

export default Nav;
