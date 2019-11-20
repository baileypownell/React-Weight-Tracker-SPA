import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './store/reducer';
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
import LogInOrSignUp from './components/LogInOrSignUp';

import './scss/main.scss';

// initialize the redux store
const store = createStore(reducer);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Nav/>
      <Route exact={true} path="/" component={Home}/>
      <Route path="/createAccount" component={CreateAccount}/>
      <Route path="/logIn" component={LogIn}/>
      <Route path="/Program" component={Program}/>
      <Route path="/LogInOrSignUp" component={LogInOrSignUp}/>
    </BrowserRouter>
  </Provider>,
  document.getElementById('app')
);
