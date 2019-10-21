import React from 'react';
import Content from './Content';


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



function Home() {
  return <Content><h1>It's never been <br/><span id="fancy">easier</span><br/> to track your progress</h1></Content>
}

function CreateAccount() {
  return <Content><h1>This is the create account page</h1></Content>
}

function LogIn() {
  return <Content><h1>This is the login page</h1></Content>
}

export default Nav;
