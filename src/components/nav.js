import React from 'react';
import Content from './Content';
import Home from './Home';

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
          <Link to="/createAccount"><button>CREATE ACCOUNT</button></Link>
          <Link to="/logIn"><button>LOG IN</button></Link>
        </nav>
          <Route exact={true} path="/" component={Home}/>
          <Route path="/createAccount" component={CreateAccount}/>
          <Route path="/logIn" component={LogIn}/>
      </div>
    )
  }
}

let string = 'This is the create account page';
let string2 = 'This is the login page';

function CreateAccount() {
  return <Content message={string}></Content>
}

function LogIn() {
  return <Content message={string2}></Content>
}

export default Nav;
