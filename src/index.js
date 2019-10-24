import React from 'react';
import ReactDOM from 'react-dom';
import Nav from './components/Nav';
import {
  BrowserRouter,
  Switch,
  Route,
  Link
} from "react-router-dom";
import CreateAccount from './components/CreateAccount';
import Home from './components/Home';
import LogIn from './components/LogIn';
import Program from './components/Program';

import './scss/main.scss';


ReactDOM.render(
  <BrowserRouter>
    <Nav/>
    <Route exact={true} path="/" component={Home}/>
    <Route path="/createAccount" component={CreateAccount}/>
    <Route path="/logIn" component={LogIn}/>
    <Route path="/Program" component={Program}/>
  </BrowserRouter>,
  document.getElementById('app')
);
